
import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Info, ChevronRight, Loader2, Check } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (result: any[]) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onScanResult }) => {
  const [step, setStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const steps = [
    { n: 1, label: 'Upload' },
    { n: 2, label: 'Processando' },
    { n: 3, label: 'Conciliação' },
    { n: 4, label: 'Confirmação' },
    { n: 5, label: 'Resultado' }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const nextStep = () => {
    if (step === 1 && selectedFile) {
      setIsProcessing(true);
      setStep(2);
      // Simular processamento
      setTimeout(() => {
        setIsProcessing(false);
        // Mock de resultados
        const mockItems = [
          { id: 'imp-1', name: 'Transferência Recebida', amount: 1500.00, category: 'Serviço' },
          { id: 'imp-2', name: 'Padaria Central', amount: 22.50, category: 'Alimentação' },
          { id: 'imp-3', name: 'Posto Shell', amount: 200.00, category: 'Transporte' }
        ];
        onScanResult(mockItems);
        onClose();
        setStep(1);
        setSelectedFile(null);
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-[#3A4F3C]/60 backdrop-blur-md" onClick={onClose} />

      <div className="bg-[#E6DCCB] w-full max-w-3xl rounded-t-2xl md:rounded-[3rem] shadow-2xl relative animate-in slide-in-from-bottom md:zoom-in-95 duration-300 border border-black/10 flex flex-col max-h-[95vh] md:max-h-[90vh] overflow-hidden">

        {/* Header Step 1 - Box 1 */}
        <div className="p-5 md:p-12 border-b border-black/5 bg-[#D8CFC0]/20">
          <button onClick={onClose} className="absolute top-4 right-4 md:top-8 md:right-8 text-[#3A4F3C]/40 hover:text-[#3A4F3C] transition-all">
            <X size={20} />
          </button>

          <div className="space-y-10">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-10 bg-[#3A4F3C] rounded-full" />
              <div>
                <h3 className="text-lg md:text-3xl font-black text-[#3A4F3C] uppercase tracking-tighter leading-none">Importar Extrato</h3>
                <p className="text-[#3A4F3C]/60 font-black uppercase text-[10px] tracking-widest mt-2">
                  Importe transações de um extrato bancário para conciliar com suas movimentações.
                </p>
              </div>
            </div>

            {/* Stepper Visual Detalhado */}
            <div className="relative hidden md:block">
              <div className="absolute top-4 left-0 w-full h-0.5 bg-black/5" />
              <div className="flex items-center justify-between relative z-10">
                {steps.map((s) => (
                  <div key={s.n} className="flex flex-col items-center space-y-3 group">
                    <div className={`
                        w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500
                        ${s.n < step ? 'bg-[#6E8F7A] text-white shadow-lg' :
                        s.n === step ? 'bg-[#3A4F3C] text-white shadow-xl scale-110' :
                          'bg-white text-[#3A4F3C]/30 border border-black/5'}
                      `}>
                      {s.n < step ? <Check size={20} /> : s.n}
                    </div>
                    <div className="text-center">
                      <span className={`
                          text-[9px] font-black uppercase tracking-widest block
                          ${s.n === step ? 'text-[#3A4F3C]' : 'text-[#3A4F3C]/40'}
                        `}>
                        {s.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content - Step 1 View */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-12 space-y-6 md:space-y-10">

          {step === 1 ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center md:text-left flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#3A4F3C]/10 rounded-2xl flex items-center justify-center text-[#3A4F3C]">
                  <Upload size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-[#3A4F3C] uppercase tracking-tight">Importar Extrato Bancário</h4>
                  <p className="text-[10px] font-bold text-[#3A4F3C]/60 uppercase tracking-widest mt-1">
                    Etapa 1: Envie o documento original (.OFX, .PDF ou .JPG)
                  </p>
                </div>
              </div>

              {/* Box 2 - Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-4 border-dashed rounded-xl md:rounded-[2.5rem] p-6 md:p-12 flex flex-col items-center justify-center space-y-4 md:space-y-6 cursor-pointer transition-all
                  ${isDragging ? 'bg-[#3A4F3C]/5 border-[#3A4F3C] scale-[0.99]' : 'bg-white/40 border-black/5 hover:bg-white/60 hover:border-[#3A4F3C]/20'}
                `}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".ofx,.pdf,.jpg,.jpeg" />

                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${selectedFile ? 'bg-[#6E8F7A] text-white' : 'bg-[#3A4F3C]/5 text-[#3A4F3C]'}`}>
                  {selectedFile ? <FileText size={40} /> : <Upload size={40} />}
                </div>

                <div className="text-center">
                  <p className="text-xs md:text-lg font-black text-[#3A4F3C] uppercase tracking-tight">
                    {selectedFile ? selectedFile.name : 'Arraste um arquivo ou clique para selecionar'}
                  </p>
                  <p className="text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest mt-2">
                    Formatos aceitos: ofx, pdf, jpg
                  </p>
                </div>
              </div>

              {/* Information Box */}
              <div className="bg-[#3A4F3C] text-[#E6DCCB] p-5 md:p-8 rounded-xl md:rounded-[2rem] flex items-start space-x-4 md:space-x-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Info size={120} />
                </div>
                <div className="bg-white/10 p-3 rounded-xl mt-1">
                  <Info size={24} />
                </div>
                <div className="space-y-2 relative">
                  <h5 className="font-black uppercase text-xs tracking-widest">Onde encontrar o arquivo OFX?</h5>
                  <p className="text-[10px] font-medium leading-relaxed opacity-80 uppercase tracking-tight">
                    No app ou site do seu banco, procure por "Exportar extrato" ou "Baixar OFX". É o formato mais rápido e preciso para importar.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 space-y-8">
              <div className="relative">
                <div className="w-24 h-24 border-8 border-black/5 rounded-full" />
                <Loader2 size={96} className="text-[#3A4F3C] animate-spin absolute inset-0" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-black text-xl text-[#3A4F3C]">{step}</span>
                </div>
              </div>
              <div className="text-center space-y-3">
                <h4 className="text-2xl font-black text-[#3A4F3C] uppercase tracking-tighter">
                  {step === 2 ? 'Analisando Documento' :
                    step === 3 ? 'Organizando Transações' :
                      step === 4 ? 'Ajustando Detalhes' : 'Finalizando'}
                </h4>
                <p className="text-[10px] font-black text-[#3A4F3C]/40 uppercase tracking-widest">
                  {step === 2 ? 'Estamos mapeando as transações do seu extrato...' :
                    'Quase pronto para a conferência final.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 md:p-12 border-t border-black/5 bg-[#D8CFC0]/30 flex flex-col-reverse md:flex-row items-center justify-between gap-3 md:gap-6">
          <button
            onClick={onClose}
            className="w-full md:w-auto px-10 py-5 rounded-2xl font-black text-[#3A4F3C]/60 hover:bg-black/5 uppercase text-[10px] tracking-widest transition-all"
          >
            Cancelar
          </button>
          <button
            disabled={!selectedFile || isProcessing}
            onClick={nextStep}
            className={`w-full md:w-auto bg-[#3A4F3C] text-[#E6DCCB] px-8 md:px-14 py-4 md:py-5 rounded-xl md:rounded-2xl font-black shadow-2xl transition-all active:scale-95 flex items-center justify-center space-x-3 text-[10px] md:text-sm uppercase tracking-widest disabled:opacity-20 disabled:cursor-not-allowed`}
          >
            <span>{isProcessing ? 'Processando...' : 'Avançar para Conciliação'}</span>
            {!isProcessing && <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
