export const COURSE_IDS = [
  "razonamiento",
  "fisica",
  "algebra",
  "geometria",
  "trigonometria",
  "aritmetica",
] as const;

export type CourseId = (typeof COURSE_IDS)[number];

export interface Topic {
  id: string;
  name: string;
  blurb: string;
}

export interface Course {
  id: CourseId;
  name: string;
  short: string;
  description: string;
  topics: Topic[];
}

export interface Question {
  id: string;
  courseId: CourseId;
  topicId: string;
  stem: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 1 | 2 | 3;
}

export interface TopicStats {
  attempted: number;
  correct: number;
  timeSeconds: number;
}

export interface PracticeRecord {
  id: string;
  courseId: CourseId;
  topicId: string | "mixed";
  total: number;
  correct: number;
  xpEarned: number;
  seconds: number;
  at: number;
}

export interface SimulacroRecord {
  id: string;
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  seconds: number;
  xpEarned: number;
  courseIds: CourseId[];
  weakTopics: Array<{
    courseId: CourseId;
    topicId: string;
    attempted: number;
    correct: number;
  }>;
  at: number;
}

export interface PracticeAnswer {
  questionId: string;
  choice: number | null;
  correct: boolean | null;
  revealed: boolean;
}

export interface PracticeSession {
  id: string;
  courseId: CourseId;
  topicId: string | "mixed";
  questions: Question[];
  index: number;
  answers: PracticeAnswer[];
  startedAt: number;
  xpFromAnswers: number;
}

export interface ExamAnswer {
  choice: number | null;
  flagged: boolean;
}

export interface ExamSession {
  id: string;
  courseIds: CourseId[];
  questions: Question[];
  index: number;
  answers: ExamAnswer[];
  startedAt: number;
  finishedAt: number | null;
}

export interface Profile {
  name: string;
  avatarId: string;
  onboarded: boolean;
}

export interface Settings {
  theme: "dark" | "light";
  reminderStudy: boolean;
  reminderSimulacro: boolean;
  reminderMotivation: boolean;
  reminderStreak: boolean;
  haptic: boolean;
}

export interface AppPersistedState {
  version: 1;
  profile: Profile;
  xp: number;
  streak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  studySeconds: number;
  questionsAttempted: number;
  questionsCorrect: number;
  questionsIncorrect: number;
  topicStats: Record<string, TopicStats>;
  practiceHistory: PracticeRecord[];
  simulacroHistory: SimulacroRecord[];
  unlockedAchievements: Record<string, number>;
  settings: Settings;
}

export type LevelId = 1 | 2 | 3 | 4 | 5 | 6;
