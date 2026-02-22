import React from 'react';
import Logo from '../ui/Logo';

interface MobileNavbarProps {
    onMenuToggle: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ onMenuToggle }) => {
    return (
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#3A4F3C] z-[30] flex items-center justify-between px-4 shadow-lg border-b border-white/5">
            <Logo variant="light" showTagline={false} />
            <button
                onClick={onMenuToggle}
                className="p-2 text-[#E6DCCB]"
            >
                <div className="space-y-1.5">
                    <div className="w-6 h-0.5 bg-current"></div>
                    <div className="w-6 h-0.5 bg-current"></div>
                    <div className="w-4 h-0.5 bg-current ml-auto"></div>
                </div>
            </button>
        </div>
    );
};

export default MobileNavbar;
