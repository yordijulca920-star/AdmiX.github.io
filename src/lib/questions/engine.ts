import { COURSES, getCourse } from "@/data/courses";
import { generateQuestions } from "@/data/questions";
import { shuffle } from "@/data/questions/helpers";
import type { CourseId, Question } from "@/lib/models/types";

function makeSeed() {
  return (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0;
}

export function buildPracticeSet(
  courseId: CourseId,
  topicId: string | "mixed",
  count: number,
  seed = makeSeed(),
): Question[] {
  const course = getCourse(courseId);
  if (!course) return [];
  const n = Math.max(1, Math.min(50, Math.floor(count)));
  if (topicId === "mixed") {
    const per = Math.ceil(n / course.topics.length);
    const pool: Question[] = [];
    course.topics.forEach((t, idx) => {
      pool.push(...generateQuestions(courseId, t.id, per, seed + idx * 17));
    });
    return shuffle(() => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    }, pool).slice(0, n);
  }
  return generateQuestions(courseId, topicId, n, seed);
}

export function buildSimulacroSet(courseIds: CourseId[], count: number, seed = makeSeed()): Question[] {
  const ids = courseIds.length ? courseIds : (COURSES.map((c) => c.id) as CourseId[]);
  const n = Math.max(5, Math.min(100, Math.floor(count)));
  const pool: Question[] = [];
  ids.forEach((cid, i) => {
    const course = getCourse(cid);
    if (!course) return;
    const perTopic = Math.max(2, Math.ceil(n / (ids.length * Math.min(4, course.topics.length))));
    course.topics.slice(0, 8).forEach((t, j) => {
      pool.push(...generateQuestions(cid, t.id, perTopic, seed + i * 100 + j * 13));
    });
  });
  let s = seed;
  const rng = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
  return shuffle(rng, pool).slice(0, n);
}

export function isCorrect(question: Question, choice: number | null): boolean {
  return choice !== null && choice === question.correctIndex;
}
