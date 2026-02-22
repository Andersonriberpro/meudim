import React, { useState } from 'react';
import { ICONS } from '../constants';
import { Edit2, X, ArrowLeft, Plane, AlertTriangle } from 'lucide-react';
import PageLayout from './layout/PageLayout';
import Card from './ui/Card';

interface TravelDetailsProps {
  onBack: () => void;
  travelName: string;
  setTravelName: (name: string) => void;
  travelBudget: string;
  setTravelBudget: (budget: string) => void;
  onEndTravel: () => void;
}

const TravelDetails: React.FC<TravelDetailsProps> = ({
  onBack,
  travelName,
  setTravelName,
  travelBudget,
  setTravelBudget,
  onEndTravel
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempName, setTempName] = useState(travelName);
  const [tempBudget, setTempBudget] = useState(travelBudget);

  const handleOpenEdit = () => {
    setTempName(travelName);
    setTempBudget(travelBudget);
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    setTravelName(tempName);
    setTravelBudget(tempBudget);
    setIsEditModalOpen(false);
  };

  const headerContent = (
    <button
      onClick={onBack}
      className="flex items-center space-x-2 text-[#3A4F3C] font-black uppercase text-[10px] tracking-widest hover:opacity-60 transition-all"
    >
      <ArrowLeft size={16} />
      <span>Voltar</span>
    </button>
  );

  return (
    <PageLayout title={travelName} headerContent={headerContent}>
      {/* Travel Header Card */}
      <div className="bg-[#3A4F3C] text-[#E6DCCB] p-5 md:p-10 rounded-xl md:rounded-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Plane size={120} />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
              <Plane size={24} />
            </div>
            <div>
              <h3 className="text-base md:text-2xl font-black uppercase tracking-tighter leading-none">{travelName}</h3>
              <p className="text-[7px] md:text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">03/02/2026 - 09/02/2026</p>
            </div>
          </div>
          <button
            onClick={handleOpenEdit}
            className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 md:px-6 md:py-3 rounded-xl transition-all"
          >
            <Edit2 size={14} />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Editar</span>
          </button>
        </div>
      </div>

      {/* Budget Card */}
      <Card className="space-y-4 md:space-y-6">
        <h3 className="text-sm md:text-2xl font-black text-[#3A4F3C] uppercase tracking-tighter">Orçamento da Viagem</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[7px] md:text-[9px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">Gasto</p>
              <p className="text-lg md:text-2xl font-black text-[#3A4F3C] tracking-tighter">R$ 0,00</p>
            </div>
            <div className="text-right">
              <p className="text-[7px] md:text-[9px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">Limite</p>
              <p className="text-lg md:text-2xl font-black text-[#3A4F3C]/60 tracking-tighter">R$ {travelBudget}</p>
            </div>
          </div>

          <div className="w-full h-2.5 md:h-4 bg-black/5 rounded-full overflow-hidden">
            <div className="w-[1%] h-full bg-[#6E8F7A] rounded-full transition-all duration-700" />
          </div>

          <div className="flex justify-end">
            <span className="text-[7px] md:text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">0.0% utilizado</span>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-3">
        <button
          onClick={handleOpenEdit}
          className="flex-1 flex items-center justify-center space-x-3 bg-white/40 backdrop-blur-md border border-white/40 px-5 py-4 rounded-xl md:rounded-2xl font-black text-[#3A4F3C] shadow-sm hover:bg-white/60 transition-all text-[9px] md:text-xs uppercase tracking-widest"
        >
          <Edit2 size={16} />
          <span>Ajustar Orçamento</span>
        </button>
        <button
          onClick={onEndTravel}
          className="flex-1 flex items-center justify-center space-x-3 bg-[#9C4A3C] hover:bg-[#8A3F33] text-white px-5 py-4 rounded-xl md:rounded-2xl font-black shadow-xl transition-all active:scale-95 text-[9px] md:text-xs uppercase tracking-widest"
        >
          <AlertTriangle size={16} />
          <span>Encerrar Viagem</span>
        </button>
      </div>

      {/* Travel Expenses */}
      <Card className="min-h-[200px] md:min-h-[300px]">
        <h3 className="text-sm md:text-2xl font-black text-[#3A4F3C] mb-6 md:mb-10 uppercase tracking-tighter">Despesas — {travelName}</h3>

        <div className="flex flex-col items-center justify-center space-y-3 py-10 md:py-16">
          <div className="w-16 h-16 bg-[#3A4F3C]/5 rounded-2xl flex items-center justify-center text-[#3A4F3C]/20">
            <Plane size={32} />
          </div>
          <p className="text-[10px] md:text-xs font-black text-[#3A4F3C]/30 text-center uppercase tracking-widest max-w-xs">
            Nenhuma despesa registrada para {travelName} ainda.
          </p>
        </div>
      </Card>

      {/* Edit Travel Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[400] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-[#3A4F3C]/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsEditModalOpen(false)} />

          <div className="bg-[#E6DCCB] w-full max-w-md rounded-t-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative animate-in slide-in-from-bottom md:zoom-in-95 duration-200 border border-black/10">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 text-[#3A4F3C]/40 hover:text-[#3A4F3C] transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg md:text-2xl font-black text-[#3A4F3C] mb-5 md:mb-8 uppercase tracking-tighter">Editar Viagem</h3>

            <div className="space-y-4 md:space-y-6">
              <div className="space-y-1">
                <label className="text-[7px] md:text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Destino</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Ex: Férias na Praia"
                  className="w-full bg-white/60 border border-black/5 rounded-xl px-4 py-3 outline-none font-black text-[#3A4F3C] uppercase text-[10px] focus:ring-2 focus:ring-[#3A4F3C]/10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[7px] md:text-[8px] font-black text-[#3A4F3C]/40 uppercase tracking-widest ml-1">Orçamento</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#3A4F3C]/30 text-[10px]">R$</span>
                  <input
                    type="text"
                    value={tempBudget}
                    onChange={(e) => setTempBudget(e.target.value)}
                    className="w-full bg-white/60 border border-black/5 rounded-xl pl-10 pr-4 py-3 outline-none font-black text-[#3A4F3C] text-sm focus:ring-2 focus:ring-[#3A4F3C]/10"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row md:space-x-3 pt-2 gap-2">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-full md:flex-1 py-3 md:py-4 rounded-xl font-black text-[#3A4F3C]/60 hover:bg-black/5 uppercase text-[9px] tracking-widest transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="w-full md:flex-[2] py-4 rounded-xl font-black text-[#E6DCCB] bg-[#3A4F3C] hover:bg-[#2F3F31] shadow-xl transition-all active:scale-95 uppercase text-[9px] tracking-widest"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default TravelDetails;
