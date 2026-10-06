import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppFrame } from "@/components/layout/app-frame";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { avgSimulacro, bestSimulacro, rankedCourses } from "@/lib/stats/derived";
import { useAppStore } from "@/lib/store/app-store";
import { formatDuration, percent } from "@/lib/utils";

export const Route = createFileRoute("/estadisticas")({ component: Estadisticas });

function Estadisticas() {
  const attempted = useAppStore((s) => s.questionsAttempted);
  const correct = useAppStore((s) => s.questionsCorrect);
  const incorrect = useAppStore((s) => s.questionsIncorrect);
  const studySeconds = useAppStore((s) => s.studySeconds);
  const topicStats = useAppStore((s) => s.topicStats);
  const simulacroHistory = useAppStore((s) => s.simulacroHistory);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const ranked = useMemo(() => rankedCourses({ topicStats }), [topicStats]);
  const best = bestSimulacro({ simulacroHistory });
  const avg = avgSimulacro({ simulacroHistory });
  const acc = percent(correct, attempted);
  const chart = ranked.map((r) => ({ name: r.course.short, aciertos: r.accuracy }));

  return (
    <AppFrame>
      <PageHeader title="Estadísticas" subtitle="Tu rendimiento acumulado" />
      <div className="space-y-4 px-4 pb-8">
        <div className="grid grid-cols-2 gap-2">
          <Mini label="Resueltas" value={String(attempted)} />
          <Mini label="Correctas" value={String(correct)} />
          <Mini label="Incorrectas" value={String(incorrect)} />
          <Mini label="Aciertos" value={`${acc}%`} />
        </div>
        <Card className="p-4">
          <p className="text-xs text-muted">Tiempo total de estudio</p>
          <p className="font-display text-2xl tabular font-semibold">{formatDuration(studySeconds)}</p>
        </Card>

        <Card className="p-4">
          <h2 className="font-display text-base font-semibold">Rendimiento por curso</h2>
          {chart.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Completa una práctica para ver la gráfica.</p>
          ) : mounted ? (
            <div className="mt-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "currentColor", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
                    contentStyle={{ background: "var(--admix-surface)", border: "none", borderRadius: 12 }}
                  />
                  <Bar dataKey="aciertos" fill="var(--admix-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-3 h-48 rounded-xl bg-surface-2" />
          )}
        </Card>

        <section>
          <h2 className="mb-2 font-display text-base font-semibold">Mejor y menor curso</h2>
          {ranked.length === 0 ? (
            <p className="text-sm text-muted">Todavía no hay ranking.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Card className="p-3">
                <p className="text-[11px] text-muted">Mejor</p>
                <p className="font-medium">{ranked[0]!.course.name}</p>
                <p className="tabular text-sm text-primary">{ranked[0]!.accuracy}%</p>
              </Card>
              <Card className="p-3">
                <p className="text-[11px] text-muted">A reforzar</p>
                <p className="font-medium">{ranked[ranked.length - 1]!.course.name}</p>
                <p className="tabular text-sm text-danger">{ranked[ranked.length - 1]!.accuracy}%</p>
              </Card>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-2 font-display text-base font-semibold">Simulacros</h2>
          <div className="grid grid-cols-2 gap-2">
            <Mini label="Intentos" value={String(simulacroHistory.length)} />
            <Mini label="Promedio" value={`${avg}%`} />
            <Mini label="Mejor" value={best ? `${percent(best.correct, best.total)}%` : "—"} />
            <Mini label="Último" value={simulacroHistory[0] ? `${percent(simulacroHistory[0].correct, simulacroHistory[0].total)}%` : "—"} />
          </div>
          <div className="mt-3 space-y-2">
            {simulacroHistory.slice(0, 8).map((s) => (
              <Card key={s.id} className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm">{new Date(s.at).toLocaleDateString("es")}</p>
                  <p className="text-xs text-muted">
                    {s.correct}/{s.total} · {formatDuration(s.seconds)}
                  </p>
                </div>
                <span className="tabular font-display text-lg">{percent(s.correct, s.total)}%</span>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppFrame>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-3">
      <p className="text-[11px] text-muted">{label}</p>
      <p className="font-display text-xl tabular font-semibold">{value}</p>
    </Card>
  );
}
