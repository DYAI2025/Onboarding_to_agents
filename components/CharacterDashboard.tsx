
import React from 'react';
import { FusionResult, Transit } from '../types';
import { CosmicWeather } from './CosmicWeather';

interface Props {
  result: FusionResult;
  symbolUrl: string; 
  onNavigateToQuizzes: () => void;
  transits?: Transit[]; 
  isLoadingTransits?: boolean;
}

// Helper for random percentages to simulate the "Biometric Matrix"
const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

export const CharacterDashboard: React.FC<Props> = ({ 
  result, 
  symbolUrl, 
  onNavigateToQuizzes, 
  transits = [],
  isLoadingTransits = false
}) => {
  
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#2D2A26] pb-32">
      
      {/* --- Top Status Bar --- */}
      <div className="border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-500">
               Compute Status: Ready • {new Date().toLocaleDateString()}
             </span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-gray-900 transition-colors">Hell</button>
            <button className="bg-[#0B1221] text-white text-[10px] uppercase tracking-[0.2em] font-bold px-6 py-2 rounded-full hover:bg-gray-800 transition-colors">
              Upgrade
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300"></div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pt-12">
        
        {/* --- Header Section --- */}
        <div className="flex justify-between items-end mb-16">
          <div>
             <h1 className="font-serif text-5xl md:text-6xl text-[#1A1A1A] mb-2 tracking-tight">Dein Character Sheet</h1>
             <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-medium">KI-Generiert • Keine Vorhersage</p>
          </div>
          <div className="hidden md:flex relative">
             <input 
               type="text" 
               placeholder="Matrix durchsuchen..." 
               className="bg-[#F5F2EB] rounded-full pl-6 pr-12 py-3 text-xs w-64 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all"
             />
             <svg className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          
          {/* --- LEFT COLUMN: CORE MATRIX (AI Symbol Card) --- */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="sticky top-24">
              <div className="w-full aspect-[3/5] rounded-[3.5rem] overflow-hidden relative shadow-elevated group border border-astro-border bg-[#0D0D0F]">
                {/* Background AI Symbol - Blurred for depth */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-all duration-[15s] ease-linear group-hover:scale-125 opacity-30 blur-2xl scale-110"
                  style={{ backgroundImage: `url(${symbolUrl})` }}
                ></div>
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-12 flex flex-col justify-between text-white z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col items-start">
                       <div className="w-2.5 h-2.5 rounded-full bg-astro-gold mb-2 shadow-[0_0_12px_#D4AF37]"></div>
                       <span className="font-mono text-[9px] tracking-[0.5em] text-astro-gold uppercase font-black">SYNC: ACTIVE</span>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[9px] uppercase tracking-[0.3em] font-bold">
                      Core_Matrix
                    </div>
                  </div>

                  {/* CENTRAL FOCUSED SYMBOL VIEWPORT */}
                  <div className="relative flex flex-col items-center justify-center flex-1">
                    <div className="w-full aspect-square relative flex items-center justify-center">
                       {/* Floating Ring Orbits */}
                       <div className="absolute inset-[-15%] border border-white/5 rounded-full animate-spin-slow opacity-40"></div>
                       <div className="absolute inset-[-5%] border border-white/10 rounded-full animate-[spin_18s_linear_infinite_reverse] opacity-20"></div>
                       <div className="absolute inset-[5%] border border-astro-gold/10 rounded-full animate-[spin_25s_linear_infinite] opacity-30"></div>
                       
                       {/* THE AI GENERATED SYMBOL: THE FOCUS */}
                       <div className="w-[85%] h-[85%] rounded-full overflow-hidden border border-white/20 bg-black/40 backdrop-blur-xl shadow-[0_0_80px_rgba(212,175,55,0.15)] transition-all duration-1000 group-hover:scale-[1.08] relative group/symbol">
                          <img 
                            src={symbolUrl} 
                            alt="Cosmic Identity Symbol" 
                            className="w-full h-full object-cover filter brightness-110 contrast-105 transition-all duration-700 group-hover/symbol:brightness-125"
                          />
                          {/* Inner scanner line simulation */}
                          <div className="absolute top-0 left-0 w-full h-[1px] bg-astro-gold/40 animate-[bounce_5s_infinite] opacity-0 group-hover:opacity-100"></div>
                       </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-3 font-bold">Master Identity</div>
                    <h2 className="font-serif text-5xl mb-6 text-white tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                      {result.synthesisTitle.split(' ').slice(-1)[0] || "Sovereign"}
                    </h2>
                    
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-astro-gold/60 to-transparent mx-auto mb-6"></div>
                    
                    {/* ENHANCED DUAL SYSTEM SIGNATURE BADGE (Written Words) */}
                    <div className="flex justify-center items-center gap-6">
                        <div className="text-right">
                            <div className="text-[8px] uppercase tracking-widest text-white/30 mb-1 font-bold">Western</div>
                            <p className="font-serif italic text-xl text-astro-gold drop-shadow-lg leading-tight mb-0.5">
                                {result.western.sunSign}
                            </p>
                            <p className="font-serif italic text-[10px] text-white/50 leading-tight">
                                {result.western.ascendant}
                            </p>
                        </div>
                        <div className="h-10 w-px bg-white/10"></div>
                        <div className="text-left">
                            <div className="text-[8px] uppercase tracking-widest text-white/30 mb-1 font-bold">Eastern</div>
                            <p className="font-serif italic text-xl text-astro-gold drop-shadow-lg leading-tight mb-0.5">
                                {result.eastern.yearAnimal}
                            </p>
                            <p className="font-serif italic text-[10px] text-white/50 leading-tight">
                                {result.eastern.yearElement}
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 flex justify-center">
                      <div className="px-6 py-2.5 bg-astro-gold/20 border border-astro-gold/30 rounded-full text-[10px] uppercase tracking-[0.4em] font-black backdrop-blur-xl flex items-center gap-3 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                        Status: Verifiziert
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Corner Decors */}
                <div className="absolute top-6 left-6 w-6 h-6 border-l-2 border-t-2 border-white/10"></div>
                <div className="absolute top-6 right-6 w-6 h-6 border-r-2 border-t-2 border-white/10"></div>
                <div className="absolute bottom-6 left-6 w-6 h-6 border-l-2 border-b-2 border-white/10"></div>
                <div className="absolute bottom-6 right-6 w-6 h-6 border-r-2 border-b-2 border-white/10"></div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: THE FEED --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Synthesis Card */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 bg-[#1A1A1A] rounded-full text-white shadow-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <div>
                  <h3 className="font-serif text-3xl text-[#1A1A1A]">Charakter-Synthese</h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-1 font-bold">Multi-Domain Astrology Feed</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { icon: '🐉', label: 'Jahrestier', val: result.eastern.yearAnimal, sub: '+ Core Ba Zi Identity' },
                  { icon: '🐎', label: 'Monatstier', val: result.eastern.monthAnimal, sub: '+ Season & Social Matrix' },
                  { icon: '💎', label: 'Tages-Meister', val: result.eastern.dayElement, sub: '+ Personal Inner Essence' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-[#FDFBF7] rounded-2xl border border-gray-100/50 hover:border-astro-gold/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm border border-gray-100">{item.icon}</div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">{item.label}</div>
                        <div className="font-serif text-xl text-[#1A1A1A]">{item.val}</div>
                      </div>
                    </div>
                    <div className="hidden md:block text-[9px] uppercase tracking-widest text-gray-300 font-bold">{item.sub}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-gray-100 flex justify-between items-center group cursor-default hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-50 group-hover:scale-110 transition-transform"><svg className="w-4 h-4 text-astro-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg></div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Element</span>
                  </div>
                  <span className="font-serif text-xl text-astro-text">{result.western.element}</span>
                </div>
                <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-gray-100 flex justify-between items-center group cursor-default hover:bg-white transition-colors">
                   <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-50 group-hover:scale-110 transition-transform">⭐</div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Konstellation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
                       <span className="text-[8px] uppercase font-bold text-gray-400">Sonne</span>
                       <span className="font-serif italic text-sm text-astro-text">{result.western.sunSign}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
                       <span className="text-[8px] uppercase font-bold text-gray-400">AC</span>
                       <span className="font-serif italic text-sm text-astro-text">{result.western.ascendant}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Ba Zi Pillars Grid */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
               <div className="flex justify-between items-center mb-6 relative z-10">
                 <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#1A1A1A]">Ba Zi Four Pillars Matrix</span>
                 <span className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Core Calibration</span>
               </div>
               <div className="grid grid-cols-4 gap-3 text-center relative z-10">
                 {['Jahr', 'Monat', 'Tag', 'Stunde'].map((col, i) => (
                   <div key={i} className="flex flex-col gap-2">
                      <div className="bg-[#1A1A1A] text-white py-2 rounded-xl text-[9px] uppercase tracking-[0.2em] font-bold">{col}</div>
                      <div className="bg-[#FDFBF7] py-6 border border-gray-100 rounded-xl flex items-center justify-center font-serif text-2xl group-hover:text-astro-gold transition-colors shadow-inner">
                        {i === 0 ? result.eastern.yearAnimal : 
                         i === 1 ? result.eastern.monthAnimal :
                         i === 2 ? '---' : '---'}
                      </div>
                      <div className="bg-[#FDFBF7] py-4 border border-gray-100 rounded-xl flex items-center justify-center font-serif text-gray-400 italic text-base">
                         {i === 0 ? result.eastern.yearElement : 
                          i === 2 ? result.eastern.dayElement : '---'}
                      </div>
                   </div>
                 ))}
               </div>
               {/* Watermark in background */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-serif font-black text-gray-50/50 -z-0 pointer-events-none text-center opacity-5 select-none uppercase tracking-tighter">BAZI</div>
            </div>

            {/* 3. Outer Image Card */}
            <div className="bg-[#F5F2EB] rounded-[2rem] p-10 border border-[#EBE5D9] relative overflow-hidden">
               <div className="flex justify-between items-center mb-10 relative z-10">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-astro-gold animate-pulse"></div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Elementare Signatur</span>
                 </div>
                 <div className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Pillar_Expanded_Details</div>
               </div>
               
               <h3 className="font-serif text-5xl text-[#1A1A1A] mb-12 relative z-10">Äußeres Image</h3>
               
               <div className="grid grid-cols-2 gap-12 relative z-10">
                  {/* Decorative Line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gray-300 to-transparent transform -translate-x-1/2"></div>
                  
                  <div className="group cursor-default">
                    <div className="flex items-center gap-3 mb-3 text-gray-400 text-[10px] uppercase tracking-widest font-black transition-colors group-hover:text-astro-gold">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 10l7-7m0 0l7 7m-7-7v18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                       Himmelsstamm
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-ambient border border-white transition-all group-hover:shadow-elevated">
                       <span className="block font-serif text-2xl text-[#1A1A1A] mb-1">Metall</span>
                       <span className="block font-serif italic text-gray-400 text-lg">(Geng)</span>
                    </div>
                  </div>
                  <div className="group cursor-default">
                    <div className="flex items-center gap-3 mb-3 text-gray-400 text-[10px] uppercase tracking-widest font-black transition-colors group-hover:text-astro-gold">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                       Erdzweig
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-ambient border border-white transition-all group-hover:shadow-elevated">
                       <span className="block font-serif text-2xl text-[#1A1A1A] mb-1">{result.eastern.yearAnimal}</span>
                       <span className="block font-serif italic text-gray-400 text-lg">({result.eastern.yearElement})</span>
                    </div>
                  </div>
               </div>
               
               <div className="mt-12 pt-8 border-t border-gray-300/30 relative z-10">
                 <p className="font-serif italic text-gray-500 text-xl leading-relaxed text-center">
                   "Dein soziales Erbe und der erste Eindruck, den du in der Welt hinterlässt."
                 </p>
               </div>
            </div>

            {/* 4. Dark Resonance Map */}
            <div className="bg-[#0B1221] rounded-[2rem] p-10 text-white relative overflow-hidden group">
               {/* Glow background effect */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-astro-gold/5 rounded-full blur-[100px] group-hover:bg-astro-gold/10 transition-colors duration-1000"></div>

               <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-astro-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      <span className="text-[11px] uppercase tracking-[0.4em] font-black text-white/90">Celestial_Resonance_Map</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono tracking-widest">Geometrische Analyse der Geburtsmatrix</span>
                  </div>
               </div>
               
               <div className="h-64 w-full flex items-center justify-center relative z-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full max-w-[250px] transition-transform duration-1000 group-hover:scale-110">
                    <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2"/>
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#334155" strokeWidth="0.5" />
                    <line x1="50" y1="10" x2="50" y2="90" stroke="#334155" strokeWidth="0.5" />
                    <line x1="10" y1="50" x2="90" y2="50" stroke="#334155" strokeWidth="0.5" />
                    
                    {/* Pulsing Data Polygon */}
                    <polygon points="50,25 75,50 50,65 30,50" fill="rgba(212,175,55,0.25)" stroke="#D4AF37" strokeWidth="1.5">
                       <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" repeatCount="indefinite" />
                    </polygon>
                    <circle cx="50" cy="25" r="2" fill="#D4AF37" className="animate-pulse" />
                    <circle cx="75" cy="50" r="2" fill="#D4AF37" className="animate-pulse" />
                    <circle cx="50" cy="65" r="2" fill="#D4AF37" className="animate-pulse" />
                    <circle cx="30" cy="50" r="2" fill="#D4AF37" className="animate-pulse" />
                  </svg>
                  
                  {/* Labels */}
                  <div className="absolute top-4 text-[9px] uppercase tracking-[0.4em] text-gray-500 font-black">Essenz</div>
                  <div className="absolute bottom-4 text-[9px] uppercase tracking-[0.4em] text-gray-500 font-black">Projektion</div>
                  <div className="absolute left-8 text-[9px] uppercase tracking-[0.4em] text-gray-500 font-black">Reflexion</div>
               </div>
               
               <div className="mt-6 flex justify-between items-end relative z-10">
                  <div className="flex gap-4">
                     <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-astro-gold"></div>
                        <span className="text-[8px] uppercase tracking-widest text-gray-500">Core_Active</span>
                     </div>
                  </div>
                  <span className="text-[9px] font-mono tracking-[0.2em] text-gray-600">SYNC: 100.2ms_READY</span>
               </div>
            </div>

            {/* 5. Quantum Synergy Module */}
            <div className="bg-white rounded-[2rem] p-12 border border-gray-100 shadow-ambient relative overflow-hidden group">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#0B1221] text-white text-[9px] uppercase tracking-[0.4em] px-8 py-2 rounded-b-2xl font-black">
                 Quantum_Synergy_Module
               </div>
               
               <div className="mt-10 text-center relative z-10">
                 <div className="text-[10px] uppercase tracking-[0.5em] text-gray-400 mb-4 font-bold">Synergy Analysis</div>
                 <h3 className="font-serif text-4xl text-[#1A1A1A] mb-10 tracking-tight">CROSS-SYSTEM<br/>COMPATIBILITY</h3>
                 
                 <div className="relative">
                   <span className="absolute -top-10 left-0 text-[140px] font-serif text-gray-50 -z-10 select-none opacity-80 transition-transform group-hover:scale-110 duration-1000">“</span>
                   <p className="font-serif italic text-2xl text-[#1A1A1A] leading-relaxed max-w-xl mx-auto drop-shadow-sm">
                     “Spannungsfeld zwischen hoher Sensibilität (Wasser) und rationaler Struktur (Metall); diplomatische Fassade (Waage) als Schutzschild.”
                   </p>
                   <div className="flex justify-center gap-4 mt-12">
                     <div className="px-5 py-2 bg-[#FDFBF7] rounded-full border border-gray-100 text-[10px] uppercase tracking-widest text-gray-500 font-bold shadow-inner">Source: Ba Zi</div>
                     <div className="px-5 py-2 bg-[#FDFBF7] rounded-full border border-gray-100 text-[10px] uppercase tracking-widest text-gray-500 font-bold shadow-inner">Source: Western</div>
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </div>

        {/* --- FULL WIDTH SECTION: ORACLE --- */}
        <div className="mb-32">
           <div className="text-center mb-16 relative">
             <h2 className="font-serif text-6xl md:text-7xl text-[#1A1A1A] relative z-10 tracking-tight">Heutige Resonanz</h2>
             <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[180px] font-serif font-black text-gray-100 opacity-30 -z-0 pointer-events-none select-none tracking-tighter">ORACLE</span>
             <p className="text-[11px] uppercase tracking-[0.5em] text-astro-gold mt-4 font-black">Daily_Transit_Report</p>
           </div>

           <div className="mb-12">
             <CosmicWeather 
               transits={transits} 
               isLoading={isLoadingTransits} 
               title="Celestial Oracle" 
             />
           </div>

           <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-ambient relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-astro-text rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg group-hover:rotate-6 transition-transform">🤖</div>
                 <div>
                    <div className="text-[11px] uppercase tracking-[0.3em] font-black text-astro-text">KI Agenten_Matrix</div>
                    <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Status: Online_Active</div>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                 <div className="p-8 bg-[#FDFBF7] rounded-[2rem] border border-gray-100 hover:border-astro-gold/30 transition-all cursor-pointer group/card shadow-sm hover:shadow-elevated">
                    <div className="flex justify-between items-center mb-6">
                       <span className="font-serif text-2xl text-astro-text group-hover/card:text-astro-gold transition-colors">ATLAS</span>
                       <span className="text-[9px] px-3 py-1 bg-white border border-gray-200 rounded-full font-bold uppercase tracking-widest text-gray-400">BA ZI</span>
                    </div>
                    <p className="font-serif italic text-gray-500 text-lg mb-8">Analytische Matrix-Schnittstelle für komplexe Elementarflüsse.</p>
                    <div className="py-4 w-full border border-gray-200 rounded-xl text-center text-[10px] uppercase tracking-[0.2em] font-black bg-white group-hover/card:bg-astro-text group-hover/card:text-white group-hover/card:border-transparent transition-all">
                       Agent_Vorstellen
                    </div>
                 </div>
                 <div className="p-8 bg-[#FDFBF7] rounded-[2rem] border border-gray-100 hover:border-astro-gold/30 transition-all cursor-pointer group/card shadow-sm hover:shadow-elevated">
                    <div className="flex justify-between items-center mb-6">
                       <span className="font-serif text-2xl text-astro-text group-hover/card:text-astro-gold transition-colors">VIKA</span>
                       <span className="text-[9px] px-3 py-1 bg-astro-text text-white rounded-full font-bold uppercase tracking-widest">WESTLICH</span>
                    </div>
                    <p className="font-serif italic text-gray-500 text-lg mb-8">Harmonische Resonanz-Einheit für seelische Gleichklang-Analyse.</p>
                    <div className="py-4 w-full bg-astro-text text-white rounded-xl text-center text-[10px] uppercase tracking-[0.2em] font-black shadow-lg hover:bg-black transition-all">
                       Live_Session (Premium)
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* --- STATS SECTION --- */}
        <div className="mb-32">
           <div className="text-center mb-16">
             <div className="text-[11px] uppercase tracking-[0.5em] text-gray-300 mb-2 font-bold">System Status</div>
             <h2 className="font-serif text-6xl text-[#1A1A1A] tracking-tight">Entfaltungs-Matrix</h2>
           </div>

           <div className="bg-white rounded-[3rem] p-16 border border-gray-100 shadow-elevated grid grid-cols-1 md:grid-cols-12 gap-16 relative overflow-hidden">
              {/* Subtle background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-astro-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

              <div className="md:col-span-5 flex flex-col justify-center">
                 <div className="w-20 h-20 rounded-[2rem] bg-[#0B1221] flex items-center justify-center text-astro-gold text-3xl mb-8 shadow-2xl rotate-3">
                   ⚡
                 </div>
                 <h3 className="font-serif text-4xl text-[#1A1A1A] mb-6 leading-tight">Biometrische Matrix_Resonanz</h3>
                 <p className="font-sans text-sm text-gray-500 leading-relaxed mb-10 font-light opacity-80">
                   Deine aktuelle Resonanz wird über 5 Kernparameter abgebildet. Jede Veränderung im Transit-Feld beeinflusst diese Werte in Echtzeit über das Siderische Interface.
                 </p>
                 <div className="flex">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-green-50 text-green-700 border border-green-100 rounded-full text-[10px] uppercase tracking-widest font-black shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Integrity_Check: PASSED
                    </div>
                 </div>
              </div>

              <div className="md:col-span-7 space-y-10">
                 {['Holz', 'Feuer', 'Erde', 'Metall', 'Wasser'].map((el, i) => {
                    const val = getRandom(30, 90);
                    return (
                      <div key={i} className="group">
                         <div className="flex justify-between text-[11px] uppercase tracking-[0.3em] font-black mb-3 text-gray-400 group-hover:text-astro-gold transition-colors">
                            <span>{el}</span>
                            <span>{val}%</span>
                         </div>
                         <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className="h-full bg-[#0B1221] rounded-full transition-all duration-[2000ms] ease-out shadow-[0_0_15px_rgba(11,18,33,0.3)]" 
                              style={{width: `${val}%`}}
                            ></div>
                         </div>
                         {/* Dashed line effect decorative */}
                         <div className="flex justify-between mt-2 px-1">
                            {[...Array(24)].map((_, j) => <div key={j} className="w-0.5 h-1 bg-gray-100 rounded-full"></div>)}
                         </div>
                      </div>
                    );
                 })}
                 <div className="text-right text-[10px] font-mono tracking-widest text-gray-300 mt-6 uppercase">
                    Reference: Natal_Matrix_v1.2_Stable_PROJECTION
                 </div>
              </div>
           </div>
        </div>

        {/* --- INVENTORY / QUESTS --- */}
        <div className="mb-32">
           <div className="text-center mb-16">
             <div className="text-[11px] uppercase tracking-[0.5em] text-gray-300 mb-2 font-bold">Quest_Log</div>
             <h2 className="font-serif text-6xl text-[#1A1A1A] tracking-tight">Mission & Belohnung</h2>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Kacheln & Perks */}
              <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-ambient relative overflow-hidden group">
                 <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="p-3 bg-[#FDFBF7] rounded-2xl border border-gray-100 shadow-sm">📦</div>
                    <div>
                       <span className="text-[11px] uppercase tracking-[0.3em] font-black text-astro-text">Kacheln & Perks</span>
                       <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Storage: 2/20 Slots</div>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-6 relative z-10">
                    <div className="aspect-[3/4] rounded-2xl border border-gray-100 bg-[#FDFBF7] p-6 flex flex-col items-center justify-center text-center hover:border-astro-gold/30 transition-all group/item shadow-sm">
                       <div className="w-12 h-12 rounded-full bg-white mb-4 flex items-center justify-center text-gray-300 text-2xl shadow-inner border border-gray-50 group-hover/item:scale-110 transition-transform">★</div>
                       <div className="text-[10px] uppercase tracking-widest font-black mb-1.5 text-astro-text">Naturkind</div>
                       <div className="text-[9px] text-gray-400 font-serif italic">Amethyst</div>
                       <div className="mt-auto text-[8px] text-astro-gold uppercase font-black tracking-widest">Common</div>
                    </div>
                    
                    <div className="aspect-[3/4] rounded-2xl border border-astro-gold/30 bg-astro-gold/5 p-6 flex flex-col items-center justify-center text-center group/item shadow-sm scale-105 ring-4 ring-white">
                       <div className="w-12 h-12 rounded-full bg-astro-gold/20 mb-4 flex items-center justify-center text-astro-gold text-2xl shadow-inner group-hover/item:scale-110 transition-transform">★</div>
                       <div className="text-[10px] uppercase tracking-widest font-black mb-1.5 text-[#1A1A1A]">Mentalist</div>
                       <div className="text-[9px] text-gray-500 font-serif italic">Qualität</div>
                       <div className="mt-auto text-[8px] text-astro-gold uppercase font-black tracking-widest">Rare</div>
                    </div>

                    <div className="aspect-[3/4] rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-6 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity">
                       <div className="mb-4 text-3xl">🔒</div>
                       <div className="text-[10px] uppercase tracking-widest font-black mb-1.5 text-gray-400 italic">Locked_Slot</div>
                       <button className="mt-auto px-5 py-2 bg-[#1A1A1A] text-white text-[8px] uppercase tracking-widest font-black rounded-full shadow-lg hover:scale-105 transition-all">
                          Unlock
                       </button>
                    </div>
                 </div>
              </div>

              {/* Nächste Schritte */}
              <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-ambient relative overflow-hidden">
                 <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="p-3 bg-[#FDFBF7] rounded-2xl border border-gray-100 shadow-sm">🎓</div>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.3em] font-black text-astro-text">Nächste Schritte</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Focus: Development_Path</div>
                    </div>
                 </div>

                 <div className="space-y-8 relative z-10">
                    <div className="flex items-center gap-6 opacity-40 group cursor-default">
                       <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">✓</div>
                       <span className="font-serif text-2xl text-astro-text line-through">Erste Initialisierung</span>
                       <span className="ml-auto text-[10px] uppercase tracking-widest font-black text-emerald-600">Complete</span>
                    </div>

                    <div className="flex items-start gap-6 group cursor-pointer">
                       <div className="w-8 h-8 rounded-full bg-astro-gold/20 text-astro-gold flex items-center justify-center text-xs shadow-sm animate-pulse group-hover:scale-110 transition-transform">▶</div>
                       <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                             <span className="font-serif text-2xl text-astro-text group-hover:text-astro-gold transition-colors">Mentalist_Quest</span>
                             <span className="text-[11px] font-mono tracking-widest text-astro-gold font-bold">45%</span>
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed mb-6 font-light italic">
                            Analysten-Tipp: Schärfe deine <strong>Reflexions-Tiefe</strong> für präzisere energetische Ergebnisse in der Matrix.
                          </p>
                          <button 
                            onClick={onNavigateToQuizzes}
                            className="w-full py-4 bg-[#1A1A1A] text-white rounded-2xl text-[10px] uppercase tracking-[0.3em] font-black shadow-xl hover:bg-black hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                          >
                            Journey_Fortsetzen <span>→</span>
                          </button>
                       </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 text-center">
                       <button className="px-8 py-3 bg-[#FDFBF7] border border-gray-100 rounded-full text-[10px] uppercase tracking-widest font-black text-gray-400 hover:text-astro-gold hover:border-astro-gold/30 transition-all shadow-sm">
                         Update verfügbar in 14:23h
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="text-center py-20 border-t border-gray-200/50 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F5F2EB]/30 pointer-events-none"></div>
           <div className="inline-block px-8 py-3 bg-white rounded-full border border-gray-100 shadow-ambient mb-10 relative z-10 cursor-pointer hover:shadow-elevated hover:border-astro-gold/20 transition-all">
              <span className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-black">⚡ RECALIBRATE_ORIGIN_PROTOCOL</span>
           </div>
           <div className="flex items-center justify-center gap-6 text-[9px] font-mono uppercase tracking-[0.4em] text-gray-300 relative z-10">
             <span className="flex items-center gap-2"><div className="w-1 h-1 bg-gray-200 rounded-full"></div> Cluster_Completed</span>
             <span className="opacity-30">|</span>
             <span className="flex items-center gap-2"><div className="w-1 h-1 bg-gray-200 rounded-full"></div> Sig_Verified</span>
             <span className="opacity-30">|</span>
             <span className="flex items-center gap-2"><div className="w-1 h-1 bg-gray-200 rounded-full"></div> TS: {Date.now()}</span>
           </div>
        </div>

      </div>
    </div>
  );
};
