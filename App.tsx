
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { InputCard } from './components/InputCard';
import { AnalysisView } from './components/AnalysisView';
import { ResultSymbol } from './components/ResultSymbol';
import { QuizView } from './components/QuizView';
import { CharacterDashboard } from './components/CharacterDashboard';
import { CosmicWeather } from './components/CosmicWeather';
import { AgentSelectionView } from './components/AgentSelectionView';
import { MatrixDocsView } from './components/MatrixDocsView';
import { BirthData, CalculationState, FusionResult, Transit } from './types';
import { runFusionAnalysis } from './services/astroPhysics';
import { generateSymbol, SymbolConfig } from './services/geminiService';
import { fetchCurrentTransits, fetchTransitsForDate } from './services/transitService';

type ViewType = 'dashboard' | 'quizzes' | 'character_dashboard' | 'agent_selection' | 'matrix';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  
  // Initialize theme from localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('astro_theme');
      return savedTheme === 'dark';
    } catch (e) {
      return false;
    }
  });

  // Apply theme class and save to localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('astro_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('astro_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const [astroState, setAstroState] = useState<CalculationState>(CalculationState.IDLE);
  const [analysisResult, setAnalysisResult] = useState<FusionResult | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const [transits, setTransits] = useState<Transit[]>([]);
  const [loadingTransits, setLoadingTransits] = useState(false);
  const [transitDate, setTransitDate] = useState<Date>(new Date());

  useEffect(() => {
    const loadTransits = async () => {
      setLoadingTransits(true);
      try {
        const data = await fetchCurrentTransits();
        if (data && data.length > 0) setTransits(data);
        setTransitDate(new Date()); // Ensure it shows today's date initially
      } catch (e) {
        console.error("Failed to load transits", e);
      } finally {
        setLoadingTransits(false);
      }
    };
    loadTransits();
  }, []);

  const handleValidation = async (data: BirthData) => {
    if (!data.date || !data.time) return;
    setAstroState(CalculationState.CALCULATING);
    setGeneratedImage(null); 
    setLoadingTransits(true); 
    try {
      const dateObj = new Date(data.date + 'T' + data.time);
      const [result, birthTransits] = await Promise.all([
        runFusionAnalysis(data),
        fetchTransitsForDate(dateObj)
      ]);
      setAnalysisResult(result);
      if (birthTransits && birthTransits.length > 0) {
         setTransits(birthTransits);
         setTransitDate(dateObj); // Update weather date to birth date
      }
      setAstroState(CalculationState.COMPLETE);
    } catch (error) {
      setAstroState(CalculationState.ERROR);
    } finally {
      setLoadingTransits(false);
    }
  };

  const handleGenerateImage = async (customConfig: SymbolConfig) => {
    if (!analysisResult) return;
    setAstroState(CalculationState.GENERATING_IMAGE);
    try {
      const imageUrl = await generateSymbol(analysisResult.prompt, customConfig);
      setGeneratedImage(imageUrl);
      setAstroState(CalculationState.FINISHED);
      setTimeout(() => setShowCompletionModal(true), 500);
    } catch (error) {
      setAstroState(CalculationState.COMPLETE);
    }
  };

  const enterAgentSelection = () => {
    setShowCompletionModal(false);
    setCurrentView('agent_selection');
  };

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId);
    // Simulate agent initialization delay if desired, or go straight to dashboard
    setCurrentView('character_dashboard');
  };

  // If we are in the agent selection view, we render full screen without the sidebar layout for immersion
  if (currentView === 'agent_selection' && analysisResult && generatedImage) {
    return (
      <AgentSelectionView 
        result={analysisResult} 
        symbolUrl={generatedImage} 
        onAgentSelect={handleAgentSelect} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-astro-bg text-astro-text pl-20 md:pl-64 transition-all duration-300 relative">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />
      
      {showCompletionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-astro-bg/80 backdrop-blur-md animate-fade-in">
          <div className="bg-astro-card border border-astro-border p-10 rounded-[2.5rem] shadow-2xl max-w-lg w-full text-center relative overflow-hidden">
             <div className="mb-8">
               <div className="w-20 h-20 mx-auto bg-astro-text text-white rounded-full flex items-center justify-center text-3xl mb-6 shadow-elevated animate-float">✦</div>
               <h3 className="font-serif text-3xl text-astro-text mb-4">Initialisierung Abgeschlossen</h3>
               <p className="font-sans text-astro-subtext leading-relaxed">Du hast dein inneres System der Sterne benannt. Wähle nun deinen Guide für die Reise.</p>
             </div>
             <button onClick={enterAgentSelection} className="w-full py-4 bg-astro-gold text-white font-serif italic text-xl rounded-xl shadow-lg hover:shadow-xl hover:bg-[#B89628] transition-all">
               Connect to Agents →
             </button>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto p-6 md:p-12 lg:p-16">
        <div className="flex justify-between items-center mb-12 animate-fade-in">
          <div className="flex items-center gap-2 text-astro-subtext text-xs font-sans tracking-widest uppercase font-bold">
            <span>Core_Logic_V5.0</span>
            <span className="text-astro-gold animate-pulse">•</span>
            <span>
              {currentView === 'dashboard' ? 'FUSION_ACTIVE' : 
               currentView === 'quizzes' ? 'KNOWLEDGE_VAULT' : 
               currentView === 'matrix' ? 'SYSTEM_DOCS' : 'ENTITY_MATRIX'}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4">
             <div className="flex flex-col items-end mr-2">
                <span className="font-sans text-[10px] text-astro-subtext uppercase tracking-widest font-bold">Authenticated_Seeker</span>
                <span className="font-serif italic text-sm text-astro-gold">Julian S.</span>
             </div>
             <div className="w-1.5 h-1.5 rounded-full bg-astro-gold animate-pulse"></div>
          </div>
        </div>

        {currentView === 'quizzes' ? (
          <QuizView />
        ) : currentView === 'character_dashboard' ? (
          analysisResult && generatedImage ? (
            <CharacterDashboard 
              result={analysisResult} 
              symbolUrl={generatedImage} 
              onNavigateToQuizzes={() => setCurrentView('quizzes')}
              transits={transits}
              isLoadingTransits={loadingTransits}
            />
          ) : (
             <div className="text-center py-20">
               <h3 className="font-serif text-2xl text-astro-text mb-4">Matrix Leer</h3>
               <p className="font-sans text-sm text-astro-subtext mb-8">Keine Entitätsdaten gefunden. Bitte re-initialisieren.</p>
               <button onClick={() => setCurrentView('dashboard')} className="text-astro-gold underline">Zurück zum Dashboard</button>
             </div>
          )
        ) : currentView === 'matrix' ? (
           <MatrixDocsView />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-fade-in">
            <div className="lg:col-span-4 space-y-10">
              <InputCard onSubmit={handleValidation} isLoading={astroState === CalculationState.CALCULATING} />
            </div>
            <div className="lg:col-span-8 space-y-12">
              {astroState === CalculationState.IDLE && (
                <div className="space-y-12">
                  <CosmicWeather transits={transits} isLoading={loadingTransits} displayDate={transitDate} />
                  <div className="flex flex-col items-center justify-center text-center py-10 opacity-60">
                    <p className="font-serif italic text-lg text-astro-subtext">Geburtsdaten für individuelle Sphären-Projektion erforderlich.</p>
                  </div>
                </div>
              )}
              {astroState === CalculationState.ERROR && (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-[3rem] border border-red-200">
                  <h3 className="font-serif text-3xl text-red-600">Verbindungsabbruch</h3>
                </div>
              )}
              {(astroState !== CalculationState.IDLE && astroState !== CalculationState.ERROR) && analysisResult && (
                <div className="space-y-12 animate-fade-in-up">
                  <CosmicWeather 
                    transits={transits} 
                    isLoading={loadingTransits} 
                    displayDate={transitDate}
                    title="Deine Celestia Matrix" 
                  />
                  <AnalysisView 
                    result={analysisResult} 
                    state={astroState}
                    onGenerateImage={handleGenerateImage}
                    onNavigateToQuizzes={() => setCurrentView('quizzes')}
                    transits={transits}
                  />
                </div>
              )}
              {generatedImage && analysisResult && (
                <div className="animate-fade-in-up">
                  <ResultSymbol 
                    imageUrl={generatedImage} 
                    synthesis={analysisResult.synthesisTitle} 
                    sunSign={analysisResult.western.sunSign}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
