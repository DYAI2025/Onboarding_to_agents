export interface BirthData {
  date: string;
  time: string;
  location: string;
}

export interface WesternAnalysis {
  sunSign: string;
  moonSign: string; // Simulated
  ascendant: string; // Simulated
  element: string;
}

export interface EasternAnalysis {
  yearAnimal: string;
  yearElement: string;
  monthAnimal: string; // Simulated
  dayElement: string; // Simulated
}

export interface FusionResult {
  synthesisTitle: string;
  synthesisDescription: string;
  elementMatrix: string;
  western: WesternAnalysis;
  eastern: EasternAnalysis;
  prompt: string;
}

export interface Transit {
  body: string;
  sign: string;
  degree: number;
  isRetrograde: boolean;
  element: string;
}

export enum CalculationState {
  IDLE = 'IDLE',
  CALCULATING = 'CALCULATING',
  COMPLETE = 'COMPLETE',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR'
}

// --- Quiz Module Types ---

export interface User {
  username: string;
  email: string; // Simple mock auth
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface PersonalityResult {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  icon?: string; // SVG content
  stats?: { label: string; value: string }[];
  compatibility?: { ally: string; tension: string };
}

export interface QuestionOption {
  text: string;
  // For personality quizzes, maps result IDs (or traits) to weight values
  weights?: Record<string, number>; 
}

export interface Question {
  id: string;
  text: string;
  scenario?: string; // Context for personality questions
  options: string[] | QuestionOption[]; // Support both simple strings and complex weighted options
  correctAnswer?: number; // For Trivia
}

export type QuizType = 'TRIVIA' | 'PERSONALITY';

export interface Quiz {
  id: string;
  categoryId: string;
  type: QuizType;
  title: string;
  difficulty: string;
  questions: Question[];
  results?: PersonalityResult[]; // Possible outcomes for personality quizzes
}

export interface Score {
  id: string;
  quizId: string;
  quizTitle: string;
  username: string;
  points: number; // For Trivia
  resultTitle?: string; // For Personality
  totalQuestions: number;
  timestamp: number;
}
