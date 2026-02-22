
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../constants';

interface AddInstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

const AddInstallmentModal: React.FC<AddInstallmentModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [description, setDescription] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [installmentsCount, setInstallmentsCount] = useState('1');
  const [installmentValue, setInstallmentValue] = useState('0,00');
  const [startDate, setStartDate] = useState('2026-02-03');
  const [category, setCategory] = useState('Compras');

  useEffect(() => {
    if (initialData && isOpen) {
      setDescription(initialData.description || '');
      setTotalValue(initialData.totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '');
      setInstallmentsCount(initialData.installmentsCount?.toString() || '1');
      setStartDate(initialData.startDate || '2026-02-03');
      setCategory(initialData.category || 'Compras');
    } else if (isOpen) {
      setDescription('');
      setTotalValue('');
      setInstallmentsCount('1');
      setStartDate('2026-02-03');
      setCategory('Compras');
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    const total = parseFloat(totalValue.replace(/\./g, '').replace(',', '.')) || 0;
    const count = parseInt(installmentsCount) || 1;
    if (total > 0 && count > 0) {
      const calc = total / count;
      setInstallmentValue(calc.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    } else {
      setInstallmentValue('0,00');
    }
  }, [totalValue, installmentsCount]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!description || !totalValue) return;
    onSave({
      id: initialData?.id,
      description,
      totalValue: parseFloat(totalValue.replace(/\./g, '').replace(',', '.')),
      installmentsCount: parseInt(installmentsCount),
      installmentValue: parseFloat(installmentValue.replace(/\./g, '').replace(',', '.')),
      startDate,
      category
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-[#3A4F3C]/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-[#E6DCCB] w-full max-w-lg rounded-t-2xl md:rounded-[2.5rem] p-5 md:p-10 shadow-2xl relative animate-in slide-in-from-bottom md:zoom-in-95 duration-300 border border-black/10 overflow-y-auto max-h-[95vh] custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-[#3A4F3C]/40 hover:text-[#3A4F3C]">
          <X size={20} />
        </button>

        <h3 className="text-xl md:text-3xl font-black text-[#3A4F3C] mb-5 md:mb-8 uppercase tracking-tighter">
          {initialData ? 'Editar Parcelamento' : 'Novo Parcelamento'}
        </h3>
        
        <div className="space-y-4 md:space-y-6">
          <div className="space-y-1">
            <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Descrição</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Sofá Novo"
              className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] uppercase text-[10px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Valor Total</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-[#3A4F3C]/30 text-[9px]">R$</span>
                <input 
                  type="text" 
                  value={totalValue}
                  onChange={(e) => setTotalValue(e.target.value)}
                  className="w-full bg-white/60 border border-black/5 rounded-xl pl-8 pr-3 py-3 font-black text-[#3A4F3C] text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Parcelas</label>
              <input 
                type="number" 
                min="1"
                value={installmentsCount}
                onChange={(e) => setInstallmentsCount(e.target.value)}
                className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 font-black text-[#3A4F3C] text-center text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Data Início</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 font-black text-[#3A4F3C] text-[9px] uppercase"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Categoria</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 font-black text-[#3A4F3C] text-[9px] uppercase appearance-none h-full"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-[#3A4F3C]/5 p-3 rounded-xl">
             <p className="text-[7px] font-black text-[#3A4F3C]/40 uppercase tracking-widest mb-1">Valor da Parcela Estimado</p>
             <p className="text-xl font-black text-[#3A4F3C]">R$ {installmentValue}</p>
          </div>

          <div className="flex flex-col-reverse md:flex-row md:space-x-3 pt-2 gap-2">
            <button 
              onClick={onClose}
              className="w-full md:flex-1 py-3 rounded-xl font-black text-[#3A4F3C]/40 hover:bg-black/5 uppercase text-[9px] tracking-widest"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="w-full md:flex-[2] py-4 rounded-xl font-black text-[#E6DCCB] bg-[#3A4F3C] shadow-xl text-[9px] uppercase tracking-widest"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInstallmentModal;
