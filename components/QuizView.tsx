import React, { useState, useEffect } from 'react';
import { User, Category, Quiz, Question, PersonalityResult, QuestionOption } from '../types';
import { quizService } from '../services/quizService';

export const QuizView: React.FC = () => {
  const [user, setUser] = useState<User | null>(quizService.getCurrentUser());
  const [viewState, setViewState] = useState<'auth' | 'categories' | 'quiz' | 'leaderboard'>('auth');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const [usernameInput, setUsernameInput] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  useEffect(() => {
    if (user) setViewState('categories');
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    setIsLoadingAuth(true);
    const loggedInUser = await quizService.login(usernameInput);
    setUser(loggedInUser);
    setIsLoadingAuth(false);
  };

  const handleLogout = () => {
    quizService.logout();
    setUser(null);
    setViewState('auth');
    setActiveQuiz(null);
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setViewState('quiz');
  };

  const getCategoryTheme = (id: string) => {
    switch (id) {
      case 'c_perso': return { bg: 'bg-p-violet/40', text: 'text-violet-900', aura: 'rgba(139, 92, 246, 0.08)', gradient: 'from-p-violet to-white' };
      case 'c1': return { bg: 'bg-p-amber/40', text: 'text-amber-900', aura: 'rgba(212, 175, 55, 0.08)', gradient: 'from-p-amber to-white' };
      default: return { bg: 'bg-gray-50/40', text: 'text-gray-900', aura: 'rgba(0, 0, 0, 0.03)', gradient: 'from-gray-50 to-white' };
    }
  };

  if (viewState === 'auth') {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="bg-astro-card border border-astro-border p-12 rounded-[2rem] shadow-elevated max-w-md w-full text-center relative overflow-hidden">
          <div className="w-24 h-24 bg-astro-bg rounded-full flex items-center justify-center mx-auto mb-10 text-4xl shadow-inner border border-astro-border animate-float">🗝️</div>
          <h2 className="font-serif text-5xl text-astro-text mb-12 tracking-tight">Archiv Zugang</h2>
          <form onSubmit={handleLogin} className="space-y-8">
            <input
              type="text"
              placeholder="Name deines Wesens..."
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full p-4 bg-transparent border-b border-astro-border text-center font-serif text-2xl focus:border-astro-gold focus:outline-none transition-all italic"
            />
            <button className="w-full py-5 bg-astro-text text-white font-serif italic text-xl rounded-xl shadow-lg hover:bg-black transition-all">
              {isLoadingAuth ? 'Erkenne...' : 'Eintreten'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (viewState === 'categories') {
    const categories = quizService.getCategories();
    return (
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <h2 className="font-serif text-5xl text-astro-text tracking-tight">Erkenntnis-Sphären</h2>
          <button onClick={() => setViewState('leaderboard')} className="text-astro-gold font-serif italic text-xl border-b border-astro-gold pb-1">Halle der Rekorde →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {categories.map(cat => {
            const theme = getCategoryTheme(cat.id);
            const isSelected = selectedCategory === cat.id;
            return (
              <div 
                key={cat.id} 
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                className={`cursor-pointer p-10 rounded-[3rem] border transition-all duration-700 bg-white shadow-ambient hover:shadow-elevated ${isSelected ? 'border-astro-gold' : 'border-astro-border'}`}
              >
                <div className="text-5xl mb-6">{cat.icon}</div>
                <h3 className="font-serif text-3xl mb-3">{cat.name}</h3>
                <p className="font-sans text-sm text-astro-subtext leading-relaxed">{cat.description}</p>
              </div>
            );
          })}
        </div>
        {selectedCategory && (
          <div className="mt-16 space-y-6 animate-fade-in-up">
            {quizService.getQuizzesByCategory(selectedCategory).map(quiz => (
              <div key={quiz.id} className="p-8 bg-white border border-astro-border rounded-3xl flex justify-between items-center shadow-sm hover:border-astro-gold transition-all">
                <div>
                  <h4 className="font-serif text-2xl text-astro-text">{quiz.title}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-astro-subtext mt-1">{quiz.questions.length} Stufen • {quiz.difficulty}</p>
                </div>
                <button onClick={() => startQuiz(quiz)} className="px-10 py-3 bg-astro-text text-white rounded-xl font-serif italic text-lg hover:bg-black transition-all">Beginnen</button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (viewState === 'quiz' && activeQuiz) {
    return <QuizPlayer quiz={activeQuiz} onFinish={() => setViewState('categories')} />;
  }

  return <div>Leaderboard View</div>;
};

const QuizPlayer: React.FC<{ quiz: Quiz; onFinish: () => void }> = ({ quiz, onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [personalityScores, setPersonalityScores] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  const question = quiz.questions[currentIdx];
  const isPersonality = quiz.type === 'PERSONALITY';

  const handleAnswer = (idx: number) => {
    if (isPersonality) {
      const opt = question.options[idx] as QuestionOption;
      const newScores = { ...personalityScores };
      // Explicitly cast to fix 'unknown' type assignment issues in loop
      (Object.entries(opt.weights || {}) as [string, number][]).forEach(([k, v]) => {
        newScores[k] = (newScores[k] || 0) + v;
      });
      setPersonalityScores(newScores);
    }
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowResult(true);
    }
  };

  const getResult = () => {
    let max = -1; 
    let id = '';
    // Explicitly cast to fix 'unknown' type in numerical comparison
    (Object.entries(personalityScores) as [string, number][]).forEach(([k, v]) => { 
      if (v > max) { 
        max = v; 
        id = k; 
      } 
    });
    return quiz.results?.find(r => r.id === id) || quiz.results?.[0];
  };

  if (showResult && isPersonality) {
    const res = getResult() as PersonalityResult;
    return (
      <div className="max-w-3xl mx-auto py-12 animate-fade-in-up">
        <div className="bg-astro-card border border-astro-border p-12 rounded-[4rem] text-center shadow-elevated relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-astro-gold/5 rounded-full blur-[100px]"></div>
          <div className="relative z-10">
            <div className="w-48 h-48 mx-auto mb-10 bg-astro-bg rounded-full p-8 flex items-center justify-center border border-astro-border shadow-inner animate-float text-astro-gold" dangerouslySetInnerHTML={{ __html: res.icon || '' }} />
            <h3 className="font-serif text-6xl text-astro-text mb-4 tracking-tight">{res.title}</h3>
            <p className="font-serif italic text-2xl text-astro-gold mb-10">{res.tagline}</p>
            <p className="font-sans text-sm text-astro-subtext leading-relaxed max-w-xl mx-auto mb-12">{res.description}</p>
            
            <div className="grid grid-cols-2 gap-8 mb-16">
              {res.stats?.map((s, i) => (
                <div key={i} className="bg-astro-bg/50 p-6 rounded-3xl border border-astro-border">
                  <div className="text-[10px] uppercase tracking-widest text-astro-subtext mb-2 font-bold">{s.label}</div>
                  <div className="text-4xl font-serif text-astro-text">{s.value}</div>
                </div>
              ))}
            </div>

            {res.compatibility && (
              <div className="bg-astro-gold/5 border border-astro-gold/10 p-10 rounded-[2.5rem] mb-16">
                <div className="grid grid-cols-2 gap-12">
                   <div>
                     <div className="text-[10px] uppercase tracking-widest text-emerald-600 mb-4 font-black">Verbündeter</div>
                     <div className="font-serif text-2xl text-astro-text">{res.compatibility.ally}</div>
                   </div>
                   <div>
                     <div className="text-[10px] uppercase tracking-widest text-red-600 mb-4 font-black">Spannung</div>
                     <div className="font-serif text-2xl text-astro-text">{res.compatibility.tension}</div>
                   </div>
                </div>
              </div>
            )}

            <button onClick={onFinish} className="px-12 py-5 bg-astro-text text-white font-serif italic text-xl rounded-2xl hover:bg-black transition-all">Zurück zum Archiv</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-20 animate-fade-in">
      <div className="text-center mb-16">
        <span className="text-[10px] uppercase tracking-[0.5em] text-astro-subtext font-bold block mb-4">Phase {currentIdx + 1} / {quiz.questions.length}</span>
        <h3 className="font-serif text-4xl md:text-5xl text-astro-text leading-tight">{question.text}</h3>
      </div>
      <div className="space-y-4">
        {question.options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(i)} className="w-full p-8 bg-white border border-astro-border rounded-3xl text-lg font-sans text-astro-text hover:border-astro-gold hover:bg-astro-bg transition-all shadow-ambient">
            {typeof opt === 'string' ? opt : opt.text}
          </button>
        ))}
      </div>
    </div>
  );
};