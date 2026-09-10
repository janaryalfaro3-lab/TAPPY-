import React, { useState, useEffect } from 'react';
import { getBrandedPlaceholder } from '../utils/productPlaceholders';
import { Sparkles, Radio } from 'lucide-react';

interface NfcProductImageProps {
  src?: string;
  alt: string;
  format?: string;
  aspectRatio?: 'aspect-[4/3]' | 'aspect-[16/9]' | 'aspect-square' | 'aspect-[16/10]';
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  showBadge?: boolean;
  badgeLabel?: string;
}

/**
 * Standardized high-quality NFC Product Image component
 * - Integrated high-end shimmer pre-loader wave with hardware pulse skeleton
 * - Strict object-fit: contain strategy inside an explicit aspect-ratio container
 * - Automatic seamless failover to high-resolution branded SVG placeholder if image is missing or fails
 * - Luxury dark studio gradient stage with specular depth and shadow
 */
export const NfcProductImage: React.FC<NfcProductImageProps> = ({
  src,
  alt,
  format = 'stand',
  aspectRatio = 'aspect-[4/3]',
  className = '',
  containerClassName = '',
  priority = true,
  showBadge = false,
  badgeLabel,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(
    src || getBrandedPlaceholder(format, alt)
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (src) {
      setCurrentSrc(src);
      setHasError(false);
      setIsLoaded(false);
    } else {
      setCurrentSrc(getBrandedPlaceholder(format, alt));
      setIsLoaded(true);
    }
  }, [src, format, alt]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(getBrandedPlaceholder(format, alt));
      setIsLoaded(true);
    }
  };

  return (
    <div
      className={`relative w-full ${aspectRatio} rounded-xl overflow-hidden border border-stone-800 bg-gradient-to-b from-stone-900 via-stone-950 to-neutral-950 p-2.5 shadow-inner flex items-center justify-center select-none ${containerClassName}`}
    >
      {/* Subtle Studio Spotlight Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* High-End Shimmer / Preloader Skeleton (visible until asset loads) */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-stone-950/90 backdrop-blur-xs">
          {/* Animated Light Sweep / Shimmer Bar */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-sky-400/15 to-transparent animate-shimmer" />
          </div>

          {/* Hardware Silhouette with Gentle Pulse */}
          <div className="relative flex flex-col items-center gap-2 text-stone-600">
            <div className="w-12 h-12 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-center animate-pulse shadow-inner">
              <Radio className="w-6 h-6 text-sky-500/60 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <span className="text-[10px] tracking-wider uppercase font-mono text-sky-400/70 font-medium">
              Loading NFC Hardware...
            </span>
          </div>
        </div>
      )}

      {/* Main Product Image with object-fit: contain & smooth crossfade */}
      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-contain filter drop-shadow-[0_14px_24px_rgba(0,0,0,0.85)] block transition-all duration-500 ease-out ${
          isLoaded ? 'opacity-100 scale-100 filter blur-0' : 'opacity-0 scale-96 filter blur-xs'
        } ${className}`}
      />

      {/* Optional Badge */}
      {showBadge && (
        <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-xs border border-slate-700 text-white text-[10.5px] font-semibold shadow-sm">
            <Sparkles className="w-2.5 h-2.5 text-sky-400" />
            <span>{badgeLabel || 'NFC Ready'}</span>
          </span>
        </div>
      )}

      {/* Indicator when rendered via high-res branded fallback */}
      {hasError && (
        <div className="absolute bottom-2 left-2 z-20 pointer-events-none">
          <span className="px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-800 text-sky-300 text-[9px] font-mono uppercase tracking-wider">
            HQ Vector Model
          </span>
        </div>
      )}
    </div>
  );
};

