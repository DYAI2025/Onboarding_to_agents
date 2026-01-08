import React, { useState } from 'react';
import { fetchCurrentTransits } from '../services/transitService';

interface CodeBlockProps {
  label?: string;
  children: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, label }) => (
  <div className="relative group">
    {label && <div className="absolute top-0 right-0 px-3 py-1 bg-gray-800 text-[9px] uppercase tracking-widest text-gray-400 font-bold rounded-bl-xl border-l border-b border-gray-700">{label}</div>}
    <pre className="bg-[#0D0D0F] border border-gray-800 rounded-xl p-6 overflow-x-auto text-[10px] md:text-xs font-mono text-emerald-400 leading-relaxed shadow-inner">
      <code>{children}</code>
    </pre>
  </div>
);

export const MatrixDocsView: React.FC = () => {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [latency, setLatency] = useState<number>(0);
  const [payloadPreview, setPayloadPreview] = useState<string>('');

  const runLiveTest = async () => {
    setTestStatus('testing');
    setPayloadPreview('');
    const start = Date.now();
    try {
      const data = await fetchCurrentTransits();
      const end = Date.now();
      setLatency(end - start);
      setPayloadPreview(JSON.stringify(data.slice(0, 3), null, 2)); // Show first 3 items
      setTestStatus('success');
    } catch (e) {
      setTestStatus('failed');
      setPayloadPreview('Error: Connection timed out or CORS policy restricted.');
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-astro-border pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="w-2 h-2 bg-astro-gold rounded-sm animate-pulse"></div>
             <span className="text-[10px] uppercase tracking-[0.4em] font-black text-astro-subtext">Classified_System_Docs</span>
           </div>
           <h1 className="font-serif text-5xl text-astro-text tracking-tight">API & Matrix Architektur</h1>
        </div>
        <div className="text-right mt-4 md:mt-0">
           <div className="text-[9px] font-mono text-astro-subtext">SYS_VERSION: 2.5.0</div>
           <div className="text-[9px] font-mono text-astro-gold">ENGINE: BAZI_V2_FLY_DEV</div>
        </div>
      </div>

      {/* Connection Status Panel */}
      <div className="bg-[#1A1A1A] rounded-[2rem] p-8 md:p-12 border border-gray-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
           <div>
              <h3 className="text-white font-serif text-3xl mb-4">Externer Uplink Status</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Das Frontend kommuniziert direkt mit der Astro-Engine v2 für präzise Ephemeriden-Berechnungen und Instant-Symbol-Generierung.
                Die Verbindung wird über HTTPS/JSON realisiert.
              </p>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-gray-800">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Target Host</span>
                    <span className="font-mono text-emerald-400 text-xs">https://baziengine-v2.fly.dev</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-gray-800">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Protocol</span>
                    <span className="font-mono text-white text-xs">REST / JSON</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-gray-800">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Fallback</span>
                    <span className="font-mono text-amber-400 text-xs">Local_Calculations.js + Gemini_SDK</span>
                 </div>
              </div>

              <button 
                onClick={runLiveTest}
                disabled={testStatus === 'testing'}
                className="mt-8 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] uppercase tracking-[0.2em] font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 {testStatus === 'testing' ? (
                   <><span className="animate-spin text-lg">◌</span> Uplink wird getestet...</>
                 ) : (
                   <>⚡ Live Verbindung testen</>
                 )}
              </button>
           </div>

           <div className="bg-black border border-gray-800 rounded-xl p-6 font-mono text-xs text-gray-300 flex flex-col h-full shadow-inner">
              <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                 <span className="uppercase tracking-widest text-[9px] text-gray-500">Terminal Output</span>
                 {testStatus === 'success' && <span className="text-emerald-500 text-[9px]">● ONLINE ({latency}ms)</span>}
                 {testStatus === 'failed' && <span className="text-red-500 text-[9px]">● OFFLINE (Fallback Active)</span>}
                 {testStatus === 'idle' && <span className="text-gray-600 text-[9px]">● STANDBY</span>}
              </div>
              <div className="flex-1 overflow-y-auto min-h-[200px] text-[10px] leading-relaxed opacity-80">
                 {testStatus === 'idle' && "// Warten auf Test-Initialisierung..."}
                 {testStatus === 'testing' && (
                    <div className="space-y-1">
                      <div>> Initialisiere Handshake...</div>
                      <div>> GET /api/transits</div>
                      <div className="animate-pulse">> Warten auf Antwort...</div>
                    </div>
                 )}
                 {(testStatus === 'success' || testStatus === 'failed') && (
                    <div className="space-y-2">
                       {testStatus === 'success' && <div className="text-emerald-400">> Verbindung erfolgreich hergestellt.</div>}
                       {testStatus === 'failed' && <div className="text-red-400">> Verbindung fehlgeschlagen. Netzwerkfehler.</div>}
                       {payloadPreview && (
                         <div className="mt-4 pt-4 border-t border-gray-800">
                           <div className="text-gray-500 mb-1">// Sample Response Payload:</div>
                           <pre className="text-emerald-300/80">{payloadPreview}</pre>
                           {testStatus === 'success' && <div className="text-gray-500 mt-1">... (more items truncated)</div>}
                         </div>
                       )}
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Documentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         
         {/* Left: Endpoints */}
         <div className="lg:col-span-7 space-y-8">
            <h3 className="font-serif text-3xl text-astro-text">Core Endpoints</h3>
            
            <div className="border border-astro-border rounded-2xl overflow-hidden bg-white dark:bg-[#151517]">
               <div className="bg-gray-50 dark:bg-[#1A1A1C] border-b border-astro-border px-6 py-4 flex items-center gap-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-md text-[10px] font-black uppercase">GET</span>
                  <code className="font-mono text-sm text-astro-text">/api/transits</code>
               </div>
               <div className="p-6 space-y-4">
                  <p className="text-sm text-astro-subtext">
                    Ruft die aktuellen planetaren Positionen und Aspekte für einen bestimmten Zeitpunkt ab. 
                    Verwendet für die "Cosmic Weather" Visualisierung.
                  </p>
               </div>
            </div>

            {/* NEW SYMBOL ENDPOINT */}
            <div className="border border-astro-border rounded-2xl overflow-hidden bg-white dark:bg-[#151517] shadow-[0_0_20px_rgba(212,175,55,0.05)] border-astro-gold/20">
               <div className="bg-astro-gold/10 dark:bg-astro-gold/5 border-b border-astro-gold/20 px-6 py-4 flex items-center gap-4">
                  <span className="px-3 py-1 bg-astro-gold text-white rounded-md text-[10px] font-black uppercase">POST</span>
                  <code className="font-mono text-sm text-astro-text">/api/symbol</code>
               </div>
               <div className="p-6 space-y-4">
                  <p className="text-sm text-astro-subtext">
                    Generiert ein "Instant Symbol" basierend auf den Astro-Daten. Nutzt eine serverseitige Image-Pipeline für schnelle Ergebnisse.
                  </p>
                  <div>
                    <div className="text-[9px] uppercase tracking-widest font-bold text-astro-subtext mb-2">Payload</div>
                    <div className="bg-black/5 dark:bg-black/30 p-3 rounded-lg font-mono text-[10px] text-astro-text">
                      {`{ "prompt": string, "style": "western"|"eastern", "mode": "transparent" }`}
                    </div>
                  </div>
               </div>
            </div>

            <div className="border border-astro-border rounded-2xl overflow-hidden bg-white dark:bg-[#151517]">
               <div className="bg-gray-50 dark:bg-[#1A1A1C] border-b border-astro-border px-6 py-4 flex items-center gap-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-md text-[10px] font-black uppercase">GET</span>
                  <code className="font-mono text-sm text-astro-text">/api/fusion</code>
               </div>
               <div className="p-6 space-y-4">
                  <p className="text-sm text-astro-subtext">
                    Berechnet die Fusion aus westlichem Tierkreis und östlichem Ba Zi basierend auf Geburtsdaten.
                  </p>
               </div>
            </div>
         </div>

         {/* Right: Schemas */}
         <div className="lg:col-span-5 space-y-8">
            <h3 className="font-serif text-3xl text-astro-text">Data Contracts</h3>
            
            <CodeBlock label="Symbol Response">
{`interface SymbolResponse {
  imageUrl: string; // Base64 or Signed URL
  generationTimeMs: number;
  model: "flux-schnell" | "stable-cascade";
}`}
            </CodeBlock>

            <CodeBlock label="Transit Interface">
{`interface Transit {
  body: "Sun" | "Moon" | "Mars" ...;
  sign: "Aries" | "Taurus" ...;
  degree: number; // 0-29
  isRetrograde: boolean;
  element: "Fire" | "Earth" ...;
}`}
            </CodeBlock>

            <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl">
               <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">⚠</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700 dark:text-amber-400">Implementation Note</span>
               </div>
               <p className="text-xs text-amber-800 dark:text-amber-200/70 leading-relaxed">
                  Falls die externe API nicht erreichbar ist (Timeout > 5000ms), schaltet das System automatisch auf das interne <code className="font-mono bg-amber-200/50 dark:bg-amber-900/50 px-1 rounded">astroPhysics.ts</code> Modul um. Dies gewährleistet 100% Uptime für den Benutzer, auch bei Netzwerkstörungen.
               </p>
            </div>
         </div>
      </div>

    </div>
  );
};