import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { topicKey } from "@/data/courses";
import { evaluateAchievements } from "@/lib/gamification/achievements";
import { streakBonus, XP } from "@/lib/gamification/levels";
import type {
  AppPersistedState,
  CourseId,
  ExamSession,
  PracticeSession,
  Question,
  Settings,
  TopicStats,
} from "@/lib/models/types";
import { isCorrect } from "@/lib/questions/engine";
import { todayKey, uid, yesterdayKey } from "@/lib/utils";

export const defaultSettings: Settings = {
  theme: "dark",
  reminderStudy: true,
  reminderSimulacro: false,
  reminderMotivation: true,
  reminderStreak: true,
  haptic: true,
};

const emptyStats = (): TopicStats => ({ attempted: 0, correct: 0, timeSeconds: 0 });

export const defaultPersisted: AppPersistedState = {
  version: 1,
  profile: { name: "Estudiante", avatarId: "sigma", onboarded: false },
  xp: 0,
  streak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  studySeconds: 0,
  questionsAttempted: 0,
  questionsCorrect: 0,
  questionsIncorrect: 0,
  topicStats: {},
  practiceHistory: [],
  simulacroHistory: [],
  unlockedAchievements: {},
  settings: defaultSettings,
};

export interface AppStore extends AppPersistedState {
  hydrated: boolean;
  practice: PracticeSession | null;
  exam: ExamSession | null;
  lastUnlocked: string[];
  setHydrated: (v: boolean) => void;
  completeOnboarding: (name: string) => void;
  setName: (name: string) => void;
  setAvatar: (id: string) => void;
  patchSettings: (patch: Partial<Settings>) => void;
  clearLastUnlocked: () => void;
  startPractice: (input: {
    courseId: CourseId;
    topicId: string | "mixed";
    questions: Question[];
  }) => void;
  answerPractice: (choice: number) => { correct: boolean; xp: number } | null;
  nextPractice: () => void;
  finishPractice: () => { xpEarned: number; correct: number; total: number } | null;
  abandonPractice: () => void;
  startExam: (input: { courseIds: CourseId[]; questions: Question[] }) => void;
  selectExam: (choice: number) => void;
  flagExam: () => void;
  goExam: (index: number) => void;
  finishExam: () => AppPersistedState["simulacroHistory"][number] | null;
  abandonExam: () => void;
  addStudySeconds: (seconds: number) => void;
  resetAll: () => void;
}

function applyStreak(s: AppPersistedState): { next: AppPersistedState; bonus: number } {
  const today = todayKey();
  if (s.lastStudyDate === today) return { next: s, bonus: 0 };
  if (s.lastStudyDate === yesterdayKey()) {
    const streak = s.streak + 1;
    const bonus = streakBonus(streak);
    return {
      next: {
        ...s,
        streak,
        longestStreak: Math.max(s.longestStreak, streak),
        lastStudyDate: today,
        xp: s.xp + bonus,
      },
      bonus,
    };
  }
  const bonus = streakBonus(1);
  return {
    next: {
      ...s,
      streak: 1,
      longestStreak: Math.max(s.longestStreak, 1),
      lastStudyDate: today,
      xp: s.xp + bonus,
    },
    bonus,
  };
}

function bumpTopic(
  stats: Record<string, TopicStats>,
  courseId: string,
  topicId: string,
  correct: boolean,
): Record<string, TopicStats> {
  const key = topicKey(courseId, topicId);
  const prev = stats[key] ?? emptyStats();
  return {
    ...stats,
    [key]: {
      attempted: prev.attempted + 1,
      correct: prev.correct + (correct ? 1 : 0),
      timeSeconds: prev.timeSeconds,
    },
  };
}

function withAchievements(s: AppPersistedState): { state: AppPersistedState; unlocked: string[] } {
  const newly = evaluateAchievements(s);
  if (!newly.length) return { state: s, unlocked: [] };
  const unlockedAchievements = { ...s.unlockedAchievements };
  const now = Date.now();
  for (const id of newly) unlockedAchievements[id] = now;
  return { state: { ...s, unlockedAchievements }, unlocked: newly };
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...defaultPersisted,
      hydrated: false,
      practice: null,
      exam: null,
      lastUnlocked: [],
      setHydrated: (v) => set({ hydrated: v }),
      completeOnboarding: (name) =>
        set({
          profile: {
            ...get().profile,
            name: name.trim() || "Estudiante",
            onboarded: true,
          },
        }),
      setName: (name) =>
        set({ profile: { ...get().profile, name: name.trim() || get().profile.name } }),
      setAvatar: (id) => set({ profile: { ...get().profile, avatarId: id } }),
      patchSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      clearLastUnlocked: () => set({ lastUnlocked: [] }),
      startPractice: ({ courseId, topicId, questions }) =>
        set({
          practice: {
            id: uid("prac"),
            courseId,
            topicId,
            questions,
            index: 0,
            answers: questions.map((q) => ({
              questionId: q.id,
              choice: null,
              correct: null,
              revealed: false,
            })),
            startedAt: Date.now(),
            xpFromAnswers: 0,
          },
        }),
      answerPractice: (choice) => {
        const session = get().practice;
        if (!session) return null;
        const q = session.questions[session.index];
        const cur = session.answers[session.index];
        if (!q || !cur || cur.revealed) return null;
        const ok = isCorrect(q, choice);
        const gained = ok ? XP.correct : 0;
        const answers = session.answers.map((a, i) =>
          i === session.index ? { ...a, choice, correct: ok, revealed: true } : a,
        );
        const { next } = applyStreak(get());
        const topicStats = bumpTopic(next.topicStats, q.courseId, q.topicId, ok);
        const merged: AppPersistedState = {
          ...next,
          xp: next.xp + gained,
          questionsAttempted: next.questionsAttempted + 1,
          questionsCorrect: next.questionsCorrect + (ok ? 1 : 0),
          questionsIncorrect: next.questionsIncorrect + (ok ? 0 : 1),
          topicStats,
        };
        const { state, unlocked } = withAchievements(merged);
        set({
          ...state,
          practice: { ...session, answers, xpFromAnswers: session.xpFromAnswers + gained },
          lastUnlocked: unlocked.length ? unlocked : get().lastUnlocked,
        });
        return { correct: ok, xp: gained };
      },
      nextPractice: () => {
        const session = get().practice;
        if (!session) return;
        if (session.index >= session.questions.length - 1) return;
        set({ practice: { ...session, index: session.index + 1 } });
      },
      finishPractice: () => {
        const session = get().practice;
        if (!session) return null;
        const total = session.questions.length;
        const correct = session.answers.filter((a) => a.correct).length;
        const seconds = Math.max(1, Math.round((Date.now() - session.startedAt) / 1000));
        const completeBonus = session.answers.every((a) => a.revealed) ? XP.practiceComplete : 0;
        const record = {
          id: session.id,
          courseId: session.courseId,
          topicId: session.topicId,
          total,
          correct,
          xpEarned: session.xpFromAnswers + completeBonus,
          seconds,
          at: Date.now(),
        };
        const merged: AppPersistedState = {
          version: 1,
          profile: get().profile,
          xp: get().xp + completeBonus,
          streak: get().streak,
          longestStreak: get().longestStreak,
          lastStudyDate: get().lastStudyDate,
          studySeconds: get().studySeconds + seconds,
          questionsAttempted: get().questionsAttempted,
          questionsCorrect: get().questionsCorrect,
          questionsIncorrect: get().questionsIncorrect,
          topicStats: get().topicStats,
          practiceHistory: [record, ...get().practiceHistory].slice(0, 50),
          simulacroHistory: get().simulacroHistory,
          unlockedAchievements: get().unlockedAchievements,
          settings: get().settings,
        };
        const { state, unlocked } = withAchievements(merged);
        set({ ...state, practice: null, lastUnlocked: unlocked.length ? unlocked : get().lastUnlocked });
        return { xpEarned: record.xpEarned, correct, total };
      },
      abandonPractice: () => set({ practice: null }),
      startExam: ({ courseIds, questions }) =>
        set({
          exam: {
            id: uid("exam"),
            courseIds,
            questions,
            index: 0,
            answers: questions.map(() => ({ choice: null, flagged: false })),
            startedAt: Date.now(),
            finishedAt: null,
          },
        }),
      selectExam: (choice) => {
        const exam = get().exam;
        if (!exam || exam.finishedAt) return;
        const answers = exam.answers.map((a, i) => (i === exam.index ? { ...a, choice } : a));
        set({ exam: { ...exam, answers } });
      },
      flagExam: () => {
        const exam = get().exam;
        if (!exam) return;
        const answers = exam.answers.map((a, i) =>
          i === exam.index ? { ...a, flagged: !a.flagged } : a,
        );
        set({ exam: { ...exam, answers } });
      },
      goExam: (index) => {
        const exam = get().exam;
        if (!exam) return;
        const i = Math.max(0, Math.min(exam.questions.length - 1, index));
        set({ exam: { ...exam, index: i } });
      },
      finishExam: () => {
        const exam = get().exam;
        if (!exam) return null;
        const finishedAt = Date.now();
        const seconds = Math.max(1, Math.round((finishedAt - exam.startedAt) / 1000));
        let correct = 0;
        let incorrect = 0;
        let unanswered = 0;
        const weakMap = new Map<string, { courseId: CourseId; topicId: string; attempted: number; correct: number }>();
        let topicStats = get().topicStats;
        exam.questions.forEach((q, i) => {
          const choice = exam.answers[i]?.choice ?? null;
          if (choice === null) {
            unanswered += 1;
            return;
          }
          const ok = isCorrect(q, choice);
          if (ok) correct += 1;
          else incorrect += 1;
          topicStats = bumpTopic(topicStats, q.courseId, q.topicId, ok);
          const key = topicKey(q.courseId, q.topicId);
          const prev = weakMap.get(key) ?? { courseId: q.courseId, topicId: q.topicId, attempted: 0, correct: 0 };
          prev.attempted += 1;
          if (ok) prev.correct += 1;
          weakMap.set(key, prev);
        });
        const weakTopics = [...weakMap.values()]
          .filter((t) => t.attempted > 0)
          .sort((a, b) => a.correct / a.attempted - b.correct / b.attempted)
          .slice(0, 4);
        const xpAnswers = correct * XP.correct;
        const { next } = applyStreak(get());
        const record = {
          id: exam.id,
          total: exam.questions.length,
          correct,
          incorrect,
          unanswered,
          seconds,
          xpEarned: xpAnswers + XP.simulacroComplete,
          courseIds: exam.courseIds,
          weakTopics,
          at: finishedAt,
        };
        const merged: AppPersistedState = {
          ...next,
          xp: next.xp + xpAnswers + XP.simulacroComplete,
          studySeconds: next.studySeconds + seconds,
          questionsAttempted: next.questionsAttempted + correct + incorrect,
          questionsCorrect: next.questionsCorrect + correct,
          questionsIncorrect: next.questionsIncorrect + incorrect,
          topicStats,
          simulacroHistory: [record, ...next.simulacroHistory].slice(0, 30),
        };
        const { state, unlocked } = withAchievements(merged);
        set({
          ...state,
          exam: { ...exam, finishedAt },
          lastUnlocked: unlocked.length ? unlocked : get().lastUnlocked,
        });
        return record;
      },
      abandonExam: () => set({ exam: null }),
      addStudySeconds: (seconds) => set({ studySeconds: get().studySeconds + Math.max(0, seconds) }),
      resetAll: () =>
        set({
          ...defaultPersisted,
          settings: get().settings,
          profile: { ...defaultPersisted.profile, onboarded: true, name: get().profile.name, avatarId: get().profile.avatarId },
          practice: null,
          exam: null,
          lastUnlocked: [],
          hydrated: true,
        }),
    }),
    {
      name: "admix-local-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        version: s.version,
        profile: s.profile,
        xp: s.xp,
        streak: s.streak,
        longestStreak: s.longestStreak,
        lastStudyDate: s.lastStudyDate,
        studySeconds: s.studySeconds,
        questionsAttempted: s.questionsAttempted,
        questionsCorrect: s.questionsCorrect,
        questionsIncorrect: s.questionsIncorrect,
        topicStats: s.topicStats,
        practiceHistory: s.practiceHistory,
        simulacroHistory: s.simulacroHistory,
        unlockedAchievements: s.unlockedAchievements,
        settings: s.settings,
        practice: s.practice,
        exam: s.exam,
      }),
    },
  ),
);

export function useHydratedStore() {
  return useAppStore((s) => s.hydrated);
}
