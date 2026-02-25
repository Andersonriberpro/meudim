import React from 'react';

interface LogoIconProps {
    className?: string;
    size?: number | string;
}

const LogoIcon: React.FC<LogoIconProps> = ({ className = '', size = 32 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Recreating the stylized "M" chart icon from the user's reference image */}
            <path d="M15 85 L15 45 L35 32 L50 48 L68 25 L85 12 L85 85 L68 85 L68 45 L50 62 L35 48 L35 85 Z" />
        </svg>
    );
};

export default LogoIcon;
