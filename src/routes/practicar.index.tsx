import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CourseIcon } from "@/components/course/course-icon";
import { AppFrame } from "@/components/layout/app-frame";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COURSES, getCourse } from "@/data/courses";
import type { CourseId } from "@/lib/models/types";
import { buildPracticeSet } from "@/lib/questions/engine";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

type Search = { course?: string; topic?: string };

export const Route = createFileRoute("/practicar/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    course: typeof s.course === "string" ? s.course : undefined,
    topic: typeof s.topic === "string" ? s.topic : undefined,
  }),
  component: Practicar,
});

const COUNTS = [10, 20, 30] as const;

function Practicar() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const startPractice = useAppStore((s) => s.startPractice);
  const initialCourse = COURSES.some((c) => c.id === search.course)
    ? (search.course as CourseId)
    : COURSES[0]!.id;
  const [courseId, setCourseId] = useState<CourseId>(initialCourse);
  const course = getCourse(courseId)!;
  const initialTopic =
    search.topic === "mixed" || course.topics.some((t) => t.id === search.topic)
      ? (search.topic as string)
      : course.topics[0]!.id;
  const [topicId, setTopicId] = useState(initialTopic);
  const [count, setCount] = useState<number | "custom">(10);
  const [custom, setCustom] = useState("15");

  const resolvedTopic = useMemo(() => {
    if (topicId === "mixed") return "mixed" as const;
    if (course.topics.some((t) => t.id === topicId)) return topicId;
    return course.topics[0]!.id;
  }, [course, topicId]);

  function start() {
    const n = count === "custom" ? Math.max(1, Math.min(50, Number(custom) || 10)) : count;
    const questions = buildPracticeSet(courseId, resolvedTopic, n);
    startPractice({ courseId, topicId: resolvedTopic, questions });
    void navigate({ to: "/practicar/sesion" });
  }

  return (
    <AppFrame>
      <PageHeader title="Practicar" subtitle="Elige curso, tema y cantidad" />
      <div className="space-y-5 px-4 pb-6">
        <section>
          <h2 className="mb-2 text-sm font-medium text-muted">Curso</h2>
          <div className="grid grid-cols-2 gap-2">
            {COURSES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCourseId(c.id);
                  setTopicId(c.topics[0]!.id);
                }}
                className={cn(
                  "flex min-h-12 items-center gap-2 rounded-xl px-3 py-2 text-left text-sm shadow-[var(--shadow-border)]",
                  courseId === c.id ? "bg-primary text-primary-fg" : "bg-surface",
                )}
              >
                <CourseIcon id={c.id} />
                <span className="leading-tight">{c.short}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-medium text-muted">Tema</h2>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setTopicId("mixed")}
              className={cn(
                "min-h-11 rounded-xl px-3 py-2 text-left text-sm shadow-[var(--shadow-border)]",
                resolvedTopic === "mixed" ? "bg-primary text-primary-fg" : "bg-surface",
              )}
            >
              Todos los temas de {course.name}
            </button>
            {course.topics.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTopicId(t.id)}
                className={cn(
                  "min-h-11 rounded-xl px-3 py-2 text-left text-sm shadow-[var(--shadow-border)]",
                  resolvedTopic === t.id ? "bg-primary text-primary-fg" : "bg-surface",
                )}
              >
                {t.name}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-medium text-muted">Preguntas</h2>
          <div className="grid grid-cols-4 gap-2">
            {COUNTS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                className={cn(
                  "min-h-12 rounded-xl font-display text-lg tabular shadow-[var(--shadow-border)]",
                  count === n ? "bg-primary text-primary-fg" : "bg-surface",
                )}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCount("custom")}
              className={cn(
                "min-h-12 rounded-xl text-xs font-medium shadow-[var(--shadow-border)]",
                count === "custom" ? "bg-primary text-primary-fg" : "bg-surface",
              )}
            >
              Otro
            </button>
          </div>
          {count === "custom" ? (
            <Input
              className="mt-3"
              type="number"
              min={1}
              max={50}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              aria-label="Cantidad personalizada"
            />
          ) : null}
        </section>

        <Button size="xl" className="w-full" onClick={start}>
          Empezar práctica
        </Button>
      </div>
    </AppFrame>
  );
}
