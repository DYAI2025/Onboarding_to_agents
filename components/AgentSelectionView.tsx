
import React from 'react';
import { FusionResult } from '../types';

interface Props {
  result: FusionResult;
  symbolUrl: string;
  onAgentSelect: (agentId: string) => void;
}

export const AgentSelectionView: React.FC<Props> = ({ result, symbolUrl, onAgentSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#334155] via-[#1E293B] to-[#0F172A] text-gray-300 font-sans p-6 md:p-12 relative overflow-hidden animate-fade-in">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-astro-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* --- HEADER SECTION --- */}
      <div className="max-w-7xl mx-auto mb-20 relative z-10">
        
        {/* Navigation / Meta */}
        <div className="flex justify-between items-center mb-16">
            <div className="text-[10px] uppercase tracking-[0.4em] text-slate-300 font-black">System v.7.0</div>
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></span>
                <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold">Uplink Established</span>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
            
            {/* LARGE SYMBOL DISPLAY */}
            <div className="relative group shrink-0 order-1 lg:order-1">
                 {/* Decorative rings */}
                 <div className="absolute inset-[-40px] border border-white/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
                 <div className="absolute inset-[-20px] border border-white/20 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
                 
                 {/* Main Container */}
                 <div className="w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full border border-white/20 bg-[#1E293B]/40 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.3)] p-4 relative overflow-hidden transition-transform duration-700 hover:scale-[1.02]">
                    <div className="w-full h-full rounded-full overflow-hidden relative z-10 border border-white/10 bg-black/20">
                         <img 
                           src={symbolUrl} 
                           alt="Cosmic Fusion Symbol" 
                           className="w-full h-full object-cover transition-transform duration-[2s] ease-in-out group-hover:scale-110 group-hover:rotate-3" 
                         />
                    </div>
                    {/* Gloss effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none z-20"></div>
                 </div>

                 {/* Label Badge */}
                 <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#1E293B] border border-astro-gold/30 px-8 py-4 rounded-full backdrop-blur-md whitespace-nowrap shadow-xl flex items-center gap-3">
                    <span className="text-2xl text-astro-gold">✦</span>
                    <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-astro-gold font-bold">Dein Kosmisches Siegel</div>
                        <div className="text-[8px] text-slate-400 font-mono tracking-widest">VERIFIED_UNIQUE</div>
                    </div>
                 </div>
            </div>

            {/* Title & Context */}
            <div className="text-center lg:text-left max-w-2xl order-2 lg:order-2">
                <h1 className="font-serif text-5xl md:text-7xl text-white tracking-tight mb-8 leading-[0.9] drop-shadow-lg">
                  Wähle deine <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-astro-gold italic">Intelligenz</span>
                </h1>
                <p className="text-lg text-slate-300 font-light leading-relaxed mb-10">
                  Deine Fusion aus <strong className="text-white font-serif italic text-xl">{result.western.sunSign}</strong> (Westlich) und <strong className="text-white font-serif italic text-xl">{result.eastern.yearAnimal}</strong> (Östlich) wurde erfolgreich in das System integriert. 
                  <br className="hidden md:block" />
                  Wähle nun das Interface, das dich auf deiner Reise begleiten soll.
                </p>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                   <div className="px-5 py-2.5 bg-white/10 rounded-xl border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-2 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-astro-gold rounded-full"></span>
                      ID: {result.synthesisTitle.split(' ').slice(0, 2).join('_').toUpperCase()}
                   </div>
                   <div className="px-5 py-2.5 bg-white/10 rounded-xl border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-2 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      MATRIX: {result.elementMatrix}
                   </div>
                </div>
            </div>

        </div>
      </div>

      {/* --- AGENT CARDS --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 pb-20 mt-28">
         
         {/* AGENT 1: LEVI BAZI */}
         <div 
            onClick={() => onAgentSelect('levi')}
            className="bg-[#1E293B]/60 border border-white/10 rounded-[2.5rem] p-10 hover:border-astro-gold/40 hover:bg-[#1E293B]/80 transition-all duration-500 group relative overflow-hidden cursor-pointer backdrop-blur-md shadow-lg"
         >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity transform group-hover:rotate-12 duration-700">
               <span className="text-8xl grayscale">🐉</span>
            </div>
            
            <div className="flex items-center gap-2 mb-8">
               <span className="text-[9px] uppercase tracking-[0.3em] font-black text-slate-300 group-hover:text-astro-gold transition-colors">Quantum_BaZi_Protocols</span>
               <div className="w-1.5 h-1.5 rounded-full bg-astro-gold"></div>
            </div>

            <h2 className="font-serif text-5xl text-white mb-4 group-hover:text-astro-gold transition-colors">Levi Bazi</h2>
            <div className="flex gap-2 mb-8">
               {['BAZI', 'ELEMENTS', 'CYCLES', 'FUSION'].map(tag => (
                  <span key={tag} className="text-[9px] uppercase tracking-widest text-slate-300 border border-white/20 px-3 py-1.5 rounded-lg bg-white/5">{tag}</span>
               ))}
            </div>

            <div className="bg-[#0F172A]/50 border border-white/10 p-6 rounded-2xl mb-8 group-hover:border-white/20 transition-colors">
               <p className="font-sans text-sm text-slate-200 leading-relaxed italic">
                  "Eine tiefe, ruhige männliche Stimme mit einem scharfen, systematischen Ansatz für Berechnung und Synthese. Ich analysiere die strukturelle Integrität deiner Schicksalsmatrix."
               </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
               <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                     <span className="text-astro-gold opacity-0 group-hover:opacity-100 transition-opacity">✓</span> Ruhige männliche Präsenz
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                     <span className="text-astro-gold opacity-0 group-hover:opacity-100 transition-opacity">✓</span> Experte für Ba Zi & Fusion
                  </li>
               </ul>
            </div>

            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
               <div className="w-12 h-12 rounded-full bg-astro-gold text-[#0F172A] flex items-center justify-center text-xl shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                  →
               </div>
            </div>
         </div>

         {/* AGENT 2: VICTORIA CELESTIA */}
         <div 
            onClick={() => onAgentSelect('victoria')}
            className="bg-[#1E293B]/60 border border-white/10 rounded-[2.5rem] p-10 hover:border-astro-gold/40 hover:bg-[#1E293B]/80 transition-all duration-500 group relative overflow-hidden cursor-pointer backdrop-blur-md shadow-lg"
         >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity transform group-hover:-rotate-12 duration-700">
               <span className="text-8xl grayscale">⚖️</span>
            </div>

            <div className="flex items-center gap-2 mb-8">
               <span className="text-[9px] uppercase tracking-[0.3em] font-black text-slate-300 group-hover:text-astro-gold transition-colors">Celestial_Relationship_Module</span>
               <div className="w-1.5 h-1.5 rounded-full bg-astro-gold"></div>
            </div>

            <h2 className="font-serif text-5xl text-white mb-4 group-hover:text-astro-gold transition-colors">Victoria Celestia</h2>
            <div className="flex gap-2 mb-8 flex-wrap">
               {['RELATIONSHIPS', 'CAREER', 'SYNASTRY'].map(tag => (
                  <span key={tag} className="text-[9px] uppercase tracking-widest text-slate-300 border border-white/20 px-3 py-1.5 rounded-lg bg-white/5">{tag}</span>
               ))}
            </div>

            <div className="bg-[#0F172A]/50 border border-white/10 p-6 rounded-2xl mb-8 group-hover:border-white/20 transition-colors">
               <p className="font-sans text-sm text-slate-200 leading-relaxed italic">
                  "Eine warme weibliche Stimme, fokussiert auf Beziehungsdynamik und Berufsastrologie — klar, unterstützend und geerdet."
               </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
               <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                     <span className="text-astro-gold opacity-0 group-hover:opacity-100 transition-opacity">✓</span> Warme weibliche Stimme
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                     <span className="text-astro-gold opacity-0 group-hover:opacity-100 transition-opacity">✓</span> Fokus auf Beziehungen & Beruf
                  </li>
               </ul>
            </div>

            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
               <div className="w-12 h-12 rounded-full bg-astro-gold text-[#0F172A] flex items-center justify-center text-xl shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                  →
               </div>
            </div>
         </div>

      </div>

      {/* --- FOOTER / DISCLAIMER --- */}
      <div className="max-w-4xl mx-auto text-center border-t border-white/5 pt-12 pb-6">
         <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mb-4">Transparency Protocol</div>
         <p className="text-[9px] text-slate-500 leading-relaxed max-w-2xl mx-auto">
            The astrological and calculating agents provided herein are for entertainment and reflective purposes only. They do not predict the future with absolute certainty nor do they offer professional financial, legal, or medical advice. User discretion is advised when interpreting quantum synthesis outputs.
         </p>
         
         <div className="mt-8 flex justify-between items-center px-8 opacity-30 hover:opacity-100 transition-opacity">
             <div className="w-8 h-8 rounded-full bg-emerald-900/20 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">⚡</div>
             <div className="w-8 h-8 rounded-full bg-yellow-900/20 flex items-center justify-center text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)] font-bold font-serif">1</div>
         </div>
      </div>
    </div>
  );
};
