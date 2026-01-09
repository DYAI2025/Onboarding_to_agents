
// FILE: components/SmartImage.tsx
import React, { useState, useEffect } from 'react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackComponent?: React.ReactNode;
  containerClassName?: string;
  priority?: boolean;
}

export const SmartImage: React.FC<SmartImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  containerClassName = "",
  fallbackComponent,
  priority = false,
  ...props 
}) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    if (!src) {
        setStatus('error');
        return;
    }
    const img = new Image();
    img.src = src;
    img.onload = () => setStatus('loaded');
    img.onerror = () => setStatus('error');
    // Handle cached images immediately
    if (img.complete) {
        if (img.naturalWidth === 0) {
            setStatus('error');
        } else {
            setStatus('loaded');
        }
    }
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setStatus('error');
    if (props.onError) props.onError(e);
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Loading State - Skeleton Pulse */}
      {status === 'loading' && (
        <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center z-10 backdrop-blur-sm">
           <div className="w-8 h-8 border-2 border-astro-gold/30 border-t-astro-gold rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
         <div className="absolute inset-0 flex items-center justify-center bg-red-500/5 z-20 backdrop-blur-sm">
            {fallbackComponent || <div className="text-red-400 text-[10px] uppercase tracking-widest font-bold border border-red-500/30 px-3 py-1 rounded-full bg-red-500/10">Image Error</div>}
         </div>
      )}

      {/* Actual Image with Fade In */}
      <img
        src={src}
        alt={alt}
        onError={handleError}
        className={`${className} transition-opacity duration-700 ease-out ${status === 'loaded' ? '' : 'opacity-0'}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...props}
      />
    </div>
  );
};
