import React, { useState, useEffect, useMemo } from 'react';
import { X, TrendingUp, AlertCircle, Info } from 'lucide-react';
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
  const [installmentValue, setInstallmentValue] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Compras');

  useEffect(() => {
    if (initialData && isOpen) {
      setDescription(initialData.description || '');
      setTotalValue(initialData.totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '');
      setInstallmentsCount(initialData.installmentsCount?.toString() || '1');
      setInstallmentValue(initialData.installmentValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '');
      setStartDate(initialData.startDate || new Date().toISOString().split('T')[0]);
      setCategory(initialData.category || 'Compras');
    } else if (isOpen) {
      setDescription('');
      setTotalValue('');
      setInstallmentsCount('1');
      setInstallmentValue('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setCategory('Compras');
    }
  }, [initialData, isOpen]);

  // Auto-calculate installment value when total or count changes
  useEffect(() => {
    if (!isOpen || initialData) return; // Don't auto-calc on edit initial load

    const total = parseFloat(totalValue.replace(/\./g, '').replace(',', '.')) || 0;
    const count = parseInt(installmentsCount) || 1;

    if (total > 0 && count > 0) {
      const calc = total / count;
      setInstallmentValue(calc.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    }
  }, [totalValue, installmentsCount, isOpen, initialData]);

  const financialStats = useMemo(() => {
    const totalV = parseFloat(totalValue.replace(/\./g, '').replace(',', '.')) || 0;
    const instV = parseFloat(installmentValue.replace(/\./g, '').replace(',', '.')) || 0;
    const count = parseInt(installmentsCount) || 1;

    const totalPaid = instV * count;
    const totalInterest = Math.max(0, totalPaid - totalV);
    const interestPercent = totalV > 0 && totalInterest > 0
      ? ((totalInterest / totalV) / count) * 100
      : 0;

    return {
      totalPaid,
      totalInterest,
      interestPercent
    };
  }, [totalValue, installmentValue, installmentsCount]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!description || !totalValue || !installmentValue) return;
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

        <div className="mb-6">
          <h3 className="text-xl md:text-3xl font-black text-[#3A4F3C] uppercase tracking-tighter leading-none">
            {initialData ? 'Editar Parcelamento' : 'Novo Parcelamento'}
          </h3>
          <p className="text-[7px] md:text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest mt-1 italic">
            Configure seu financiamento
          </p>
        </div>

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
              <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Valor Total (Original)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-[#3A4F3C]/30 text-[9px]">R$</span>
                <input
                  type="text"
                  value={totalValue}
                  onChange={(e) => setTotalValue(e.target.value)}
                  placeholder="0,00"
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
              <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Valor da Parcela (Real)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-[#3A4F3C]/30 text-[9px]">R$</span>
                <input
                  type="text"
                  value={installmentValue}
                  onChange={(e) => setInstallmentValue(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-[#3A4F3C]/5 border border-[#3A4F3C]/20 rounded-xl pl-8 pr-3 py-3 font-black text-[#3A4F3C] text-xs focus:bg-white transition-all"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Data Início</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 font-black text-[#3A4F3C] text-[9px] uppercase"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 font-black text-[#3A4F3C] text-[10px] uppercase appearance-none"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {financialStats.totalInterest > 0 && (
            <div className="bg-[#9C4A3C]/5 border border-[#9C4A3C]/20 p-4 rounded-xl space-y-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp size={14} className="text-[#9C4A3C]" />
                  <span className="text-[8px] font-black text-[#9C4A3C] uppercase tracking-widest">Indicador de Juros</span>
                </div>
                <div className="bg-[#9C4A3C] text-white px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-tighter">
                  {financialStats.interestPercent.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}% ao mês
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[#9C4A3C]/10 pt-3">
                <div>
                  <p className="text-[7px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">Total com Juros</p>
                  <p className="text-sm font-black text-[#3A4F3C]">R$ {financialStats.totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="text-right">
                  <p className="text-[7px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">Juros Pagos</p>
                  <p className="text-sm font-black text-[#9C4A3C]">R$ {financialStats.totalInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 opacity-40">
                <AlertCircle size={10} />
                <p className="text-[6px] font-bold uppercase italic tracking-tight">Cálculo baseado na diferença entre o valor original e o total das parcelas.</p>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse md:flex-row md:space-x-3 pt-2 gap-2">
            <button
              onClick={onClose}
              className="w-full md:flex-1 py-4 rounded-xl font-black text-[#3A4F3C]/40 hover:bg-black/5 uppercase text-[9px] tracking-widest"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!description || !totalValue || !installmentValue}
              className={`w-full md:flex-[2] py-4 rounded-xl font-black text-[#E6DCCB] shadow-xl text-[9px] uppercase tracking-widest transition-all ${description && totalValue && installmentValue ? 'bg-[#3A4F3C]' : 'bg-[#3A4F3C]/20 text-[#3A4F3C]/40'}`}
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
