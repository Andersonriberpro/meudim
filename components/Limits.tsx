
import React, { useState } from 'react';
import { ICONS } from '../constants';
import AddLimitModal from './AddLimitModal';
import { CheckCircle2, Edit, Trash2 } from 'lucide-react';

interface CategoryLimit {
  id: string;
  category: string;
  monthlyLimit: number;
  currentSpending: number;
}

const Limits: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLimit, setEditingLimit] = useState<CategoryLimit | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [limits, setLimits] = useState<CategoryLimit[]>([
    {
      id: 'l1',
      category: 'Alimentação',
      monthlyLimit: 1200,
      currentSpending: 450.50
    },
    {
      id: 'l2',
      category: 'Transporte',
      monthlyLimit: 500,
      currentSpending: 520.00
    }
  ]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingLimit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (limit: CategoryLimit) => {
    setEditingLimit(limit);
    setIsModalOpen(true);
  };

  const handleSaveLimit = (data: { id?: string; category: string; value: number }) => {
    if (data.id) {
      setLimits(limits.map(l => l.id === data.id ? { ...l, category: data.category, monthlyLimit: data.value } : l));
      showToast("Tudo certo por aqui 👌");
    } else {
      const newLimit: CategoryLimit = {
        id: Math.random().toString(36).substr(2, 9),
        category: data.category,
        monthlyLimit: data.value,
        currentSpending: 0 
      };
      setLimits([newLimit, ...limits]);
      showToast("Gasto registrado com sucesso");
    }
    setIsModalOpen(false);
    setEditingLimit(null);
  };

  const deleteLimit = (id: string) => {
    if (confirm('Deseja remover este limite?')) {
      setLimits(limits.filter(l => l.id !== id));
      showToast("Seu dim tá organizado");
    }
  };

  return (
    <div className="space-y-4 md:space-y-8 animate-in fade-in duration-500 pb-20">
      {toast && (
        <div className="fixed top-20 md:top-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-[300] bg-[#6E8F7A] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-white/20 w-[85%] md:w-auto">
          <CheckCircle2 size={18} />
          <span className="font-black uppercase text-[9px] tracking-tight">{toast}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
         <h2 className="text-xl md:text-4xl font-black text-[#3A4F3C] uppercase tracking-tighter">Meus Limites</h2>
         <button 
           onClick={handleOpenAdd}
           className="bg-[#3A4F3C] text-[#E6DCCB] px-4 py-2 md:px-8 md:py-3 rounded-xl font-black flex items-center space-x-2 shadow-xl hover:bg-[#2F3F31] transition-all active:scale-95 text-[8px] md:text-[10px] uppercase tracking-widest"
         >
            <Edit size={14} className="md:hidden" />
            <span className="hidden md:inline">Novo Limite</span>
            <span className="md:hidden">Novo</span>
         </button>
      </div>

      {limits.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-md p-10 md:p-24 rounded-xl md:rounded-[3rem] shadow-sm border border-white/40 flex flex-col items-center justify-center text-center space-y-4">
           <div className="text-[#3A4F3C]/40">
              <p className="text-sm md:text-2xl font-black uppercase tracking-tight">Sem limites definidos.</p>
              <p className="font-bold uppercase text-[7px] md:text-[10px] tracking-widest mt-2 max-w-xs mx-auto">Defina metas por categoria para manter seu orçamento sob controle.</p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {limits.map((limit) => {
            const percent = (limit.currentSpending / limit.monthlyLimit) * 100;
            const isOverLimit = percent > 100;

            return (
              <div key={limit.id} className="bg-white/40 backdrop-blur-md p-4 md:p-8 rounded-xl md:rounded-[2.5rem] shadow-sm border border-white/40 space-y-4 md:space-y-6 relative group hover:bg-white/60 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[7px] md:text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Categoria</span>
                    <h3 className="text-sm md:text-2xl font-black text-[#3A4F3C] uppercase tracking-tight leading-none mt-1">{limit.category}</h3>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleOpenEdit(limit)}
                      className="p-1.5 md:p-2 text-[#3A4F3C]/20 hover:text-[#3A4F3C] transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => deleteLimit(limit.id)}
                      className="p-1.5 md:p-2 text-[#3A4F3C]/20 hover:text-[#9C4A3C] transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <div className="flex justify-between text-[7px] md:text-[10px] font-black uppercase tracking-widest">
                    <span className="text-[#3A4F3C]/40">Progresso</span>
                    <span className={isOverLimit ? 'text-[#9C4A3C]' : 'text-[#3A4F3C]'}>
                      {percent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 md:h-4 bg-black/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${isOverLimit ? 'bg-[#9C4A3C]' : 'bg-[#3A4F3C]'}`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-end pt-1">
                  <div>
                    <p className="text-[7px] md:text-[9px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">Gasto Atual</p>
                    <p className={`text-base md:text-2xl font-black tracking-tighter ${isOverLimit ? 'text-[#9C4A3C]' : 'text-[#3A4F3C]'}`}>
                      R$ {limit.currentSpending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[7px] md:text-[9px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">Limite</p>
                    <p className="text-base md:text-2xl font-black text-[#3A4F3C] tracking-tighter">
                      R$ {limit.monthlyLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {isOverLimit && (
                  <div className="bg-[#9C4A3C]/10 text-[#9C4A3C] p-3 rounded-xl text-[7px] md:text-[10px] font-black flex items-center space-x-2 animate-pulse uppercase tracking-widest border border-[#9C4A3C]/20">
                     <span>⚠️ Limite ultrapassado!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AddLimitModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingLimit(null);
        }} 
        onSave={handleSaveLimit} 
        initialData={editingLimit}
      />
    </div>
  );
};

export default Limits;
