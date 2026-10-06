import type { AppPersistedState } from "@/lib/models/types";
import { COURSE_BY_ID } from "@/data/courses";
import { getLevel } from "./levels";

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  hint: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first-practice",
    name: "Primera práctica",
    description: "Completaste tu primera sesión de práctica.",
    hint: "Termina un set de preguntas.",
  },
  {
    id: "q-100",
    name: "Cien preguntas",
    description: "Has respondido 100 preguntas.",
    hint: "Acumula 100 intentos.",
  },
  {
    id: "q-500",
    name: "Quinientas",
    description: "Has respondido 500 preguntas.",
    hint: "Acumula 500 intentos.",
  },
  {
    id: "q-1000",
    name: "Mil preguntas",
    description: "Has respondido 1000 preguntas.",
    hint: "Acumula 1000 intentos.",
  },
  {
    id: "first-simulacro",
    name: "Primer simulacro",
    description: "Completaste tu primer examen cronometrado.",
    hint: "Termina un simulacro.",
  },
  {
    id: "streak-7",
    name: "Semana firme",
    description: "Mantén una racha de 7 días.",
    hint: "Estudia 7 días seguidos.",
  },
  {
    id: "streak-30",
    name: "Mes de acero",
    description: "Mantén una racha de 30 días.",
    hint: "Estudia 30 días seguidos.",
  },
  {
    id: "algebra-master",
    name: "Maestro del Álgebra",
    description: "Al menos 30 aciertos en Álgebra con 80% o más.",
    hint: "Domina el curso de Álgebra.",
  },
  {
    id: "fisica-master",
    name: "Maestro de Física",
    description: "Al menos 30 aciertos en Física con 80% o más.",
    hint: "Domina el curso de Física.",
  },
  {
    id: "level-maestro",
    name: "Rango Maestro",
    description: "Alcanzaste el nivel 6 · Maestro.",
    hint: "Reúne 3500 XP.",
  },
  {
    id: "perfect-practice",
    name: "Práctica perfecta",
    description: "Completa una práctica de 10 o más sin errores.",
    hint: "10/10 o mejor, sin fallos.",
  },
  {
    id: "simulacro-80",
    name: "Listo para ingresar",
    description: "Obtén 80% o más en un simulacro de 20+ preguntas.",
    hint: "Simulacro largo con alto acierto.",
  },
];

export function achievementById(id: string) {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

function courseMastered(state: AppPersistedState, courseId: string, minCorrect = 30, minRatio = 0.8) {
  let attempted = 0;
  let correct = 0;
  const course = COURSE_BY_ID[courseId as keyof typeof COURSE_BY_ID];
  if (!course) return false;
  for (const topic of course.topics) {
    const s = state.topicStats[`${courseId}:${topic.id}`];
    if (!s) continue;
    attempted += s.attempted;
    correct += s.correct;
  }
  return correct >= minCorrect && attempted > 0 && correct / attempted >= minRatio;
}

export function evaluateAchievements(state: AppPersistedState): string[] {
  const unlocked = new Set(Object.keys(state.unlockedAchievements));
  const next: string[] = [];
  const maybe = (id: string, ok: boolean) => {
    if (ok && !unlocked.has(id)) next.push(id);
  };

  maybe("first-practice", state.practiceHistory.length >= 1);
  maybe("q-100", state.questionsAttempted >= 100);
  maybe("q-500", state.questionsAttempted >= 500);
  maybe("q-1000", state.questionsAttempted >= 1000);
  maybe("first-simulacro", state.simulacroHistory.length >= 1);
  maybe("streak-7", state.longestStreak >= 7 || state.streak >= 7);
  maybe("streak-30", state.longestStreak >= 30 || state.streak >= 30);
  maybe("algebra-master", courseMastered(state, "algebra"));
  maybe("fisica-master", courseMastered(state, "fisica"));
  maybe("level-maestro", getLevel(state.xp).id >= 6);
  maybe(
    "perfect-practice",
    state.practiceHistory.some((p) => p.total >= 10 && p.correct === p.total),
  );
  maybe(
    "simulacro-80",
    state.simulacroHistory.some((s) => s.total >= 20 && s.correct / s.total >= 0.8),
  );

  return next;
}
