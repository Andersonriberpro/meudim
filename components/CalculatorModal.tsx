
import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldReset, setShouldReset] = useState(false);

  if (!isOpen) return null;

  const handleNumber = (num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setShouldReset(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setShouldReset(false);
  };

  const handleDelete = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const calculate = () => {
    if (!equation) return;
    const fullExp = equation + display;
    try {
      // Usando uma alternativa segura ao eval
      const result = Function('"use strict";return (' + fullExp.replace(/x/g, '*').replace(/÷/g, '/') + ')')();
      setDisplay(Number(result.toFixed(2)).toString());
      setEquation('');
      setShouldReset(true);
    } catch (e) {
      setDisplay('Erro');
      setEquation('');
      setShouldReset(true);
    }
  };

  const handlePercent = () => {
    const val = parseFloat(display);
    setDisplay((val / 100).toString());
  };

  const handleToggleSign = () => {
    setDisplay((parseFloat(display) * -1).toString());
  };

  const buttons = [
    { label: 'C', action: handleClear, type: 'special' },
    { label: '+/-', action: handleToggleSign, type: 'special' },
    { label: '%', action: handlePercent, type: 'special' },
    { label: '÷', action: () => handleOperator('÷'), type: 'operator' },
    { label: '7', action: () => handleNumber('7'), type: 'number' },
    { label: '8', action: () => handleNumber('8'), type: 'number' },
    { label: '9', action: () => handleNumber('9'), type: 'number' },
    { label: 'x', action: () => handleOperator('x'), type: 'operator' },
    { label: '4', action: () => handleNumber('4'), type: 'number' },
    { label: '5', action: () => handleNumber('5'), type: 'number' },
    { label: '6', action: () => handleNumber('6'), type: 'number' },
    { label: '-', action: () => handleOperator('-'), type: 'operator' },
    { label: '1', action: () => handleNumber('1'), type: 'number' },
    { label: '2', action: () => handleNumber('2'), type: 'number' },
    { label: '3', action: () => handleNumber('3'), type: 'number' },
    { label: '+', action: () => handleOperator('+'), type: 'operator' },
    { label: '0', action: () => handleNumber('0'), type: 'number', wide: true },
    { label: ',', action: () => handleNumber('.'), type: 'number' },
    { label: '=', action: calculate, type: 'equal' },
  ];

  return (
    <div className="fixed inset-0 z-[500] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-[#3A4F3C]/60 backdrop-blur-md" onClick={onClose} />

      <div className="bg-[#E6DCCB] w-full max-w-[340px] rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-black/10 relative animate-in slide-in-from-bottom md:zoom-in-95">

        {/* Header da Calculadora */}
        <div className="p-6 bg-[#3A4F3C] flex items-center justify-between text-[#E6DCCB]">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#9C4A3C] rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest">MeuDim Calc</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Display */}
        <div className="bg-[#D8CFC0] p-8 text-right flex flex-col justify-end h-32 border-b border-black/5">
          <span className="text-[10px] font-bold text-[#3A4F3C]/40 uppercase tracking-widest mb-1 h-4">
            {equation}
          </span>
          <span className="text-5xl font-black text-[#3A4F3C] tracking-tighter truncate">
            {display.replace('.', ',')}
          </span>
        </div>

        {/* Grid de Botões */}
        <div className="p-4 grid grid-cols-4 gap-3">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.action}
              className={`
                 h-14 rounded-2xl font-black text-lg transition-all active:scale-90
                 ${btn.wide ? 'col-span-2' : ''}
                 ${btn.type === 'number' ? 'bg-white text-[#3A4F3C] shadow-sm hover:bg-white/80' : ''}
                 ${btn.type === 'operator' ? 'bg-[#3A4F3C] text-[#E6DCCB] shadow-md hover:bg-[#2F3F31]' : ''}
                 ${btn.type === 'special' ? 'bg-[#3A4F3C]/10 text-[#3A4F3C] border border-black/5 hover:bg-black/5' : ''}
                 ${btn.type === 'equal' ? 'bg-[#6E8F7A] text-white shadow-lg hover:bg-[#5D7B68]' : ''}
               `}
            >
              {btn.label}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl font-black text-lg flex items-center justify-center bg-[#9C4A3C]/10 text-[#9C4A3C] hover:bg-[#9C4A3C]/20 transition-all active:scale-90"
          >
            <Delete size={20} />
          </button>
        </div>

        {/* Rodapé Decorativo */}
        <div className="p-4 text-center">
          <p className="text-[8px] font-black text-[#3A4F3C]/20 uppercase tracking-[0.4em]">Ferramenta de Suporte MeuDim</p>
        </div>
      </div>
    </div>
  );
};

export default CalculatorModal;
