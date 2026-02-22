
import React, { useState } from 'react';
import { ICONS } from '../constants';
import AddInstallmentModal from './AddInstallmentModal';
import InstallmentDetailsModal from './InstallmentDetailsModal';
import AddCardModal from './AddCardModal';
import { FileText, Search, Filter, CreditCard, ChevronRight, MoreHorizontal, Plus, Edit, Trash2 } from 'lucide-react';

interface Installment {
  id: string;
  description: string;
  totalValue: number;
  installmentsCount: number;
  installmentValue: number;
  startDate: string;
  category: string;
  paidParcels: number[];
}

interface Card {
  id: string;
  name: string;
  nickname: string;
  lastDigits: string;
  type: string;
  brand: string;
  dueDay: string;
  status: 'Ativo' | 'Inativo';
}

const Installments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'installments' | 'cards'>('installments');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingInstallment, setEditingInstallment] = useState<Installment | null>(null);
  
  const [cardSearch, setCardSearch] = useState('');
  const [cardFilterStatus, setCardFilterStatus] = useState<'Todos' | 'Ativo' | 'Inativo'>('Todos');

  const [installments, setInstallments] = useState<Installment[]>([
    {
      id: 'demo-1',
      description: 'Compra Veículo',
      totalValue: 20000.00,
      installmentsCount: 36,
      installmentValue: 555.56,
      startDate: '2026-02-02',
      category: 'Transporte',
      paidParcels: []
    }
  ]);

  const [cards, setCards] = useState<Card[]>([
    {
      id: 'c1',
      name: 'Nubank Roxo',
      nickname: 'Cartão Principal',
      lastDigits: '4455',
      type: 'Crédito',
      brand: 'Mastercard',
      dueDay: '10',
      status: 'Ativo'
    }
  ]);

  const handleOpenAdd = () => {
    setEditingInstallment(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Installment) => {
    setEditingInstallment(item);
    setIsModalOpen(true);
  };

  const handleSave = (data: any) => {
    if (data.id) {
      setInstallments(installments.map(item => item.id === data.id ? { ...item, ...data } : item));
    } else {
      const newItem: Installment = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        paidParcels: []
      };
      setInstallments([newItem, ...installments]);
    }
    setIsModalOpen(false);
    setEditingInstallment(null);
  };

  const handleSaveCard = (data: any) => {
    const newCard: Card = {
      ...data,
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      status: 'Ativo'
    };
    setCards([newCard, ...cards]);
    setIsCardModalOpen(false);
  };

  const deleteInstallment = (id: string) => {
    if (confirm('Deseja realmente excluir este parcelamento?')) {
      setInstallments(installments.filter(item => item.id !== id));
    }
  };

  const openDetails = (id: string) => {
    setSelectedId(id);
    setIsDetailsOpen(true);
  };

  const toggleParcelStatus = (parcelNumber: number) => {
    if (!selectedId) return;
    setInstallments(prev => prev.map(item => {
      if (item.id === selectedId) {
        const isPaid = item.paidParcels.includes(parcelNumber);
        const newPaidParcels = isPaid 
          ? item.paidParcels.filter(n => n !== parcelNumber)
          : [...item.paidParcels, parcelNumber];
        return { ...item, paidParcels: newPaidParcels };
      }
      return item;
    }));
  };

  const activeInstallment = installments.find(i => i.id === selectedId);
  const filteredCards = cards.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(cardSearch.toLowerCase()) || 
                          c.nickname.toLowerCase().includes(cardSearch.toLowerCase()) ||
                          c.lastDigits.includes(cardSearch);
    const matchesStatus = cardFilterStatus === 'Todos' || c.status === cardFilterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 md:space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
         <h2 className="text-xl md:text-4xl font-black text-[#3A4F3C] uppercase tracking-tighter">Parcelas</h2>
         <div className="flex bg-[#3A4F3C]/5 p-1 rounded-xl w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('installments')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === 'installments' ? 'bg-[#3A4F3C] text-[#E6DCCB] shadow-lg' : 'text-[#3A4F3C]/40 hover:text-[#3A4F3C]'}`}
            >
               Contratos
            </button>
            <button 
              onClick={() => setActiveTab('cards')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === 'cards' ? 'bg-[#3A4F3C] text-[#E6DCCB] shadow-lg' : 'text-[#3A4F3C]/40 hover:text-[#3A4F3C]'}`}
            >
               Cartões
            </button>
         </div>
      </div>

      {activeTab === 'installments' ? (
        <div className="space-y-4 animate-in slide-in-from-left-4 duration-500">
           <div className="flex justify-end md:block hidden">
             <button 
               onClick={handleOpenAdd}
               className="bg-[#3A4F3C] text-[#E6DCCB] px-6 py-2 rounded-xl font-black flex items-center space-x-2 shadow-xl hover:bg-[#2F3F31] transition-all active:scale-95 text-[9px] uppercase tracking-widest"
             >
                <Plus size={16} />
                <span>Novo Parcelamento</span>
             </button>
           </div>
           
           {/* FAB Mobile */}
           <button 
             onClick={handleOpenAdd}
             className="md:hidden fixed bottom-24 right-5 z-40 w-14 h-14 bg-[#3A4F3C] rounded-full shadow-2xl flex items-center justify-center text-[#E6DCCB] border-4 border-white active:scale-90"
           >
             <Plus size={28} strokeWidth={3} />
           </button>

          {installments.length === 0 ? (
            <div className="bg-white/40 backdrop-blur-md p-10 rounded-xl md:rounded-[3rem] shadow-sm border border-white/40 text-center">
               <p className="text-xs font-black uppercase tracking-tight text-[#3A4F3C]/40">Nenhum parcelamento ativo.</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-6">
              {installments.map((item) => (
                <div key={item.id} className="bg-white/40 backdrop-blur-md p-4 md:p-8 rounded-xl md:rounded-[2.5rem] shadow-sm border border-white/40 space-y-4 relative group hover:bg-white/60 transition-all">
                   <div className="flex justify-between items-start">
                      <h3 className="text-sm md:text-2xl font-black text-[#3A4F3C] leading-tight uppercase tracking-tight">
                        {item.description}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <button onClick={() => handleOpenEdit(item)} className="p-1.5 md:p-2 text-[#3A4F3C]/20 hover:text-[#3A4F3C]"><Edit size={14} /></button>
                        <button onClick={() => deleteInstallment(item.id)} className="p-1.5 md:p-2 text-[#3A4F3C]/20 hover:text-[#9C4A3C]"><Trash2 size={14} /></button>
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <div className="flex justify-between text-[7px] md:text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">
                         <span>Progresso</span>
                         <span>{item.paidParcels.length}/{item.installmentsCount} parcelas</span>
                      </div>
                      <div className="w-full h-2.5 md:h-4 bg-black/5 rounded-full overflow-hidden">
                         <div className="h-full bg-[#3A4F3C] rounded-full transition-all duration-700" style={{ width: `${Math.max((item.paidParcels.length / item.installmentsCount) * 100, 2)}%` }} />
                      </div>
                   </div>
                   <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-1">
                      <div className="flex flex-1 w-full justify-between md:justify-start md:space-x-10">
                        <div className="space-y-0.5">
                          <p className="text-[7px] md:text-[9px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">Devedor</p>
                          <p className="text-sm md:text-2xl font-black text-[#9C4A3C] tracking-tighter">R$ {(item.totalValue - (item.paidParcels.length * item.installmentValue)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[7px] md:text-[9px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">Valor Parcela</p>
                          <p className="text-sm md:text-2xl font-black text-[#3A4F3C] tracking-tighter">R$ {item.installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                      <button onClick={() => openDetails(item.id)} className="w-full md:w-auto flex items-center justify-center space-x-2 bg-white/60 border border-black/5 px-4 py-2.5 rounded-xl text-[#3A4F3C] font-black text-[8px] uppercase tracking-widest hover:bg-white active:scale-95 shadow-sm">
                        <FileText size={14} />
                        <span>Ver Detalhes</span>
                      </button>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
          <div className="bg-[#3A4F3C] text-[#E6DCCB] p-5 md:p-12 rounded-xl md:rounded-[3rem] shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
                <h3 className="text-base md:text-3xl font-black uppercase tracking-tighter leading-none">Meus Cartões</h3>
                <p className="text-[7px] md:text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">Gestão de limites e faturas</p>
             </div>
             <button 
               onClick={() => setIsCardModalOpen(true)}
               className="bg-[#E6DCCB] text-[#3A4F3C] px-6 py-2.5 rounded-xl font-black uppercase text-[8px] md:text-[10px] tracking-widest flex items-center justify-center space-x-2"
             >
                <Plus size={14} />
                <span>Novo Cartão</span>
             </button>
          </div>

          <div className="bg-white/40 backdrop-blur-md p-4 rounded-xl shadow-sm border border-white/40 flex flex-col md:flex-row gap-3">
             <div className="relative flex-1">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A4F3C]/40" />
                <input 
                  type="text"
                  placeholder="Buscar..."
                  value={cardSearch}
                  onChange={(e) => setCardSearch(e.target.value)}
                  className="w-full bg-white/60 border border-black/5 rounded-xl px-10 py-2.5 outline-none font-black text-[#3A4F3C] text-[9px] uppercase tracking-widest"
                />
             </div>
             <div className="flex bg-[#3A4F3C]/5 p-0.5 rounded-xl">
                {['Todos', 'Ativo'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setCardFilterStatus(status as any)}
                    className={`flex-1 px-3 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${cardFilterStatus === status ? 'bg-[#3A4F3C] text-white shadow-md' : 'text-[#3A4F3C]/40'}`}
                  >
                    {status}
                  </button>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {filteredCards.map((card) => (
              <div 
                key={card.id} 
                className="bg-white/60 backdrop-blur-md p-5 rounded-xl md:rounded-[2.5rem] shadow-sm border border-white/40 hover:bg-white transition-all group"
              >
                <div className="flex items-center justify-between mb-4 md:mb-8">
                   <div className="p-2.5 bg-[#3A4F3C] text-white rounded-xl">
                      <CreditCard size={18} />
                   </div>
                   <div className="flex items-center space-x-2">
                      <span className="text-[7px] font-black uppercase tracking-widest px-2 py-1 bg-[#6E8F7A]/10 text-[#6E8F7A] rounded-lg">
                        {card.status}
                      </span>
                      <button className="text-[#3A4F3C]/20 hover:text-[#3A4F3C]"><MoreHorizontal size={16}/></button>
                   </div>
                </div>

                <div className="space-y-3">
                   <div>
                      <h4 className="text-sm md:text-xl font-black text-[#3A4F3C] uppercase tracking-tight leading-none">{card.name}</h4>
                      <p className="text-[7px] md:text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest mt-1 italic">{card.nickname}</p>
                   </div>
                   <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                      <div>
                         <p className="text-[7px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">Final</p>
                         <p className="text-[10px] md:text-sm font-black text-[#3A4F3C]">•••• {card.lastDigits}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[7px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">Vencimento</p>
                         <p className="text-[10px] md:text-sm font-black text-[#3A4F3C]">Dia {card.dueDay}</p>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AddInstallmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        initialData={editingInstallment}
      />

      <AddCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onSave={handleSaveCard}
      />

      {activeInstallment && (
        <InstallmentDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          installment={activeInstallment}
          onToggleParcel={toggleParcelStatus}
        />
      )}
    </div>
  );
};

export default Installments;
