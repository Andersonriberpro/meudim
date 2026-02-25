import React from 'react';
import Logo from './ui/Logo';

const Footer: React.FC = () => {
    return (
        <footer className="w-full py-8 px-4 md:px-10 border-t border-[#3A4F3C]/5 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col items-center space-y-4">
                <Logo variant="dark" showTagline={false} className="opacity-90" />
                <p className="text-[10px] md:text-xs font-medium text-[#3A4F3C]/40 uppercase tracking-[0.2em] text-center">
                    2026 Meu Dim controle financeiro todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
