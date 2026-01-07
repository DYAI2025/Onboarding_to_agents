
import React from 'react';

interface Props {
  currentView: 'dashboard' | 'quizzes' | 'character_dashboard';
  onNavigate: (view: 'dashboard' | 'quizzes' | 'character_dashboard') => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<Props> = ({ currentView, onNavigate, isDarkMode, onToggleTheme }) => {
  const menuItems = [
    { id: 'dashboard', icon: '◉', label: 'Dashboard' },
    { id: 'profile', icon: '👤', label: 'Identity' },
    { id: 'quizzes', icon: '☾', label: 'Archive' },
    { id: 'agents', icon: '✦', label: 'Entities' },
    { id: 'premium', icon: '⚛', label: 'Ascension' },
  ];

  const handleNavigation = (id: string) => {
    if (id === 'dashboard') onNavigate('dashboard');
    if (id === 'quizzes') onNavigate('quizzes');
    if (id === 'profile') onNavigate('character_dashboard');
  };

  return (
    <div className="w-20 md:w-64 bg-white dark:bg-[#111113] min-h-screen border-r border-astro-border flex flex-col items-center md:items-start py-10 md:px-8 fixed left-0 top-0 z-50 transition-all duration-500 shadow-ambient">
      <div className="mb-16 font-serif text-3xl tracking-widest md:pl-2 group cursor-pointer" onClick={() => onNavigate('dashboard')}>
        <span className="hidden md:inline font-bold">ASTRO</span>
        <span className="md:hidden">A</span>
        <div className="h-0.5 w-0 bg-astro-gold transition-all duration-700 group-hover:w-full"></div>
      </div>
      
      <div className="flex flex-col gap-6 w-full">
        {menuItems.map((item) => {
          // Map internal ID to view state for active check
          const isActive = 
            (item.id === 'dashboard' && currentView === 'dashboard') ||
            (item.id === 'quizzes' && currentView === 'quizzes') ||
            (item.id === 'profile' && currentView === 'character_dashboard');

          return (
            <div 
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`flex items-center gap-5 cursor-pointer p-3.5 rounded-2xl transition-all duration-500 group relative ${
                isActive 
                  ? 'bg-astro-bg text-astro-gold shadow-ambient' 
                  : 'text-astro-subtext hover:text-astro-text hover:bg-astro-bg/40'
              }`}
            >
              <span className={`text-xl transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
              <span className="hidden md:inline font-sans text-[10px] tracking-[0.2em] uppercase font-bold">{item.label}</span>
              {isActive && (
                <div className="absolute left-[-2rem] md:left-[-2rem] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-astro-gold rounded-r-full shadow-[2px_0_10px_rgba(212,175,55,0.4)]"></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-auto space-y-4 w-full pt-10 border-t border-astro-border/50">
        <div className="flex items-center gap-5 text-astro-subtext p-3.5 cursor-pointer hover:text-astro-text transition-colors group">
          <span className="text-xl group-hover:rotate-45 transition-transform duration-500">⚙</span>
          <span className="hidden md:inline font-sans text-[10px] tracking-[0.2em] uppercase font-bold">Matrix</span>
        </div>
        <div 
          onClick={onToggleTheme}
          className="flex items-center gap-5 text-astro-subtext p-3.5 cursor-pointer hover:text-astro-gold transition-all duration-500 group bg-astro-bg/30 rounded-2xl"
        >
          <span className="text-xl">{isDarkMode ? '☀' : '☾'}</span>
          <span className="hidden md:inline font-sans text-[10px] tracking-[0.2em] uppercase font-bold">
            {isDarkMode ? 'Lumen' : 'Nox'}
          </span>
        </div>
      </div>
    </div>
  );
};
