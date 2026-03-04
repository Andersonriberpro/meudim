
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ICONS } from '../constants';
import { X, Loader2 } from 'lucide-react';

interface DayTransaction {
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
}

const CalendarView: React.FC = () => {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactionsData, setTransactionsData] = useState<Record<string, DayTransaction[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const fetchMonthTransactions = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Fetch for the entire current year to make it easier, or just the month
      const startOfMonth = new Date(year, month, 1).toISOString().split('T')[0];
      const endOfMonth = new Date(year, month + 1, 0).toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth);

      if (error) throw error;

      const mapping: Record<string, DayTransaction[]> = {};
      (data || []).forEach(t => {
        // Handle timezone properly by splitting the date string
        const [y, m, d] = t.date.split('-').map(Number);
        const key = `${y}-${m - 1}-${d}`;
        if (!mapping[key]) mapping[key] = [];
        mapping[key].push({
          description: t.description,
          amount: Number(t.amount),
          type: t.type
        });
      });

      setTransactionsData(mapping);
    } catch (err) {
      console.error('Erro ao buscar transações do calendário:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, year, month]);

  useEffect(() => {
    fetchMonthTransactions();
  }, [fetchMonthTransactions]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const getDayKey = (day: number) => `${year}-${month}-${day}`;
  const dayTransactions = selectedDay ? transactionsData[getDayKey(selectedDay)] || [] : [];

  const dailyIncome = dayTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const dailyExpense = dayTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalDay = dailyIncome - dailyExpense;

  return (
    <div className="space-y-4 md:space-y-8 animate-in fade-in duration-500 pb-20">
      <h2 className="text-xl md:text-4xl font-black text-[#3A4F3C] uppercase tracking-tighter">Calendário</h2>

      <div className="bg-white/40 backdrop-blur-md p-4 md:p-10 rounded-xl md:rounded-[3rem] shadow-sm border border-white/40 flex flex-col min-h-[400px] md:min-h-[600px]">
        <div className="flex items-center justify-between mb-6 md:mb-12">
          <button
            onClick={handlePrevMonth}
            className="p-2 md:p-4 bg-white/50 hover:bg-white rounded-xl md:rounded-2xl text-[#3A4F3C] transition-all shadow-sm"
          >
            <span className="md:hidden scale-75 block">{ICONS.Back}</span>
            <span className="hidden md:block">{ICONS.Back}</span>
          </button>
          <h3 className="text-sm md:text-2xl font-black text-[#3A4F3C] uppercase tracking-tighter">
            {monthNames[month]} {year}
          </h3>
          <button
            onClick={handleNextMonth}
            className="p-2 md:p-4 bg-white/50 hover:bg-white rounded-xl md:rounded-2xl text-[#3A4F3C] transition-all shadow-sm"
          >
            <span className="md:hidden scale-75 block">{ICONS.Next}</span>
            <span className="hidden md:block">{ICONS.Next}</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-y-4 md:gap-y-10">
          {weekDays.map(day => (
            <div key={day} className="text-center font-black text-[#3A4F3C]/40 uppercase text-[7px] md:text-[10px] tracking-widest">{day}</div>
          ))}

          {paddingDays.map(p => (
            <div key={`padding-${p}`} />
          ))}

          {days.map(day => {
            const dayTrans = transactionsData[getDayKey(day)] || [];
            const hasData = dayTrans.length > 0;
            const hasExpense = dayTrans.some(t => t.type === 'EXPENSE');
            const hasIncome = dayTrans.some(t => t.type === 'INCOME');

            const now = new Date();
            const isTodayStyle = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();

            return (
              <div key={day} className="flex justify-center items-center">
                <button
                  onClick={() => handleDayClick(day)}
                  disabled={isLoading}
                  className={`w-10 h-10 md:w-14 md:h-14 flex flex-col items-center justify-center rounded-xl md:rounded-2xl text-xs md:text-lg font-black transition-all transform active:scale-90 relative
                      ${isTodayStyle ? 'bg-[#3A4F3C] text-[#E6DCCB] shadow-xl' : 'text-[#3A4F3C] hover:bg-white/60'}
                      ${hasData && !isTodayStyle ? 'bg-[#D8CFC0] border border-black/5' : ''}
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                   `}>
                  <span>{day}</span>
                  {hasData && (
                    <div className="flex space-x-0.5 mt-0.5 md:mt-1">
                      {hasIncome && <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${isTodayStyle ? 'bg-white' : 'bg-[#6E8F7A]'}`} />}
                      {hasExpense && <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${isTodayStyle ? 'bg-white/60' : 'bg-[#9C4A3C]'}`} />}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && selectedDay !== null && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-[#3A4F3C]/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsModalOpen(false)} />

          <div className="bg-[#E6DCCB] w-full max-w-sm rounded-t-2xl md:rounded-[3rem] p-6 md:p-10 shadow-2xl relative animate-in slide-in-from-bottom md:zoom-in-95 duration-200 border border-black/10">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 md:top-8 md:right-8 text-[#3A4F3C]/40 hover:text-[#3A4F3C]">
              <X size={20} />
            </button>

            <h3 className="text-lg md:text-2xl font-black text-[#3A4F3C] mb-5 md:mb-8 uppercase tracking-tighter">
              {selectedDay}/{month + 1} • Detalhes
            </h3>

            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2 max-h-[40vh] overflow-y-auto custom-scrollbar pr-1">
                {dayTransactions.length > 0 ? (
                  dayTransactions.map((t, idx) => (
                    <div key={idx} className="bg-white/50 p-3 md:p-5 rounded-xl md:rounded-2xl flex justify-between items-center border border-black/5">
                      <div className="flex flex-col">
                        <span className="font-black text-[#3A4F3C] uppercase tracking-tight text-[10px] md:text-sm">{t.description}</span>
                        <span className="text-[7px] font-black text-[#3A4F3C]/40 uppercase">{t.type === 'INCOME' ? 'Receita' : 'Despesa'}</span>
                      </div>
                      <span className={`font-black text-[10px] md:text-sm ${t.type === 'INCOME' ? 'text-[#6E8F7A]' : 'text-[#9C4A3C]'}`}>
                        {t.type === 'INCOME' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[#3A4F3C]/40 font-black uppercase text-[7px] md:text-[10px] tracking-widest text-center py-6 md:py-8">Nenhum lançamento</p>
                )}
              </div>

              {dayTransactions.length > 0 && (
                <div className="pt-4 md:pt-6 border-t border-[#3A4F3C]/10 flex justify-between items-end">
                  <div>
                    <p className="text-[7px] md:text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest mb-0.5">Saldo do Dia</p>
                    <p className={`text-xl md:text-4xl font-black tracking-tighter ${totalDay >= 0 ? 'text-[#3A4F3C]' : 'text-[#9C4A3C]'}`}>
                      R$ {totalDay.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-[#3A4F3C] text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-xs shadow-xl active:scale-95"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
