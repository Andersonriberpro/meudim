
import React, { useEffect, useRef, useState } from 'react';
import { X, RefreshCw, AlertTriangle } from 'lucide-react';

interface DocumentScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (result: any[]) => void;
}

const DocumentScanner: React.FC<DocumentScannerProps> = ({ isOpen, onClose, onScanResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS'>('IDLE');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    setError(null);
    try {
      const constraints: MediaStreamConstraints = { 
        video: { facingMode: { ideal: 'environment' } },
        audio: false 
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err: any) {
      setError("Permissão de câmera negada ou dispositivo não encontrado.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleScan = () => {
    if (!stream || isScanning) return;
    setIsScanning(true);
    setStatus('SCANNING');

    setTimeout(() => {
      setStatus('SUCCESS');
      setTimeout(() => {
        const mockItems = [
          { id: 'sc-1', name: 'Leite Integral 1L', amount: 5.85, category: 'Supermercado' },
          { id: 'sc-2', name: 'Café Torrado 500g', amount: 18.90, category: 'Supermercado' },
          { id: 'sc-3', name: 'Detergente Líquido', amount: 3.25, category: 'Casa' },
          { id: 'sc-4', name: 'Chocolate 80g', amount: 7.50, category: 'Alimentação' }
        ];
        onScanResult(mockItems);
        setIsScanning(false);
        setStatus('IDLE');
      }, 800);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black flex flex-col animate-in fade-in duration-300">
      <div className="absolute top-0 left-0 right-0 p-10 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={onClose} className="text-white p-4 bg-white/10 rounded-full backdrop-blur-xl">
          <X size={24} />
        </button>
        <div className="text-center">
          <h3 className="text-white font-black text-xl uppercase tracking-[0.3em]">IA VISION</h3>
          <p className="text-[#6E8F7A] text-[10px] font-black uppercase tracking-tighter">Posicione o Cupom Fiscal</p>
        </div>
        <div className="w-14" />
      </div>

      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {!error ? (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale opacity-60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
               <div className="w-full max-w-sm aspect-[3/4] border-2 border-white/20 rounded-[3rem] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-[#6E8F7A] rounded-tl-[3rem]" />
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-8 border-r-8 border-[#6E8F7A] rounded-tr-[3rem]" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-8 border-l-8 border-[#6E8F7A] rounded-bl-[3rem]" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-[#6E8F7A] rounded-br-[3rem]" />
                  {isScanning && <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#6E8F7A] to-transparent shadow-[0_0_20px_#6E8F7A] animate-[scan_2s_ease-in-out_infinite] z-20" />}
               </div>
            </div>
          </>
        ) : (
          <div className="text-center space-y-6 text-white px-10">
             <AlertTriangle size={64} className="mx-auto text-[#9C4A3C]" />
             <p className="font-bold uppercase tracking-widest">{error}</p>
          </div>
        )}

        {status !== 'IDLE' && (
          <div className="absolute bottom-48 bg-white text-[#3A4F3C] px-8 py-4 rounded-3xl font-black uppercase text-sm tracking-widest flex items-center space-x-3 shadow-2xl animate-bounce">
            <RefreshCw size={20} className="animate-spin" />
            <span>{status === 'SCANNING' ? 'Mapeando Itens...' : 'Análise Concluída!'}</span>
          </div>
        )}
      </div>

      <div className="bg-black p-12 flex items-center justify-center">
        <button 
          onClick={handleScan}
          disabled={isScanning || !!error}
          className="w-24 h-24 rounded-full border-8 border-white/10 flex items-center justify-center hover:border-white/20 transition-all active:scale-90"
        >
          <div className={`w-16 h-16 rounded-full bg-white transition-all ${isScanning ? 'scale-75 opacity-50' : 'scale-100'}`} />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes scan { 0%, 100% { top: 0%; } 50% { top: 100%; } }`}} />
    </div>
  );
};

export default DocumentScanner;
