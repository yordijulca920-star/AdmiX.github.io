import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppFrame } from "@/components/layout/app-frame";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { COURSES } from "@/data/courses";
import type { CourseId } from "@/lib/models/types";
import { buildSimulacroSet } from "@/lib/questions/engine";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/simulacro/")({ component: SimulacroSetup });

const COUNTS = [20, 40, 60] as const;

function SimulacroSetup() {
  const navigate = useNavigate();
  const startExam = useAppStore((s) => s.startExam);
  const existing = useAppStore((s) => s.exam);
  const [selected, setSelected] = useState<CourseId[]>(COURSES.map((c) => c.id));
  const [count, setCount] = useState<number | "custom">(20);
  const [custom, setCustom] = useState("25");

  function toggle(id: CourseId) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.length === 1 ? prev : prev.filter((x) => x !== id);
      return [...prev, id];
    });
  }

  function start() {
    const n = count === "custom" ? Math.max(5, Math.min(100, Number(custom) || 20)) : count;
    const questions = buildSimulacroSet(selected, n);
    startExam({ courseIds: selected, questions });
    void navigate({ to: "/simulacro/sesion" });
  }

  return (
    <AppFrame>
      <PageHeader title="Simulacro" subtitle="Examen cronometrado. Sin pistas hasta el final." />
      <div className="space-y-5 px-4 pb-6">
        {existing && !existing.finishedAt ? (
          <Card className="p-4">
            <p className="text-sm">Tienes un simulacro en curso.</p>
            <Button className="mt-3 w-full" onClick={() => navigate({ to: "/simulacro/sesion" })}>
              Continuar
            </Button>
          </Card>
        ) : null}

        <section>
          <h2 className="mb-2 text-sm font-medium text-muted">Cursos incluidos</h2>
          <div className="flex flex-col gap-2">
            {COURSES.map((c) => {
              const on = selected.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggle(c.id)}
                  className={cn(
                    "flex min-h-12 items-center justify-between rounded-xl px-4 text-left text-sm shadow-[var(--shadow-border)]",
                    on ? "bg-primary text-primary-fg" : "bg-surface",
                  )}
                >
                  <span>{c.name}</span>
                  <span className="text-xs opacity-80">{c.topics.length} temas</span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-medium text-muted">Número de preguntas</h2>
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
                "min-h-12 rounded-xl text-xs shadow-[var(--shadow-border)]",
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
              min={5}
              max={100}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
            />
          ) : null}
        </section>

        <Card className="p-4 text-sm text-muted">
          Cronómetro visible, navegación libre, marca para revisar. Las soluciones aparecen al entregar.
        </Card>

        <Button size="xl" className="w-full" onClick={start}>
          Iniciar simulacro
        </Button>
      </div>
    </AppFrame>
  );
}
