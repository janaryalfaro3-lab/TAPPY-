import React, { useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'auto',
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  // Height mappings for the mint logo badge
  const heightClasses = {
    sm: 'h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-12',
  };

  const subtitleClasses = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  };

  const isDark = variant === 'dark';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${
        onClick ? 'cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]' : ''
      } ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Official Mint Blue Tappy Brand Logo */}
      {!imgError ? (
        <div className="relative flex items-center shrink-0">
          <img
            src="/tappy-logo-badge.png"
            alt="tappy™"
            className={`${heightClasses[size]} w-auto object-contain rounded-lg shadow-2xs border border-teal-200/40`}
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        /* Geometric Mint Fallback Emblem */
        <div
          className={`${heightClasses[size]} px-3 rounded-lg flex items-center justify-center bg-[#5de1e6] text-white font-black font-display tracking-tight text-base shadow-2xs`}
        >
          tappy™
        </div>
      )}

      {/* NFC Review Solutions Descriptor */}
      {showSubtitle && (
        <div className="hidden sm:flex flex-col leading-tight">
          <div className="flex items-center gap-1">
            <span
              className={`text-[9px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-md ${
                isDark
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-cyan-50 text-cyan-800 border border-cyan-200'
              }`}
            >
              NFC REVIEW SOLUTIONS
            </span>
          </div>
          <span
            className={`font-sans ${subtitleClasses[size]} ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            1-Tap Google Reviews
          </span>
        </div>
      )}
    </div>
  );
};
