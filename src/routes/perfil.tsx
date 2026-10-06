import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppFrame } from "@/components/layout/app-frame";
import { PageHeader } from "@/components/layout/page-header";
import { AvatarBubble } from "@/components/profile/avatar-bubble";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AVATARS } from "@/data/avatars";
import { COURSES } from "@/data/courses";
import { ACHIEVEMENTS } from "@/lib/gamification/achievements";
import { levelProgress } from "@/lib/gamification/levels";
import { courseStats } from "@/lib/stats/derived";
import { useAppStore } from "@/lib/store/app-store";

export const Route = createFileRoute("/perfil")({ component: Perfil });

function Perfil() {
  const profile = useAppStore((s) => s.profile);
  const xp = useAppStore((s) => s.xp);
  const streak = useAppStore((s) => s.streak);
  const longest = useAppStore((s) => s.longestStreak);
  const topicStats = useAppStore((s) => s.topicStats);
  const unlocked = useAppStore((s) => s.unlockedAchievements);
  const questionsAttempted = useAppStore((s) => s.questionsAttempted);
  const questionsCorrect = useAppStore((s) => s.questionsCorrect);
  const setName = useAppStore((s) => s.setName);
  const setAvatar = useAppStore((s) => s.setAvatar);
  const [name, setLocal] = useState(profile.name);
  const level = levelProgress(xp);

  return (
    <AppFrame>
      <PageHeader title="Perfil" subtitle="Tu identidad de estudio" />
      <div className="space-y-5 px-4 pb-8">
        <div className="flex flex-col items-center text-center">
          <AvatarBubble id={profile.avatarId} size="lg" />
          <h2 className="mt-3 font-display text-2xl font-semibold">{profile.name}</h2>
          <p className="text-sm text-muted">
            Nivel {level.current.id} · {level.current.name}
          </p>
        </div>

        <Card className="p-4">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted">{xp} XP</span>
            <span className="tabular text-muted">
              {level.next ? `Siguiente: ${level.next.name}` : "Rango máximo"}
            </span>
          </div>
          <Progress value={level.ratio * 100} />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="tabular font-display text-lg">{streak}d</p>
              <p className="text-[11px] text-muted">Racha</p>
            </div>
            <div>
              <p className="tabular font-display text-lg">{questionsCorrect}</p>
              <p className="text-[11px] text-muted">Aciertos</p>
            </div>
            <div>
              <p className="tabular font-display text-lg">{questionsAttempted}</p>
              <p className="text-[11px] text-muted">Intentos</p>
            </div>
          </div>
        </Card>

        <section>
          <h3 className="mb-2 text-sm font-medium text-muted">Nombre</h3>
          <div className="flex gap-2">
            <Input value={name} onChange={(e) => setLocal(e.target.value)} maxLength={32} />
            <Button
              variant="secondary"
              onClick={() => setName(name)}
              disabled={!name.trim() || name.trim() === profile.name}
            >
              Guardar
            </Button>
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-medium text-muted">Avatar</h3>
          <div className="grid grid-cols-5 gap-2">
            {AVATARS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAvatar(a.id)}
                className={`rounded-full p-0.5 ${profile.avatarId === a.id ? "ring-2 ring-primary" : ""}`}
                aria-label={a.label}
              >
                <AvatarBubble id={a.id} size="sm" className="size-12 text-base" />
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-medium text-muted">Progreso por curso</h3>
          <div className="space-y-2">
            {COURSES.map((c) => {
              const s = courseStats({ topicStats }, c.id);
              return (
                <Card key={c.id} className="p-3">
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{c.name}</span>
                    <span className="tabular text-muted">{s.progress}%</span>
                  </div>
                  <Progress value={s.progress} />
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted">Logros</h3>
            <Link to="/logros" className="text-xs text-primary">
              Ver todos
            </Link>
          </div>
          <p className="text-sm">
            {Object.keys(unlocked).length} de {ACHIEVEMENTS.length} · racha máxima {longest}d
          </p>
        </section>
      </div>
    </AppFrame>
  );
}
