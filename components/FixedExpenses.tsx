import React, { useState, useMemo } from 'react';
import { Plus, Trash2, CheckCircle2, AlertCircle, Calendar, Edit } from 'lucide-react';
import PageLayout from './layout/PageLayout';
import Card from './ui/Card';
import AddFixedExpenseModal from './AddFixedExpenseModal';

interface FixedExpense {
  id: number;
  label: string;
  amount: number;
  dueDate: string;
  paid: boolean;
}

const FixedExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<FixedExpense[]>([
    { id: 1, label: 'Aluguel', amount: 1200, dueDate: 'Dia 10', paid: true },
    { id: 2, label: 'Internet', amount: 99.90, dueDate: 'Dia 15', paid: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<FixedExpense | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const stats = useMemo(() => {
    const totalMensal = expenses.reduce((acc, e) => acc + e.amount, 0);
    const pago = expenses.filter(e => e.paid).reduce((acc, e) => acc + e.amount, 0);
    const pendente = totalMensal - pago;
    const pendentes = expenses.filter(e => !e.paid);
    const proximoVenc = pendentes.length > 0
      ? pendentes.sort((a, b) => {
        const dayA = parseInt(a.dueDate.replace('Dia ', '')) || 99;
        const dayB = parseInt(b.dueDate.replace('Dia ', '')) || 99;
        return dayA - dayB;
      })[0]?.dueDate || '—'
      : '—';
    return { totalMensal, pago, pendente, proximoVenc };
  }, [expenses]);

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: FixedExpense) => {
    setEditingExpense(exp);
    setIsModalOpen(true);
  };

  const handleSave = (data: { id?: number; label: string; amount: number; dueDate: string; paid: boolean }) => {
    if (data.id) {
      setExpenses(expenses.map(e => e.id === data.id ? { ...e, ...data } : e));
      showToast("Tudo certo por aqui 👌");
    } else {
      const newId = Date.now();
      setExpenses([...expenses, { ...data, id: newId }]);
      showToast("Tudo certo por aqui 👌");
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Excluir este gasto fixo?')) {
      setExpenses(expenses.filter(e => e.id !== id));
      showToast("Seu dim tá organizado");
    }
  };

  const togglePaid = (id: number) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, paid: !e.paid } : e));
  };

  return (
    <PageLayout title="Gastos Recorrentes">
      {toast && (
        <div className="fixed top-20 md:top-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-[300] bg-[#6E8F7A] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-white/20 w-[85%] md:w-auto">
          <CheckCircle2 size={18} />
          <span className="font-black uppercase text-[9px] tracking-tight">{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'Total Mensal', amount: `R$ ${stats.totalMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: <Calendar size={18} /> },
          { label: 'Pago', amount: `R$ ${stats.pago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, color: 'text-[#6E8F7A]' },
          { label: 'Pendente', amount: `R$ ${stats.pendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, color: 'text-[#9C4A3C]' },
          { label: 'Próximo Venc.', amount: stats.proximoVenc },
        ].map((stat, idx) => (
          <Card key={idx} className="p-4 flex flex-col justify-center">
            <span className="text-[7px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">{stat.label}</span>
            <p className={`text-lg md:text-xl font-black mt-1 ${stat.color || 'text-[#3A4F3C]'}`}>{stat.amount}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm md:text-lg font-black text-[#3A4F3C] uppercase tracking-tighter">Lista de Contas</h3>
          <button
            onClick={handleOpenAdd}
            className="bg-[#3A4F3C] text-[#E6DCCB] px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center space-x-2 shadow-lg hover:bg-[#2F3F31] transition-all active:scale-95"
          >
            <Plus size={12} />
            <span>Adicionar Fixo</span>
          </button>
        </div>

        {expenses.length === 0 ? (
          <div className="p-10 md:p-16 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] md:text-sm font-black text-[#3A4F3C]/30 uppercase tracking-widest">Nenhum gasto fixo cadastrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map(exp => (
              <div key={exp.id} className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-black/5 group hover:bg-white/80 transition-all">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => togglePaid(exp.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${exp.paid ? 'bg-[#6E8F7A]/20 text-[#6E8F7A]' : 'bg-[#9C4A3C]/20 text-[#9C4A3C]'}`}
                  >
                    {exp.paid ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  </button>
                  <div>
                    <h4 className="text-xs md:text-sm font-black text-[#3A4F3C] uppercase">{exp.label}</h4>
                    <p className="text-[8px] font-bold text-[#3A4F3C]/40 uppercase">{exp.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <p className="text-sm md:text-lg font-black text-[#3A4F3C]">R$ {exp.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenEdit(exp)} className="p-2 text-[#3A4F3C]/30 hover:text-[#3A4F3C]">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(exp.id)} className="p-2 text-[#3A4F3C]/30 hover:text-[#9C4A3C]">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <AddFixedExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingExpense}
      />
    </PageLayout>
  );
};

export default FixedExpenses;
