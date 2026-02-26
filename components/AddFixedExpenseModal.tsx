
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddFixedExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { id?: string; label: string; amount: number; dueDate: string; paid: boolean }) => void;
    initialData?: { id: string; label: string; amount: number; dueDate: string; paid: boolean } | null;
}

const AddFixedExpenseModal: React.FC<AddFixedExpenseModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [label, setLabel] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDay, setDueDay] = useState('');
    const [paid, setPaid] = useState(false);

    useEffect(() => {
        if (initialData && isOpen) {
            setLabel(initialData.label || '');
            setAmount(initialData.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '');
            setDueDay(initialData.dueDate?.replace('Dia ', '') || '');
            setPaid(initialData.paid || false);
        } else if (isOpen) {
            setLabel('');
            setAmount('');
            setDueDay('');
            setPaid(false);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!label || !amount) return;
        onSave({
            id: initialData?.id,
            label,
            amount: parseFloat(amount.replace(/\./g, '').replace(',', '.')) || 0,
            dueDate: dueDay ? `Dia ${dueDay}` : '',
            paid
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
            <div className="absolute inset-0 bg-[#3A4F3C]/60 backdrop-blur-md" onClick={onClose} />

            <div className="bg-[#E6DCCB] w-full max-w-lg rounded-t-2xl md:rounded-[2.5rem] p-5 md:p-10 shadow-2xl relative animate-in slide-in-from-bottom md:zoom-in-95 duration-300 border border-black/10 overflow-y-auto max-h-[95vh] custom-scrollbar">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-[#3A4F3C]/40 hover:text-[#3A4F3C]">
                    <X size={20} />
                </button>

                <div className="mb-6 md:mb-10">
                    <h3 className="text-xl md:text-3xl font-black text-[#3A4F3C] uppercase tracking-tighter leading-none">
                        {initialData ? 'Editar Gasto Fixo' : 'Novo Gasto Fixo'}
                    </h3>
                    <p className="text-[7px] md:text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest mt-1 italic">
                        Configure sua conta recorrente
                    </p>
                </div>

                <div className="space-y-4 md:space-y-6">
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Descrição *</label>
                        <input
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="Ex: Aluguel, Internet, Luz"
                            className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] uppercase text-[10px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Valor *</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-[#3A4F3C]/30 text-[9px]">R$</span>
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0,00"
                                    className="w-full bg-white/60 border border-black/5 rounded-xl pl-8 pr-3 py-3 font-black text-[#3A4F3C] text-xs"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Vencimento (Dia)</label>
                            <input
                                type="number"
                                min={1}
                                max={31}
                                value={dueDay}
                                onChange={(e) => setDueDay(e.target.value)}
                                placeholder="Ex: 10"
                                className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 font-black text-[#3A4F3C] text-center text-xs"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-white/40 p-4 rounded-xl border border-black/5">
                        <button
                            onClick={() => setPaid(!paid)}
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${paid ? 'bg-[#6E8F7A] border-[#6E8F7A] text-white' : 'border-[#3A4F3C]/20'}`}
                        >
                            {paid && <span className="text-xs font-black">✓</span>}
                        </button>
                        <span className="text-[9px] font-black text-[#3A4F3C] uppercase tracking-widest">Já foi pago este mês</span>
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
                            disabled={!label || !amount}
                            className={`w-full md:flex-[2] py-4 rounded-xl font-black text-[#E6DCCB] shadow-xl uppercase text-[9px] tracking-widest transition-all ${label && amount ? 'bg-[#3A4F3C]' : 'bg-[#3A4F3C]/20 text-[#3A4F3C]/40'}`}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddFixedExpenseModal;
