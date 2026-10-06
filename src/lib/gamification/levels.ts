import type { LevelId } from "@/lib/models/types";

export interface LevelDef {
  id: LevelId;
  name: string;
  minXp: number;
}

export const LEVELS: LevelDef[] = [
  { id: 1, name: "Principiante", minXp: 0 },
  { id: 2, name: "Aprendiz", minXp: 150 },
  { id: 3, name: "Estudiante", minXp: 400 },
  { id: 4, name: "Avanzado", minXp: 900 },
  { id: 5, name: "Experto", minXp: 1800 },
  { id: 6, name: "Maestro", minXp: 3500 },
];

export const XP = {
  correct: 10,
  practiceComplete: 50,
  simulacroComplete: 100,
  streakDailyCap: 50,
} as const;

export function getLevel(xp: number): LevelDef {
  let current = LEVELS[0]!;
  for (const level of LEVELS) {
    if (xp >= level.minXp) current = level;
  }
  return current;
}

export function getNextLevel(xp: number): LevelDef | null {
  const current = getLevel(xp);
  return LEVELS.find((l) => l.id === current.id + 1) ?? null;
}

export function levelProgress(xp: number): { current: LevelDef; next: LevelDef | null; ratio: number; into: number; span: number } {
  const current = getLevel(xp);
  const next = getNextLevel(xp);
  if (!next) {
    return { current, next: null, ratio: 1, into: 0, span: 1 };
  }
  const span = next.minXp - current.minXp;
  const into = xp - current.minXp;
  return { current, next, ratio: Math.min(1, into / span), into, span };
}

export function streakBonus(streak: number): number {
  if (streak <= 0) return 0;
  return Math.min(XP.streakDailyCap, 5 * streak);
}
