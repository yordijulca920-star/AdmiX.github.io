import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { AppFrame } from "@/components/layout/app-frame";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getCourse, getTopic } from "@/data/courses";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/practicar/sesion")({ component: PracticeSession });

function PracticeSession() {
  const navigate = useNavigate();
  const practice = useAppStore((s) => s.practice);
  const answerPractice = useAppStore((s) => s.answerPractice);
  const nextPractice = useAppStore((s) => s.nextPractice);
  const finishPractice = useAppStore((s) => s.finishPractice);
  const [picked, setPicked] = useState<number | null>(null);
  const [summary, setSummary] = useState<{ xpEarned: number; correct: number; total: number } | null>(null);

  useEffect(() => {
    if (!practice && !summary) navigate({ to: "/practicar", replace: true });
  }, [practice, summary, navigate]);

  if (summary) {
    return (
      <AppFrame hideNav>
        <div className="stagger-in flex min-h-dvh flex-col justify-center px-6 py-10">
          <p className="text-xs tracking-[0.2em] text-primary uppercase">Práctica lista</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Bien trabajado</h1>
          <Card className="mt-6 space-y-3 p-5">
            <Row label="Aciertos" value={`${summary.correct} / ${summary.total}`} />
            <Row label="XP ganada" value={`+${summary.xpEarned}`} />
          </Card>
          <Button className="mt-6 w-full" size="xl" onClick={() => navigate({ to: "/practicar" })}>
            Nueva práctica
          </Button>
          <Button className="mt-2 w-full" size="lg" variant="secondary" onClick={() => navigate({ to: "/home" })}>
            Ir al inicio
          </Button>
        </div>
      </AppFrame>
    );
  }

  if (!practice) return null;
  const q = practice.questions[practice.index]!;
  const ans = practice.answers[practice.index]!;
  const course = getCourse(q.courseId);
  const topic = getTopic(q.courseId, q.topicId);
  const last = practice.index === practice.questions.length - 1;
  const revealed = ans.revealed;

  function submit() {
    if (picked === null) return;
    answerPractice(picked);
  }

  function goNext() {
    if (last) {
      const result = finishPractice();
      if (result) setSummary(result);
      return;
    }
    setPicked(null);
    nextPractice();
  }

  return (
    <AppFrame hideNav>
      <div className="flex min-h-dvh flex-col px-4 pt-5 pb-6">
        <div className="mb-3 flex items-center justify-between text-xs text-muted">
          <span>
            {course?.short} · {topic?.name ?? "Mixto"}
          </span>
          <span className="tabular">
            {practice.index + 1}/{practice.questions.length}
          </span>
        </div>
        <Progress value={((practice.index + (revealed ? 1 : 0)) / practice.questions.length) * 100} />

        <h1 className="mt-5 font-display text-xl leading-snug font-semibold">{q.stem}</h1>

        <ul className="mt-5 flex flex-col gap-2">
          {q.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const selected = (revealed ? ans.choice : picked) === i;
            const isRight = revealed && i === q.correctIndex;
            const isWrong = revealed && selected && i !== q.correctIndex;
            return (
              <li key={i}>
                <button
                  type="button"
                  disabled={revealed}
                  onClick={() => setPicked(i)}
                  className={cn(
                    "flex w-full min-h-12 items-start gap-3 rounded-xl px-3 py-3 text-left text-sm shadow-[var(--shadow-border)]",
                    isRight && "bg-success/15 text-fg",
                    isWrong && "bg-danger/15",
                    !revealed && selected && "bg-primary/15",
                    !revealed && !selected && "bg-surface",
                    revealed && !isRight && !isWrong && "bg-surface opacity-70",
                  )}
                >
                  <span className="font-display tabular text-muted">{letter}</span>
                  <span className="flex-1">{opt}</span>
                  {isRight ? <Check className="size-4 text-success" /> : null}
                  {isWrong ? <X className="size-4 text-danger" /> : null}
                </button>
              </li>
            );
          })}
        </ul>

        {revealed ? (
          <Card className="mt-4 p-4">
            <p className={cn("font-medium", ans.correct ? "text-success" : "text-danger")}>
              {ans.correct ? "Correcto" : "Incorrecto"}
              <span className="ml-2 text-fg">+{ans.correct ? 10 : 0} XP</span>
            </p>
            {!ans.correct ? (
              <p className="mt-1 text-sm text-muted">
                Respuesta correcta: {q.options[q.correctIndex]}
              </p>
            ) : null}
            <p className="mt-2 text-sm text-fg/90">{q.explanation}</p>
          </Card>
        ) : null}

        <div className="mt-auto pt-6">
          {revealed ? (
            <Button size="xl" className="w-full" onClick={goNext}>
              {last ? "Ver resultados" : "Siguiente pregunta"}
            </Button>
          ) : (
            <Button size="xl" className="w-full" disabled={picked === null} onClick={submit}>
              Responder
            </Button>
          )}
        </div>
      </div>
    </AppFrame>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="tabular font-medium">{value}</span>
    </div>
  );
}
