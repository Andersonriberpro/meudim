import React from 'react';
import { View } from '../types';
import { ICONS } from '../constants';
import { X, LogOut, User, Crown } from 'lucide-react';
import Logo from './ui/Logo';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, onToggle }) => {
  const { user, userProfile, isAdmin, signOut } = useAuth();

  const menuItems = [
    { id: View.DASHBOARD, label: 'Painel Principal', icon: ICONS.Dashboard },
    { id: View.TRANSACTIONS, label: 'Meus Lançamentos', icon: ICONS.Transactions },
    { id: View.FIXED_EXPENSES, label: 'Gastos Recorrentes', icon: ICONS.FixedExpenses },
    { id: View.INSTALLMENTS, label: 'Controle de Parcelas', icon: ICONS.Installments },
    { id: View.LIMITS, label: 'Meus Limites', icon: ICONS.Limits },
    { id: View.GROCERY, label: 'Mercado', icon: ICONS.Grocery },
    { id: View.WISHLIST, label: 'Lista de Desejos', icon: ICONS.Wishlist },
    { id: View.CALENDAR, label: 'Calendário', icon: ICONS.Calendar },
    { id: View.REPORTS, label: 'Relatórios', icon: ICONS.Reports },
    { id: View.SETTINGS, label: 'Usuários', icon: ICONS.Settings },
  ];

  const userName = userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';
  const userEmail = user?.email || '';
  const userRole = userProfile?.role || 'user';

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 md:relative md:z-auto
      ${isOpen ? 'translate-x-0 w-64 md:w-56' : '-translate-x-full md:hidden'} 
      bg-[#3A4F3C] h-full shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border-r border-black/10
    `}>
      <div className="p-4 md:p-6 flex items-center justify-between min-w-[224px]">
        <Logo variant="sidebar" />
        <button onClick={onToggle} className="p-1.5 hover:bg-black/20 rounded-lg text-[#E6DCCB] transition-colors">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar p-2 md:p-3 space-y-0.5 min-w-[224px]">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg md:rounded-xl transition-all ${currentView === item.id
              ? 'bg-[#E6DCCB] text-[#3A4F3C] font-black shadow-lg shadow-black/20 scale-[1.02]'
              : 'text-[#E6DCCB]/60 hover:bg-white/5 hover:text-[#E6DCCB]'
              }`}
          >
            <span className={`scale-90 ${currentView === item.id ? 'text-[#3A4F3C]' : 'text-[#E6DCCB]/40'}`}>
              {item.icon}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-3 min-w-[224px]">
        {/* User Info */}
        <div className="flex items-center space-x-3 px-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden ${isAdmin ? 'bg-[#D4A853]/30' : 'bg-[#E6DCCB]/20'
            }`}>
            {userProfile?.avatar_url ? (
              <img src={userProfile.avatar_url} alt={userName} className="w-full h-full object-cover" />
            ) : (
              isAdmin
                ? <Crown size={14} className="text-[#D4A853]" />
                : <User size={14} className="text-[#E6DCCB]/60" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black text-[#E6DCCB] uppercase tracking-tight truncate">
              {userName}
            </p>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${isAdmin
                ? 'bg-[#D4A853]/20 text-[#D4A853]'
                : 'bg-[#E6DCCB]/10 text-[#E6DCCB]/40'
                }`}>
                {isAdmin ? '👑 Admin' : '👤 Usuário'}
              </span>
            </div>
            <p className="text-[7px] font-bold text-[#E6DCCB]/30 truncate mt-0.5">
              {userEmail}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-[#E6DCCB]/40 hover:bg-[#9C4A3C]/20 hover:text-white transition-all bg-white/5 border border-white/5 font-black uppercase text-[8px] tracking-widest"
        >
          <LogOut size={14} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
