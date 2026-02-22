import React, { useState } from 'react';
import { ICONS } from '../constants';
import { View } from '../types';
import { CheckCircle2, ShoppingBag, Plane, ArrowRight, Trophy, ChevronRight, ListTodo, CreditCard, BarChart2, Star, Download, Plus, X } from 'lucide-react';
import AddTransactionModal from './AddTransactionModal';
import ImportModal from './ImportModal';
import ScanVerificationModal from './ScanVerificationModal';
import PageLayout from './layout/PageLayout';
import Card from './ui/Card';
import Toast from './ui/Toast';

interface DashboardProps {
  onViewChange: (view: View) => void;
  isTravelModeActive: boolean;
  setIsTravelModeActive: (active: boolean) => void;
  travelName: string;
  setTravelName: (name: string) => void;
  travelBudget: string;
  setTravelBudget: (budget: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  onViewChange,
  isTravelModeActive,
  setIsTravelModeActive,
  travelName,
  setTravelName,
  travelBudget,
  setTravelBudget
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
  const [isTravelActivationModalOpen, setIsTravelActivationModalOpen] = useState(false);
  const [scannedItemsBuffer, setScannedItemsBuffer] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const [transactions, setTransactions] = useState([
    {
      id: 'd1',
      description: 'Supermercado Mensal',
      amount: 450.90,
      date: '2026-02-03',
      category: 'Supermercado',
      type: 'EXPENSE',
      paymentMethod: 'Pix'
    }
  ]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleTravel = () => {
    if (!isTravelModeActive) {
      setIsTravelActivationModalOpen(true);
    } else {
      setIsTravelModeActive(false);
      showToast("Modo Viagem Desativado");
    }
  };

  const confirmTravelActivation = () => {
    if (!travelName.trim()) {
      showToast("Defina um nome para a viagem");
      return;
    }
    setIsTravelModeActive(true);
    setIsTravelActivationModalOpen(false);
    showToast("Boa viagem! Modo Viagem Ativo ✈️");
  };

  const handleImportResult = (items: any[]) => {
    setScannedItemsBuffer(items);
    setIsVerificationOpen(true);
  };

  const handleConfirmScanItems = (items: any[], paymentMethod: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newTransactions = items.map(item => ({
      id: Math.random().toString(36).substr(2, 9),
      description: item.name,
      amount: item.amount,
      category: item.category,
      type: 'EXPENSE',
      paymentMethod: paymentMethod,
      date: today
    }));

    setTransactions([...newTransactions, ...transactions]);
    setIsVerificationOpen(false);
    showToast(`${items.length} itens lançados com sucesso!`);
  };

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const quickShortcuts = [
    { id: View.FIXED_EXPENSES, label: 'Recorrentes', icon: <ListTodo size={18} />, color: 'bg-[#D8CFC0]' },
    { id: View.INSTALLMENTS, label: 'Parcelas', icon: <CreditCard size={18} />, color: 'bg-[#D8CFC0]' },
    { id: View.REPORTS, label: 'Relatórios', icon: <BarChart2 size={18} />, color: 'bg-[#D8CFC0]' },
    { id: View.WISHLIST, label: 'Desejos', icon: <Star size={18} />, color: 'bg-[#D8CFC0]' },
  ];

  return (
    <PageLayout>
      <Toast message={toast} />

      {/* Header Profile */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="w-12 h-12 md:w-20 md:h-20 bg-[#3A4F3C] rounded-xl md:rounded-3xl flex items-center justify-center text-[#E6DCCB] text-xl md:text-3xl font-black shadow-xl">
            A
          </div>
          <div>
            <h2 className="text-lg md:text-2xl font-black text-[#3A4F3C] uppercase tracking-tighter leading-none">Anderson</h2>
            <div className="flex flex-col mt-0.5">
              <p className="text-[#3A4F3C] font-black uppercase text-[8px] md:text-[10px] tracking-tight opacity-70">MeuDim <span className="opacity-40 italic font-medium">"seu dinheiro no controle"</span></p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-[#6E8F7A] text-white text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest">15 DIAS 🔥</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#3A4F3C] text-[#E6DCCB] px-4 py-2 md:px-8 md:py-5 rounded-xl md:rounded-[2.5rem] shadow-lg flex items-center space-x-3 self-start md:self-auto">
          <div className="text-right">
            <p className="text-[7px] font-black uppercase opacity-60 leading-none">Plano</p>
            <p className="font-black text-xs md:text-lg uppercase">PRO</p>
          </div>
          <div className="w-6 h-6 md:w-10 md:h-10 bg-white/10 rounded-lg flex items-center justify-center text-xs md:text-lg">💎</div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        <button
          onClick={() => onViewChange(View.ACHIEVEMENTS)}
          className="bg-[#3A4F3C] text-[#E6DCCB] p-4 md:p-6 rounded-xl md:rounded-[2rem] shadow-lg flex items-center justify-between group hover:bg-[#2F3F31] transition-all active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              🏆
            </div>
            <div className="text-left">
              <h3 className="text-sm md:text-lg font-black uppercase tracking-tighter leading-none">Conquistas</h3>
              <p className="text-[7px] font-bold uppercase opacity-60 tracking-widest mt-1">
                25% concluído
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="opacity-40" />
        </button>

        <div className={`p-4 md:p-6 rounded-xl md:rounded-[2rem] shadow-lg transition-all border flex items-center justify-between gap-3 ${isTravelModeActive ? 'bg-[#6E8F7A] border-white/20 text-white' : 'bg-white/40 border-white/40 text-[#3A4F3C]'}`}>
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isTravelModeActive ? 'bg-white/20' : 'bg-[#3A4F3C]/10'}`}>
              <Plane size={16} />
            </div>
            <div className="max-w-[140px] md:max-w-none">
              <h3 className="text-sm md:text-lg font-black uppercase tracking-tighter leading-none">Modo Viagem</h3>
              <p className="text-[7px] font-bold uppercase opacity-60 tracking-widest mt-0.5 truncate">
                {isTravelModeActive ? travelName : 'Ative para controlar gastos em trânsito'}
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleTravel}
            className={`w-9 h-5 rounded-full relative transition-all shadow-inner ${isTravelModeActive ? 'bg-white' : 'bg-[#3A4F3C]/20'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all shadow-md ${isTravelModeActive ? 'right-0.5 bg-[#6E8F7A]' : 'left-0.5 bg-white'}`} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-[#6E8F7A] rounded-xl md:rounded-[2.5rem] p-5 md:p-8 shadow-xl text-white">
          <span className="text-[8px] font-black uppercase tracking-widest opacity-80">Entradas</span>
          <p className="text-xl md:text-4xl font-black mt-0.5">R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-[#9C4A3C] rounded-xl md:rounded-[2.5rem] p-5 md:p-8 shadow-xl text-white">
          <span className="text-[8px] font-black uppercase tracking-widest opacity-80">Saídas</span>
          <p className="text-xl md:text-4xl font-black mt-0.5">R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-[#3A4F3C] rounded-xl md:rounded-[2.5rem] p-5 md:p-8 shadow-xl text-[#E6DCCB] border border-white/10">
          <span className="text-[8px] font-black uppercase tracking-widest opacity-80">Saldo</span>
          <p className="text-xl md:text-4xl font-black mt-0.5">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* FAB Menu and other items remain same logic but slightly cleaner if possible */}
      {/* ... (FAB Menu and other sections remain similar but wrapped in PageLayout) */}

      {/* Floating Action Button (FAB) - Mobile Only */}
      <div className="md:hidden fixed bottom-24 right-5 z-40 flex flex-col items-end space-y-2">
        {isFabMenuOpen && (
          <div className="flex flex-col items-end space-y-2 mb-2 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <button
              onClick={() => { setIsImportModalOpen(true); setIsFabMenuOpen(false); }}
              className="bg-white text-[#3A4F3C] px-5 py-3 rounded-xl shadow-2xl border border-black/5 font-black text-[8px] uppercase tracking-widest flex items-center space-x-2"
            >
              <span>Importar</span>
              <Download size={14} />
            </button>
            <button
              onClick={() => { setIsAddModalOpen(true); setIsFabMenuOpen(false); }}
              className="bg-white text-[#3A4F3C] px-5 py-3 rounded-xl shadow-2xl border border-black/5 font-black text-[8px] uppercase tracking-widest flex items-center space-x-2"
            >
              <span>Novo Registro</span>
              <Plus size={14} />
            </button>
          </div>
        )}
        <button
          onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-[#E6DCCB] transition-all transform active:scale-90 border-4 border-white ${isFabMenuOpen ? 'bg-[#9C4A3C] rotate-45' : 'bg-[#3A4F3C]'}`}
        >
          <Plus size={28} strokeWidth={3} />
        </button>
      </div>

      {/* Quick Access Shortcuts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {quickShortcuts.map((shortcut) => (
          <button
            key={shortcut.id}
            onClick={() => onViewChange(shortcut.id)}
            className="flex flex-col items-center justify-center p-3 md:p-6 bg-white/40 backdrop-blur-md rounded-xl md:rounded-[2rem] border border-white/40 shadow-sm hover:bg-white/60 transition-all group"
          >
            <div className="w-8 h-8 bg-[#3A4F3C]/10 text-[#3A4F3C] rounded-lg flex items-center justify-center mb-2 group-hover:bg-[#3A4F3C] group-hover:text-[#E6DCCB] transition-all">
              {shortcut.icon}
            </div>
            <span className="text-[8px] font-black text-[#3A4F3C] uppercase tracking-tighter text-center">
              {shortcut.label}
            </span>
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="p-4 md:p-10">
        <div className="flex items-center justify-between mb-4 md:mb-10">
          <h3 className="text-base md:text-2xl font-black text-[#3A4F3C] uppercase tracking-tighter">Atividade</h3>
          <button onClick={() => onViewChange(View.TRANSACTIONS)} className="text-[#3A4F3C] font-black text-[8px] border-b border-[#3A4F3C] uppercase tracking-widest">Ver Tudo</button>
        </div>

        <div className="space-y-2 md:space-y-4">
          {transactions.map((t) => (
            <div key={t.id} className="bg-white/70 p-3 md:p-6 rounded-xl flex items-center justify-between shadow-sm border border-black/5 hover:bg-white transition-all group">
              <div className="flex items-center space-x-2 md:space-x-5">
                <div className={`w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl flex items-center justify-center text-white text-[10px] md:text-base ${t.type === 'INCOME' ? 'bg-[#6E8F7A]' : 'bg-[#9C4A3C]'}`}>
                  {t.category === 'Supermercado' ? <ShoppingBag size={14} /> : <Plus size={14} />}
                </div>
                <div>
                  <p className="font-black text-[#3A4F3C] text-[11px] md:text-lg leading-tight uppercase tracking-tight">{t.description}</p>
                  <p className="text-[7px] font-bold text-[#3A4F3C]/40 uppercase tracking-widest mt-0.5">{t.category} • {t.paymentMethod}</p>
                </div>
              </div>
              <p className={`text-xs md:text-2xl font-black whitespace-nowrap ${t.type === 'INCOME' ? 'text-[#6E8F7A]' : 'text-[#9C4A3C]'}`}>
                {t.type === 'INCOME' ? '+ ' : '- '}R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Modals remain same */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(data) => setTransactions([data, ...transactions])}
        isTravelModeActive={isTravelModeActive}
        travelName={travelName}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onScanResult={handleImportResult}
      />

      <ScanVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        scannedItems={scannedItemsBuffer}
        onConfirm={handleConfirmScanItems}
      />

      {/* Travel Activation Modal */}
      {isTravelActivationModalOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3A4F3C]/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsTravelActivationModalOpen(false)} />
          <div className="bg-[#E6DCCB] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in-95 border border-black/10">
            <button onClick={() => setIsTravelActivationModalOpen(false)} className="absolute top-6 right-6 text-[#3A4F3C]/20 hover:text-[#3A4F3C]">
              <X size={20} />
            </button>
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-[#3A4F3C] text-[#E6DCCB] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Plane size={32} />
              </div>
              <h3 className="text-xl font-black text-[#3A4F3C] uppercase tracking-tighter">Ativar Modo Viagem</h3>
              <p className="text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest mt-1">Configurações de Destino</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[7px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Destino da Viagem</label>
                <input
                  type="text"
                  value={travelName}
                  onChange={(e) => setTravelName(e.target.value)}
                  placeholder="Ex: Rio de Janeiro 2026"
                  className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] uppercase text-[10px]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[7px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Orçamento Previsto (R$)</label>
                <input
                  type="text"
                  value={travelBudget}
                  onChange={(e) => setTravelBudget(e.target.value)}
                  placeholder="1.500,00"
                  className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] text-[10px]"
                />
              </div>
              <button
                onClick={confirmTravelActivation}
                className="w-full bg-[#3A4F3C] text-[#E6DCCB] py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all mt-4"
              >
                Iniciar Monitoramento
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Dashboard;
