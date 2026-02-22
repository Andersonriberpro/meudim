import React from 'react';
import { Trophy, ArrowLeft, Star, Target, Zap, Heart, Shield, Award } from 'lucide-react';
import PageLayout from './layout/PageLayout';
import Card from './ui/Card';

interface AchievementsProps {
  onBack: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ onBack }) => {
  const achievements = [
    { title: 'Primeiros Passos', desc: 'Realizou seu primeiro lançamento', icon: <Target className="text-blue-500" />, status: 'COMPLETE' },
    { title: 'Poupador Nato', desc: 'Manteve o saldo positivo por 30 dias', icon: <PiggyBank className="text-green-500" />, status: 'IN_PROGRESS' },
    { title: 'Mestre do Planejamento', desc: 'Criou 5 categorias personalizadas', icon: <Zap className="text-yellow-500" />, status: 'COMPLETE' },
  ];

  const header = (
    <button onClick={onBack} className="flex items-center space-x-2 text-[#3A4F3C] font-black uppercase text-[10px] tracking-widest hover:opacity-60 transition-all">
      <ArrowLeft size={16} />
      <span>Voltar</span>
    </button>
  );

  return (
    <PageLayout title="Conquistas" headerContent={header}>
      <Card className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-20 h-20 bg-[#3A4F3C] rounded-3xl flex items-center justify-center text-[#E6DCCB] mb-4 shadow-xl">
          <Trophy size={40} />
        </div>
        <h3 className="text-2xl font-black text-[#3A4F3C] uppercase tracking-tighter">Seu Nível: Veterano</h3>
        <p className="text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest mt-1">2.450 Pontos Acumulados</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach, idx) => (
          <Card key={idx} className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/60 rounded-xl flex items-center justify-center shadow-inner">
              {ach.icon}
            </div>
            <div>
              <h4 className="text-sm font-black text-[#3A4F3C] uppercase tracking-tight">{ach.title}</h4>
              <p className="text-[8px] font-bold text-[#3A4F3C]/60 uppercase leading-none mt-1">{ach.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
};

// Simplified for brevity in this tool call, assumed original had PiggyBank import which was missing in my mock but likely exists in user code constants or lucide
import { PiggyBank } from 'lucide-react';

export default Achievements;
