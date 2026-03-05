import React from 'react';
import { Trophy, ArrowLeft, Target, PiggyBank, Zap, CheckCircle2, Lock } from 'lucide-react';
import PageLayout from './layout/PageLayout';
import Card from './ui/Card';
import { useAchievements } from '../hooks/useAchievements';

interface AchievementsProps {
  onBack: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ onBack }) => {
  const { achievements, level, completionPercentage } = useAchievements();

  const getIcon = (id: string, status: string) => {
    const color = status === 'COMPLETE' ? 'text-[#6E8F7A]' : 'text-[#3A4F3C]/20';
    switch (id) {
      case '1': return <Target className={color} />;
      case '2': return <PiggyBank className={color} />;
      case '3': return <Zap className={color} />;
      default: return <Target className={color} />;
    }
  };

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
        <h3 className="text-2xl font-black text-[#3A4F3C] uppercase tracking-tighter">Seu Nível: {level}</h3>
        <p className="text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest mt-1">{completionPercentage}% do progresso total</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <Card key={ach.id} className={`flex items-center justify-between p-6 ${ach.status === 'COMPLETE' ? 'bg-white' : 'bg-white/40'}`}>
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${ach.status === 'COMPLETE' ? 'bg-[#6E8F7A]/10' : 'bg-black/5'}`}>
                {getIcon(ach.id, ach.status)}
              </div>
              <div>
                <h4 className={`text-sm font-black uppercase tracking-tight ${ach.status === 'COMPLETE' ? 'text-[#3A4F3C]' : 'text-[#3A4F3C]/40'}`}>{ach.title}</h4>
                <p className="text-[8px] font-bold text-[#3A4F3C]/60 uppercase leading-none mt-1">{ach.desc}</p>
              </div>
            </div>
            {ach.status === 'COMPLETE' ? (
              <CheckCircle2 size={16} className="text-[#6E8F7A]" />
            ) : (
              <Lock size={16} className="text-[#3A4F3C]/20" />
            )}
          </Card>
        ))}
      </div>
    </PageLayout>
  );
};

export default Achievements;
