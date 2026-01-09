
import React, { useRef, useEffect } from 'react';
import { FusionResult } from '../types';
import { SmartImage } from './SmartImage';

interface Props {
  result: FusionResult;
  symbolUrl: string;
  onAgentSelect: (agentId: string) => void;
}

export const AgentSelectionView: React.FC<Props> = ({ result, symbolUrl, onAgentSelect }) => {
  
  // Audio Ref for the Gong
  const gongRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize Audio Object
    // Using a reliable public domain gong sound
    gongRef.current = new Audio('https://cdn.freesound.org/previews/26/26777_189914-lq.mp3');
  }, []);

  const handleSelection = (agentId: string) => {
    if (gongRef.current) {
      const audio = gongRef.current;
      audio.currentTime = 0;
      audio.volume = 1.0;
      audio.play().catch(e => console.error("Audio play failed", e));

      // Implement the "Slow Fade Out" logic manually
      // We start fading after 2 seconds to let the impact hit, then fade over 3 seconds
      setTimeout(() => {
        const fadeInterval = setInterval(() => {
            if (audio.volume > 0.05) {
                audio.volume -= 0.05;
            } else {
                audio.volume = 0;
                audio.pause();
                clearInterval(fadeInterval);
            }
        }, 150); // Steps to reduce volume
      }, 2000);
    }
    
    // Trigger navigation
    onAgentSelect(agentId);
  };

  return (
    <div className="min-h-screen bg-[#0F1014] text-gray-300 font-sans p-6 md:p-12 relative overflow-hidden animate-fade-in">
      
      {/* Background Ambience - Darker for contrast */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* --- HEADER SECTION --- */}
      <div className="max-w-7xl mx-auto mb-20 relative z-10">
        
        {/* Navigation / Meta */}
        <div className="flex justify-between items-center mb-16">
            <div className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black">System v.7.0</div>
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></span>
                <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">Uplink Established</span>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
            
            {/* LARGE SYMBOL DISPLAY */}
            <div className="relative group shrink-0 order-1 lg:order-1">
                 {/* Decorative rings */}
                 <div className="absolute inset-[-40px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
                 <div className="absolute inset-[-20px] border border-white/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
                 
                 {/* Main Container */}
                 <div className="w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full border border-white/10 bg-[#1E293B]/20 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden transition-transform duration-700 hover:scale-[1.02]">
                    <div className="w-[80%] h-[80%] rounded-full overflow-hidden relative z-10 border border-white/10 bg-black/40 shadow-2xl flex items-center justify-center">
                         <SmartImage 
                           src={symbolUrl} 
                           alt="Cosmic Fusion Symbol" 
                           className="w-[125%] h-[125%] max-w-none object-cover transition-transform duration-[2s] ease-in-out group-hover:scale-[1.35] group-hover:rotate-3" 
                           priority={true}
                         />
                    </div>
                    {/* Gloss effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none z-20"></div>
                 </div>

                 {/* Label Badge */}
                 <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#0F1014] border border-astro-gold/30 px-8 py-4 rounded-full backdrop-blur-md whitespace-nowrap shadow-xl flex items-center gap-3 z-30">
                    <span className="text-2xl text-astro-gold">✦</span>
                    <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-astro-gold font-bold">Dein Kosmisches Siegel</div>
                        <div className="text-[8px] text-slate-500 font-mono tracking-widest">VERIFIED_UNIQUE</div>
                    </div>
                 </div>
            </div>

            {/* Title & Context */}
            <div className="text-center lg:text-left max-w-2xl order-2 lg:order-2">
                <h1 className="font-serif text-5xl md:text-7xl text-white tracking-tight mb-8 leading-[0.9] drop-shadow-lg">
                  Wähle deine <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-astro-gold italic">Intelligenz</span>
                </h1>
                
                <div className="text-lg text-slate-400 font-light leading-relaxed mb-10 space-y-6">
                  <p>
                    Deine Fusion aus <strong className="text-white font-serif italic text-xl">{result.western.sunSign}</strong> (Westlich) und <strong className="text-white font-serif italic text-xl">{result.eastern.yearAnimal}</strong> (Östlich) bildet eine einzigartige energetische Signatur.
                  </p>
                  <p className="opacity-70 text-sm md:text-base border-l-2 border-astro-gold/30 pl-4">
                    Während die westliche Astrologie deine psychologische Struktur und den solaren Willen definiert, offenbart das östliche Ba Zi die elementaren Rhythmen und das Fundament deines Schicksals. Zusammen weben sie die Matrix deiner wahren Potentiale.
                  </p>
                  <p className="text-astro-gold/80 font-medium text-xl font-serif italic pt-2">
                    Wähle deinen persönlichen Astro-Consultant für tiefgehende Einblicke und einen astrologischen Deep-Dive.
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                   <div className="px-5 py-2.5 bg-white/5 rounded-xl border border-white/5 text-xs font-mono text-slate-400 flex items-center gap-2 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-astro-gold rounded-full"></span>
                      ID: {result.synthesisTitle.split(' ').slice(0, 2).join('_').toUpperCase()}
                   </div>
                   <div className="px-5 py-2.5 bg-white/5 rounded-xl border border-white/5 text-xs font-mono text-slate-400 flex items-center gap-2 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      MATRIX: {result.elementMatrix}
                   </div>
                </div>
            </div>

        </div>
      </div>

      {/* --- AGENT CARDS --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 pb-20 mt-28">
         
         {/* AGENT 1: LEVI BAZI - HEAVY BRONZE PLATE STYLE */}
         <div 
            onClick={() => handleSelection('levi')}
            className="group relative cursor-pointer transform hover:-translate-y-2 transition-transform duration-500"
         >
            {/* The Bronze Plate Container */}
            <div className="relative rounded-[2.5rem] p-10 overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] transition-all duration-500 group-hover:shadow-[0_35px_60px_-15px_rgba(212,175,55,0.15)]
                 bg-gradient-to-br from-[#785a3c] via-[#a88856] to-[#4a3420]
                 border-t border-l border-[#d4af37]/40 border-b-[6px] border-r-[6px] border-[#2a1b0e]/60"
            >
                {/* Brushed Metal Texture Overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum-dark.png')] mix-blend-overlay pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20 pointer-events-none mix-blend-overlay"></div>

                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-700 mix-blend-multiply">
                   <span className="text-9xl text-[#2a1b0e]">🐉</span>
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                       <span className="text-[9px] uppercase tracking-[0.3em] font-black text-[#3e2718] drop-shadow-[0_1px_0_rgba(255,255,255,0.2)]">Quantum_BaZi_Protocols</span>
                       <div className="w-2 h-2 rounded-full bg-[#3e2718] shadow-inner"></div>
                    </div>

                    {/* Engraved Text Effect */}
                    <h2 className="font-serif text-5xl mb-4 text-[#2a1b0e] font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,0.2)]" style={{ textShadow: 'inset 1px 1px 2px rgba(0,0,0,0.5)' }}>
                        Levi Bazi
                    </h2>
                    
                    <div className="flex gap-2 mb-8">
                       {['BAZI', 'ELEMENTS', 'CYCLES', 'FUSION'].map(tag => (
                          <span key={tag} className="text-[9px] uppercase tracking-widest text-[#3e2718] border border-[#3e2718]/20 px-3 py-1.5 rounded-lg bg-[#3e2718]/5 font-bold drop-shadow-[0_1px_0_rgba(255,255,255,0.2)]">{tag}</span>
                       ))}
                    </div>

                    <div className="bg-[#2a1b0e]/10 border border-[#2a1b0e]/10 p-6 rounded-2xl mb-8 shadow-inner">
                       <p className="font-sans text-sm text-[#1a0f05] leading-relaxed italic font-medium drop-shadow-[0_1px_0_rgba(255,255,255,0.1)]">
                          "Eine tiefe, ruhige männliche Stimme mit einem scharfen, systematischen Ansatz für Berechnung und Synthese. Ich analysiere die strukturelle Integrität deiner Schicksalsmatrix."
                       </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[#3e2718]/10">
                       <ul className="space-y-3">
                          <li className="flex items-center gap-3 text-sm text-[#2a1b0e] font-semibold">
                             <span className="text-[#3e2718] opacity-60 group-hover:opacity-100 transition-opacity">✓</span> Ruhige männliche Präsenz
                          </li>
                          <li className="flex items-center gap-3 text-sm text-[#2a1b0e] font-semibold">
                             <span className="text-[#3e2718] opacity-60 group-hover:opacity-100 transition-opacity">✓</span> Experte für Ba Zi & Fusion
                          </li>
                       </ul>
                    </div>

                    <div className="absolute bottom-8 right-8 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 opacity-80 group-hover:opacity-100">
                       <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#2a1b0e] to-[#0f0803] text-[#d4af37] flex items-center justify-center text-2xl shadow-[0_4px_8px_rgba(0,0,0,0.4)] border border-[#d4af37]/20">
                          →
                       </div>
                    </div>
                </div>
            </div>
         </div>

         {/* AGENT 2: VICTORIA CELESTIA - HEAVY BRONZE PLATE STYLE */}
         <div 
            onClick={() => handleSelection('victoria')}
            className="group relative cursor-pointer transform hover:-translate-y-2 transition-transform duration-500"
         >
             {/* The Bronze Plate Container */}
            <div className="relative rounded-[2.5rem] p-10 overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] transition-all duration-500 group-hover:shadow-[0_35px_60px_-15px_rgba(212,175,55,0.15)]
                 bg-gradient-to-br from-[#785a3c] via-[#a88856] to-[#4a3420]
                 border-t border-l border-[#d4af37]/40 border-b-[6px] border-r-[6px] border-[#2a1b0e]/60"
            >
                {/* Brushed Metal Texture Overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum-dark.png')] mix-blend-overlay pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20 pointer-events-none mix-blend-overlay"></div>

                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:-rotate-12 duration-700 mix-blend-multiply">
                   <span className="text-9xl text-[#2a1b0e]">⚖️</span>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                       <span className="text-[9px] uppercase tracking-[0.3em] font-black text-[#3e2718] drop-shadow-[0_1px_0_rgba(255,255,255,0.2)]">Celestial_Relationship_Module</span>
                       <div className="w-2 h-2 rounded-full bg-[#3e2718] shadow-inner"></div>
                    </div>

                    {/* Engraved Text Effect */}
                    <h2 className="font-serif text-5xl mb-4 text-[#2a1b0e] font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,0.2)]" style={{ textShadow: 'inset 1px 1px 2px rgba(0,0,0,0.5)' }}>
                        Victoria Celestia
                    </h2>
                    
                    <div className="flex gap-2 mb-8 flex-wrap">
                       {['RELATIONSHIPS', 'CAREER', 'SYNASTRY'].map(tag => (
                          <span key={tag} className="text-[9px] uppercase tracking-widest text-[#3e2718] border border-[#3e2718]/20 px-3 py-1.5 rounded-lg bg-[#3e2718]/5 font-bold drop-shadow-[0_1px_0_rgba(255,255,255,0.2)]">{tag}</span>
                       ))}
                    </div>

                    <div className="bg-[#2a1b0e]/10 border border-[#2a1b0e]/10 p-6 rounded-2xl mb-8 shadow-inner">
                       <p className="font-sans text-sm text-[#1a0f05] leading-relaxed italic font-medium drop-shadow-[0_1px_0_rgba(255,255,255,0.1)]">
                          "Eine warme weibliche Stimme, fokussiert auf Beziehungsdynamik und Berufsastrologie — klar, unterstützend und geerdet."
                       </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[#3e2718]/10">
                       <ul className="space-y-3">
                          <li className="flex items-center gap-3 text-sm text-[#2a1b0e] font-semibold">
                             <span className="text-[#3e2718] opacity-60 group-hover:opacity-100 transition-opacity">✓</span> Warme weibliche Stimme
                          </li>
                          <li className="flex items-center gap-3 text-sm text-[#2a1b0e] font-semibold">
                             <span className="text-[#3e2718] opacity-60 group-hover:opacity-100 transition-opacity">✓</span> Fokus auf Beziehungen & Beruf
                          </li>
                       </ul>
                    </div>

                    <div className="absolute bottom-8 right-8 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 opacity-80 group-hover:opacity-100">
                       <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#2a1b0e] to-[#0f0803] text-[#d4af37] flex items-center justify-center text-2xl shadow-[0_4px_8px_rgba(0,0,0,0.4)] border border-[#d4af37]/20">
                          →
                       </div>
                    </div>
                </div>
            </div>
         </div>

      </div>

      {/* --- FOOTER / DISCLAIMER --- */}
      <div className="max-w-4xl mx-auto text-center border-t border-white/5 pt-12 pb-6">
         <div className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-black mb-4">Transparency Protocol</div>
         <p className="text-[9px] text-slate-600 leading-relaxed max-w-2xl mx-auto">
            The astrological and calculating agents provided herein are for entertainment and reflective purposes only. They do not predict the future with absolute certainty nor do they offer professional financial, legal, or medical advice. User discretion is advised when interpreting quantum synthesis outputs.
         </p>
         
         <div className="mt-8 flex justify-between items-center px-8 opacity-20 hover:opacity-100 transition-opacity">
             <div className="w-8 h-8 rounded-full bg-emerald-900/10 flex items-center justify-center text-emerald-800 font-bold">⚡</div>
             <div className="w-8 h-8 rounded-full bg-yellow-900/10 flex items-center justify-center text-yellow-800 font-bold font-serif">1</div>
         </div>
      </div>
    </div>
  );
};
