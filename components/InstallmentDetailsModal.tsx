
import React from 'react';
import { X, CheckCircle2, Circle } from 'lucide-react';

interface InstallmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  installment: {
    description: string;
    installmentsCount: number;
    installmentValue: number;
    startDate: string;
    paidParcels: number[];
  };
  onToggleParcel: (parcelNumber: number) => void;
}

const InstallmentDetailsModal: React.FC<InstallmentDetailsModalProps> = ({
  isOpen,
  onClose,
  installment,
  onToggleParcel
}) => {
  if (!isOpen) return null;

  const getParcelDate = (startDate: string, monthsToAdd: number) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + monthsToAdd);
    if (new Date(startDate).getDate() !== date.getDate()) {
      date.setDate(0);
    }
    return date.toLocaleDateString('pt-BR');
  };

  const parcels = Array.from({ length: installment.installmentsCount }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-[#3A4F3C]/40 backdrop-blur-md" onClick={onClose} />

      <div className="bg-[#E6DCCB] w-full max-w-2xl h-[90vh] md:h-[85vh] rounded-t-2xl md:rounded-[2.5rem] flex flex-col shadow-2xl relative animate-in slide-in-from-bottom duration-300 overflow-hidden border border-black/10">

        <div className="p-5 md:p-10 border-b border-black/5 flex items-center justify-between">
          <div>
            <h3 className="text-base md:text-3xl font-black text-[#3A4F3C] uppercase tracking-tighter leading-none">{installment.description}</h3>
            <p className="text-[7px] md:text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">Plano de Pagamentos</p>
          </div>
          <button onClick={onClose} className="p-2 bg-black/5 text-[#3A4F3C] rounded-full">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-2 md:space-y-4 custom-scrollbar bg-black/5">
          {parcels.map((num) => {
            const isPaid = installment.paidParcels.includes(num);
            return (
              <div
                key={num}
                onClick={() => onToggleParcel(num)}
                className={`flex items-center justify-between p-3 md:p-6 rounded-xl md:rounded-[2rem] border transition-all cursor-pointer ${isPaid
                    ? 'bg-[#6E8F7A]/5 border-[#6E8F7A]/20 shadow-sm'
                    : 'bg-white border-black/5'
                  }`}
              >
                <div className="flex items-center space-x-3 md:space-x-5">
                  <div className={isPaid ? 'text-[#6E8F7A]' : 'text-black/10'}>
                    {isPaid ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </div>
                  <div>
                    <p className="text-[11px] md:text-xl font-black text-[#3A4F3C] tracking-tight">
                      Parcela {num}/{installment.installmentsCount}
                    </p>
                    <p className="text-[7px] md:text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">
                      {getParcelDate(installment.startDate, num - 1)}
                    </p>
                  </div>
                </div>
                <p className={`text-sm md:text-2xl font-black tracking-tighter ${isPaid ? 'text-[#6E8F7A]' : 'text-[#3A4F3C]'}`}>
                  R$ {installment.installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            );
          })}
        </div>

        <div className="p-5 md:p-10 bg-[#E6DCCB] border-t border-black/5 flex justify-between items-center">
          <div className="font-black text-[8px] md:text-[10px] uppercase tracking-widest text-[#3A4F3C]/40">
            Pagas: <span className="text-[#6E8F7A]">{installment.paidParcels.length}</span> / {installment.installmentsCount}
          </div>
          <button onClick={onClose} className="bg-[#3A4F3C] text-white px-6 py-3 rounded-xl font-black uppercase text-[8px] md:text-[10px] tracking-widest shadow-xl">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallmentDetailsModal;
