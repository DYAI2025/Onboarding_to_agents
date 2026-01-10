
import React, { useMemo, useState, useRef } from 'react';
import { Transit } from '../types';

interface Props {
  transits: Transit[];
  isLoading: boolean;
  title?: string;
  displayDate?: Date; // New prop to control the displayed date
}

interface AugmentedTransit extends Transit {
  x: number;
  y: number;
  radius: number;
  totalDegree: number;
}

interface Aspect {
  target: AugmentedTransit;
  type: 'Conjunction' | 'Opposition' | 'Square' | 'Trine' | 'Sextile';
  color: string;
}

const ASPECT_DEFS = [
  { name: 'Conjunction', degree: 0, color: '#D4AF37', orb: 8 },
  { name: 'Opposition', degree: 180, color: '#E11D48', orb: 8 },
  { name: 'Square', degree: 90, color: '#F59E0B', orb: 7 },
  { name: 'Trine', degree: 120, color: '#10B981', orb: 7 },
  { name: 'Sextile', degree: 60, color: '#3B82F6', orb: 5 },
];

const PLANET_INSIGHTS: Record<string, string> = {
  'Sun': 'Kernidentität und Lebenswille. Der zentrale Punkt der bewussten Wahrnehmung.',
  'Moon': 'Emotionale Resonanz und Instinkt. Spiegelt die unbewussten Bedürfnisse wider.',
  'Mercury': 'Kommunikation und kognitive Prozesse. Die Brücke zwischen Geist und Materie.',
  'Venus': 'Wertesystem und Harmonie. Definiert die Anziehung und ästhetische Resonanz.',
  'Mars': 'Antrieb und Durchsetzung. Die rohe Energie des Handelns und der Initiative.',
  'Jupiter': 'Expansion und Sinnfindung. Der Kanal für Wachstum und philosophische Tiefe.',
  'Saturn': 'Struktur und Grenze. Die Disziplin, die Form aus dem Chaos erschafft.',
  'Uranus': 'Inspiration und Befreiung. Der plötzliche Blitz der Erkenntnis und Erneuerung.',
  'Neptune': 'Transzendenz und Vision. Die Auflösung der Grenzen zum Universellen.',
  'Pluto': 'Transformation und Macht. Die regenerative Kraft der tiefgreifenden Wandlung.'
};

const ZODIAC_ELEMENTS: Record<string, string> = {
  "Aries": "Fire", "Leo": "Fire", "Sagittarius": "Fire",
  "Taurus": "Earth", "Virgo": "Earth", "Capricorn": "Earth",
  "Gemini": "Air", "Libra": "Air", "Aquarius": "Air",
  "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water"
};

const ELEMENT_COLORS: Record<string, string> = {
  "Fire": "#EF4444",
  "Earth": "#10B981",
  "Air": "#F59E0B",
  "Water": "#3B82F6"
};

// 3D Gradients for Plastic Look
const BODY_STYLES: Record<string, any> = {
  'Sun': {
    background: 'radial-gradient(circle at 35% 35%, #FFFBEB 0%, #FCD34D 20%, #F59E0B 50%, #D97706 100%)',
    boxShadow: '0 0 40px rgba(245, 158, 11, 0.6), inset -4px -4px 8px rgba(180, 83, 9, 0.5)'
  },
  'Moon': {
    background: 'radial-gradient(circle at 35% 35%, #F3F4F6 0%, #D1D5DB 40%, #9CA3AF 100%)',
    boxShadow: '0 0 15px rgba(255, 255, 255, 0.3), inset -3px -3px 6px rgba(0,0,0,0.5)'
  },
  'Fire': {
    background: 'radial-gradient(circle at 30% 30%, #FCA5A5 0%, #EF4444 40%, #991B1B 100%)',
    boxShadow: '0 0 10px rgba(239, 68, 68, 0.4), inset -3px -3px 5px rgba(0,0,0,0.4)'
  },
  'Water': {
    background: 'radial-gradient(circle at 30% 30%, #93C5FD 0%, #3B82F6 40%, #1E40AF 100%)',
    boxShadow: '0 0 10px rgba(59, 130, 246, 0.4), inset -3px -3px 5px rgba(0,0,0,0.4)'
  },
  'Air': {
    background: 'radial-gradient(circle at 30% 30%, #FDE68A 0%, #F59E0B 40%, #B45309 100%)',
    boxShadow: '0 0 10px rgba(245, 158, 11, 0.4), inset -3px -3px 5px rgba(0,0,0,0.4)'
  },
  'Earth': {
    background: 'radial-gradient(circle at 30% 30%, #6EE7B7 0%, #10B981 40%, #065F46 100%)',
    boxShadow: '0 0 10px rgba(16, 185, 129, 0.4), inset -3px -3px 5px rgba(0,0,0,0.4)'
  }
};

const ZODIAC_ORDER = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export const CosmicWeather: React.FC<Props> = ({ transits, isLoading, title = "Kosmisches Wetter", displayDate }) => {
  // Use the passed displayDate or fallback to now
  const dateToUse = displayDate || new Date();
  
  const dateStr = dateToUse.toLocaleDateString('de-DE', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredSign, setHoveredSign] = useState<string | null>(null);
  const [hoveredOrbit, setHoveredOrbit] = useState<string | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<AugmentedTransit | null>(null);
  
  // Optimization: Use ref for mouse position to avoid re-rendering entire chart on every pixel move
  const mouseRef = useRef({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const planetCoords = useMemo((): AugmentedTransit[] => {
    if (!transits || !Array.isArray(transits) || transits.length === 0) return [];
    
    // Filter and sort so Sun is processed but placed at center
    const sortedTransits = [...transits].sort((a, b) => {
        if (a.body === 'Sun') return -1;
        if (b.body === 'Sun') return 1;
        return 0;
    });

    let orbitIndex = 0;

    return sortedTransits
      .filter(t => t && t.sign)
      .map((t) => {
        const isSun = t.body === 'Sun';
        
        // Sun is fixed at center (0,0 relative to 150,150)
        if (isSun) {
           return {
             ...t,
             x: 150,
             y: 150,
             radius: 0,
             totalDegree: 0 // Irrelevant for center
           };
        }

        const signIdx = ZODIAC_ORDER.indexOf(t.sign);
        const safeSignIdx = signIdx === -1 ? 0 : signIdx;
        const totalDegree = (safeSignIdx * 30) + (t.degree || 0);
        const rad = (totalDegree - 90) * (Math.PI / 180); 
        
        // Increase radius step for other planets
        const radius = 50 + (orbitIndex * 14); 
        orbitIndex++;
        
        return {
          ...t,
          x: 150 + Math.cos(rad) * radius,
          y: 150 + Math.sin(rad) * radius,
          radius,
          totalDegree
        };
      });
  }, [transits]);

  const activePlanet = selectedPlanet || (hoveredPlanet ? planetCoords.find(p => p.body === hoveredPlanet) : null);

  const activeAspects = useMemo(() => {
    if (!activePlanet) return [];
    const aspects: Aspect[] = [];
    
    planetCoords.forEach(p => {
      if (p.body === activePlanet.body) return;
      if (p.radius === 0 && activePlanet.radius === 0) return; // Ignore aspect if both are sun (impossible) or center

      let diff = Math.abs(activePlanet.totalDegree - p.totalDegree);
      if (diff > 180) diff = 360 - diff;
      
      const foundAspect = ASPECT_DEFS.find(a => Math.abs(diff - a.degree) <= a.orb);
      if (foundAspect) {
        aspects.push({
          target: p,
          type: foundAspect.name as any,
          color: foundAspect.color
        });
      }
    });
    
    return aspects;
  }, [activePlanet, planetCoords]);

  // Helper to create SVG Arc Paths
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
        x: centerX + (r * Math.cos(angleInRadians)),
        y: centerY + (r * Math.sin(angleInRadians))
      };
    };

    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (chartRef.current) {
      const rect = chartRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update ref instead of state to prevent re-renders
      mouseRef.current = { x, y };

      // Direct DOM manipulation for tooltip position
      if (tooltipRef.current) {
        tooltipRef.current.style.left = `${x + 20}px`;
        tooltipRef.current.style.top = `${y - 20}px`;
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#0B1221] border border-white/5 rounded-[3rem] p-12 overflow-hidden h-[700px] flex flex-col animate-pulse relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#161E2E_0%,_#0B1221_100%)] opacity-50"></div>
        <div className="relative z-10 flex justify-between items-start mb-12">
           <div className="space-y-4">
              <div className="h-8 w-48 bg-white/10 rounded-lg"></div>
              <div className="h-2 w-32 bg-white/5 rounded-full"></div>
           </div>
           <div className="h-4 w-24 bg-white/5 rounded-full"></div>
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 flex items-center justify-center py-10">
            <div className="relative w-[350px] h-[350px] rounded-full border border-white/5 flex items-center justify-center">
               <div className="absolute w-[20%] h-[20%] rounded-full bg-white/5 border border-white/10 animate-pulse"></div>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-8">
            <div className="h-[400px] w-full bg-white/5 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
               <div className="space-y-2"><div className="h-2 w-20 bg-white/5 rounded-full"></div><div className="h-10 w-40 bg-white/10 rounded-xl"></div></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B1221] rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-elevated border border-white/5 animate-fade-in min-h-[700px] flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#161E2E_0%,_#0B1221_100%)]"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>

      <style>
        {`
          @keyframes dashMove { to { stroke-dashoffset: -20; } }
          @keyframes aspectFlow { to { stroke-dashoffset: -100; } }
          .orbit-path { stroke-dasharray: 1, 4; animation: dashMove 20s linear infinite; }
          .orbit-path-active { stroke-dasharray: 5, 2; animation: dashMove 3s linear infinite; }
          .aspect-line { animation: aspectFlow 30s linear infinite; }
        `}
      </style>

      <div className="relative z-10 flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 rounded-full bg-astro-gold animate-pulse"></div>
             <h3 className="font-serif text-3xl text-white">{title}</h3>
          </div>
          <p className="font-sans text-[10px] text-gray-400 uppercase tracking-[0.3em] font-medium">{dateStr}</p>
        </div>
        <div className="text-right">
           <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Celestia 3D Engine</div>
           <div className="text-[8px] text-astro-gold mt-1 italic opacity-60">Aspect_Matrix_Active</div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10" ref={chartRef} onMouseMove={handleMouseMove}>
        
        <div className="lg:col-span-7 flex items-center justify-center py-10" style={{ perspective: '1500px' }}>
          <div 
            className="relative transition-transform duration-1000 ease-out preserve-3d"
            style={{ 
              transform: 'rotateX(58deg) rotateZ(0deg)',
              width: '400px',
              height: '400px'
            }}
          >
            <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible absolute inset-0">
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(212,175,55,0.4)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="100%" stopColor="rgba(212,175,55,0.4)" />
                </linearGradient>
                <linearGradient id="orbitGradientActive" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="50%" stopColor="#FFF" />
                  <stop offset="100%" stopColor="#D4AF37" />
                </linearGradient>
              </defs>

              <g className="fill-none">
                {planetCoords.map((p, i) => {
                  const isActive = hoveredPlanet === p.body || selectedPlanet?.body === p.body;
                  const isOrbitHovered = hoveredOrbit === p.body;
                  
                  // Do not draw orbit for the Sun (radius 0)
                  if (p.radius === 0) return null;

                  return (
                    <g key={`orbit-group-${p.body}`}>
                      {/* Invisible Hit Area for Orbit - Thicker stroke */}
                      <circle 
                        cx="150" cy="150" r={p.radius} 
                        stroke="transparent"
                        strokeWidth="12"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredOrbit(p.body)}
                        onMouseLeave={() => setHoveredOrbit(null)}
                      />
                      {/* Visible Orbit Line with Gradient */}
                      <circle 
                        cx="150" cy="150" r={p.radius} 
                        stroke={isActive ? "url(#orbitGradientActive)" : (isOrbitHovered ? "white" : "url(#orbitGradient)")}
                        strokeOpacity={isActive || isOrbitHovered ? "1" : "0.3"}
                        strokeWidth={isActive || isOrbitHovered ? "1.5" : "0.5"}
                        filter={isActive || isOrbitHovered ? "url(#glow)" : "none"}
                        className={`transition-all duration-300 pointer-events-none ${isActive || isOrbitHovered ? 'orbit-path-active' : 'orbit-path'}`}
                      />
                    </g>
                  );
                })}
              </g>

              {/* Dynamic Aspect Lines */}
              {activePlanet && (
                <g className="animate-fade-in pointer-events-none">
                   {activeAspects.map((asp, idx) => (
                      <g key={`aspect-${activePlanet.body}-${asp.target.body}`}>
                        <line 
                          x1={activePlanet.x} y1={activePlanet.y} 
                          x2={asp.target.x} y2={asp.target.y} 
                          stroke={asp.color}
                          strokeWidth="1.5"
                          strokeDasharray="4 2"
                          className="aspect-line"
                          strokeOpacity="0.8"
                        />
                        <circle cx={activePlanet.x} cy={activePlanet.y} r="2" fill={asp.color} />
                        <circle cx={asp.target.x} cy={asp.target.y} r="2" fill={asp.color} />
                      </g>
                   ))}
                </g>
              )}

              <g>
                {ZODIAC_ORDER.map((sign, i) => {
                  const startAngle = i * 30;
                  const endAngle = (i + 1) * 30;
                  const isHovered = hoveredSign === sign;
                  const elementColor = ELEMENT_COLORS[ZODIAC_ELEMENTS[sign]];
                  
                  return (
                    <path
                      key={`sector-${sign}`}
                      d={describeArc(150, 150, 148, startAngle, endAngle)}
                      stroke={isHovered ? elementColor : "white"}
                      strokeOpacity={isHovered ? "0.8" : "0.2"}
                      strokeWidth={isHovered ? "8" : "2"}
                      fill="transparent"
                      filter={isHovered ? "url(#glow)" : "none"}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredSign(sign)}
                      onMouseLeave={() => setHoveredSign(null)}
                    />
                  );
                })}
              </g>

              {ZODIAC_ORDER.map((sign, i) => {
                 const angle = (i * 30 - 90) * (Math.PI / 180);
                 const x = 150 + Math.cos(angle) * 148;
                 const y = 150 + Math.sin(angle) * 148;
                 const isHovered = hoveredSign === sign;
                 const elementColor = ELEMENT_COLORS[ZODIAC_ELEMENTS[sign]];

                 return (
                   <g key={`label-${sign}`} className="pointer-events-none">
                     <line x1={150 + Math.cos(angle) * 144} y1={150 + Math.sin(angle) * 144} x2={x} y2={y} stroke={isHovered ? elementColor : "white"} strokeOpacity="0.4" />
                     <text 
                       x={150 + Math.cos(angle + 0.26) * 135} 
                       y={150 + Math.sin(angle + 0.26) * 135} 
                       className={`font-bold transition-all duration-300 ${isHovered ? 'text-[8px]' : 'fill-gray-400 text-[6px]'} uppercase tracking-tighter`}
                       fill={isHovered ? elementColor : "gray"}
                       textAnchor="middle"
                     >
                       {sign.substring(0, 3)}
                     </text>
                   </g>
                 );
              })}
            </svg>

            {planetCoords.map((planet) => {
              const isSelected = selectedPlanet?.body === planet.body;
              const isHovered = hoveredPlanet === planet.body || hoveredOrbit === planet.body;
              
              // Determine Style
              let style = BODY_STYLES[planet.element] || BODY_STYLES['Earth'];
              if (planet.body === 'Sun') style = BODY_STYLES['Sun'];
              if (planet.body === 'Moon') style = BODY_STYLES['Moon'];

              // Scale determination for visual part only
              const isSun = planet.body === 'Sun';
              const baseSize = isSun ? 'w-10 h-10' : (planet.body === 'Moon' ? 'w-4 h-4' : 'w-5 h-5');
              
              const visualScaleClass = isSelected 
                 ? 'scale-[1.5]' 
                 : (isHovered ? 'scale-125' : 'scale-100');

              return (
                <div 
                  key={planet.body}
                  className={`absolute z-30 flex items-center justify-center cursor-pointer`}
                  style={{
                    left: `${(planet.x / 300) * 100}%`,
                    top: `${(planet.y / 300) * 100}%`,
                    transform: 'translate(-50%, -50%) rotateX(-58deg)',
                    width: isSun ? '48px' : '32px', // Slight hit area adjustment
                    height: isSun ? '48px' : '32px'
                  }}
                  onMouseEnter={() => setHoveredPlanet(planet.body)}
                  onMouseLeave={() => setHoveredPlanet(null)}
                  onClick={(e) => { e.stopPropagation(); setSelectedPlanet(isSelected ? null : planet); }}
                >
                  <div 
                    className={`${baseSize} rounded-full transition-all duration-500 relative ${visualScaleClass} ${isSelected ? 'z-50' : 'z-20'}`}
                    style={{
                        ...style,
                        filter: isSelected ? 'brightness(1.2)' : 'none'
                    }}
                  >
                    {isSelected && <div className="absolute inset-0 rounded-full animate-ping bg-white/40"></div>}
                    {isSun && <div className="absolute inset-[-10px] rounded-full bg-orange-400/20 blur-md animate-pulse"></div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3D Tooltip Overlay - Following Mouse in 2D Space */}
        {(hoveredSign || hoveredOrbit) && (
            <div 
                ref={tooltipRef}
                className="absolute z-50 pointer-events-none px-4 py-3 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-fade-in flex flex-col gap-1 transition-opacity duration-200"
                style={{ 
                    left: mouseRef.current.x + 20, 
                    top: mouseRef.current.y - 20,
                    transform: 'translateZ(100px)' 
                }}
            >
                {hoveredSign && !hoveredOrbit && (
                    <>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ELEMENT_COLORS[ZODIAC_ELEMENTS[hoveredSign]] }}></span>
                            <span className="font-serif text-lg text-white">{hoveredSign}</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest font-black text-gray-400">
                             {ZODIAC_ELEMENTS[hoveredSign]} Sektor
                        </span>
                    </>
                )}
                {hoveredOrbit && (
                    <>
                         <div className="flex items-center gap-2">
                             <span className="font-serif text-lg text-white">{hoveredOrbit}</span>
                         </div>
                         <span className="text-[9px] uppercase tracking-widest font-black text-gray-400">
                             {hoveredOrbit === 'Sun' ? 'Zentralgestirn' : 'Orbital Path'}
                         </span>
                         {planetCoords.find(p => p.body === hoveredOrbit) && (
                             <span className="text-[9px] uppercase tracking-widest font-black text-astro-gold mt-1">
                                 Currently in {planetCoords.find(p => p.body === hoveredOrbit)?.sign}
                             </span>
                         )}
                    </>
                )}
            </div>
        )}

        <div className="lg:col-span-5 h-full flex flex-col justify-center">
           <div className={`bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md transition-all duration-700 min-h-[450px] flex flex-col relative overflow-hidden ${activePlanet || hoveredSign ? 'border-astro-gold/40 shadow-[0_0_60px_rgba(212,175,55,0.25)]' : 'opacity-60'}`}>
              <div className={`absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-[100px] transition-all duration-1000 ${
                (activePlanet?.element || ZODIAC_ELEMENTS[hoveredSign || '']) === 'Fire' ? 'bg-red-500/10' :
                (activePlanet?.element || ZODIAC_ELEMENTS[hoveredSign || '']) === 'Water' ? 'bg-blue-500/10' :
                (activePlanet?.element || ZODIAC_ELEMENTS[hoveredSign || '']) === 'Air' ? 'bg-amber-500/10' :
                'bg-emerald-500/10'
              }`}></div>

              {activePlanet ? (
                <div className="animate-fade-in flex flex-col h-full relative z-10">
                   <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="text-astro-gold text-[10px] font-black tracking-[0.4em] uppercase mb-1">Planetare Analyse</div>
                        <h4 className="font-serif text-5xl text-white tracking-tight">{activePlanet.body}</h4>
                      </div>
                      {selectedPlanet && (
                        <button onClick={(e) => { e.stopPropagation(); setSelectedPlanet(null); }} className="p-3 hover:bg-white/10 rounded-full transition-all group/close">
                           <svg className="w-6 h-6 text-gray-500 group-hover/close:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      )}
                   </div>

                   {/* Aspect Readout in HUD */}
                   {activeAspects.length > 0 && (
                     <div className="mb-6 animate-fade-in">
                        <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-3 font-bold">Resonante Aspekte ({activeAspects.length})</div>
                        <div className="flex flex-wrap gap-2">
                           {activeAspects.map((asp, i) => (
                             <div key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 group hover:border-white/30 transition-all">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: asp.color }}></div>
                                <span className="text-[10px] text-gray-300 font-bold">{asp.type} zu {asp.target.body}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-black/60 p-4 rounded-2xl border border-white/10 backdrop-blur-sm group/item hover:border-astro-gold/30 transition-colors">
                         <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Zodiak</div>
                         <div className="font-serif text-xl text-white">{activePlanet.sign} <span className="text-astro-gold italic">{activePlanet.degree}°</span></div>
                      </div>
                      <div className="bg-black/60 p-4 rounded-2xl border border-white/10 backdrop-blur-sm group/item hover:border-astro-gold/30 transition-colors">
                         <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Kraft</div>
                         <div className="font-serif text-xl text-astro-gold">{activePlanet.element}</div>
                      </div>
                   </div>

                   <div className="mt-auto space-y-4">
                      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl shadow-inner">
                         <p className="font-serif italic text-base text-gray-200 leading-relaxed">
                           "{PLANET_INSIGHTS[activePlanet.body] || 'Planetare Schwingung in Harmonie.'}"
                         </p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                         <span className="text-astro-gold animate-pulse">●</span> Matrix_State: SYNCED
                         <span className="ml-auto">Asp_Check: OK</span>
                      </div>
                   </div>
                </div>
              ) : hoveredSign ? (
                <div className="animate-fade-in flex flex-col h-full relative z-10">
                   <div className="mb-10">
                      <div className="text-astro-gold text-[10px] font-black tracking-[0.4em] uppercase mb-1">Fokus-Sektor</div>
                      <h4 className="font-serif text-6xl text-white tracking-tight">{hoveredSign}</h4>
                   </div>
                   <div className="space-y-6">
                      <div className="bg-black/40 p-6 rounded-2xl border border-astro-gold/40 flex justify-between items-center group shadow-lg">
                         <span className="text-[12px] uppercase tracking-widest font-bold text-gray-300 group-hover:text-astro-gold transition-colors">Primäres Element</span>
                         <span className="font-serif text-4xl text-astro-gold" style={{ color: ELEMENT_COLORS[ZODIAC_ELEMENTS[hoveredSign]] }}>{ZODIAC_ELEMENTS[hoveredSign]}</span>
                      </div>
                      <div className="p-8 border-l-4 border-astro-gold/50 bg-white/5 rounded-r-3xl shadow-inner" style={{ borderColor: ELEMENT_COLORS[ZODIAC_ELEMENTS[hoveredSign]] }}>
                         <h5 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3 font-bold">Essenz</h5>
                         <p className="font-serif italic text-2xl text-gray-200 leading-relaxed">
                            {hoveredSign === 'Aries' ? 'Der feurige Funke, der den kosmischen Reigen entfacht.' : 
                             hoveredSign === 'Pisces' ? 'Die transzendente Tiefe, in der sich alle Seelen spiegeln.' :
                             `Ein kraftvoller Ausdruck der ${ZODIAC_ELEMENTS[hoveredSign]}-Energie.`}
                         </p>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 group cursor-pointer" onClick={() => setSelectedPlanet(planetCoords[0])}>
                   <div className="w-20 h-20 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/10 text-4xl mb-6 group-hover:scale-110 group-hover:border-astro-gold/40 transition-all duration-700 shadow-inner">✦</div>
                   <h4 className="font-serif text-2xl text-white/60 mb-3 italic group-hover:text-white/90 transition-colors tracking-wide">Sphärenharmonie</h4>
                   <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] leading-relaxed max-w-[250px] font-light">
                     Bewege den Cursor über Orbits oder Zeichen, um energetische Aspekte und planetare Muster zu visualisieren.
                   </p>
                </div>
              )}
           </div>
        </div>
      </div>
      
      {/* Aspect Legend */}
      <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-6 relative z-10">
        <div className="flex flex-wrap gap-8 justify-center">
           {ASPECT_DEFS.map(asp => (
             <div key={asp.name} className="flex items-center gap-2.5 opacity-40 hover:opacity-100 transition-opacity cursor-help" title={`${asp.name}: ${asp.degree}° (+/- ${asp.orb}° Orb)`}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: asp.color }}></div>
                <span className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400">{asp.name}</span>
             </div>
           ))}
        </div>
        <div className="flex gap-12 justify-center opacity-60">
           {['Fire', 'Earth', 'Air', 'Water'].map(el => {
             const isActive = (activePlanet?.element === el) || (hoveredSign && ZODIAC_ELEMENTS[hoveredSign] === el);
             return (
               <div key={el} className={`flex items-center gap-3 transition-all duration-500 ${isActive ? 'opacity-100 scale-110' : 'opacity-25'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: ELEMENT_COLORS[el] }}></div>
                  <span className={`text-[9px] uppercase tracking-[0.4em] font-black ${isActive ? 'text-astro-gold' : 'text-gray-400'}`}>{el}</span>
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
};
