import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
    message: string | null;
    onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
    if (!message) return null;

    return (
        <div className="fixed top-20 md:top-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-[300] bg-[#6E8F7A] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-white/20 w-[85%] md:w-auto animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 size={18} />
            <span className="font-black uppercase text-[9px] tracking-tight">{message}</span>
        </div>
    );
};

export default Toast;
