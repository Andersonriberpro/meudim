import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, PiggyBank, Calendar, TrendingUp, ArrowUpCircle, Brain, Loader2 } from 'lucide-react';
import PageLayout from './layout/PageLayout';
import Card from './ui/Card';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const COLORS_MONTH = ['#3A4F3C', '#6E8F7A', '#D8CFC0', '#9C4A3C', '#E6DCCB', '#A4B494'];
const COLORS_PSYCHOLOGY = ['#6E8F7A', '#3A4F3C'];

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<'Semana' | 'Mês' | 'Ano'>('Mês');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [limits, setLimits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const [transRes, limitsRes] = await Promise.all([
        supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false }),
        supabase
          .from('category_limits')
          .select('*')
          .eq('user_id', user.id)
      ]);

      if (transRes.error) throw transRes.error;
      if (limitsRes.error) throw limitsRes.error;

      setTransactions(transRes.data || []);
      setLimits(limitsRes.data || []);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Weekly Data Calculation
  const weekData = useMemo(() => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recent = transactions.filter(t => new Date(t.date) >= lastWeek);
    const income = recent.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = recent.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + Number(t.amount), 0);

    return [
      { name: 'Receitas', value: income, color: '#6E8F7A' },
      { name: 'Despesas', value: expense, color: '#9C4A3C' },
    ];
  }, [transactions]);

  // Yearly Data Calculation
  const yearData = useMemo(() => {
    const months = MONTHS.map((name, index) => {
      const monthTrans = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getFullYear() === selectedYear && d.getMonth() === index;
      });

      const receitas = monthTrans.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + Number(t.amount), 0);
      const despesas = monthTrans.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + Number(t.amount), 0);

      return { name: name.toLowerCase(), receitas, despesas };
    });
    return months;
  }, [transactions, selectedYear]);

  // Monthly Data Calculation
  const monthlyTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const monthPieData = useMemo(() => {
    const catMap: Record<string, number> = {};
    monthlyTransactions.filter(t => t.type === 'EXPENSE').forEach(t => {
      const cat = t.category || 'OUTROS';
      catMap[cat] = (catMap[cat] || 0) + Number(t.amount);
    });

    return Object.entries(catMap).map(([name, value]) => ({ name, value }));
  }, [monthlyTransactions]);

  const monthSummary = useMemo(() => {
    const receitas = monthlyTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + Number(t.amount), 0);
    const despesas = monthlyTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + Number(t.amount), 0);
    return [{ name: MONTHS[selectedMonth], receitas, despesas }];
  }, [monthlyTransactions, selectedMonth]);

  const impulseAnalysis = useMemo(() => {
    const expenses = monthlyTransactions.filter(t => t.type === 'EXPENSE');
    const spendingPerCat: Record<string, number> = {};
    expenses.forEach(t => {
      const cat = (t.category || 'OUTROS').trim().toUpperCase();
      spendingPerCat[cat] = (spendingPerCat[cat] || 0) + Number(t.amount);
    });

    let totalImpulse = 0;
    const exceededCategories: { name: string, excess: number }[] = [];

    limits.forEach(l => {
      const cat = (l.category || '').trim().toUpperCase();
      const spent = spendingPerCat[cat] || 0;
      const limit = Number(l.monthly_limit);

      if (spent > limit) {
        const excess = spent - limit;
        totalImpulse += excess;
        exceededCategories.push({ name: l.category, excess });
      }
    });

    const totalSpent = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
    const essential = totalSpent - totalImpulse;

    const psychologyData = totalSpent > 0 ? [
      { name: 'Essencial', value: essential },
      { name: 'Impulso', value: totalImpulse },
    ] : [{ name: 'Sem Dados', value: 1 }];

    return { totalImpulse, exceededCategories, psychologyData };
  }, [monthlyTransactions, limits]);

  const renderActiveChart = () => {
    switch (period) {
      case 'Semana':
        return (
          <Card className="animate-in fade-in duration-300">
            <h3 className="text-sm md:text-3xl font-black text-[#3A4F3C] mb-6 md:mb-10 uppercase tracking-tighter text-center md:text-left">Últimos 7 dias</h3>
            <div className="h-[250px] md:h-[400px] relative">
              {weekData[0].value === 0 && weekData[1].value === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center opacity-20 font-black uppercase text-[10px]">Sem lançamentos recentes</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={weekData} cx="50%" cy="50%" innerRadius={0} outerRadius={80} md:outerRadius={150} paddingAngle={0} dataKey="value" stroke="none">
                      {weekData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#E6DCCB', fontWeight: '900', color: '#3A4F3C', fontSize: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        );
      case 'Ano':
        return (
          <Card className="animate-in fade-in duration-300">
            <h3 className="text-sm md:text-3xl font-black text-[#3A4F3C] mb-6 md:mb-10 uppercase tracking-tighter text-center md:text-left">Anual {selectedYear}</h3>
            <div className="h-[300px] md:h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3A4F3C20" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#3A4F3C', fontWeight: '900', fontSize: 8, textTransform: 'uppercase' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#3A4F3C60', fontWeight: '700', fontSize: 8 }} />
                  <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#E6DCCB', fontWeight: '900', color: '#3A4F3C', fontSize: '10px' }} />
                  <Bar dataKey="receitas" fill="#6E8F7A" radius={[4, 4, 0, 0]} barSize={12} />
                  <Bar dataKey="despesas" fill="#9C4A3C" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        );
      case 'Mês':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in fade-in duration-300">
            <Card>
              <h3 className="text-sm md:text-2xl font-black text-[#3A4F3C] mb-4 md:mb-8 uppercase tracking-tighter">Categorias</h3>
              <div className="h-[200px] md:h-[300px] relative">
                {monthPieData.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 font-black uppercase text-[10px]">Nenhuma despesa este mês</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={monthPieData} cx="50%" cy="50%" innerRadius={40} md:innerRadius={60} outerRadius={70} md:outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                        {monthPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_MONTH[index % COLORS_MONTH.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        contentStyle={{ borderRadius: '1rem', border: 'none', fontSize: '10px' }}
                      />
                      <Legend iconSize={8} formatter={(value) => <span className="text-[#3A4F3C] font-black text-[7px] md:text-[10px] uppercase ml-1">{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-sm md:text-2xl font-black text-[#3A4F3C] mb-4 md:mb-8 uppercase tracking-tighter">Receita x Despesa</h3>
              <div className="h-[200px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthSummary} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3A4F3C10" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#3A4F3C', fontWeight: '900', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#3A4F3C40', fontSize: 8 }} />
                    <Tooltip
                      formatter={(val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      contentStyle={{ borderRadius: '1rem', border: 'none', fontSize: '10px' }}
                    />
                    <Bar dataKey="receitas" name="Rec" fill="#6E8F7A" radius={[6, 6, 0, 0]} barSize={40} />
                    <Bar dataKey="despesas" name="Des" fill="#9C4A3C" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        );
    }
  };

  const headerControls = (
    <div className="flex bg-black/5 p-1 rounded-xl w-full md:w-fit overflow-hidden">
      <button onClick={() => setPeriod('Semana')} className={`flex-1 md:flex-none px-4 md:px-10 py-2 rounded-lg font-black text-[8px] md:text-[10px] uppercase tracking-widest transition-all ${period === 'Semana' ? 'bg-white text-[#3A4F3C]' : 'text-[#3A4F3C]/40'}`}>Semana</button>
      <button onClick={() => setPeriod('Mês')} className={`flex-1 md:flex-none px-4 md:px-10 py-2 rounded-lg font-black text-[8px] md:text-[10px] uppercase tracking-widest transition-all ${period === 'Mês' ? 'bg-white text-[#3A4F3C]' : 'text-[#3A4F3C]/40'}`}>Mês</button>
      <button onClick={() => setPeriod('Ano')} className={`flex-1 md:flex-none px-4 md:px-10 py-2 rounded-lg font-black text-[8px] md:text-[10px] uppercase tracking-widest transition-all ${period === 'Ano' ? 'bg-white text-[#3A4F3C]' : 'text-[#3A4F3C]/40'}`}>Ano</button>
    </div>
  );

  return (
    <PageLayout title="Relatórios" headerContent={headerControls}>
      <Card className="grid grid-cols-2 gap-3 p-4 md:p-8">
        <div className="space-y-1">
          <label className="text-[7px] md:text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Ano</label>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 font-black text-[#3A4F3C] text-[9px] uppercase appearance-none outline-none"
            >
              {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <Calendar size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3A4F3C]/30 pointer-events-none" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[7px] md:text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Mês</label>
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 font-black text-[#3A4F3C] text-[9px] uppercase appearance-none outline-none"
            >
              {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
            <Calendar size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3A4F3C]/30 pointer-events-none" />
          </div>
        </div>
      </Card>

      {renderActiveChart()}

      <div className="bg-white/40 backdrop-blur-md p-4 md:p-6 rounded-xl md:rounded-[2rem] shadow-sm border border-white/40 flex items-center justify-center space-x-6 md:space-x-12">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#6E8F7A] rounded-sm"></div>
          <span className="font-black text-[#3A4F3C] text-[7px] md:text-[10px] uppercase">Receitas</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#9C4A3C] rounded-sm"></div>
          <span className="font-black text-[#3A4F3C] text-[7px] md:text-[10px] uppercase">Despesas</span>
        </div>
      </div>

      <div className="pt-6 space-y-4">
        <div className="flex items-center space-x-3">
          <Brain size={20} className="text-[#3A4F3C]" />
          <h3 className="text-base md:text-3xl font-black text-[#3A4F3C] uppercase tracking-tighter">Psicologia</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/60 backdrop-blur-md p-5 md:p-10 rounded-xl md:rounded-[3rem] border border-white/40 flex flex-col min-h-[250px] md:min-h-[400px]">
            <h4 className="text-xs md:text-2xl font-black text-[#3A4F3C] uppercase tracking-tighter self-start mb-4">Custo Impulso</h4>
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className={`text-4xl md:text-7xl font-black tracking-tighter ${impulseAnalysis.totalImpulse > 0 ? 'text-[#9C4A3C]' : 'text-[#6E8F7A]'}`}>
                R$ {impulseAnalysis.totalImpulse.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>

              {impulseAnalysis.totalImpulse > 0 ? (
                <div className="mt-6 w-full space-y-2">
                  <p className="text-[7px] md:text-[9px] font-black text-[#3A4F3C]/60 uppercase tracking-widest text-center mb-2">Categorias que excederam:</p>
                  <div className="max-h-[100px] overflow-auto space-y-1">
                    {impulseAnalysis.exceededCategories.map((c, i) => (
                      <div key={i} className="flex justify-between items-center bg-[#9C4A3C]/5 p-2 rounded-lg">
                        <span className="text-[8px] font-black uppercase text-[#3A4F3C]">{c.name}</span>
                        <span className="text-[8px] font-black text-[#9C4A3C]">+ R$ {c.excess.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-10 bg-[#6E8F7A] text-white p-4 rounded-xl flex items-center space-x-3 w-full animate-in zoom-in-50">
                  <span className="text-xl">🌿</span>
                  <p className="text-[8px] md:text-[10px] font-black uppercase leading-tight">Você manteve o controle total sobre seus limites!</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-5 md:p-10 rounded-xl md:rounded-[3rem] border border-white/40 min-h-[250px] md:min-h-[400px]">
            <h4 className="text-xs md:text-2xl font-black text-[#3A4F3C] uppercase tracking-tighter">Tipo de Gasto</h4>
            <div className="h-[150px] md:h-[250px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={impulseAnalysis.psychologyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    md:innerRadius={70}
                    outerRadius={60}
                    md:outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {impulseAnalysis.psychologyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_PSYCHOLOGY[index % COLORS_PSYCHOLOGY.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    contentStyle={{ borderRadius: '1rem', border: 'none', fontSize: '10px' }}
                  />
                  <Legend iconSize={6} formatter={(value) => <span className="text-[#3A4F3C] font-black text-[7px] uppercase ml-1">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Reports;
