import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Flag, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { AppFrame } from "@/components/layout/app-frame";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getCourse } from "@/data/courses";
import { useAppStore } from "@/lib/store/app-store";
import { cn, formatClock } from "@/lib/utils";

export const Route = createFileRoute("/simulacro/sesion")({ component: ExamSession });

function ExamSession() {
  const navigate = useNavigate();
  const exam = useAppStore((s) => s.exam);
  const selectExam = useAppStore((s) => s.selectExam);
  const flagExam = useAppStore((s) => s.flagExam);
  const goExam = useAppStore((s) => s.goExam);
  const finishExam = useAppStore((s) => s.finishExam);
  const [grid, setGrid] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!exam) {
      navigate({ to: "/simulacro", replace: true });
      return;
    }
    if (exam.finishedAt) {
      navigate({ to: "/simulacro/resultado", replace: true });
    }
  }, [exam, navigate]);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  if (!exam || exam.finishedAt) return null;
  const q = exam.questions[exam.index]!;
  const ans = exam.answers[exam.index]!;
  const answered = exam.answers.filter((a) => a.choice !== null).length;
  const elapsed = Math.floor((now - exam.startedAt) / 1000);

  function deliver() {
    finishExam();
    setConfirm(false);
    void navigate({ to: "/simulacro/resultado" });
  }

  return (
    <AppFrame hideNav>
      <div className="flex min-h-dvh flex-col px-4 pt-4 pb-5">
        <header className="flex items-center justify-between gap-2">
          <div>
            <p className="tabular font-display text-lg font-semibold">{formatClock(elapsed)}</p>
            <p className="text-xs text-muted">
              {exam.index + 1} / {exam.questions.length} · {answered} respondidas
            </p>
          </div>
          <div className="flex gap-1">
            <Button variant={ans.flagged ? "default" : "secondary"} size="icon" onClick={flagExam} aria-label="Marcar">
              <Flag className="size-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={() => setGrid(true)} aria-label="Mapa">
              <LayoutGrid className="size-4" />
            </Button>
          </div>
        </header>

        <p className="mt-4 text-xs text-primary">{getCourse(q.courseId)?.name}</p>
        <h1 className="mt-1 font-display text-lg leading-snug font-semibold">{q.stem}</h1>

        <ul className="mt-4 flex flex-col gap-2">
          {q.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const selected = ans.choice === i;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => selectExam(i)}
                  className={cn(
                    "flex w-full min-h-12 items-start gap-3 rounded-xl px-3 py-3 text-left text-sm shadow-[var(--shadow-border)]",
                    selected ? "bg-primary text-primary-fg" : "bg-surface",
                  )}
                >
                  <span className="font-display tabular opacity-70">{letter}</span>
                  <span>{opt}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
          <Button variant="secondary" size="lg" disabled={exam.index === 0} onClick={() => goExam(exam.index - 1)}>
            Anterior
          </Button>
          {exam.index === exam.questions.length - 1 ? (
            <Button size="lg" onClick={() => setConfirm(true)}>
              Entregar
            </Button>
          ) : (
            <Button size="lg" onClick={() => goExam(exam.index + 1)}>
              Siguiente
            </Button>
          )}
        </div>
        <Button variant="ghost" className="mt-2 w-full" onClick={() => setConfirm(true)}>
          Terminar ahora
        </Button>
      </div>

      <Dialog open={grid} onOpenChange={setGrid}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Navegar</DialogTitle>
            <DialogDescription>Toca un número para saltar. El punto marca las que señalaste.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-6 gap-2">
            {exam.questions.map((_, i) => {
              const a = exam.answers[i]!;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    goExam(i);
                    setGrid(false);
                  }}
                  className={cn(
                    "relative min-h-11 rounded-lg text-sm tabular shadow-[var(--shadow-border)]",
                    i === exam.index && "ring-2 ring-primary",
                    a.choice !== null ? "bg-primary/20" : "bg-surface-2",
                  )}
                >
                  {i + 1}
                  {a.flagged ? <span className="absolute top-1 right-1 size-1.5 rounded-full bg-warn" /> : null}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Entregar simulacro?</DialogTitle>
            <DialogDescription>
              {exam.questions.length - answered} sin responder. No podrás cambiar las marcas después.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setConfirm(false)}>
              Seguir
            </Button>
            <Button className="flex-1" onClick={deliver}>
              Entregar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppFrame>
  );
}
