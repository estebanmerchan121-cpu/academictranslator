
export interface KeyTerm {
  term: string;
  definition: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  translation?: string;
  definition?: string;
  keyTerms?: KeyTerm[];
  timestamp: number;
}

export interface TranslationResult {
  translation: string;
  definition?: string;
  keyTerms?: KeyTerm[];
}

export interface AcademicCategory {
  id: string;
  label: string;
  icon: string;
  subContexts: SubContext[];
}

export interface SubContext {
  id: string;
  label: string;
  description: string;
  group?: string; // Optional grouping for UI display
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface ChatState {
  category: AcademicCategory | null;
  subContext: SubContext | null;
  targetLanguage: Language | null;
  messages: Message[];
  isLoading: boolean;
}
