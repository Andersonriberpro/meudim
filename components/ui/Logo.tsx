import React from 'react';
import LogoIcon from './LogoIcon';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'green' | 'sidebar';
  showTagline?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', variant = 'dark', showTagline = true }) => {
  // variants:
  // light: light text (kraft), icon is kraft on transparent
  // dark: dark text (militar), icon is militar on transparent (VERSÃO COLORIDA style)
  // green: dark text (militar), icon is kraft on militar rounded square (APP ICON style)
  // sidebar: light text (kraft), icon is kraft on militar rounded square (for dark sidebars)

  const textColor = (variant === 'light' || variant === 'sidebar') ? 'text-[#E6DCCB]' : 'text-[#3A4F3C]';
  const tagColor = (variant === 'light' || variant === 'sidebar') ? 'text-[#E6DCCB]/40' : 'text-[#3A4F3C]/40';

  // Icon styling
  const iconBg = (variant === 'green' || variant === 'sidebar') ? 'bg-[#3A4F3C] border border-white/5 shadow-2x-strong' : 'bg-transparent';
  const iconColor = (variant === 'green' || variant === 'sidebar' || variant === 'light') ? 'text-[#E6DCCB]' : 'text-[#3A4F3C]';
  const iconPadding = (variant === 'green' || variant === 'sidebar') ? 'p-1.5' : 'p-0';

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center space-x-2.5">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center ${iconColor} ${iconPadding} transition-transform hover:scale-105`}>
          <LogoIcon size={variant === 'green' || variant === 'sidebar' ? 24 : 32} />
        </div>
        <h1
          className={`text-2xl md:text-3xl ${textColor} tracking-tight leading-none`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <span className="font-medium">Meu </span>
          <span className="font-extrabold">Dim</span>
        </h1>
      </div>
      {showTagline && (
        <p className={`text-[8px] font-black ${tagColor} uppercase tracking-[0.3em] mt-1 ml-11 opacity-50`}>
          seu dinheiro no controle
        </p>
      )}
    </div>
  );
};

export default Logo;
