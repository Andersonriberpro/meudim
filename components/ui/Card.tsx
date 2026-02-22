import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'glass' | 'solid' | 'highlight';
}

const Card: React.FC<CardProps> = ({ children, className = '', variant = 'glass' }) => {
    const variants = {
        glass: 'bg-white/40 backdrop-blur-md border-white/40',
        solid: 'bg-[#3A4F3C] border-white/10 text-[#E6DCCB]',
        highlight: 'bg-[#6E8F7A] border-white/20 text-white'
    };

    return (
        <div className={`rounded-xl md:rounded-[2.5rem] p-4 md:p-8 shadow-sm border ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
};

export default Card;
