import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppFrame } from "@/components/layout/app-frame";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCourse, getTopic } from "@/data/courses";
import { isCorrect } from "@/lib/questions/engine";
import { useAppStore } from "@/lib/store/app-store";
import { formatDuration, percent } from "@/lib/utils";

export const Route = createFileRoute("/simulacro/resultado")({ component: Resultado });

function Resultado() {
  const navigate = useNavigate();
  const exam = useAppStore((s) => s.exam);
  const history = useAppStore((s) => s.simulacroHistory);
  const abandonExam = useAppStore((s) => s.abandonExam);

  const record = history[0];
  const data = useMemo(() => {
    if (!exam || !exam.finishedAt) return record ?? null;
    return record && record.id === exam.id ? record : record;
  }, [exam, record]);

  if (!data) {
    return (
      <AppFrame>
        <PageHeader title="Resultados" back="/simulacro" />
        <p className="px-4 text-sm text-muted">Aún no hay un simulacro entregado.</p>
      </AppFrame>
    );
  }

  const pct = percent(data.correct, data.total);
  const avg = data.total > 0 ? Math.round(data.seconds / data.total) : 0;

  return (
    <AppFrame>
      <PageHeader title="Resultados" subtitle="Simulacro entregado" back="/simulacro" />
      <div className="space-y-4 px-4 pb-8">
        <Card className="p-5 text-center">
          <p className="text-xs tracking-[0.18em] text-muted uppercase">Puntaje</p>
          <p className="font-display text-5xl font-semibold tabular">{pct}%</p>
          <p className="mt-1 text-sm text-muted">
            {data.correct} correctas · {data.incorrect} incorrectas · {data.unanswered} en blanco
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-2">
          <Mini label="Tiempo" value={formatDuration(data.seconds)} />
          <Mini label="Promedio / pregunta" value={`${avg}s`} />
          <Mini label="XP" value={`+${data.xpEarned}`} />
          <Mini label="Preguntas" value={String(data.total)} />
        </div>

        <section>
          <h2 className="mb-2 font-display text-base font-semibold">Tus temas más débiles</h2>
          {data.weakTopics.length === 0 ? (
            <p className="text-sm text-muted">No hay suficientes datos en este intento.</p>
          ) : (
            <div className="space-y-2">
              {data.weakTopics.map((t) => {
                const course = getCourse(t.courseId);
                const topic = getTopic(t.courseId, t.topicId);
                const acc = percent(t.correct, t.attempted);
                return (
                  <Card key={`${t.courseId}:${t.topicId}`} className="flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm font-medium">{topic?.name ?? t.topicId}</p>
                      <p className="text-xs text-muted">{course?.name}</p>
                    </div>
                    <span className="tabular text-sm">{acc}%</span>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {exam && exam.finishedAt ? (
          <section>
            <h2 className="mb-2 font-display text-base font-semibold">Revisión</h2>
            <div className="space-y-3">
              {exam.questions.map((q, i) => {
                const choice = exam.answers[i]?.choice ?? null;
                const ok = isCorrect(q, choice);
                const blank = choice === null;
                return (
                  <Card key={q.id + i} className="p-3">
                    <p className="text-xs text-muted">
                      {i + 1}. {blank ? "Sin responder" : ok ? "Correcta" : "Incorrecta"}
                    </p>
                    <p className="mt-1 text-sm">{q.stem}</p>
                    <p className="mt-2 text-xs text-primary">Correcta: {q.options[q.correctIndex]}</p>
                    {blank || ok ? null : (
                      <p className="text-xs text-danger">Elegiste: {q.options[choice!]}</p>
                    )}
                    <p className="mt-2 text-xs text-muted">{q.explanation}</p>
                  </Card>
                );
              })}
            </div>
          </section>
        ) : null}

        <Button
          size="xl"
          className="w-full"
          onClick={() => {
            abandonExam();
            navigate({ to: "/simulacro" });
          }}
        >
          Nuevo simulacro
        </Button>
        <Button asChild variant="secondary" size="lg" className="w-full">
          <Link to="/estadisticas">Ver estadísticas</Link>
        </Button>
      </div>
    </AppFrame>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-3">
      <p className="text-[11px] text-muted">{label}</p>
      <p className="font-display text-lg tabular font-semibold">{value}</p>
    </Card>
  );
}
