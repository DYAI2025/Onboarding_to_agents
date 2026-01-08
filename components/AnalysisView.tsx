
import React, { useState, useEffect, useRef } from 'react';
import { FusionResult, CalculationState } from '../types';
import { SymbolConfig } from '../services/geminiService';

interface Props {
  result: FusionResult;
  state: CalculationState;
  onGenerateImage: (config: SymbolConfig) => void;
  onNavigateToQuizzes?: () => void;
}

const SUN_SIGN_INSIGHTS: Record<string, string> = {
  "Aries": "Der Urfunke des Seins. Mutig, instinktiv und getrieben von der reinen Kraft des Anfangs.",
  "Taurus": "Der Garten der Sinne. Du verankerst den Geist in der Materie mit unerschütterlicher Beständigkeit.",
  "Gemini": "Der himmlische Bote. Du webst Verbindungen durch die Dualität von Gedanke und Ausdruck.",
  "Cancer": "Das Gefäß der Erinnerung. Du nährt die Wurzeln der Seele mit schützenden lunaren Wassern.",
  "Leo": "Der strahlende Souverän. Du erleuchtest die Welt mit der großzügigen Wärme des kreativen Herzens.",
  "Virgo": "Der heilige Analyst. Du reinigst das Chaotische zum Göttlichen durch Hingabe und Präzision.",
  "Libra": "Der harmonische Spiegel. Du suchst das Gleichgewicht und die Schönheit im Tanz der Beziehungen.",
  "Scorpio": "Der Alchemist der Tiefe. Du transformierst Schatten in Licht durch die Intensität der Erneuerung.",
  "Sagittarius": "Der ewige Sucher. Du erweiterst Horizonte mit dem Pfeil der Wahrheit und dem Feuer der Weisheit.",
  "Capricorn": "Der Gipfel des Berges. Du baust Vermächtnisse von Dauer durch Disziplin und die Meisterschaft der Zeit.",
  "Aquarius": "Der visionäre Architekt. Du gießt die Wasser der Innovation in das kollektive Bewusstsein.",
  "Pisces": "Der grenzenlose Ozean. Du löst Grenzen auf, um mit dem universellen Traum zu verschmelzen."
};

export const AnalysisView: React.FC<Props> = ({ result, state, onGenerateImage, onNavigateToQuizzes }) => {
  const [config, setConfig] = useState<SymbolConfig>({
    influence: 'balanced',
    transparentBackground: true
  });
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Parallax & Mouse States
  const solarSigRef = useRef<HTMLDivElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [autoPulse, setAutoPulse] = useState(0);

  useEffect(() => {
    // Scroll handler for parallax
    const handleScroll = () => {
      if (solarSigRef.current) {
        const rect = solarSigRef.current.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        
        if (rect.top < viewHeight && rect.bottom > 0) {
          const sensitivity = 0.15;
          const centerPoint = (rect.top + rect.height / 2) - (viewHeight / 2);
          setParallaxOffset(centerPoint * sensitivity);
          
          const progress = (centerPoint / (viewHeight / 2));
          setScrollProgress(Math.min(Math.max(progress, -1), 1));
        }
      }
    };
    
    // Auto-pulse animation loop
    let frameId: number;
    const animatePulse = () => {
      const now = Date.now();
      // Sine wave oscillating between 0 and 1 every ~4 seconds
      const wave = (Math.sin(now / 2000) + 1) / 2;
      setAutoPulse(wave);
      frameId = requestAnimationFrame(animatePulse);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    animatePulse();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!solarSigRef.current) return;
    const rect = solarSigRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const sunInsight = SUN_SIGN_INSIGHTS[result.western.sunSign] || "Ein einzigartiges Licht im kosmischen Gefüge.";

  const handleShare = async () => {
    const shareText = `Meine Astro-Fusion Analyse: "${result.synthesisTitle}"\n\n${result.synthesisDescription}\n\nWestern: ${result.western.sunSign} | Eastern: ${result.eastern.yearAnimal}\nElement-Matrix: ${result.elementMatrix}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Astro Fusion Engine Analyse',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setShareFeedback('In die Zwischenablage kopiert!');
        setTimeout(() => setShareFeedback(null), 3000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const normalizedRotation = Math.min(Math.max(parallaxOffset / 12, -8), 8) + (mousePos.y * 10);
  const normalizedRotationY = mousePos.x * 10;
  const dynamicScale = (1 + (0.05 * (1 - Math.abs(scrollProgress)))) + (isHovering ? 0.02 : 0);

  // Dynamic values for depth effects
  const baseGlowColor = config.influence === 'eastern' ? '16, 185, 129' : config.influence === 'western' ? '245, 158, 11' : '212, 175, 55';
  
  // Calculate mouse distance from center (0 to ~0.707)
  const mouseDist = Math.sqrt(mousePos.x ** 2 + mousePos.y ** 2);
  const normalizedMouseDist = Math.min(mouseDist * 2, 1); // Normalize to roughly 0-1

  // Dynamic Glow Calculation: Combine auto-pulse with mouse/scroll interaction
  // Base intensity oscillates between 0.15 and 0.35 independently of interaction
  const pulseFactor = 0.15 + (autoPulse * 0.2); 
  const glowAlpha = (pulseFactor + Math.abs(scrollProgress) * 0.15 + (normalizedMouseDist * 0.4));
  
  const glowHueShift = 135 + scrollProgress * 45 + (normalizedMouseDist * 15) + (autoPulse * 20);
  const blurAmount = Math.abs(scrollProgress) * 4 + (normalizedMouseDist * 2) + (autoPulse * 4);

  return (
    <div className="space-y-16 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="inline-block px-3 py-1 border border-green-200 bg-green-50 text-green-700 text-[10px] tracking-widest uppercase rounded-full dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
          ✅ Systeme Synchronisiert
        </div>
        <h2 className="font-serif text-5xl text-astro-text tracking-tight">Analyse & Erkenntnis</h2>
        <p className="font-sans text-astro-subtext max-w-lg mx-auto leading-relaxed">
          Mysterium und Klarheit vereint. Finde deine wahre Natur durch reflektierte Analysen und persönliche Erkenntnisse.
        </p>
      </div>

      <div className="bg-astro-card border border-astro-border rounded-[3rem] p-10 md:p-14 shadow-elevated relative overflow-hidden transition-all duration-700">
        <div className="absolute top-8 left-8 z-20">
          <button 
            onClick={handleShare}
            className="group flex items-center gap-2 px-5 py-2.5 bg-white/50 dark:bg-zinc-800/50 border border-astro-border rounded-full hover:border-astro-gold transition-all duration-300 shadow-sm"
          >
            <span className="text-sm group-hover:scale-110 transition-transform">📤</span>
            <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-astro-subtext group-hover:text-astro-gold">Exportieren</span>
          </button>
          {shareFeedback && (
            <div className="absolute top-12 left-0 mt-2 bg-astro-text text-white text-[9px] px-3 py-1 rounded-full whitespace-nowrap animate-fade-in">
              {shareFeedback}
            </div>
          )}
        </div>

        <div className="text-center mb-16 relative z-10">
          <span className="font-sans text-[11px] tracking-[0.4em] text-astro-gold uppercase mb-4 block font-black">Synthese-Matrix</span>
          <h3 className="font-serif text-6xl text-astro-text mb-8 tracking-tighter">{result.synthesisTitle}</h3>
          <p className="font-sans text-xl text-astro-subtext max-w-2xl mx-auto leading-relaxed opacity-80 font-light">
            "{result.synthesisDescription}"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-p-violet/20 backdrop-blur-md border border-astro-border rounded-[2.5rem] p-10 transition-transform hover:scale-[1.01] duration-500">
            <h5 className="font-serif text-2xl text-astro-text mb-6 border-b border-astro-border/50 pb-4">Westliche Sphäre</h5>
            <div className="space-y-4 font-sans text-[10px]">
              {[
                { label: 'Sonnenzeichen', val: result.western.sunSign },
                { label: 'Aszendent', val: result.western.ascendant },
                { label: 'Element', val: result.western.element }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-astro-subtext uppercase tracking-widest font-bold">{item.label}</span>
                  <span className="font-serif italic text-xl text-astro-text">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-p-sage/20 backdrop-blur-md border border-astro-border rounded-[2.5rem] p-10 transition-transform hover:scale-[1.01] duration-500">
            <h5 className="font-serif text-2xl text-astro-text mb-6 border-b border-astro-border/50 pb-4">Östlicher Pfad</h5>
            <div className="space-y-4 font-sans text-[10px]">
              {[
                { label: 'Wächter-Tier', val: result.eastern.yearAnimal },
                { label: 'Basis-Element', val: result.eastern.yearElement },
                { label: 'Tages-Meister', val: result.eastern.dayElement },
                ...(result.eastern.dayStem ? [{ label: 'Himmelsstamm', val: result.eastern.dayStem }] : []),
                ...(result.eastern.dayPolarity ? [{ label: 'Polarität', val: result.eastern.dayPolarity }] : [])
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-astro-subtext uppercase tracking-widest font-bold">{item.label}</span>
                  <span className="font-serif italic text-xl text-astro-text">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- REFINED SOLAR SIGNATURE WITH DYNAMIC REACTIVE GLOW --- */}
        <div 
          ref={solarSigRef} 
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setMousePos({ x: 0, y: 0 });
          }}
          className={`
            bg-white/40 dark:bg-zinc-900/40 border rounded-[3.5rem] text-center backdrop-blur-2xl relative overflow-hidden group min-h-[450px] flex items-center justify-center transition-all duration-700 perspective-1000
            ${isHovering ? 'border-astro-gold shadow-[0_45px_100px_rgba(212,175,55,0.25)]' : 'border-astro-border shadow-elevated'}
          `}
        >
           {/* Primary Dynamic Gradient - Intensity and Hue reactive to Time (Pulse) and Mouse */}
           <div 
             className="absolute inset-0 pointer-events-none transition-all duration-1000 will-change-[background,opacity,filter]"
             style={{
               background: `linear-gradient(${glowHueShift}deg, rgba(${baseGlowColor},${glowAlpha}) 0%, transparent 50%, rgba(245,243,255,${glowAlpha * 0.5}) 100%)`,
               opacity: isHovering ? 1 : 0.8,
               filter: `blur(${blurAmount}px)`
             }}
           ></div>

           {/* Central "Quiet" Radial Mask - Ensures clarity in the center */}
           <div 
             className="absolute inset-0 pointer-events-none transition-opacity duration-700"
             style={{
               background: `radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,${0.02 * (0.5 + autoPulse * 0.5)}) 100%)`,
               opacity: isHovering ? 1 : 0
             }}
           ></div>

           {/* Floating Light Bloom - Tracks Mouse & Pulses */}
           <div 
             className={`absolute inset-[-80%] transition-opacity duration-1000 pointer-events-none will-change-transform ${isHovering ? 'opacity-100' : 'opacity-60'}`}
             style={{ 
               background: `radial-gradient(circle at ${50 + mousePos.x * 25}% ${50 + mousePos.y * 25}%, rgba(${baseGlowColor},${0.15 + autoPulse * 0.1}) 0%, rgba(253,248,232,0.01) 60%, transparent 90%)`,
               transform: `translateY(${parallaxOffset * -5}px) scale(${1.4 + Math.abs(parallaxOffset) * 0.003 + autoPulse * 0.05}) rotate(${parallaxOffset * -0.15}deg)` 
             }}
           ></div>

           <div 
             className="relative z-10 p-12 will-change-transform transition-all duration-500 ease-out flex flex-col items-center"
             style={{ 
               transform: `translateY(${parallaxOffset * 1.5}px) scale(${dynamicScale}) rotateX(${normalizedRotation}deg) rotateY(${normalizedRotationY}deg)` 
             }}
           >
              <div className="inline-flex items-center gap-4 mb-8">
                <span className={`w-1.5 h-1.5 rounded-full bg-astro-gold transition-all duration-500 animate-pulse-soft ${isHovering ? 'scale-150 shadow-[0_0_12px_#D4AF37]' : ''}`}></span>
                <span className="font-serif text-[18px] italic tracking-[0.2em] text-astro-gold font-medium transition-all duration-700 group-hover:tracking-[0.3em]">
                  Solar-Signatur: {result.western.sunSign}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full bg-astro-gold transition-all duration-500 animate-pulse-soft ${isHovering ? 'scale-150 shadow-[0_0_12px_#D4AF37]' : ''}`} style={{ animationDelay: '1.5s' }}></span>
              </div>
              
              <div className="relative group/text cursor-default">
                <p className="font-sans font-light text-astro-text text-3xl md:text-6xl leading-tight opacity-95 max-w-4xl mx-auto drop-shadow-xl select-none transition-all duration-700 group-hover/text:scale-[1.02] group-hover/text:text-astro-gold tracking-tight">
                  "{sunInsight}"
                </p>
              </div>
              
              <div 
                className={`mt-10 h-1 transition-all duration-1000 bg-gradient-to-r from-transparent via-astro-gold/40 to-transparent`}
                style={{
                  width: isHovering ? '12rem' : '5rem',
                  opacity: 0.5 + autoPulse * 0.5
                }}
              ></div>
           </div>
        </div>

        {/* --- GENERATOR CONFIGURATION SECTION --- */}
        <div className="mt-16 bg-astro-bg/30 rounded-[2.5rem] p-10 border border-astro-border animate-fade-in-up">
           <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="text-center md:text-left">
                 <h4 className="font-serif text-3xl text-astro-text mb-1">Generator-Konfiguration</h4>
                 <p className="font-sans text-[10px] uppercase tracking-widest text-astro-subtext font-bold">Gewichtung der kosmischen Einflüsse</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="text-[9px] uppercase tracking-widest text-astro-subtext font-bold">Hintergrund:</div>
                    <button 
                      onClick={() => setConfig(prev => ({ ...prev, transparentBackground: !prev.transparentBackground }))}
                      className={`px-4 py-1.5 rounded-full border text-[9px] uppercase tracking-widest font-black transition-all ${config.transparentBackground ? 'bg-astro-text text-white border-astro-text' : 'bg-white text-astro-subtext border-astro-border hover:border-astro-gold'}`}
                    >
                      {config.transparentBackground ? 'Minimal' : 'Ambient'}
                    </button>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'western', label: 'Westlich', icon: '♈', desc: 'Fokus auf solare Geometrie & Tierkreis-Elemente.', accent: 'border-amber-400', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]' },
                { id: 'balanced', label: 'Balance', icon: '☯', desc: 'Perfekte Symbiose beider astrologischen Welten.', accent: 'border-astro-gold', glow: 'shadow-ambient' },
                { id: 'eastern', label: 'Östlich', icon: '🐉', desc: 'Fokus auf Ba Zi Wächter-Tier & 5-Elemente-Fluss.', accent: 'border-emerald-500', glow: 'shadow-[0_0_25px_rgba(16,185,129,0.3)]' },
              ].map((opt) => {
                const isActive = config.influence === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setConfig(prev => ({ ...prev, influence: opt.id as any }))}
                    className={`group relative text-left p-6 rounded-[2rem] border-2 transition-all duration-500 overflow-hidden ${isActive ? `bg-white ${opt.accent} ${opt.glow} scale-[1.03]` : 'bg-white/50 border-astro-border hover:border-astro-gold/40'}`}
                  >
                    <div className="relative z-10">
                       <div className="flex items-center justify-between mb-3">
                          <span className={`text-3xl transition-transform duration-500 ${isActive ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`}>{opt.icon}</span>
                          {isActive && <div className={`w-2 h-2 rounded-full ${opt.id === 'eastern' ? 'bg-emerald-500' : 'bg-astro-gold'}`}></div>}
                       </div>
                       <div className={`font-serif text-2xl mb-1 transition-colors ${isActive ? (opt.id === 'eastern' ? 'text-emerald-700' : 'text-astro-gold') : 'text-astro-text'}`}>{opt.label}</div>
                       <p className="font-sans text-[10px] text-astro-subtext leading-relaxed tracking-wider font-medium">{opt.desc}</p>
                    </div>
                    {isActive && (
                       <div className={`absolute top-0 right-0 w-20 h-20 ${opt.id === 'eastern' ? 'bg-emerald-500/5' : 'bg-astro-gold/5'} rounded-bl-full pointer-events-none`}></div>
                    )}
                  </button>
                );
              })}
           </div>
           
           {config.influence === 'eastern' && (
             <div className="mt-8 p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 animate-fade-in flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">🐉</div>
                   <div>
                      <div className="font-serif text-lg text-emerald-900 dark:text-emerald-100">Östlicher Fokus Aktiviert</div>
                      <p className="text-[10px] font-sans text-emerald-600/70 uppercase tracking-widest font-bold">Elementarer Fluss & Wächter-Resonanz</p>
                   </div>
                </div>
                <div className="px-4 py-2 bg-emerald-600 text-white rounded-full text-[9px] uppercase tracking-widest font-black shadow-lg">
                   Deep Synthesis Matrix
                </div>
             </div>
           )}
        </div>

        {/* --- CTA SECTION --- */}
        <div className="mt-16 pt-16 border-t border-astro-border flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="max-w-md text-center md:text-left">
              <h4 className="font-serif text-4xl text-astro-text mb-4">Der uralte Wächter</h4>
              <p className="font-sans text-sm text-astro-subtext leading-relaxed font-light">
                Jede Seele wird von einer archaischen Kraft begleitet. Welches Wesen spiegelt dein innerstes Wesen wider?
              </p>
           </div>
           
           <button 
             onClick={onNavigateToQuizzes}
             className="group relative px-10 py-5 bg-[#0D0D0F] text-white rounded-2xl font-serif italic text-2xl shadow-elevated hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
           >
             <span className="relative z-10">Wächter entdecken</span>
             <div className="absolute inset-0 bg-gradient-to-r from-astro-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
             <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:rotate-12 transition-transform">✦</div>
           </button>
        </div>

        <div className="mt-16 text-center">
           <button 
             onClick={() => onGenerateImage(config)}
             disabled={state === CalculationState.GENERATING_IMAGE || state === CalculationState.FINISHED}
             className="px-12 py-5 bg-astro-text text-white font-serif italic text-xl rounded-2xl shadow-elevated hover:bg-black transition-all duration-500 disabled:opacity-50 relative overflow-hidden group"
           >
             <span className="relative z-10">
               {state === CalculationState.GENERATING_IMAGE ? 'Kosmische Webung...' : 'Meisterwerk erschaffen'}
             </span>
             <div className="absolute inset-0 bg-gradient-to-r from-astro-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
           </button>
        </div>
      </div>
    </div>
  );
};
