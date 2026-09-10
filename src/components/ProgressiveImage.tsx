import React, { useState, useRef, useEffect } from 'react';
import { getBrandedPlaceholder } from '../utils/productPlaceholders';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  format?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string; // e.g. 'aspect-[4/3]' or 'aspect-square'
  objectFit?: 'cover' | 'contain';
  priority?: boolean;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  format,
  className = '',
  containerClassName = '',
  aspectRatio = 'aspect-[4/3]',
  objectFit = 'contain',
  priority = true,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoaded, setIsLoaded] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getBrandedPlaceholder(format, alt));
    }
  };

  const aspectClass = aspectRatio && aspectRatio !== 'none' ? aspectRatio : '';

  return (
    <div
      className={`relative overflow-hidden bg-slate-900/5 ${aspectClass} ${containerClassName}`}
    >
      {/* Actual image rendered with high fidelity */}
      <img
        ref={imgRef}
        src={imgSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full ${
          objectFit === 'contain' ? 'object-contain' : 'object-cover'
        } block transition-opacity duration-200 ${className}`}
      />
    </div>
  );
};
