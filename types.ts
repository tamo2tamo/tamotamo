
export enum QuizLevel {
  LEVEL_1 = '英検2級〜準1級レベル',
  LEVEL_2 = '早稲田大学文学部レベル',
  LEVEL_3 = '早稲田大学国際教養学部レベル',
}

export enum Screen {
  LEVEL_SELECT,
  LOADING,
  QUIZ,
  RESULTS,
}

export interface Question {
  passage?: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Quiz {
  title: string;
  questions: Question[];
}

export interface Explanation {
  detailedExplanation: string;
}

export interface Vocabulary {
  word: string;
  meaning: string;
  example: string;
}

export interface ResultsData {
  score: number;
  total: number;
  passageSummary?: string;
  explanations: Explanation[];
  vocabulary: Vocabulary[];
  level: QuizLevel;
}
