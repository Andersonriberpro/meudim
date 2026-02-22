
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { ShoppingCart, CheckCircle, Edit2, Check, X as CloseIcon, PlusCircle } from 'lucide-react';
import { GroceryItem } from '../types';

const GroceryList: React.FC = () => {
  // Navigation State
  const [isInList, setIsInList] = useState(false);

  // Budget State
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [totalLimit, setTotalLimit] = useState(1200);
  const [tempLimit, setTempLimit] = useState('1.200,00');

  // Accumulated spending for the month
  const [spentThisMonth, setSpentThisMonth] = useState(450.00);

  // Items State
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState('');

  // Inline editing state for items
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState('');

  // UI feedback for finishing purchase
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEditLimitClick = () => {
    setTempLimit(totalLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    setIsEditingLimit(true);
  };

  const handleSaveLimit = () => {
    const value = parseFloat(tempLimit.replace(/\./g, '').replace(',', '.'));
    if (!isNaN(value)) {
      setTotalLimit(value);
    }
    setIsEditingLimit(false);
  };

  const handleCancelLimit = () => {
    setIsEditingLimit(false);
  };

  const addItem = () => {
    if (!newItemName) return;
    const price = parseFloat(newItemPrice.replace(',', '.')) || 0;
    const item: GroceryItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItemName,
      quantity: newItemQty,
      estimatedPrice: price,
      inCart: false
    };
    setItems([...items, item]);
    setNewItemName('');
    setNewItemQty(1);
    setNewItemPrice('');
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const toggleInCart = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, inCart: !item.inCart } : item));
  };

  const startEditingItem = (item: GroceryItem) => {
    setEditingItemId(item.id);
    setEditingPriceValue(item.estimatedPrice.toString().replace('.', ','));
  };

  const saveEditedPrice = (id: string) => {
    const newPrice = parseFloat(editingPriceValue.replace(',', '.')) || 0;
    setItems(items.map(item => item.id === id ? { ...item, estimatedPrice: newPrice } : item));
    setEditingItemId(null);
  };

  const handleFinishPurchase = () => {
    const cartItems = items.filter(i => i.inCart);
    if (cartItems.length === 0) return;

    const purchaseTotal = cartItems.reduce((acc, curr) => acc + (curr.estimatedPrice * curr.quantity), 0);

    // Update finalized monthly spending
    setSpentThisMonth(prev => prev + purchaseTotal);

    // Remove finished items from the list
    setItems(items.filter(i => !i.inCart));

    // Show feedback
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const totalInCart = items
    .filter(item => item.inCart)
    .reduce((acc, curr) => acc + (curr.estimatedPrice * curr.quantity), 0);

  const totalToBuy = items
    .filter(item => !item.inCart)
    .reduce((acc, curr) => acc + (curr.estimatedPrice * curr.quantity), 0);

  // Available logic: Limit - (Already Spent + Currently in Cart)
  const remainingLimit = totalLimit - spentThisMonth - totalInCart;

  // Tela Inicial (Welcome Screen)
  if (!isInList) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in zoom-in-95 duration-300 px-4">
        <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl md:rounded-[3rem] shadow-2xl border border-white/40 max-w-md w-full text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#3A4F3C]" />

          <div className="bg-[#3A4F3C]/5 w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto text-[#3A4F3C] mb-2">
            <ShoppingCart size={40} strokeWidth={2.5} />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-black text-[#3A4F3C] leading-tight uppercase tracking-tighter">
              Mercado MeuDim
            </h2>
            <p className="text-[#3A4F3C]/60 font-black uppercase text-[9px] tracking-widest px-4 leading-relaxed">
              Controle suas compras em tempo real e não exceda o limite mensal.
            </p>
          </div>

          <button
            onClick={() => setIsInList(true)}
            className="w-full bg-[#3A4F3C] text-[#E6DCCB] py-5 rounded-2xl font-black text-sm md:text-lg shadow-xl hover:bg-[#2F3F31] active:scale-95 transition-all flex items-center justify-center space-x-3 uppercase tracking-widest"
          >
            <PlusCircle size={24} />
            <span>Criar Lista</span>
          </button>
        </div>
      </div>
    );
  }

  // Interface Completa da Lista
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-4xl font-black text-[#3A4F3C] uppercase tracking-tighter">Mercado</h2>
        <div className="flex flex-wrap gap-2">
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white/60 px-4 py-3 rounded-xl border border-black/5 text-[#3A4F3C] font-black uppercase tracking-widest text-[9px]">
            {ICONS.History} <span>Histórico</span>
          </button>
          <button
            onClick={() => setIsInList(false)}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-[#9C4A3C]/10 text-[#9C4A3C] px-4 py-3 rounded-xl font-black uppercase tracking-widest text-[9px]"
          >
            {ICONS.Logout} <span>Sair</span>
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-[#6E8F7A] text-white px-5 py-4 rounded-2xl flex items-center space-x-3 shadow-lg border border-white/20">
          <CheckCircle className="text-white flex-shrink-0" size={20} />
          <p className="font-black uppercase text-[10px] tracking-tight leading-tight">Compra finalizada! O valor foi debitado do seu limite.</p>
        </div>
      )}

      <div className="bg-white/40 backdrop-blur-md p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-white/40">
        <h3 className="text-xl md:text-2xl font-black text-[#3A4F3C] mb-6 uppercase tracking-tight">Status Orçamentário</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-[#3A4F3C]/5 p-5 rounded-2xl border border-black/5">
            <p className="text-[#3A4F3C]/40 font-black text-[8px] uppercase tracking-widest">Disponível</p>
            <p className={`text-2xl md:text-3xl font-black mt-1 tracking-tighter ${remainingLimit >= 0 ? 'text-[#3A4F3C]' : 'text-[#9C4A3C]'}`}>
              R$ {remainingLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="sm:text-center p-2">
            <p className="text-[#3A4F3C]/40 font-black text-[8px] uppercase tracking-widest">Gasto no Mês</p>
            <p className="text-xl md:text-2xl font-black text-[#3A4F3C] mt-1 tracking-tighter">
              R$ {spentThisMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="sm:text-right p-2">
            <p className="text-[#3A4F3C]/40 font-black text-[8px] uppercase tracking-widest">Limite Mercado</p>
            <div className="flex items-center sm:justify-end space-x-2 mt-1">
              {isEditingLimit ? (
                <div className="flex items-center bg-[#3A4F3C]/5 border border-black/5 rounded-xl px-2 py-1">
                  <input
                    autoFocus
                    type="text"
                    value={tempLimit}
                    onChange={(e) => setTempLimit(e.target.value)}
                    className="w-20 bg-transparent outline-none font-black text-[#3A4F3C] text-lg tracking-tighter"
                  />
                  <button onClick={handleSaveLimit} className="text-[#6E8F7A] p-1"><Check size={16} /></button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 cursor-pointer" onClick={handleEditLimitClick}>
                  <p className="text-xl md:text-2xl font-black text-[#3A4F3C] tracking-tighter">
                    R$ {totalLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <Edit2 size={14} className="opacity-20" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-md p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-white/40">
        <h3 className="text-xl md:text-2xl font-black text-[#3A4F3C] mb-6 uppercase tracking-tight">Adicionar Item</h3>
        <div className="flex flex-col gap-4">
          <input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="O que comprar?"
            className="w-full bg-white/60 border border-black/5 rounded-2xl px-5 py-4 outline-none font-black text-[#3A4F3C] uppercase text-xs"
          />
          <div className="flex gap-4">
            <div className="flex-1 flex items-center bg-white/60 border border-black/5 rounded-2xl px-4">
              <span className="text-[#3A4F3C]/40 font-black text-[8px] mr-2">QTD</span>
              <input
                type="number"
                min="1"
                value={newItemQty}
                onChange={(e) => setNewItemQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-transparent py-4 outline-none font-black text-[#3A4F3C]"
              />
            </div>
            <div className="flex-1 flex items-center bg-white/60 border border-black/5 rounded-2xl px-4">
              <span className="text-[#3A4F3C]/40 font-black text-[8px] mr-2">R$</span>
              <input
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                placeholder="Preço"
                className="w-full bg-transparent py-4 outline-none font-black text-[#3A4F3C]"
              />
            </div>
          </div>
          <button
            onClick={addItem}
            className="w-full bg-[#3A4F3C] text-[#E6DCCB] py-5 rounded-2xl font-black flex items-center justify-center space-x-2 shadow-xl"
          >
            {ICONS.Add}
            <span className="uppercase text-[10px] tracking-widest">Incluir na Lista</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Para Comprar */}
        <div className="bg-white/40 backdrop-blur-md p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-white/40 flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-[#3A4F3C] uppercase tracking-tight">Falta</h3>
            <span className="bg-[#3A4F3C]/10 text-[#3A4F3C] px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
              {items.filter(i => !i.inCart).length} Itens
            </span>
          </div>
          <div className="flex-1 space-y-3">
            {items.filter(i => !i.inCart).map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-black/5">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleInCart(item.id)}
                    className="w-8 h-8 rounded-lg border-2 border-black/10 bg-white"
                  />
                  <div>
                    <p className="font-black text-[#3A4F3C] uppercase tracking-tight text-xs">{item.name}</p>
                    <p className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">
                      {item.quantity}x de R$ {item.estimatedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-black text-[#3A4F3C]/40 text-xs tracking-tighter">R$ {(item.estimatedPrice * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <button onClick={() => deleteItem(item.id)} className="text-[#9C4A3C]/40 hover:text-[#9C4A3C]">{ICONS.Trash}</button>
                </div>
              </div>
            ))}
            {items.filter(i => !i.inCart).length === 0 && (
              <p className="text-center py-10 text-[#3A4F3C]/20 font-black uppercase text-[10px] tracking-widest">Lista vazia</p>
            )}
          </div>
        </div>

        {/* No Carrinho */}
        <div className="bg-white/40 backdrop-blur-md p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-white/40 flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-[#6E8F7A] uppercase tracking-tight">No Carrinho</h3>
            <span className="bg-[#6E8F7A]/10 text-[#6E8F7A] px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
              {items.filter(i => i.inCart).length} Itens
            </span>
          </div>
          <div className="flex-1 space-y-3">
            {items.filter(i => i.inCart).map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-[#6E8F7A]/10 rounded-xl border border-[#6E8F7A]/20">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleInCart(item.id)}
                    className="w-8 h-8 rounded-lg bg-[#6E8F7A] flex items-center justify-center text-white"
                  >
                    <Check size={16} />
                  </button>
                  <div>
                    <p className="font-black text-[#6E8F7A] uppercase tracking-tight text-xs line-through opacity-50">{item.name}</p>
                    <p className="text-[8px] font-black text-[#6E8F7A]/60 uppercase tracking-widest">
                      {item.quantity}x R$ {item.estimatedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <span className="font-black text-[#6E8F7A] text-xs tracking-tighter">R$ {(item.estimatedPrice * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
            {items.filter(i => i.inCart).length === 0 && (
              <p className="text-center py-10 text-[#6E8F7A]/20 font-black uppercase text-[10px] tracking-widest">Carrinho vazio</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-md p-6 md:p-10 rounded-2xl md:rounded-[3rem] shadow-xl border border-white/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:w-auto text-center md:text-left">
          <p className="text-[#3A4F3C]/40 font-black uppercase text-[8px] tracking-[0.3em] mb-1">Total no Carrinho</p>
          <p className="text-2xl md:text-5xl font-black text-[#3A4F3C] tracking-tighter">
            R$ {totalInCart.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <button
          onClick={handleFinishPurchase}
          disabled={items.filter(i => i.inCart).length === 0}
          className={`w-full md:w-auto px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-sm md:text-xl flex items-center justify-center space-x-3 transition-all ${items.filter(i => i.inCart).length > 0
              ? 'bg-[#3A4F3C] text-[#E6DCCB] shadow-xl active:scale-95'
              : 'bg-[#3A4F3C]/20 text-[#3A4F3C]/40 cursor-not-allowed'
            }`}
        >
          <ShoppingCart size={24} />
          <span className="uppercase text-sm tracking-tight">Finalizar Agora</span>
        </button>
      </div>
    </div>
  );
};

export default GroceryList;
