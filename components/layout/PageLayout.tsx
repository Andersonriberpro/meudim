import React from 'react';

interface PageLayoutProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
    headerContent?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title, className = '', headerContent }) => {
    return (
        <div className={`space-y-4 md:space-y-8 animate-in fade-in duration-500 pb-20 ${className}`}>
            {(title || headerContent) && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
                    {title && <h2 className="text-xl md:text-4xl font-black text-[#3A4F3C] uppercase tracking-tighter">{title}</h2>}
                    {headerContent}
                </div>
            )}
            {children}
        </div>
    );
};

export default PageLayout;
