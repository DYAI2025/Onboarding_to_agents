
import { Category, Quiz, Score, User, QuestionOption, PersonalityResult } from '../types';

// --- Mock Data ---

const MOCK_CATEGORIES: Category[] = [
  { id: 'c_perso', name: 'Archetypen & Persönlichkeit', icon: '⚜️', description: 'Entdecke deine verborgenen Muster und Seelen-Signaturen.' },
  { id: 'c1', name: 'Zodiac Origins', icon: '♈', description: 'The ancient roots of the 12 signs.' },
  { id: 'c2', name: 'Planetary Forces', icon: '🪐', description: 'Understanding the gravity of our solar neighbors.' },
  { id: 'c3', name: 'Elemental Alchemy', icon: '🔥', description: 'Fire, Earth, Air, and Water mastery.' },
];

// Helper to create weighted options easily
const wo = (text: string, weights: Record<string, number>): QuestionOption => ({ text, weights });

const MOCK_QUIZZES: Quiz[] = [
  // --- TRIVIA QUIZZES ---
  {
    id: 'q1', categoryId: 'c1', type: 'TRIVIA', title: 'Sun Sign Symbols', difficulty: 'Novice',
    questions: [
      { id: 'q1_1', text: 'Which sign is represented by the Scales?', options: ['Libra', 'Scorpio', 'Gemini', 'Pisces'], correctAnswer: 0 },
      { id: 'q1_2', text: 'Which sign is known as the Water Bearer?', options: ['Cancer', 'Aquarius', 'Pisces', 'Aries'], correctAnswer: 1 },
      { id: 'q1_3', text: 'The Lion represents which Zodiac sign?', options: ['Aries', 'Leo', 'Taurus', 'Sagittarius'], correctAnswer: 1 },
    ]
  },

  // --- PERSONALITY QUIZZES ---

  // 1. SPIRIT ANIMAL WARDEN QUIZ
  {
    id: 'p_krafttier',
    categoryId: 'c_perso',
    type: 'PERSONALITY',
    title: 'Welcher uralte Wächter schlummert in deiner Seele?',
    difficulty: 'Seelenreise',
    results: [
      {
        id: 'wolf', title: 'Der Silberwolf', tagline: 'Hüter des Rudels',
        description: 'Der Silberwolf steht für Loyalität, Instinkt und die Kraft der Gemeinschaft. Du bist ein natürlicher Beschützer, der erst in der Verbindung zu anderen seine wahre Stärke entfaltet. Dein Geheul erinnert die Welt daran, dass niemand allein wandern muss.',
        stats: [{label: 'Loyalität', value: '98%'}, {label: 'Instinkt', value: '94%'}],
        compatibility: { ally: 'Der Obsidianbär', tension: 'Der Schattenluchs' },
        icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M50 85 L30 75 L20 55 L25 35 L35 25 L35 15 L45 25 L50 20 L55 25 L65 15 L65 25 L75 35 L80 55 L70 75 Z"/><circle cx="40" cy="45" r="4" fill="currentColor"/><circle cx="60" cy="45" r="4" fill="currentColor"/></svg>`
      },
      {
        id: 'eagle', title: 'Der Sonnenadler', tagline: 'Auge des Horizonts',
        description: 'Der Sonnenadler schenkt dir Weitblick und die Freiheit des Geistes. Du fliegst über den Dingen und erkennst Zusammenhänge, die anderen verborgen bleiben. Deine Seele verlangt nach Höhe und der Klarheit des reinen Lichts.',
        stats: [{label: 'Klarheit', value: '96%'}, {label: 'Freiheit', value: '99%'}],
        compatibility: { ally: 'Der Feuerphönix', tension: 'Der Obsidianbär' },
        icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M50 25 Q55 35 50 45 Q45 35 50 25"/><path d="M50 45 Q45 55 30 50 Q15 48 5 55"/><path d="M50 45 Q55 55 70 50 Q85 48 95 55"/><path d="M50 50 L50 70"/></svg>`
      },
      {
        id: 'bear', title: 'Der Obsidianbär', tagline: 'Fels der Ahnen',
        description: 'Der Obsidianbär ist das Fundament der Welt. In dir ruht eine unerschütterliche Kraft und tiefe Geduld. Du bist der Anker in jedem Sturm und der Bewahrer alter Wahrheiten. Deine Ruhe ist deine größte Macht.',
        stats: [{label: 'Resilienz', value: '100%'}, {label: 'Geduld', value: '95%'}],
        compatibility: { ally: 'Der Silberwolf', tension: 'Der Sonnenadler' },
        icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 60 Q20 30 50 30 Q80 30 80 60 L85 80 L15 80 Z"/><circle cx="35" cy="50" r="3"/><circle cx="65" cy="50" r="3"/></svg>`
      },
      {
        id: 'lynx', title: 'Der Schattenluchs', tagline: 'Wächter der Stille',
        description: 'Der Schattenluchs sieht, was nicht gesagt wird. Du bist unabhängig, scharfsinnig und ein Meister der Beobachtung. Du brauchst keinen Lärm, um gehört zu werden, und findest deine Pfade dort, wo andere nur Dunkelheit sehen.',
        stats: [{label: 'Scharfsinn', value: '97%'}, {label: 'Autonomie', value: '92%'}],
        compatibility: { ally: 'Die Mond-Eule', tension: 'Der Silberwolf' },
        icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M30 20 L40 40 L30 50 L40 80 L60 80 L70 50 L60 40 L70 20 Z"/><path d="M40 35 L40 25 M60 35 L60 25"/></svg>`
      },
      {
        id: 'phoenix', title: 'Der Feuerphönix', tagline: 'Glut der Erneuerung',
        description: 'Der Feuerphönix brennt in dir – transformierend und unbesiegbar. Du hast die Gabe, aus jeder Niederlage stärker hervorzugehen. Dein Leben ist ein ständiger Wandel, ein Tanz zwischen Ende und Neuanfang.',
        stats: [{label: 'Wandlung', value: '99%'}, {label: 'Strahlkraft', value: '96%'}],
        compatibility: { ally: 'Der Sonnenadler', tension: 'Der Obsidianbär' },
        icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M50 80 Q70 60 50 10 Q30 60 50 80 Z"/><path d="M20 50 Q50 40 80 50 Q50 60 20 50" opacity="0.6"/></svg>`
      }
    ],
    questions: [
      {
        id: 'k1', text: 'Ein Sturm zieht auf. Wo suchst du Zuflucht?', scenario: 'Die Blitze zucken am Horizont...',
        options: [
          wo('In der Tiefe einer Höhle, nah an der Erde.', { bear: 3, wolf: 1 }),
          wo('Auf dem höchsten Gipfel, um den Blitz zu beobachten.', { eagle: 3, phoenix: 1 }),
          wo('Mitten im Wald, fast unsichtbar im Unterholz.', { lynx: 3 }),
          wo('Im Kreis meiner Gefährten, Schulter an Schulter.', { wolf: 3, bear: 1 }),
        ]
      },
      {
        id: 'k2', text: 'Welche Gabe hättest du am liebsten?', scenario: 'Die Sterne flüstern dir zu...',
        options: [
          wo('Die Fähigkeit, die Wahrheit hinter jeder Maske zu sehen.', { lynx: 3, eagle: 1 }),
          wo('Die Kraft, alles Zerstörte wieder aufzubauen.', { phoenix: 3, bear: 1 }),
          wo('Einen Instinkt, der mich nie in die Irre führt.', { wolf: 3, lynx: 1 }),
          wo('Die Freiheit, alle Grenzen hinter mir zu lassen.', { eagle: 3, phoenix: 1 }),
        ]
      },
      {
        id: 'k3', text: 'Was bedeutet Stärke für dich?', scenario: 'Das Echo deines Herzens...',
        options: [
          wo('Unbeugsamkeit und Beständigkeit.', { bear: 3, wolf: 1 }),
          wo('Die Weisheit des Schweigens.', { lynx: 3 }),
          wo('Die Loyalität zu dem, was man liebt.', { wolf: 3, bear: 1 }),
          wo('Der Mut, sich immer wieder neu zu erfinden.', { phoenix: 3, eagle: 1 }),
        ]
      },
      {
        id: 'k4', text: 'Dein Weg wird von einem Abgrund versperrt. Was tust du?', scenario: 'Die Tiefe ruft...',
        options: [
          wo('Ich breite die Schwingen meiner Fantasie aus und fliege.', { eagle: 3, phoenix: 2 }),
          wo('Ich suche geduldig nach einem geheimen Pfad.', { lynx: 3, bear: 1 }),
          wo('Ich baue mit meinem Rudel eine Brücke.', { wolf: 3, bear: 2 }),
          wo('Ich springe durch das Feuer der Notwendigkeit.', { phoenix: 3 }),
        ]
      }
    ]
  },

  {
    id: 'p_elemental',
    categoryId: 'c_perso',
    type: 'PERSONALITY',
    title: 'Elemental Affinity Explorer',
    difficulty: 'Self-Discovery',
    results: [
      {
        id: 'fire', title: 'Der Ewige Funke (Feuer)', tagline: 'Leidenschaft & Dynamik',
        description: 'Dein Geist brennt mit der Intensität eines lodernden Feuers. Du bist mutig, initiativ und handelst aus einem tiefen inneren Drang heraus.',
        stats: [{label: 'Aktion', value: 'Vital'}, {label: 'Wärme', value: 'Hoch'}],
        compatibility: { ally: 'Luft', tension: 'Wasser' },
        icon: `<svg viewBox="0 0 100 100" fill="none" stroke="#EF4444" stroke-width="2"><path d="M50 10 Q65 40 50 60 Q35 40 50 10 Z"/><path d="M50 30 Q75 60 50 90 Q25 60 50 30 Z" opacity="0.6"/></svg>`
      },
      {
        id: 'earth', title: 'Der Bergpfad (Erde)', tagline: 'Beständigkeit & Realismus',
        description: 'Du bist der Fels in der Brandung. Dein Wesen ist tief verwurzelt in der Realität. Du baust langsam, aber für die Ewigkeit.',
        stats: [{label: 'Stabilität', value: 'Maximum'}, {label: 'Fokus', value: 'Stark'}],
        compatibility: { ally: 'Wasser', tension: 'Luft' },
        icon: `<svg viewBox="0 0 100 100" fill="none" stroke="#10B981" stroke-width="2"><rect x="30" y="30" width="40" height="40" rx="4"/><path d="M20 70 L80 70" stroke-opacity="0.5"/><path d="M40 80 L60 80" stroke-opacity="0.3"/></svg>`
      }
    ],
    questions: [
      {
        id: 'e1', text: 'Ein plötzliches Problem tritt auf. Was ist dein erster Impuls?', scenario: 'Die Krise klopft an...',
        options: [
          wo('Sofort handeln und das Feuer löschen!', { fire: 3 }),
          wo('Erstmal tief durchatmen und die Lage sondieren.', { earth: 3 }),
        ]
      }
    ]
  }
];

class QuizService {
  private users: User[] = [];
  private scores: Score[] = [];
  private currentUser: User | null = null;

  constructor() {
    try {
      const storedScores = localStorage.getItem('astro_scores');
      if (storedScores) this.scores = JSON.parse(storedScores);
    } catch (e) {
      console.warn('LocalStorage unavailable');
    }
  }

  async login(username: string): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { username, email: `${username.toLowerCase()}@example.com` };
        this.currentUser = user;
        resolve(user);
      }, 800);
    });
  }

  logout() {
    this.currentUser = null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getCategories(): Category[] {
    return MOCK_CATEGORIES;
  }

  getQuizzesByCategory(categoryId: string): Quiz[] {
    return MOCK_QUIZZES.filter(q => q.categoryId === categoryId);
  }

  submitScore(quizId: string, pointsOrResult: number | string, totalQuestions: number): Score {
    if (!this.currentUser) throw new Error("Must be logged in to save score");
    
    const quiz = MOCK_QUIZZES.find(q => q.id === quizId);
    
    const newScore: Score = {
      id: Math.random().toString(36).substr(2, 9),
      quizId,
      quizTitle: quiz?.title || 'Unknown Quiz',
      username: this.currentUser.username,
      points: typeof pointsOrResult === 'number' ? pointsOrResult : 0,
      resultTitle: typeof pointsOrResult === 'string' ? pointsOrResult : undefined,
      totalQuestions,
      timestamp: Date.now()
    };

    this.scores.push(newScore);
    this.persistScores();
    return newScore;
  }

  getLeaderboard(): Score[] {
    return [...this.scores]
      .filter(s => s.points > 0 || s.resultTitle) 
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);
  }

  private persistScores() {
    try {
      localStorage.setItem('astro_scores', JSON.stringify(this.scores));
    } catch (e) {
      console.error(e);
    }
  }
}

export const quizService = new QuizService();
