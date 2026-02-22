
import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Tag, Trash2, Check } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS } from '../constants';

interface ScannedItem {
  id: string;
  name: string;
  amount: number;
  category: string;
}

interface ScanVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  scannedItems: ScannedItem[];
  onConfirm: (items: any[], paymentMethod: string) => void;
}

const ScanVerificationModal: React.FC<ScanVerificationModalProps> = ({ 
  isOpen, 
  onClose, 
  scannedItems, 
  onConfirm 
}) => {
  const [items, setItems] = useState<ScannedItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('Pix');

  useEffect(() => {
    if (isOpen) {
      setItems(scannedItems);
    }
  }, [isOpen, scannedItems]);

  const updateItem = (id: string, field: keyof ScannedItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const total = items.reduce((acc, curr) => acc + curr.amount, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#3A4F3C]/80 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="bg-[#E6DCCB] w-full max-w-2xl h-[90vh] rounded-[3rem] flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden border border-black/10">
        
        {/* Header */}
        <div className="p-10 border-b border-black/5 bg-[#E6DCCB] sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-4xl font-black text-[#3A4F3C] uppercase tracking-tighter leading-none">Conferência</h3>
            <button onClick={onClose} className="p-3 bg-black/5 text-[#3A4F3C] hover:bg-black/10 rounded-full">
              <X size={24} />
            </button>
          </div>
          <p className="text-[#3A4F3C]/60 font-bold uppercase text-[10px] tracking-[0.3em]">IA detectou {items.length} itens no seu cupom</p>
        </div>

        {/* Global Settings */}
        <div className="px-10 py-8 bg-[#D8CFC0]/50 border-b border-black/5">
          <label className="text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-[0.2em] block mb-4">Forma de Pagamento Padrão</label>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map(method => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  paymentMethod === method 
                  ? 'bg-[#3A4F3C] text-white shadow-xl' 
                  : 'bg-white/50 text-[#3A4F3C]/60 border border-black/5 hover:bg-white'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-10 space-y-5 custom-scrollbar bg-[#E6DCCB]/50">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-8 rounded-[2rem] flex flex-col gap-6 shadow-sm border border-black/5 hover:border-[#3A4F3C]/20 transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex-1 flex items-center space-x-4">
                   <div className="p-3 bg-[#D8CFC0] text-[#3A4F3C] rounded-2xl">
                      <ShoppingBag size={24} />
                   </div>
                   <input 
                     value={item.name}
                     onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                     className="bg-transparent border-b-2 border-transparent focus:border-[#3A4F3C]/20 outline-none font-black text-[#3A4F3C] text-xl flex-1 uppercase tracking-tight"
                   />
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-3 text-black/10 hover:text-[#9C4A3C] transition-colors"
                >
                  <Trash2 size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#E6DCCB]/50 px-5 py-4 rounded-2xl flex items-center space-x-3 border border-black/5">
                  <Tag size={16} className="text-[#3A4F3C]/40" />
                  <select 
                    value={item.category}
                    onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                    className="bg-transparent text-[10px] font-black text-[#3A4F3C] outline-none cursor-pointer uppercase w-full"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="bg-[#E6DCCB]/50 px-5 py-4 rounded-2xl flex items-center space-x-3 border border-black/5">
                  <span className="text-[10px] font-black text-[#3A4F3C]/40">VALOR R$</span>
                  <input 
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                    className="bg-transparent text-xl font-black text-[#3A4F3C] w-full outline-none text-right"
                  />
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="py-24 text-center space-y-4 opacity-30">
               <ShoppingBag size={64} className="mx-auto" />
               <p className="font-black uppercase tracking-widest text-sm">Cupom Vazio</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-10 border-t border-black/5 bg-[#E6DCCB] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
             <p className="text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-[0.2em] mb-1">Total Confirmado</p>
             <p className="text-5xl font-black text-[#3A4F3C]">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          
          <button 
            onClick={() => onConfirm(items, paymentMethod)}
            disabled={items.length === 0}
            className="w-full md:w-auto bg-[#3A4F3C] text-white px-12 py-6 rounded-[2rem] font-black text-xl uppercase tracking-tighter shadow-2xl hover:bg-[#2F3F31] transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center space-x-4"
          >
            <Check size={24} strokeWidth={3} />
            <span>Lançar {items.length} Itens</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanVerificationModal;
