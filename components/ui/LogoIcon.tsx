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
            {/* Precision recreation of the 3-bar rising graph from the user's logo */}
            {/* Each bar has a specific slant and height increment to match the reference Exactly */}
            <path d="M8 88 L8 58 L32 42 L32 88 Z" />
            <path d="M38 88 L38 48 L62 32 L62 88 Z" />
            <path d="M68 88 L68 38 L92 18 L92 88 Z" />
        </svg>
    );
};

export default LogoIcon;
