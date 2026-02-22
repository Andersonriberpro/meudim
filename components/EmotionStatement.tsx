
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const dataEmotion = [
  { name: 'Essencial', value: 75 },
  { name: 'Desejos', value: 25 },
];
// Sálvia para essencial, Militar para desejos/outros
const COLORS = ['#6E8F7A', '#3A4F3C'];

const EmotionStatement: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col">
         <h2 className="text-4xl font-black text-[#3A4F3C] uppercase tracking-tighter">Extrato de Emoção</h2>
         <p className="text-[#3A4F3C]/60 font-bold uppercase text-xs tracking-widest mt-1">O comportamento por trás do dinheiro</p>
      </div>

      <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-white/40 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Ano de Referência</label>
          <select className="w-full bg-white/60 border border-black/5 rounded-2xl px-5 py-4 outline-none font-black text-[#3A4F3C] text-[10px] uppercase appearance-none">
            <option>2026</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Mês de Referência</label>
          <select className="w-full bg-white/60 border border-black/5 rounded-2xl px-5 py-4 outline-none font-black text-[#3A4F3C] text-[10px] uppercase appearance-none">
            <option>Fevereiro</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Impulso Card */}
        <div className="bg-white/60 backdrop-blur-md p-10 rounded-[3rem] shadow-sm border border-white/40 flex flex-col items-center justify-between min-h-[450px]">
           <h3 className="text-2xl font-black text-[#3A4F3C] uppercase tracking-tighter self-start">Custo de Impulso</h3>
           <div className="flex flex-col items-center py-8">
              <p className="text-7xl font-black text-[#9C4A3C]">R$ 0,00</p>
              <p className="text-[#3A4F3C]/40 font-black uppercase tracking-widest text-[10px] mt-2">Gastos não planejados</p>
           </div>
           <div className="bg-[#6E8F7A] text-white p-8 rounded-[2.5rem] flex items-center space-x-6 w-full shadow-xl">
              <div className="bg-white/20 p-4 rounded-2xl">
                <span className="text-3xl">🌿</span>
              </div>
              <div className="flex-1">
                 <h4 className="font-black text-lg uppercase tracking-tight">Equilíbrio Perfeito</h4>
                 <p className="text-xs font-bold opacity-90 leading-relaxed uppercase tracking-tight">Você manteve o controle total sobre seus impulsos neste mês!</p>
              </div>
           </div>
        </div>

        {/* Chart Card */}
        <div className="bg-white/60 backdrop-blur-md p-10 rounded-[3rem] shadow-sm border border-white/40 flex flex-col min-h-[450px]">
           <h3 className="text-2xl font-black text-[#3A4F3C] uppercase tracking-tighter">Psicologia do Gasto</h3>
           <div className="flex-1 mt-8">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie 
                      data={dataEmotion} 
                      cx="50%" 
                      cy="45%" 
                      innerRadius={80}
                      outerRadius={120} 
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                       {dataEmotion.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '1.5rem', border: 'none', backgroundColor: '#E6DCCB', fontWeight: '900' }}
                      formatter={(value: number) => `${value}%`}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      iconType="circle"
                      formatter={(value) => <span className="text-[#3A4F3C] font-black text-[10px] uppercase ml-1 tracking-widest">{value}</span>}
                    />
                 </PieChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionStatement;
