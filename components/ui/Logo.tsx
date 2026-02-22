import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  showTagline?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', variant = 'light', showTagline = true }) => {
  const textColor = variant === 'light' ? 'text-[#E6DCCB]' : 'text-[#3A4F3C]';
  const tagColor = variant === 'light' ? 'text-[#E6DCCB]/40' : 'text-[#3A4F3C]/40';
  const iconBg = variant === 'light' ? 'bg-[#E6DCCB]' : 'bg-[#3A4F3C]';
  const iconText = variant === 'light' ? 'text-[#3A4F3C]' : 'text-[#E6DCCB]';

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center font-black ${iconText} text-xs`}>
          M
        </div>
        <h1 className={`text-lg md:text-xl font-black ${textColor} uppercase tracking-tighter leading-none`}>
          MeuDim
        </h1>
      </div>
      {showTagline && (
        <p className={`text-[7px] font-black ${tagColor} uppercase tracking-widest mt-0.5`}>
          force edition
        </p>
      )}
    </div>
  );
};

export default Logo;
