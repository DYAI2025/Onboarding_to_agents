
import React, { useState } from 'react';

interface Props {
  imageUrl: string;
  synthesis: string;
  sunSign?: string;
}

// Zodiac configuration for fallback generation
const ZODIAC_CONFIG: Record<string, { symbol: string, color: string, element: string }> = {
  "Aries": { symbol: "♈", color: "from-orange-500 to-red-600", element: "Fire" },
  "Taurus": { symbol: "♉", color: "from-emerald-500 to-green-700", element: "Earth" },
  "Gemini": { symbol: "♊", color: "from-yellow-400 to-amber-500", element: "Air" },
  "Cancer": { symbol: "♋", color: "from-blue-400 to-cyan-600", element: "Water" },
  "Leo": { symbol: "♌", color: "from-amber-500 to-red-500", element: "Fire" },
  "Virgo": { symbol: "♍", color: "from-emerald-600 to-teal-700", element: "Earth" },
  "Libra": { symbol: "♎", color: "from-indigo-400 to-purple-500", element: "Air" },
  "Scorpio": { symbol: "♏", color: "from-purple-600 to-indigo-800", element: "Water" },
  "Sagittarius": { symbol: "♐", color: "from-orange-600 to-amber-700", element: "Fire" },
  "Capricorn": { symbol: "♑", color: "from-stone-500 to-stone-700", element: "Earth" },
  "Aquarius": { symbol: "♒", color: "from-sky-500 to-blue-600", element: "Air" },
  "Pisces": { symbol: "♓", color: "from-teal-400 to-cyan-600", element: "Water" },
};

export const ResultSymbol: React.FC<Props> = ({ imageUrl, synthesis, sunSign }) => {
  const [hasError, setHasError] = useState(false);

  // Fallback Generator Logic
  const renderFallbackSymbol = () => {
    const safeSign = sunSign && ZODIAC_CONFIG[sunSign] ? sunSign : "Aries";
    const config = ZODIAC_CONFIG[safeSign];
    
    return (
      <div className={`w-full h-full bg-gradient-to-br ${config.color} relative flex items-center justify-center overflow-hidden animate-fade-in`}>
         {/* Procedural Geometric Pattern */}
         <div className="absolute inset-0 opacity-30">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_60s_linear_infinite]">
              <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" fill="none" />
              <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" fill="none" />
              <path d="M50 10 L90 50 L50 90 L10 50 Z" stroke="white" strokeWidth="0.5" fill="none" opacity="0.5" />
            </svg>
         </div>
         
         {/* Ambient Glow */}
         <div className="absolute inset-0 bg-radial-gradient from-white/20 to-transparent pointer-events-none"></div>

         {/* Central Symbol */}
         <div className="relative z-10 text-white font-serif text-9xl drop-shadow-[0_0_15px_rgba(0,0,0,0.3)] transform hover:scale-110 transition-transform duration-500 cursor-default">
            {config.symbol}
         </div>

         {/* Label */}
         <div className="absolute bottom-8 left-0 right-0 text-center">
            <div className="inline-block px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full border border-white/20">
               <span className="text-[10px] uppercase tracking-[0.3em] text-white font-black">{safeSign} Essence</span>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="mt-12 animate-fade-in-up flex justify-center w-full px-4">
      <div className="border border-astro-border bg-astro-card p-10 md:p-14 rounded-[3rem] text-center w-full max-w-2xl shadow-elevated flex flex-col items-center relative overflow-hidden">
        {/* Background decorative elements to enhance the container */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-astro-bg/50 to-transparent pointer-events-none"></div>

        <div className="mb-12 relative group w-full flex justify-center items-center overflow-visible z-10">
          {/* Cosmic Aura Glow - Adjusted for centered focus */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-b from-astro-gold/20 to-transparent rounded-full blur-[90px] opacity-60 animate-pulse-soft pointer-events-none"></div>
          
          {/* Responsive Image Container with Perfect Centering */}
          {/* Using Aspect Ratio to ensure perfect circle scaling */}
          <div className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 max-w-full aspect-square flex items-center justify-center">
            {/* Inner Ring Glows - Centered */}
            <div className="absolute inset-[-15px] rounded-full border border-astro-gold/20 pointer-events-none animate-spin-slow"></div>
            <div className="absolute inset-[-30px] rounded-full border border-astro-gold/10 pointer-events-none animate-[spin_40s_linear_infinite_reverse]"></div>

            {/* Main Symbol Container */}
            <div className="w-full h-full rounded-full overflow-hidden border-[12px] border-white dark:border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.1)] bg-white dark:bg-zinc-800 transition-transform duration-700 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_40px_90px_rgba(212,175,55,0.3)] flex items-center justify-center relative">
              {hasError ? (
                renderFallbackSymbol()
              ) : (
                <img 
                  src={imageUrl} 
                  alt="Generated Cosmic Symbol" 
                  className="w-full h-full object-cover filter brightness-105 contrast-110 animate-appear-rotate"
                  onError={() => setHasError(true)}
                />
              )}
              {/* Internal Gloss Overlay - Only if not using fallback (fallback has its own) */}
              {!hasError && <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-black/5 pointer-events-none z-20"></div>}
            </div>
          </div>
        </div>
        
        <div className="space-y-6 max-w-lg mb-10 relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full border border-astro-gold/30 bg-astro-gold/5 text-astro-gold text-[10px] uppercase tracking-[0.4em] font-black backdrop-blur-sm">
            {hasError ? 'Emergency_Seal_Generated' : 'Visual_Confirmation'}
          </div>
          <h3 className="font-serif text-4xl md:text-6xl text-astro-text leading-tight tracking-tight drop-shadow-sm">Dein Schicksal im Kosmos</h3>
          <p className="font-sans text-sm md:text-base text-astro-subtext leading-relaxed font-light px-4">
            {hasError 
              ? "Die direkte Bildübertragung wurde unterbrochen, doch deine astrologische Signatur wurde erfolgreich in ein geometrisches Siegel synthetisiert."
              : "Deine Essenz wurde in ein kosmisches Siegel gewebt. Tritt in unsere Astrologie-Sphäre ein und entdecke die verborgenen Pfade deines Seins."}
          </p>
        </div>
        
        <div className="pt-8 border-t border-astro-border/50 w-full flex justify-center relative z-10">
          <button className="group inline-flex items-center gap-4 px-12 py-5 bg-[#0D0D0F] text-white font-serif italic text-xl md:text-2xl rounded-2xl hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 overflow-hidden relative">
            <span className="relative z-10">Zu den Sternen aufbrechen</span>
            <svg className="w-6 h-6 transition-transform group-hover:translate-x-2 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-astro-gold/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"></div>
          </button>
        </div>
      </div>
    </div>
  );
};
