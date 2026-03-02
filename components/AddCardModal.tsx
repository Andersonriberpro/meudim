import React, { useState, useEffect } from 'react';
import { X, CreditCard, ChevronDown } from 'lucide-react';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [lastDigits, setLastDigits] = useState('');
  const [type, setType] = useState('Crédito');
  const [brand, setBrand] = useState('Mastercard');
  const [dueDay, setDueDay] = useState('');
  const [limitAmount, setLimitAmount] = useState('');

  const BRANDS = ['Mastercard', 'Visa', 'Elo', 'Amex', 'Hipercard', 'Outra'];
  const TYPES = ['Crédito', 'Débito', 'Alimentação', 'Refeição'];

  useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.name || '');
      setNickname(initialData.nickname || '');
      setLastDigits(initialData.lastDigits || '');
      setType(initialData.type || 'Crédito');
      setBrand(initialData.brand || 'Mastercard');
      setDueDay(initialData.dueDay?.toString() || '');
      const limit = initialData.limitAmount ?? initialData.limit_amount ?? 0;
      setLimitAmount(limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    } else if (isOpen) {
      setName('');
      setNickname('');
      setLastDigits('');
      setType('Crédito');
      setBrand('Mastercard');
      setDueDay('');
      setLimitAmount('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!name || !dueDay) return;
    onSave({
      id: initialData?.id,
      name,
      nickname,
      lastDigits,
      type,
      brand,
      dueDay: parseInt(dueDay),
      limitAmount: parseFloat(limitAmount.replace(/\./g, '').replace(',', '.')) || 0
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-[#3A4F3C]/60 backdrop-blur-md" onClick={onClose} />

      <div className="bg-[#E6DCCB] w-full max-w-xl rounded-t-2xl md:rounded-[2.5rem] p-5 md:p-10 shadow-2xl relative animate-in slide-in-from-bottom md:zoom-in-95 duration-300 border border-black/10 max-h-[95vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-[#3A4F3C]/40 hover:text-[#3A4F3C]">
          <X size={20} />
        </button>

        <div className="mb-6 md:mb-10">
          <h3 className="text-xl md:text-3xl font-black text-[#3A4F3C] uppercase tracking-tighter leading-none">
            {initialData ? 'Editar Cartão' : 'Novo Cartão'}
          </h3>
          <p className="text-[7px] md:text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest mt-1 italic">Configure seu meio de pagamento</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Nome do Banco/Cartão *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Nubank"
                className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] uppercase text-[10px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Apelido (Opcional)</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Ex: Cartão Pessoal"
                className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] uppercase text-[10px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Limite Total</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-[#3A4F3C]/30 text-[9px]">R$</span>
                <input
                  type="text"
                  value={limitAmount}
                  onChange={(e) => setLimitAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-white/60 border border-black/5 rounded-xl pl-8 pr-3 py-3 font-black text-[#3A4F3C] text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Final (4 dígitos)</label>
              <input
                type="text"
                maxLength={4}
                value={lastDigits}
                onChange={(e) => setLastDigits(e.target.value.replace(/\D/g, ''))}
                placeholder="0000"
                className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] text-[10px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Vencimento (Dia)</label>
              <input
                type="number"
                min={1}
                max={31}
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                placeholder="Ex: 10"
                className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] text-[10px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 font-black text-[#3A4F3C] text-[9px] uppercase appearance-none"
              >
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Bandeira</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 font-black text-[#3A4F3C] text-[9px] uppercase appearance-none"
            >
              {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="flex flex-col-reverse md:flex-row md:space-x-3 pt-4 gap-2">
            <button onClick={onClose} className="w-full md:flex-1 py-4 rounded-xl font-black text-[#3A4F3C]/40 hover:bg-black/5 uppercase text-[9px] tracking-widest transition-all">
              Cancelar
            </button>
            <button onClick={handleCreate} disabled={!name || !dueDay} className={`w-full md:flex-[2] py-4 rounded-xl font-black text-[#E6DCCB] shadow-xl uppercase text-[9px] tracking-widest transition-all ${name && dueDay ? 'bg-[#3A4F3C]' : 'bg-[#3A4F3C]/20 text-[#3A4F3C]/40'}`}>
              {initialData ? 'Salvar Alterações' : 'Criar Cartão'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCardModal;
