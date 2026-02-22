
import React, { useState, useEffect, useMemo } from 'react';
import { X, Plane, ChevronDown } from 'lucide-react';
import { PAYMENT_METHODS } from '../constants';

interface CategoryData {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  subcategories: string[];
}

const CATEGORY_STRUCTURE: CategoryData[] = [
  { name: 'ALIMENTAÇÃO', type: 'EXPENSE', subcategories: ['JANTAR', 'ALMOÇO', 'LANCHE', 'RESTAURANTE', 'DELIVERY', 'PADARIA', 'LANCHONETES'] },
  { name: 'TRANSPORTE', type: 'EXPENSE', subcategories: ['COMBUSTÍVEL', 'UBER', 'TRANSPORTE PÚBLICO', 'MANUTENÇÃO VEÍCULO', 'PEDÁGIO', 'ESTACIONAMENTO'] },
  { name: 'MORADIA', type: 'EXPENSE', subcategories: ['ALUGUEL', 'CONDOMÍNIO', 'ENERGIA ELÉTRICA', 'ÁGUA', 'GÁS', 'MANUTENÇÃO DA CASA', 'INTERNET', 'IPTU', 'PRESTAÇÃO FINANCIAMENTO'] },
  { name: 'SAÚDE', type: 'EXPENSE', subcategories: ['MEDICAMENTOS', 'CONVÊNIO', 'CONSULTAS', 'EXAME', 'DENTISTA', 'ACADEMIA/ESPORTES'] },
  { name: 'EDUCAÇÃO', type: 'EXPENSE', subcategories: ['MENSALIDADE', 'CURSOS', 'LIVROS', 'MATERIAL ESCOLARES'] },
  { name: 'PETS', type: 'EXPENSE', subcategories: ['RAÇÃO', 'VETERINÁRIO', 'ACESSÓRIOS PETS'] },
  { name: 'VESTUÁRIO', type: 'EXPENSE', subcategories: ['ROUPAS', 'CALÇADOS', 'ACESSÓRIOS'] },
  { name: 'ESTÉTICA/BELEZA', type: 'EXPENSE', subcategories: ['SALÃO/BARBEARIA', 'PROCEDIMENTOS', 'COSMÉTICOS'] },
  { name: 'TECNOLOGIA/INTERNET', type: 'EXPENSE', subcategories: ['EQUIPAMENTOS', 'SOFTWARE', 'STREAMING', 'JOGOS'] },
  { name: 'LAZER', type: 'EXPENSE', subcategories: ['EVENTOS', 'HOBBIES', 'CINEMA', 'PASSEIO'] },
  { name: 'VIAGEM', type: 'EXPENSE', subcategories: ['HOSPEDAGEM', 'PASSAGENS', 'PASSEIO'] },
  { name: 'INVESTIMENTO', type: 'INCOME', subcategories: ['DIVIDENDOS', 'JUROS', 'VENDAS DE ATIVOS'] },
  { name: 'SALÁRIO/PROLABORE', type: 'INCOME', subcategories: [] },
  { name: 'FREELANCE', type: 'INCOME', subcategories: [] },
  { name: 'VENDAS', type: 'INCOME', subcategories: [] },
  { name: 'ALUGUÉIS RECEBIDO', type: 'INCOME', subcategories: [] },
  { name: 'BONIFICAÇÃO', type: 'INCOME', subcategories: [] },
  { name: 'OUTROS', type: 'EXPENSE', subcategories: [] },
  { name: 'OUTROS', type: 'INCOME', subcategories: [] },
];

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  initialData?: any;
  isTravelModeActive?: boolean;
  travelName?: string;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  isTravelModeActive = false, 
  travelName = "" 
}) => {
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
  const [linkToTravel, setLinkToTravel] = useState(false);

  // Filtragem de categorias baseada no tipo
  const availableCategories = useMemo(() => {
    return CATEGORY_STRUCTURE.filter(c => c.type === type).map(c => c.name);
  }, [type]);

  // Filtragem de subcategorias baseada na categoria selecionada
  const availableSubcategories = useMemo(() => {
    const catData = CATEGORY_STRUCTURE.find(c => c.name === category && c.type === type);
    return catData ? catData.subcategories : [];
  }, [category, type]);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type === 'INCOME' || initialData.type === 'CREDIT' ? 'INCOME' : 'EXPENSE');
      setDescription(initialData.description || '');
      setCategory(initialData.category || '');
      setSubcategory(initialData.subcategory || '');
      setValue(initialData.amount?.toString() || initialData.value?.toString() || '');
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
      setPaymentMethod(initialData.paymentMethod || 'Dinheiro');
      setLinkToTravel(initialData.linkToTravel || false);
    } else {
      setType('EXPENSE');
      setDescription('');
      setCategory('');
      setSubcategory('');
      setValue('');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('Dinheiro');
      setLinkToTravel(isTravelModeActive);
    }
  }, [initialData, isOpen, isTravelModeActive]);

  // Resetar categoria/sub ao mudar o tipo
  useEffect(() => {
    if (!initialData) {
      setCategory('');
      setSubcategory('');
    }
  }, [type]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (onSave) {
      onSave({ 
        id: initialData?.id,
        type, 
        description, 
        subcategory,
        amount: parseFloat(value.replace(',', '.')), 
        date, 
        category, 
        paymentMethod,
        linkToTravel
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-[#3A4F3C]/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-[#E6DCCB] w-full max-w-lg rounded-t-2xl md:rounded-[2.5rem] p-5 md:p-10 shadow-2xl relative animate-in slide-in-from-bottom md:zoom-in-95 duration-300 border border-black/5 max-h-[95vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-[#3A4F3C]/40 hover:text-[#3A4F3C]">
          <X size={20} />
        </button>

        <h3 className="text-xl md:text-3xl font-black text-[#3A4F3C] mb-5 md:mb-8 uppercase tracking-tighter">
          {initialData ? 'Editar Lançamento' : 'Novo Lançamento'}
        </h3>
        
        <div className="space-y-4 md:space-y-6">
          {/* Seletor de Tipo */}
          <div className="space-y-1.5">
             <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Tipo de Movimentação</label>
             <div className="flex space-x-2">
                <button 
                  onClick={() => setType('INCOME')}
                  className={`flex-1 py-3 rounded-xl font-black uppercase text-[8px] tracking-widest transition-all ${
                    type === 'INCOME' ? 'bg-[#6E8F7A] text-white shadow-lg' : 'bg-white/50 text-[#3A4F3C]/40'
                  }`}
                >
                   Receita
                </button>
                <button 
                  onClick={() => setType('EXPENSE')}
                  className={`flex-1 py-3 rounded-xl font-black uppercase text-[8px] tracking-widest transition-all ${
                    type === 'EXPENSE' ? 'bg-[#9C4A3C] text-white shadow-lg' : 'bg-white/50 text-[#3A4F3C]/40'
                  }`}
                >
                   Despesa
                </button>
             </div>
          </div>

          {isTravelModeActive && (
            <div className={`p-3 rounded-xl border flex items-center justify-between ${linkToTravel ? 'bg-[#6E8F7A]/10 border-[#6E8F7A]/30' : 'bg-white/30 border-black/5 opacity-60'}`}>
              <div className="flex items-center space-x-2">
                <Plane size={14} className={linkToTravel ? 'text-[#6E8F7A]' : 'text-[#3A4F3C]/40'} />
                <p className={`font-black uppercase text-[8px] tracking-tight ${linkToTravel ? 'text-[#3A4F3C]' : 'text-[#3A4F3C]/40'}`}>
                  Vincular à Viagem ({travelName})
                </p>
              </div>
              <button 
                onClick={() => setLinkToTravel(!linkToTravel)}
                className={`w-8 h-5 rounded-full relative transition-all ${linkToTravel ? 'bg-[#6E8F7A]' : 'bg-black/10'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${linkToTravel ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Descrição</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] uppercase text-[10px]"
              placeholder="Ex: Supermercado Mensal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Valor</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#3A4F3C]/30 text-[10px]">R$</span>
                <input 
                  type="text" 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-white/60 border border-black/5 rounded-xl pl-10 pr-4 py-3 outline-none font-black text-[#3A4F3C] text-sm"
                  placeholder="0,00"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Data</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] text-[10px]"
              />
            </div>
          </div>

          {/* Categorias e Subcategorias Dinâmicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Categoria</label>
              <div className="relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] text-[9px] uppercase appearance-none cursor-pointer"
                >
                  <option value="">Selecione...</option>
                  {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3A4F3C]/40 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Subcategoria</label>
              <div className="relative">
                <select 
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  disabled={!category}
                  className={`w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] text-[9px] uppercase appearance-none cursor-pointer ${!category && 'opacity-40'}`}
                >
                  <option value="">{category ? 'Escolha uma opção...' : 'Aguardando categoria'}</option>
                  {availableSubcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  <option value="OUTRO">OUTRA...</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3A4F3C]/40 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Campo adicional se escolher 'OUTRO' na subcategoria */}
          {subcategory === 'OUTRO' && (
             <div className="space-y-1 animate-in slide-in-from-top-2">
                <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Nova Subcategoria</label>
                <input 
                  type="text" 
                  placeholder="DIGITE O NOME..."
                  className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] uppercase text-[9px]"
                  onChange={(e) => {
                    // Aqui você poderia salvar temporariamente ou lidar com a subcategoria customizada
                  }}
                />
             </div>
          )}

          <div className="space-y-1">
            <label className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Método de Pagamento</label>
            <div className="relative">
              <select 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] text-[9px] uppercase appearance-none cursor-pointer"
              >
                {PAYMENT_METHODS.map(method => <option key={method} value={method}>{method}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3A4F3C]/40 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row md:space-x-3 pt-2 gap-2">
            <button 
              onClick={onClose}
              className="w-full md:flex-1 py-3 md:py-5 rounded-xl font-black text-[#3A4F3C]/60 hover:bg-black/5 uppercase text-[9px] tracking-widest transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              disabled={!category || !value || !description}
              className="w-full md:flex-[2] py-4 md:py-5 rounded-xl font-black text-[#E6DCCB] bg-[#3A4F3C] hover:bg-[#2F3F31] shadow-2xl transition-all active:scale-95 uppercase text-[9px] tracking-widest disabled:opacity-20 disabled:cursor-not-allowed"
            >
              {initialData ? 'Confirmar Alterações' : 'Lançar Agora'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;
