
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { WishlistGoal, WishlistItem } from '../types';
import { Target, ArrowLeft, ChevronRight, Trash2, ShoppingCart, Edit, DollarSign, PartyPopper, Plane, Home, CheckCircle2, Check, Plus } from 'lucide-react';
import AddTransactionModal from './AddTransactionModal';

const Wishlist: React.FC = () => {
  const [goals, setGoals] = useState<WishlistGoal[]>([
    {
      id: '1',
      name: 'viagem',
      items: [
        {
          id: 'demo-1',
          description: 'roupa',
          price: 100,
          category: 'Lazer',
          isPaid: false
        }
      ]
    }
  ]);
  const [newGoalName, setNewGoalName] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [itemToPay, setItemToPay] = useState<WishlistItem | null>(null);

  // Form states for adding item to goal
  const [itemDesc, setItemDesc] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('Lazer');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const createGoal = () => {
    if (!newGoalName.trim()) {
      showToast("Digite um nome para a meta");
      return;
    }
    const newGoal: WishlistGoal = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGoalName,
      items: []
    };
    setGoals([...goals, newGoal]);
    setNewGoalName('');
    showToast("Tudo certo por aqui 👌");
  };

  const deleteGoal = (id: string) => {
    if (confirm('Deseja realmente excluir esta meta?')) {
      setGoals(goals.filter(g => g.id !== id));
      showToast("Seu dim tá organizado");
    }
  };

  const addItemToGoal = () => {
    if (!selectedGoalId || !itemDesc.trim()) return;
    const price = parseFloat(itemPrice.replace(',', '.')) || 0;

    const newItem: WishlistItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: itemDesc,
      price: price,
      category: itemCategory,
      isPaid: false
    };

    setGoals(goals.map(g => {
      if (g.id === selectedGoalId) {
        return { ...g, items: [...g.items, newItem] };
      }
      return g;
    }));

    setItemDesc('');
    setItemPrice('');
    showToast("Tudo certo por aqui 👌");
  };

  const deleteItem = (goalId: string, itemId: string) => {
    setGoals(goals.map(g => {
      if (g.id === goalId) {
        return { ...g, items: g.items.filter(i => i.id !== itemId) };
      }
      return g;
    }));
    showToast("Seu dim tá organizado");
  };

  const handleOpenPaymentModal = (item: WishlistItem) => {
    setItemToPay(item);
    setIsPaymentModalOpen(true);
  };

  const handleFinishPayment = () => {
    if (selectedGoalId && itemToPay) {
      setGoals(goals.map(g => {
        if (g.id === selectedGoalId) {
          return {
            ...g,
            items: g.items.map(i => i.id === itemToPay.id ? { ...i, isPaid: true } : i)
          };
        }
        return g;
      }));
    }
    setIsPaymentModalOpen(false);
    setItemToPay(null);
    showToast("Gasto registrado com sucesso");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Viagem': return <Plane size={16} className="text-[#9C4A3C]" />;
      case 'Casa': return <Home size={16} className="text-[#3A4F3C]" />;
      case 'Lazer': return <PartyPopper size={16} className="text-[#6E8F7A]" />;
      case 'Compras': return <ShoppingCart size={16} className="text-[#3A4F3C]" />;
      default: return <ShoppingCart size={16} className="text-[#3A4F3C]/40" />;
    }
  };

  const selectedGoal = goals.find(g => g.id === selectedGoalId);

  // Detail View
  if (selectedGoalId && selectedGoal) {
    const totalGoalValue = selectedGoal.items.reduce((acc, curr) => acc + curr.price, 0);
    const paidGoalValue = selectedGoal.items.filter(i => i.isPaid).reduce((acc, curr) => acc + curr.price, 0);
    const remainingGoalValue = totalGoalValue - paidGoalValue;

    return (
      <div className="space-y-4 md:space-y-6 animate-in slide-in-from-right duration-500 pb-20">
        {toast && (
          <div className="fixed top-20 md:top-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-[300] bg-[#6E8F7A] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-white/20 w-[85%] md:w-auto">
            <CheckCircle2 size={18} />
            <span className="font-black uppercase text-[9px] tracking-tight">{toast}</span>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSelectedGoalId(null)}
            className="p-2 md:p-3 bg-white/40 text-[#3A4F3C] hover:bg-white rounded-xl transition-all shadow-sm"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h2 className="text-xl md:text-4xl font-black text-[#3A4F3C] uppercase tracking-tighter leading-tight">{selectedGoal.name}</h2>
            <p className="text-[7px] md:text-[10px] font-black uppercase tracking-widest opacity-40">Gestão de Itens</p>
          </div>
        </div>

        {/* Card Adicionar Item - Mais compacto */}
        <div className="bg-white/40 backdrop-blur-md p-5 md:p-8 rounded-xl md:rounded-[2.5rem] shadow-sm border border-white/40">
          <h3 className="text-sm md:text-2xl font-black text-[#3A4F3C] mb-4 uppercase tracking-tight">Adicionar Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              value={itemDesc}
              onChange={(e) => setItemDesc(e.target.value)}
              placeholder="O que comprar?"
              className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] uppercase text-[9px]"
            />
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#3A4F3C]/30 text-[8px]">R$</span>
              <input
                type="text"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                placeholder="0,00"
                className="w-full bg-white/60 border border-black/5 rounded-xl pl-8 pr-4 py-3 font-black text-[#3A4F3C] text-sm tracking-tighter"
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60">
                {getCategoryIcon(itemCategory)}
              </div>
              <select
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                className="w-full bg-white/60 border border-black/5 rounded-xl pl-10 pr-4 py-3 font-black text-[#3A4F3C] text-[9px] uppercase appearance-none cursor-pointer"
              >
                <option value="Lazer">Lazer</option>
                <option value="Compras">Compras</option>
                <option value="Viagem">Viagem</option>
                <option value="Casa">Casa</option>
              </select>
            </div>
          </div>
          <button
            onClick={addItemToGoal}
            className="mt-4 w-full md:w-auto bg-[#3A4F3C] text-[#E6DCCB] px-8 py-3 rounded-xl font-black text-[9px] shadow-xl hover:bg-[#2F3F31] transition-all active:scale-95 flex items-center justify-center space-x-2 uppercase tracking-widest"
          >
            <Plus size={14} />
            <span>Adicionar Item</span>
          </button>
        </div>

        {/* Lista de Itens - Mais compacta */}
        <div className="space-y-2 md:space-y-3">
          {selectedGoal.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 md:p-6 bg-white/60 backdrop-blur-sm rounded-xl md:rounded-[2rem] shadow-sm border border-white/40 group hover:bg-white/80 transition-all">
              <div className="flex flex-col">
                <p className={`font-black text-[#3A4F3C] text-xs md:text-xl uppercase tracking-tight ${item.isPaid ? 'line-through opacity-40' : ''}`}>{item.description}</p>
                <div className="flex items-center space-x-2 text-[#3A4F3C]/40 mt-0.5">
                  <span className="grayscale">{getCategoryIcon(item.category)}</span>
                  <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest">{item.category}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 md:space-x-8">
                <p className={`text-sm md:text-2xl font-black tracking-tighter ${item.isPaid ? 'text-[#3A4F3C]/40' : 'text-[#3A4F3C]'}`}>
                  R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>

                <div className="flex items-center space-x-1">
                  <div className="hidden md:flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-[#3A4F3C]/20 hover:text-[#3A4F3C]"><Edit size={16} /></button>
                    <button
                      onClick={() => deleteItem(selectedGoal.id, item.id)}
                      className="p-2 text-[#3A4F3C]/20 hover:text-[#9C4A3C]"
                    ><Trash2 size={16} /></button>
                  </div>

                  {!item.isPaid ? (
                    <button
                      onClick={() => handleOpenPaymentModal(item)}
                      className="px-4 py-2 rounded-lg font-black flex items-center space-x-1 transition-all active:scale-95 text-[8px] bg-[#3A4F3C] text-[#E6DCCB] shadow-lg uppercase tracking-widest"
                    >
                      <DollarSign size={12} />
                      <span>Pagar</span>
                    </button>
                  ) : (
                    <div className="px-4 py-2 rounded-lg font-black flex items-center space-x-1 text-[8px] bg-[#6E8F7A] text-white shadow-md uppercase tracking-widest">
                      <Check size={12} />
                      <span>Pago</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {selectedGoal.items.length === 0 && (
            <div className="bg-white/40 p-10 md:p-24 rounded-xl md:rounded-[3rem] shadow-sm border border-white/40 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] md:text-xl font-black text-[#3A4F3C]/40 uppercase tracking-widest">Sua meta aguarda itens</p>
            </div>
          )}
        </div>

        {/* Resumo de Valores - Mais compacto */}
        <div className="bg-white/40 backdrop-blur-sm p-6 md:p-10 rounded-xl md:rounded-[3rem] shadow-sm border border-white/40 flex flex-col items-end space-y-1 md:space-y-4">
          <div className="text-right flex items-center space-x-3">
            <p className="text-[#3A4F3C]/40 font-black uppercase text-[7px] md:text-[10px] tracking-widest">Meta Total:</p>
            <p className="text-xl md:text-4xl font-black text-[#3A4F3C] tracking-tighter">
              R$ {totalGoalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="text-right flex items-center space-x-3 border-t border-black/5 pt-2 w-full justify-end">
            <p className="text-[#3A4F3C]/40 font-black uppercase text-[7px] md:text-[10px] tracking-widest">Conquistado:</p>
            <p className="text-lg md:text-3xl font-black text-[#6E8F7A] tracking-tighter">
              R$ {paidGoalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="text-right flex items-center space-x-3">
            <p className="text-[#3A4F3C]/40 font-black uppercase text-[7px] md:text-[10px] tracking-widest">Restante:</p>
            <p className="text-lg md:text-3xl font-black text-[#9C4A3C] tracking-tighter">
              R$ {remainingGoalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {isPaymentModalOpen && itemToPay && (
          <AddTransactionModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onSave={handleFinishPayment}
            initialData={{
              type: 'EXPENSE',
              description: `Desejo: ${itemToPay.description}`,
              amount: itemToPay.price,
              date: new Date().toISOString().split('T')[0],
              category: 'Compras',
              paymentMethod: 'Pix'
            }}
          />
        )}
      </div>
    );
  }

  // List View - Otimizada
  return (
    <div className="space-y-4 md:space-y-8 animate-in fade-in duration-500 pb-20">
      {toast && (
        <div className="fixed top-20 md:top-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-[300] bg-[#6E8F7A] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-white/20 w-[85%] md:w-auto">
          <CheckCircle2 size={18} />
          <span className="font-black uppercase text-[9px] tracking-tight">{toast}</span>
        </div>
      )}

      <div className="flex flex-col">
        <h2 className="text-xl md:text-4xl font-black text-[#3A4F3C] uppercase tracking-tighter">Metas de Desejos</h2>
        <p className="text-[7px] md:text-xs font-black text-[#3A4F3C]/60 uppercase tracking-widest mt-1">Organize seus grandes objetivos financeiros</p>
      </div>

      <div className="bg-white/40 backdrop-blur-md p-5 md:p-10 rounded-xl md:rounded-[3rem] shadow-sm border border-white/40">
        <h3 className="text-xs md:text-2xl font-black text-[#3A4F3C] mb-4 uppercase tracking-tight">Criar Nova Meta</h3>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            placeholder="Ex: Viagem, Carro, Casamento"
            className="flex-1 bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] uppercase tracking-tight text-[10px]"
          />
          <button
            onClick={createGoal}
            className="bg-[#3A4F3C] text-[#E6DCCB] px-8 py-3 rounded-xl font-black text-[9px] flex items-center justify-center space-x-2 shadow-xl hover:bg-[#2F3F31] transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={14} />
            <span>Criar Meta</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:gap-6">
        {goals.map((goal) => {
          const totalValue = goal.items.reduce((acc, curr) => acc + curr.price, 0);
          const paidValue = goal.items.filter(i => i.isPaid).reduce((acc, curr) => acc + curr.price, 0);
          const progress = totalValue > 0 ? (paidValue / totalValue) * 100 : 0;

          return (
            <div key={goal.id} className="bg-white/60 backdrop-blur-sm p-4 md:p-8 rounded-xl md:rounded-[2.5rem] shadow-sm border border-white/40 flex flex-col md:flex-row items-center justify-between group animate-in slide-in-from-bottom-2 transition-all hover:bg-white/80">
              <div className="flex items-center space-x-4 md:space-x-8 w-full md:w-auto">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#3A4F3C] text-[#E6DCCB] rounded-xl md:rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0">
                  <Target size={24} />
                </div>
                <div className="space-y-0.5 md:space-y-1 flex-1">
                  <h4 className="text-sm md:text-2xl font-black text-[#3A4F3C] uppercase tracking-tight leading-none">{goal.name}</h4>
                  <p className="text-[#3A4F3C]/40 font-black text-[7px] md:text-[10px] uppercase tracking-widest">
                    {goal.items.length} itens | Total: R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>

                  <div className="w-full md:w-64 h-1.5 md:h-2 bg-black/5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-[#6E8F7A] transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 md:space-x-12 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-black/5">
                <div className="text-right">
                  <p className="text-[7px] md:text-[9px] font-black text-[#3A4F3C]/40 uppercase tracking-widest mb-1">Status</p>
                  <p className={`text-base md:text-2xl font-black ${progress === 100 ? 'text-[#6E8F7A]' : 'text-[#3A4F3C]'}`}>
                    {Math.round(progress)}%
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-2 text-[#3A4F3C]/10 hover:text-[#9C4A3C] transition-opacity md:opacity-0 md:group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedGoalId(goal.id)}
                    className="bg-[#3A4F3C] text-[#E6DCCB] pl-4 pr-3 md:pl-8 md:pr-6 py-2 md:py-4 rounded-xl font-black text-[8px] md:text-xs shadow-xl flex items-center space-x-2 uppercase tracking-widest"
                  >
                    <span>Gerenciar</span>
                    <ChevronRight size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="bg-white/40 p-10 md:p-24 rounded-xl md:rounded-[3rem] shadow-sm border border-white/40 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] md:text-xl font-black text-[#3A4F3C]/40 uppercase tracking-widest">Sem metas planejadas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
