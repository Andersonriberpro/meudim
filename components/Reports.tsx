import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, PiggyBank, Calendar, TrendingUp, ArrowUpCircle, Brain } from 'lucide-react';
import PageLayout from './layout/PageLayout';
import Card from './ui/Card';

const weekData = [
  { name: 'Receitas', value: 2000, color: '#6E8F7A' }, // Sage
  { name: 'Despesas', value: 605.56, color: '#9C4A3C' }, // Terracota
];

const yearData = [
  { name: 'mar', receitas: 0, despesas: 500 },
  { name: 'abr', receitas: 0, despesas: 500 },
  { name: 'mai', receitas: 0, despesas: 500 },
  { name: 'jun', receitas: 0, despesas: 500 },
  { name: 'jul', receitas: 0, despesas: 500 },
  { name: 'ago', receitas: 0, despesas: 500 },
  { name: 'set', receitas: 0, despesas: 500 },
  { name: 'out', receitas: 0, despesas: 500 },
  { name: 'nov', receitas: 0, despesas: 500 },
  { name: 'dez', receitas: 0, despesas: 500 },
  { name: 'jan', receitas: 0, despesas: 500 },
  { name: 'fev', receitas: 2000, despesas: 605.56 },
];

const monthPieData = [
  { name: 'Alimentação', value: 50 },
  { name: 'Lazer', value: 100 },
  { name: 'Outros', value: 455.56 },
];

const psychologyData = [
  { name: 'Essencial', value: 75 },
  { name: 'Desejos', value: 25 },
];

const COLORS_MONTH = ['#3A4F3C', '#6E8F7A', '#D8CFC0'];
const COLORS_PSYCHOLOGY = ['#6E8F7A', '#3A4F3C'];

const Reports: React.FC = () => {
  const [period, setPeriod] = useState<'Semana' | 'Mês' | 'Ano'>('Mês');

  const renderActiveChart = () => {
    switch (period) {
      case 'Semana':
        return (
          <Card className="animate-in fade-in duration-300">
            <h3 className="text-sm md:text-3xl font-black text-[#3A4F3C] mb-6 md:mb-10 uppercase tracking-tighter text-center md:text-left">Semana Atual</h3>
            <div className="h-[250px] md:h-[400px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={weekData} cx="50%" cy="50%" innerRadius={0} outerRadius={80} md:outerRadius={150} paddingAngle={0} dataKey="value" stroke="none">
                    {weekData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#E6DCCB', fontWeight: '900', color: '#3A4F3C', fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        );
      case 'Ano':
        return (
          <Card className="animate-in fade-in duration-300">
            <h3 className="text-sm md:text-3xl font-black text-[#3A4F3C] mb-6 md:mb-10 uppercase tracking-tighter text-center md:text-left">Anual 2026</h3>
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
              <div className="h-[200px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={monthPieData} cx="50%" cy="50%" innerRadius={40} md:innerRadius={60} outerRadius={70} md:outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                      {monthPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_MONTH[index % COLORS_MONTH.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', fontSize: '10px' }} />
                    <Legend iconSize={8} formatter={(value) => <span className="text-[#3A4F3C] font-black text-[7px] md:text-[10px] uppercase ml-1">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm md:text-2xl font-black text-[#3A4F3C] mb-4 md:mb-8 uppercase tracking-tighter">Receita x Despesa</h3>
              <div className="h-[200px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ name: 'Fev', receitas: 2000, despesas: 605.56 }]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3A4F3C10" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#3A4F3C', fontWeight: '900', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#3A4F3C40', fontSize: 8 }} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', fontSize: '10px' }} />
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
          <select className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 font-black text-[#3A4F3C] text-[9px] uppercase appearance-none">
            <option>2026</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[7px] md:text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Mês</label>
          <select className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 font-black text-[#3A4F3C] text-[9px] uppercase appearance-none">
            <option>Fev</option>
          </select>
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
          <div className="bg-white/60 backdrop-blur-md p-5 md:p-10 rounded-xl md:rounded-[3rem] border border-white/40 flex flex-col items-center justify-center min-h-[250px] md:min-h-[400px]">
            <h4 className="text-xs md:text-2xl font-black text-[#3A4F3C] uppercase tracking-tighter self-start mb-4">Custo Impulso</h4>
            <p className="text-4xl md:text-7xl font-black text-[#9C4A3C] tracking-tighter">R$ 0,00</p>
            <div className="mt-6 bg-[#6E8F7A] text-white p-4 rounded-xl flex items-center space-x-3 w-full">
              <span className="text-xl">🌿</span>
              <p className="text-[8px] font-bold uppercase leading-tight">Você manteve o controle total sobre seus impulsos!</p>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-5 md:p-10 rounded-xl md:rounded-[3rem] border border-white/40 min-h-[250px] md:min-h-[400px]">
            <h4 className="text-xs md:text-2xl font-black text-[#3A4F3C] uppercase tracking-tighter">Tipo de Gasto</h4>
            <div className="h-[150px] md:h-[250px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={psychologyData} cx="50%" cy="50%" innerRadius={40} md:innerRadius={70} outerRadius={60} md:outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                    {psychologyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_PSYCHOLOGY[index % COLORS_PSYCHOLOGY.length]} />
                    ))}
                  </Pie>
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
