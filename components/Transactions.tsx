import React, { useState, useMemo, useRef } from 'react';
import { ICONS } from '../constants';
import AddTransactionModal from './AddTransactionModal';
import { CheckCircle2, ChevronDown, Settings2, Plus, Trash2, X, Edit, Sparkles, FolderTree, ArrowUpRight } from 'lucide-react';
import PageLayout from './layout/PageLayout';
import Card from './ui/Card';
import Toast from './ui/Toast';

interface TransactionsProps {
  isTravelModeActive: boolean;
  travelName: string;
}

interface CategoryStructure {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  subcategories: string[];
}

const INITIAL_DATABASE: CategoryStructure[] = [
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
];

const SUGGESTED_CATS_EXPENSE = ['ASSINATURA', 'CABELEREIRO', 'COMPRA', 'OPERAÇÃO BANCÁRIA', 'PIX', 'SERVIÇO', 'SUPERMERCADO', 'OUTROS', 'PRESENTES', 'DOAÇÕES', 'EMPRÉSTIMOS'];

const Transactions: React.FC<TransactionsProps> = ({ isTravelModeActive, travelName }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'categories'>('list');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('Todos');
  const scrollRef = useRef<HTMLDivElement>(null);

  const [manageType, setManageType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [newCatName, setNewCatName] = useState('');
  const [newSubcatName, setNewSubcatName] = useState('');
  const [selectedParentCat, setSelectedParentCat] = useState('');

  const [manageCategories, setManageCategories] = useState<CategoryStructure[]>(INITIAL_DATABASE);
  const [transactions, setTransactions] = useState([
    { id: '1A2B3C', description: 'SUPERMERCADO MENSAL', amount: 450.90, date: '2026-02-05', category: 'ALIMENTAÇÃO', type: 'EXPENSE', paymentMethod: 'Pix' }
  ]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddCategory = (name: string, type: 'INCOME' | 'EXPENSE') => {
    const cleanName = name.trim().toUpperCase();
    if (!cleanName) return;
    if (manageCategories.find(c => c.name === cleanName)) {
      showToast("Esta categoria já existe");
      return;
    }
    setManageCategories([...manageCategories, { name: cleanName, type, subcategories: [] }]);
    setNewCatName('');
    showToast("Categoria cadastrada!");
  };

  const handleAddSubcategory = (subName: string) => {
    const cleanSub = subName.trim().toUpperCase();
    if (!cleanSub || !selectedParentCat) {
      showToast("Selecione a categoria pai");
      return;
    }

    setManageCategories(manageCategories.map(c => {
      if (c.name === selectedParentCat) {
        if (c.subcategories.includes(cleanSub)) return c;
        return { ...c, subcategories: [...c.subcategories, cleanSub] };
      }
      return c;
    }));
    setNewSubcatName('');
    showToast("Subcategoria adicionada!");
  };

  const handleRemoveCategory = (name: string) => {
    if (confirm(`Excluir a categoria ${name} e todas as suas subcategorias?`)) {
      setManageCategories(manageCategories.filter(c => c.name !== name));
      if (selectedParentCat === name) setSelectedParentCat('');
      showToast("Categoria removida");
    }
  };

  const handleRemoveSubcategory = (parentName: string, subName: string) => {
    setManageCategories(manageCategories.map(c =>
      c.name === parentName
        ? { ...c, subcategories: c.subcategories.filter(s => s !== subName) }
        : c
    ));
  };

  const handleSave = (data: any) => {
    if (data.id) {
      setTransactions(transactions.map(t => t.id === data.id ? { ...data } : t));
      showToast("Tudo certo por aqui 👌");
    } else {
      const newTransaction = { ...data, id: Math.random().toString(36).substr(2, 6).toUpperCase() };
      setTransactions([newTransaction, ...transactions]);
      showToast(data.type === 'INCOME' ? "Boa! Receita adicionada 💰" : "Gasto registrado com sucesso");
    }
    setIsAddModalOpen(false);
  };

  const filteredTransactions = filterCategory === 'Todos'
    ? transactions
    : transactions.filter(t => t.category === filterCategory);

  const balance = transactions.reduce((acc, curr) => curr.type === 'INCOME' ? acc + curr.amount : acc - curr.amount, 0);

  const suggestedCatsCloud = useMemo(() => {
    const existing = manageCategories.map(c => c.name);
    if (manageType === 'INCOME') {
      return INITIAL_DATABASE.filter(c => c.type === 'INCOME' && !existing.includes(c.name)).map(c => c.name);
    }
    return SUGGESTED_CATS_EXPENSE.filter(name => !existing.includes(name));
  }, [manageType, manageCategories]);

  const suggestedSubcatsCloud = useMemo(() => {
    if (!selectedParentCat) return [];
    const parent = INITIAL_DATABASE.find(c => c.name === selectedParentCat);
    if (!parent) return [];
    const currentSubs = manageCategories.find(c => c.name === selectedParentCat)?.subcategories || [];
    return parent.subcategories.filter(s => !currentSubs.includes(s));
  }, [selectedParentCat, manageCategories]);

  const headerTabs = (
    <div className="flex bg-[#3A4F3C]/5 p-1 rounded-xl w-full md:w-auto">
      <button
        onClick={() => setActiveTab('list')}
        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === 'list' ? 'bg-[#3A4F3C] text-[#E6DCCB] shadow-lg' : 'text-[#3A4F3C]/40 hover:text-[#3A4F3C]'}`}
      >
        Lista
      </button>
      <button
        onClick={() => setActiveTab('categories')}
        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === 'categories' ? 'bg-[#3A4F3C] text-[#E6DCCB] shadow-lg' : 'text-[#3A4F3C]/40 hover:text-[#3A4F3C]'}`}
      >
        Categorias
      </button>
    </div>
  );

  return (
    <PageLayout title="Lançamentos" headerContent={headerTabs}>
      <Toast message={toast} />

      {activeTab === 'list' ? (
        <div className="space-y-4 animate-in fade-in duration-500">
          <button
            onClick={() => { setEditingTransaction(null); setIsAddModalOpen(true); }}
            className="md:hidden fixed bottom-24 right-5 z-40 w-14 h-14 bg-[#3A4F3C] rounded-full shadow-2xl flex items-center justify-center text-[#E6DCCB] border-4 border-white active:scale-90"
          >
            <Plus size={28} strokeWidth={3} />
          </button>

          <Card className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[7px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Período</label>
              <div className="relative">
                <select className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] text-[9px] uppercase appearance-none">
                  <option>Fevereiro / 2026</option>
                  <option>Janeiro / 2026</option>
                </select>
                <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3A4F3C]/40 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[7px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Filtro</label>
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] text-[9px] uppercase appearance-none"
                >
                  <option value="Todos">Todas Categorias</option>
                  {manageCategories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3A4F3C]/40 pointer-events-none" />
              </div>
            </div>
            <div className="bg-[#3A4F3C] p-4 rounded-xl flex flex-col justify-center">
              <p className="text-[7px] font-black text-[#E6DCCB]/60 uppercase tracking-widest">Saldo do Mês</p>
              <p className={`text-base md:text-2xl font-black ${balance >= 0 ? 'text-[#6E8F7A]' : 'text-[#9C4A3C]'}`}>
                R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </Card>

          <Card className="p-3 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm md:text-2xl font-black text-[#3A4F3C] uppercase tracking-tighter">Histórico</h3>
              <button onClick={() => { setEditingTransaction(null); setIsAddModalOpen(true); }} className="hidden md:flex bg-[#3A4F3C] text-[#E6DCCB] px-6 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest">Novo Registro</button>
            </div>

            <div className="space-y-2 md:space-y-3">
              {filteredTransactions.map((t) => (
                <div key={t.id} className="bg-white/50 rounded-xl border border-black/5 hover:bg-white transition-all flex md:grid md:grid-cols-[120px_100px_1fr_150px_120px_100px] gap-2 md:gap-4 px-3 md:px-6 py-3 md:py-4 items-center group shadow-sm">
                  <div className="flex-1 flex flex-col md:block">
                    <span className="text-[8px] md:text-xs font-black text-[#3A4F3C]/40">{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                    <span className="md:hidden text-[10px] font-black text-[#3A4F3C] uppercase tracking-tight mt-0.5 line-clamp-1">{t.description}</span>
                  </div>
                  <div className="hidden md:flex justify-center">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg text-center uppercase tracking-tighter ${t.type === 'INCOME' ? 'bg-[#6E8F7A]/10 text-[#6E8F7A]' : 'bg-[#9C4A3C]/10 text-[#9C4A3C]'}`}>
                      {t.type === 'INCOME' ? 'Receita' : 'Despesa'}
                    </span>
                  </div>
                  <span className="hidden md:block text-xs font-black text-[#3A4F3C] uppercase truncate">{t.description}</span>
                  <span className="text-[7px] md:text-[10px] font-bold text-[#3A4F3C]/40 uppercase tracking-widest truncate">{t.category}</span>
                  <span className={`text-[11px] md:text-sm font-black text-right md:text-left ${t.type === 'INCOME' ? 'text-[#6E8F7A]' : 'text-[#9C4A3C]'}`}>
                    {t.type === 'INCOME' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <div className="flex items-center space-x-1 md:justify-center">
                    <button onClick={() => { setEditingTransaction(t); setIsAddModalOpen(true); }} className="p-1.5 md:p-2 text-[#3A4F3C]/20 hover:text-[#3A4F3C] transition-colors"><Edit size={14} /></button>
                    <button onClick={() => { if (confirm('Excluir?')) setTransactions(transactions.filter(tr => tr.id !== t.id)) }} className="p-1.5 md:p-2 text-[#3A4F3C]/20 hover:text-[#9C4A3C] transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
          <div ref={scrollRef} className={`p-6 md:p-10 rounded-xl md:rounded-[3rem] shadow-xl transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/10 ${manageType === 'INCOME' ? 'bg-[#6E8F7A] text-white' : 'bg-[#9C4A3C] text-white'}`}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                <Settings2 size={24} />
              </div>
              <div>
                <h3 className="text-base md:text-2xl font-black uppercase tracking-tighter leading-none">Gestão de {manageType === 'INCOME' ? 'Receitas' : 'Despesas'}</h3>
                <p className="text-[7px] md:text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">Configure categorias e subcategorias de forma inteligente</p>
              </div>
            </div>

            <div className="flex bg-white/10 p-1 rounded-2xl backdrop-blur-md">
              <button
                onClick={() => setManageType('INCOME')}
                className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${manageType === 'INCOME' ? 'bg-white text-[#6E8F7A] shadow-xl' : 'text-white/60 hover:text-white'}`}
              >
                Receitas
              </button>
              <button
                onClick={() => setManageType('EXPENSE')}
                className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${manageType === 'EXPENSE' ? 'bg-white text-[#9C4A3C] shadow-xl' : 'text-white/60 hover:text-white'}`}
              >
                Despesas
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-[#3A4F3C] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Plus size={14} className={manageType === 'INCOME' ? 'text-[#6E8F7A]' : 'text-[#9C4A3C]'} />
                    Nova Categoria {manageType === 'INCOME' ? 'de Receita' : 'de Despesa'}
                  </h4>
                </div>
                <div className="flex gap-2">
                  <input
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="DIGITE O NOME..."
                    className="flex-1 bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] uppercase text-[10px] focus:ring-2 focus:ring-[#3A4F3C]/10"
                  />
                  <button onClick={() => handleAddCategory(newCatName, manageType)} className="bg-[#3A4F3C] text-[#E6DCCB] px-5 rounded-xl flex items-center justify-center hover:bg-[#2F3F31] transition-all active:scale-95 shadow-lg">
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-[7px] font-black text-[#3A4F3C]/30 uppercase tracking-widest ml-1">Sugestões comuns:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedCatsCloud.slice(0, 10).map(sug => (
                      <button
                        key={sug}
                        onClick={() => handleAddCategory(sug, manageType)}
                        className="px-2 py-1 bg-white/50 border border-black/5 rounded-md text-[7px] font-black text-[#3A4F3C]/60 uppercase hover:bg-[#3A4F3C] hover:text-white transition-all"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-black/5">
                <h4 className="text-[10px] font-black text-[#3A4F3C] uppercase tracking-[0.2em] flex items-center gap-2">
                  <FolderTree size={14} className="text-[#3A4F3C]/60" />
                  Vincular Subcategoria
                </h4>
                <div className="relative">
                  <select
                    value={selectedParentCat}
                    onChange={(e) => setSelectedParentCat(e.target.value)}
                    className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 font-black text-[#3A4F3C] text-[10px] uppercase appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-[#3A4F3C]/10"
                  >
                    <option value="">ESCOLHA A CATEGORIA PAI ({manageType === 'INCOME' ? 'RECEITA' : 'DESPESA'})</option>
                    {manageCategories
                      .filter(c => c.type === manageType)
                      .map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3A4F3C]/40 pointer-events-none" />
                </div>
                <div className="flex gap-2">
                  <input
                    value={newSubcatName}
                    onChange={(e) => setNewSubcatName(e.target.value)}
                    placeholder="NOME DA SUBCATEGORIA..."
                    className="flex-1 bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] uppercase text-[10px] focus:ring-2 focus:ring-[#3A4F3C]/10"
                  />
                  <button onClick={() => handleAddSubcategory(newSubcatName)} className="bg-[#3A4F3C] text-[#E6DCCB] px-5 rounded-xl flex items-center justify-center hover:bg-[#2F3F31] transition-all active:scale-95 shadow-lg">
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </Card>

            <Card className="space-y-4 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-[#3A4F3C] uppercase tracking-[0.2em]">Listagem Ativa ({manageType === 'INCOME' ? 'RECEITAS' : 'DESPESAS'})</h4>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 max-h-[500px]">
                {manageCategories.filter(c => c.type === manageType).length > 0 ? (
                  manageCategories.filter(c => c.type === manageType).map((cat) => (
                    <div key={cat.name} className={`bg-white/70 border rounded-xl p-4 space-y-3 group transition-all cursor-pointer ${selectedParentCat === cat.name ? 'border-[#3A4F3C] ring-1 ring-[#3A4F3C]/10' : 'border-black/5 hover:border-black/10'}`} onClick={() => setSelectedParentCat(cat.name)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-5 rounded-full ${cat.type === 'INCOME' ? 'bg-[#6E8F7A]' : 'bg-[#9C4A3C]'}`} />
                          <div>
                            <span className="font-black text-[#3A4F3C] uppercase text-[11px] tracking-tight">{cat.name}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveCategory(cat.name); }}
                          className="text-[#3A4F3C]/10 hover:text-[#9C4A3C] transition-colors p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {cat.subcategories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pl-5">
                          {cat.subcategories.map(sub => (
                            <span key={sub} className="bg-black/5 px-2.5 py-1 rounded-lg text-[7px] font-black text-[#3A4F3C]/60 uppercase flex items-center gap-1.5 group/sub border border-black/5">
                              {sub}
                              <button
                                onClick={(e) => { e.stopPropagation(); handleRemoveSubcategory(cat.name, sub); }}
                                className="opacity-20 hover:opacity-100 hover:text-[#9C4A3C] transition-all"
                              >
                                <X size={10} strokeWidth={3} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center">
                    <FolderTree size={40} className="mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-tight">Nenhuma categoria de {manageType === 'INCOME' ? 'Receita' : 'Despesa'} cadastrada.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSave}
        initialData={editingTransaction}
        isTravelModeActive={isTravelModeActive}
        travelName={travelName}
      />
    </PageLayout>
  );
};

export default Transactions;
