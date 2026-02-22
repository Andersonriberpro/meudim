
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../constants';

interface AddLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { id?: string; category: string; value: number }) => void;
  initialData?: any;
}

const AddLimitModal: React.FC<AddLimitModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [category, setCategory] = useState('');
  const [limitValue, setLimitValue] = useState('');

  useEffect(() => {
    if (initialData && isOpen) {
      setCategory(initialData.category || '');
      setLimitValue(initialData.monthlyLimit?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '');
    } else if (isOpen) {
      setCategory('');
      setLimitValue('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!category || !limitValue) return;

    const value = parseFloat(limitValue.replace(/\./g, '').replace(',', '.'));
    if (isNaN(value)) return;

    onSave({
      id: initialData?.id,
      category,
      value
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-[#3A4F3C]/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-[#E6DCCB] w-full max-w-lg rounded-t-2xl md:rounded-[2.5rem] p-5 md:p-10 shadow-2xl relative animate-in slide-in-from-bottom md:zoom-in-95 duration-300 border border-black/10 overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#3A4F3C]/40 hover:text-[#3A4F3C] transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl md:text-3xl font-black text-[#3A4F3C] mb-5 md:mb-8 uppercase tracking-tighter">
          {initialData ? 'Editar Limite' : 'Novo Limite'}
        </h3>
        
        <div className="space-y-4 md:space-y-6">
          <div className="space-y-1">
            <label className="text-[8px] md:text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Categoria</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] text-[9px] uppercase appearance-none cursor-pointer h-12"
            >
              <option value="">Selecione...</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] md:text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Valor Mensal</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#3A4F3C]/30 text-[9px]">R$</span>
              <input 
                type="text" 
                value={limitValue}
                onChange={(e) => setLimitValue(e.target.value)}
                placeholder="0,00"
                className="w-full bg-white/60 border border-black/5 rounded-xl pl-10 pr-4 py-3 outline-none font-black text-[#3A4F3C] text-sm md:text-xl tracking-tighter h-12"
              />
            </div>
            <p className="text-[7px] md:text-[9px] font-black text-[#3A4F3C]/30 uppercase tracking-widest ml-1">Renova todo dia 1º.</p>
          </div>

          <div className="flex flex-col-reverse md:flex-row md:space-x-3 pt-2 gap-2">
            <button 
              type="button"
              onClick={onClose}
              className="w-full md:flex-1 py-3 rounded-xl font-black text-[#3A4F3C]/40 hover:bg-black/5 uppercase text-[9px] tracking-widest transition-all"
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={handleSave}
              disabled={!category || !limitValue}
              className={`w-full md:flex-[2] py-4 rounded-xl font-black text-[#E6DCCB] transition-all shadow-xl active:scale-95 uppercase text-[9px] tracking-widest ${
                category && limitValue 
                  ? 'bg-[#3A4F3C] hover:bg-[#2F3F31]' 
                  : 'bg-[#3A4F3C]/20 text-[#3A4F3C]/40'
              }`}
            >
              {initialData ? 'Confirmar' : 'Salvar Limite'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLimitModal;
