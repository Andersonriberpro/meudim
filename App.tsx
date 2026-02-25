import React, { useState } from 'react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import FixedExpenses from './components/FixedExpenses';
import GroceryList from './components/GroceryList';
import Reports from './components/Reports';
import CalendarView from './components/CalendarView';
import Wishlist from './components/Wishlist';
import TravelDetails from './components/TravelDetails';
import Achievements from './components/Achievements';
import Installments from './components/Installments';
import Limits from './components/Limits';
import Settings from './components/Settings';
import CalculatorModal from './components/CalculatorModal';
import AuthPage from './components/AuthPage';
import { useAuth } from './contexts/AuthContext';
import { ICONS } from './constants';
import { Menu } from 'lucide-react';
import MobileNavbar from './components/layout/MobileNavbar';
import LogoIcon from './components/ui/LogoIcon';
import Footer from './components/Footer';

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Shared Travel State
  const [isTravelModeActive, setIsTravelModeActive] = useState(false);
  const [travelName, setTravelName] = useState('Viagem de Férias');
  const [travelBudget, setTravelBudget] = useState('1.500,00');

  // Auth loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6DCCB] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-[#3A4F3C] rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/10 animate-pulse">
            <LogoIcon size={40} className="text-[#E6DCCB]" />
          </div>
          <div className="w-8 h-8 border-3 border-[#3A4F3C]/20 border-t-[#3A4F3C] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Not authenticated: show login
  if (!user) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return (
          <Dashboard
            onViewChange={(v) => { setCurrentView(v); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
            isTravelModeActive={isTravelModeActive}
            setIsTravelModeActive={setIsTravelModeActive}
            travelName={travelName}
            setTravelName={setTravelName}
            travelBudget={travelBudget}
            setTravelBudget={setTravelBudget}
          />
        );
      case View.TRANSACTIONS:
        return (
          <Transactions
            isTravelModeActive={isTravelModeActive}
            travelName={travelName}
          />
        );
      case View.FIXED_EXPENSES:
        return <FixedExpenses />;
      case View.GROCERY:
        return <GroceryList />;
      case View.REPORTS:
        return <Reports />;
      case View.CALENDAR:
        return <CalendarView />;
      case View.WISHLIST:
        return <Wishlist />;
      case View.ACHIEVEMENTS:
        return <Achievements onBack={() => setCurrentView(View.DASHBOARD)} />;
      case View.TRAVEL_DETAILS:
        return (
          <TravelDetails
            onBack={() => setCurrentView(View.DASHBOARD)}
            travelName={travelName}
            setTravelName={setTravelName}
            travelBudget={travelBudget}
            setTravelBudget={setTravelBudget}
            onEndTravel={() => {
              setIsTravelModeActive(false);
              setCurrentView(View.DASHBOARD);
            }}
          />
        );
      case View.INSTALLMENTS:
        return <Installments />;
      case View.LIMITS:
        return <Limits />;
      case View.SETTINGS:
        return <Settings />;
      default:
        return <div className="p-4 md:p-10 text-[#3A4F3C] font-black uppercase tracking-tighter">Página em construção...</div>;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#E6DCCB] overflow-hidden relative">

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Top Bar */}
      <MobileNavbar onMenuToggle={() => setIsSidebarOpen(true)} />

      <Sidebar
        currentView={currentView}
        onViewChange={(v) => { setCurrentView(v); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar relative pt-16 md:pt-0">
        {/* Desktop Menu Trigger (only visible when sidebar is closed) */}
        {!isSidebarOpen && (
          <div className="hidden md:flex absolute top-6 left-6 z-20">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 bg-[#3A4F3C] text-[#E6DCCB] rounded-xl shadow-xl hover:bg-[#2F3F31] transition-all active:scale-95 border border-white/10"
              title="Abrir Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        )}

        <div className="p-4 md:p-10 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>

        <Footer />

        {/* Floating Actions */}
        <div className="fixed bottom-6 right-6 z-20 flex items-center space-x-3">
          <button className="w-12 h-12 md:w-14 md:h-14 bg-[#3A4F3C] rounded-2xl md:rounded-xl flex items-center justify-center text-[#E6DCCB] shadow-2xl hover:bg-[#2F3F31] transition-all border-2 border-white hover:scale-110 hidden sm:flex">
            <span className="scale-75">{ICONS.Bot}</span>
          </button>
          <button
            onClick={() => setIsCalculatorOpen(true)}
            className="w-12 h-12 md:w-14 md:h-14 bg-[#3A4F3C] rounded-2xl md:rounded-xl flex items-center justify-center text-[#E6DCCB] shadow-2xl hover:bg-[#2F3F31] transition-all border-2 border-white active:scale-90"
          >
            <span className="scale-75">{ICONS.Calculator}</span>
          </button>
        </div>
      </main>

      <CalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
};

export default App;
