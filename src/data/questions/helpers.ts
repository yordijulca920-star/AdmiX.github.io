import type { CourseId, Question } from "@/lib/models/types";

export type Rng = () => number;

export function makeRng(seed: number): Rng {
  let a = (seed >>> 0) || 1;
  return () => {
    a = (Math.imul(a, 1664525) + 1013904223) >>> 0;
    return a / 4294967296;
  };
}

export function pick<T>(rng: Rng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

export function randint(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

export function shuffle<T>(rng: Rng, list: readonly T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function q(
  courseId: CourseId,
  topicId: string,
  stem: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  difficulty: 1 | 2 | 3 = 2,
  id?: string,
): Question {
  return {
    id: id ?? `${courseId}:${topicId}:${hash(stem + options.join("|"))}`,
    courseId,
    topicId,
    stem,
    options,
    correctIndex,
    explanation,
    difficulty,
  };
}

function hash(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

export function optionsAround(
  rng: Rng,
  correct: number,
  format: (n: number) => string = String,
): { options: string[]; correctIndex: number } {
  const bag = new Set<number>([correct]);
  const deltas = [-20, -12, -10, -8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 24, 25];
  let guard = 0;
  while (bag.size < 4 && guard < 80) {
    guard += 1;
    const v = correct + pick(rng, deltas);
    bag.add(v);
  }
  while (bag.size < 4) bag.add(correct + bag.size * 3 + 1);
  const values = shuffle(rng, [...bag]).slice(0, 4);
  if (!values.includes(correct)) values[0] = correct;
  const shuffled = shuffle(rng, values);
  return {
    options: shuffled.map(format),
    correctIndex: shuffled.indexOf(correct),
  };
}

export function choiceOptions(rng: Rng, correct: string, distractors: string[]): { options: string[]; correctIndex: number } {
  const unique = [correct, ...distractors.filter((d) => d !== correct)].slice(0, 5);
  const shuffled = shuffle(rng, unique);
  return { options: shuffled, correctIndex: shuffled.indexOf(correct) };
}

export function nOptions(
  rng: Rng,
  correct: string,
  others: string[],
): { options: string[]; correctIndex: number } {
  return choiceOptions(rng, correct, others);
}
