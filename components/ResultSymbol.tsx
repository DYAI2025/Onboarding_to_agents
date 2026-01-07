
import React, { useState } from 'react';

interface Props {
  imageUrl: string;
  synthesis: string;
}

export const ResultSymbol: React.FC<Props> = ({ imageUrl, synthesis }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="mt-12 animate-fade-in-up flex justify-center w-full">
      <div className="border border-astro-border bg-astro-card p-10 md:p-14 rounded-[3rem] text-center w-full max-w-2xl shadow-elevated flex flex-col items-center">
        <div className="mb-12 relative group w-full flex justify-center items-center overflow-visible">
          {/* Cosmic Aura Glow - Increased scale for better framing */}
          <div className="absolute w-[120%] h-[120%] bg-gradient-to-b from-astro-gold/15 to-transparent rounded-full blur-[80px] opacity-70 animate-pulse-soft"></div>
          
          {/* Responsive Image Container with Perfect Centering */}
          <div className="relative z-10 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] flex items-center justify-center">
            {/* Inner Ring Glow */}
            <div className="absolute inset-[-10px] rounded-full border border-astro-gold/10 pointer-events-none animate-spin-slow"></div>
            <div className="absolute inset-[-20px] rounded-full border border-astro-gold/5 pointer-events-none animate-[spin_30s_linear_infinite_reverse]"></div>

            <div className="w-full h-full rounded-full overflow-hidden border-[12px] border-white dark:border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white dark:bg-zinc-800 transition-all duration-1000 group-hover:scale-105 group-hover:shadow-[0_40px_80px_rgba(212,175,55,0.25)] animate-spin-super-slow flex items-center justify-center">
              {hasError ? (
                <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
                  <span className="text-5xl mb-4 grayscale opacity-40">✦</span>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-astro-subtext font-black mb-1">Übertragungsfehler</div>
                  <p className="font-serif italic text-sm text-astro-subtext/60">Symbol konnte nicht materialisiert werden</p>
                </div>
              ) : (
                <img 
                  src={imageUrl} 
                  alt="Generated Cosmic Symbol" 
                  className="w-full h-full object-cover filter brightness-105 contrast-105 animate-appear-rotate"
                  onError={() => setHasError(true)}
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-4 max-w-lg mb-10">
          <div className="text-astro-gold text-[10px] uppercase tracking-[0.6em] font-black mb-2">Visual_Confirmation</div>
          <h3 className="font-serif text-4xl md:text-5xl text-astro-text leading-tight tracking-tight">Dein Schicksal im Kosmos</h3>
          <p className="font-sans text-sm text-astro-subtext leading-relaxed font-light px-6">
            Deine Essenz wurde in ein kosmisches Siegel gewebt. Tritt in unsere Astrologie-Sphäre ein und entdecke die verborgenen Pfade deines Seins.
          </p>
        </div>
        
        <div className="pt-6 border-t border-astro-border/50 w-full flex justify-center">
          <button className="group inline-flex items-center gap-4 px-10 py-4 bg-astro-text text-white font-serif italic text-xl rounded-2xl hover:bg-black transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-95 overflow-hidden relative">
            <span className="relative z-10">Zu den Sternen aufbrechen</span>
            <svg className="w-6 h-6 transition-transform group-hover:translate-x-1 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-astro-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>
    </div>
  );
};
