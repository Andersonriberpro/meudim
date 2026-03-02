
import React, { useState, useEffect, useCallback } from 'react';
import { ICONS } from '../constants';
import AddInstallmentModal from './AddInstallmentModal';
import InstallmentDetailsModal from './InstallmentDetailsModal';
import AddCardModal from './AddCardModal';
import { FileText, Search, Filter, CreditCard, ChevronRight, MoreHorizontal, Plus, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

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
  limit_amount: number;
  status: 'Ativo' | 'Inativo';
}

const Installments: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'installments' | 'cards'>('installments');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingInstallment, setEditingInstallment] = useState<Installment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const [cardSearch, setCardSearch] = useState('');
  const [cardFilterStatus, setCardFilterStatus] = useState<'Todos' | 'Ativo' | 'Inativo'>('Todos');

  const [installments, setInstallments] = useState<Installment[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchInstallments = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('installments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInstallments((data || []).map(i => ({
        id: i.id,
        description: i.description,
        totalValue: Number(i.total_value),
        installmentsCount: Number(i.installments_count),
        installmentValue: Number(i.installment_value),
        startDate: i.start_date,
        category: i.category,
        paidParcels: i.paid_parcels || []
      })));
    } catch (err: any) {
      console.error('Erro ao carregar parcelamentos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchCards = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;

      setCards((data || []).map(c => ({
        id: c.id,
        name: c.name,
        nickname: c.nickname || '',
        lastDigits: c.last_digits || '',
        type: c.type || 'Crédito',
        brand: c.brand || 'Mastercard',
        dueDay: c.due_day?.toString() || '10',
        limit_amount: Number(c.limit_amount) || 0,
        status: c.status || 'Ativo'
      })));
    } catch (err: any) {
      console.error('Erro ao carregar cartões:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchInstallments();
    fetchCards();
  }, [fetchInstallments, fetchCards]);

  const handleOpenAdd = () => {
    setEditingInstallment(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Installment) => {
    setEditingInstallment(item);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    if (!user) return;
    try {
      if (data.id) {
        const { error } = await supabase
          .from('installments')
          .update({
            description: data.description,
            total_value: data.totalValue,
            installments_count: data.installmentsCount,
            installment_value: data.installmentValue,
            start_date: data.startDate,
            category: data.category
          })
          .eq('id', data.id)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('installments')
          .insert({
            user_id: user.id,
            description: data.description,
            total_value: data.totalValue,
            installments_count: data.installmentsCount,
            installment_value: data.installmentValue,
            start_date: data.startDate,
            category: data.category,
            paid_parcels: []
          });
        if (error) throw error;
      }
      showToast("Parcelamento salvo com sucesso!");
      fetchInstallments();
    } catch (err: any) {
      showToast("Erro ao salvar parcelamento");
      console.error(err);
    }
    setIsModalOpen(false);
    setEditingInstallment(null);
  };

  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [cardTransactions, setCardTransactions] = useState<any[]>([]);

  const fetchCardTransactions = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('amount, card_id, type')
        .not('card_id', 'is', null);
      if (error) throw error;
      setCardTransactions(data || []);
    } catch (err) {
      console.error('Erro ao carregar transações dos cartões:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchInstallments();
    fetchCards();
    fetchCardTransactions();
  }, [fetchInstallments, fetchCards, fetchCardTransactions]);

  const handleOpenAddCard = () => {
    setEditingCard(null);
    setIsCardModalOpen(true);
  };

  const handleOpenEditCard = (card: Card) => {
    setEditingCard(card);
    setIsCardModalOpen(true);
  };

  const handleSaveCard = async (data: any) => {
    if (!user) return;
    try {
      if (data.id) {
        const { error } = await supabase
          .from('cards')
          .update({
            name: data.name,
            nickname: data.nickname,
            last_digits: data.lastDigits,
            type: data.type,
            brand: data.brand,
            due_day: data.dueDay,
            limit_amount: data.limitAmount
          })
          .eq('id', data.id)
          .eq('user_id', user.id);
        if (error) throw error;
        showToast("Cartão atualizado!");
      } else {
        const { error } = await supabase
          .from('cards')
          .insert({
            user_id: user.id,
            name: data.name,
            nickname: data.nickname,
            last_digits: data.lastDigits,
            type: data.type,
            brand: data.brand,
            due_day: data.dueDay,
            limit_amount: data.limitAmount,
            status: 'Ativo'
          });
        if (error) throw error;
        showToast("Cartão cadastrado!");
      }
      fetchCards();
    } catch (err: any) {
      showToast("Erro ao salvar cartão");
      console.error(err);
    }
    setIsCardModalOpen(false);
    setEditingCard(null);
  };

  const calculateCardUsage = (cardId: string, limit: number) => {
    const used = cardTransactions
      .filter(t => t.card_id === cardId && t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const percent = limit > 0 ? (used / limit) * 100 : 0;
    return { used, percent: Math.min(100, percent) };
  };

  const deleteCard = async (id: string) => {
    if (!user) return;
    if (confirm('Deseja realmente excluir este cartão?')) {
      try {
        const { error } = await supabase
          .from('cards')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
        if (error) throw error;
        fetchCards();
        showToast("Cartão removido");
      } catch (err: any) {
        showToast("Erro ao excluir cartão");
        console.error(err);
      }
    }
  };

  const deleteInstallment = async (id: string) => {
    if (!user) return;
    if (confirm('Deseja realmente excluir este parcelamento?')) {
      try {
        const { error } = await supabase
          .from('installments')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
        if (error) throw error;
        setInstallments(installments.filter(item => item.id !== id));
        showToast("Excluído com sucesso");
      } catch (err: any) {
        showToast("Erro ao excluir");
        console.error(err);
      }
    }
  };

  const openDetails = (id: string) => {
    setSelectedId(id);
    setIsDetailsOpen(true);
  };

  const toggleParcelStatus = async (parcelNumber: number) => {
    if (!user || !selectedId) return;
    const item = installments.find(i => i.id === selectedId);
    if (!item) return;

    const isPaid = item.paidParcels.includes(parcelNumber);
    const newPaidParcels = isPaid
      ? item.paidParcels.filter(n => n !== parcelNumber)
      : [...item.paidParcels, parcelNumber];

    try {
      const { error } = await supabase
        .from('installments')
        .update({ paid_parcels: newPaidParcels })
        .eq('id', selectedId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Se marcou como pago (isPaid era falso e agora é verdadeiro)
      if (!isPaid) {
        const { error: transError } = await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            description: `${item.description} - Parc ${parcelNumber}/${item.installmentsCount}`,
            amount: item.installmentValue,
            date: new Date().toISOString().split('T')[0],
            type: 'EXPENSE',
            category: item.category,
            payment_method: 'Pix',
          });

        if (transError) {
          console.error('Erro ao gerar lançamento:', transError);
        } else {
          showToast("Lançamento gerado em despesas! 💸");
        }
      }

      setInstallments(prev => prev.map(i => i.id === selectedId ? { ...i, paidParcels: newPaidParcels } : i));
    } catch (err: any) {
      showToast("Erro ao atualizar parcela");
      console.error(err);
    }
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
      {toast && (
        <div className="fixed top-20 md:top-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-[300] bg-[#6E8F7A] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-white/20 w-[85%] md:w-auto">
          <CheckCircle2 size={18} />
          <span className="font-black uppercase text-[9px] tracking-tight">{toast}</span>
        </div>
      )}

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

          {isLoading ? (
            <div className="p-10 md:p-16 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 border-3 border-[#3A4F3C]/20 border-t-[#3A4F3C] rounded-full animate-spin mb-3" />
              <p className="text-[10px] md:text-sm font-black text-[#3A4F3C]/30 uppercase tracking-widest">Carregando...</p>
            </div>
          ) : installments.length === 0 ? (
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
                    <button onClick={() => handleOpenEditCard(card)} className="p-1.5 text-[#3A4F3C]/20 hover:text-[#3A4F3C] transition-colors"><Edit size={14} /></button>
                    <button onClick={() => deleteCard(card.id)} className="p-1.5 text-[#3A4F3C]/20 hover:text-[#9C4A3C] transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm md:text-xl font-black text-[#3A4F3C] uppercase tracking-tight leading-none">{card.name}</h4>
                    <p className="text-[7px] md:text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest mt-1 italic">{card.nickname || 'Sem apelido'}</p>
                  </div>

                  {card.type === 'Crédito' && card.limit_amount > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[7px] md:text-[9px] font-black uppercase tracking-widest">
                        <span className="text-[#3A4F3C]/40 text-[6px]">Uso do Limite</span>
                        <span className="text-[#3A4F3C]">{calculateCardUsage(card.id, card.limit_amount).percent.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${calculateCardUsage(card.id, card.limit_amount).percent > 90 ? 'bg-[#9C4A3C]' : 'bg-[#3A4F3C]'}`}
                          style={{ width: `${calculateCardUsage(card.id, card.limit_amount).percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[6px] font-black uppercase text-[#3A4F3C]/40">
                        <span>Gasto: R$ {calculateCardUsage(card.id, card.limit_amount).used.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        <span>Total: R$ {card.limit_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                    <div>
                      <p className="text-[7px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">Final</p>
                      <p className="text-[10px] md:text-sm font-black text-[#3A4F3C]">{card.lastDigits ? `•••• ${card.lastDigits}` : '----'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[7px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">Vencimento</p>
                      <p className="text-[10px] md:text-sm font-black text-[#3A4F3C]">Dia {card.dueDay || '--'}</p>
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
        initialData={editingCard}
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
