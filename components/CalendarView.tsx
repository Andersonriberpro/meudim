
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { X } from 'lucide-react';

interface DayTransaction {
  description: string;
  amount: number;
}

const CalendarView: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const transactionsData: Record<string, DayTransaction[]> = {
    "2026-1-4": [
      { description: 'churrasco', amount: 150.00 },
      { description: 'roupa', amount: 100.00 }
    ],
    "2026-1-2": [
      { description: 'almoço', amount: 50.00 }
    ],
    "2026-1-10": [
      { description: 'supermercado', amount: 320.50 }
    ]
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const getDayKey = (day: number) => `${year}-${month}-${day}`;
  const dayTransactions = selectedDay ? transactionsData[getDayKey(selectedDay)] || [] : [];
  const totalDay = dayTransactions.reduce((acc, curr) => acc + curr.amount, 0);

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

           {days.map(day => {
              const hasData = !!transactionsData[getDayKey(day)];
              const isTodayStyle = day === 3 && month === 1 && year === 2026;

              return (
                <div key={day} className="flex justify-center items-center">
                   <button 
                      onClick={() => handleDayClick(day)}
                      className={`w-10 h-10 md:w-14 md:h-14 flex flex-col items-center justify-center rounded-xl md:rounded-2xl text-xs md:text-lg font-black transition-all transform active:scale-90 relative
                      ${isTodayStyle ? 'bg-[#3A4F3C] text-[#E6DCCB] shadow-xl' : 'text-[#3A4F3C] hover:bg-white/60'}
                      ${hasData && !isTodayStyle ? 'bg-[#D8CFC0] border border-black/5' : ''}
                   `}>
                      <span>{day}</span>
                      {hasData && (
                        <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full mt-0.5 md:mt-1 ${isTodayStyle ? 'bg-[#6E8F7A]' : 'bg-[#9C4A3C]'}`} />
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
                      <span className="font-black text-[#3A4F3C] uppercase tracking-tight text-[10px] md:text-sm">{t.description}</span>
                      <span className="font-black text-[#9C4A3C] text-[10px] md:text-sm">R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[#3A4F3C]/40 font-black uppercase text-[7px] md:text-[10px] tracking-widest text-center py-6 md:py-8">Nenhum lançamento</p>
                )}
              </div>

              {dayTransactions.length > 0 && (
                <div className="pt-4 md:pt-6 border-t border-[#3A4F3C]/10 flex justify-between items-end">
                  <div>
                    <p className="text-[7px] md:text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest mb-0.5">Total</p>
                    <p className="text-xl md:text-4xl font-black text-[#3A4F3C] tracking-tighter">R$ {totalDay.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
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
