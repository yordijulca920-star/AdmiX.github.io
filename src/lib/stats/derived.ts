import { COURSES, topicKey } from "@/data/courses";
import type { AppPersistedState, CourseId } from "@/lib/models/types";
import { percent } from "@/lib/utils";

export function courseStats(state: Pick<AppPersistedState, "topicStats">, courseId: CourseId) {
  const course = COURSES.find((c) => c.id === courseId);
  let attempted = 0;
  let correct = 0;
  let topicsTouched = 0;
  for (const topic of course?.topics ?? []) {
    const s = state.topicStats[topicKey(courseId, topic.id)];
    if (!s || s.attempted === 0) continue;
    topicsTouched += 1;
    attempted += s.attempted;
    correct += s.correct;
  }
  const totalTopics = course?.topics.length ?? 1;
  return {
    attempted,
    correct,
    accuracy: percent(correct, attempted),
    progress: percent(topicsTouched, totalTopics),
    topicsTouched,
    totalTopics,
  };
}

export function overallProgress(state: Pick<AppPersistedState, "topicStats">) {
  let touched = 0;
  let total = 0;
  for (const course of COURSES) {
    total += course.topics.length;
    for (const topic of course.topics) {
      const s = state.topicStats[topicKey(course.id, topic.id)];
      if (s && s.attempted > 0) touched += 1;
    }
  }
  return percent(touched, total);
}

export function rankedCourses(state: Pick<AppPersistedState, "topicStats">) {
  return COURSES.map((c) => ({ course: c, ...courseStats(state, c.id) }))
    .filter((c) => c.attempted > 0)
    .sort((a, b) => b.accuracy - a.accuracy);
}

export function bestSimulacro(state: Pick<AppPersistedState, "simulacroHistory">) {
  if (!state.simulacroHistory.length) return null;
  return state.simulacroHistory.reduce((best, cur) =>
    cur.correct / cur.total > best.correct / best.total ? cur : best,
  );
}

export function avgSimulacro(state: Pick<AppPersistedState, "simulacroHistory">) {
  if (!state.simulacroHistory.length) return 0;
  const sum = state.simulacroHistory.reduce((n, s) => n + s.correct / s.total, 0);
  return Math.round((sum / state.simulacroHistory.length) * 100);
}
