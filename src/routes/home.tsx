import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  BookOpen,
  Flame,
  Settings,
  Target,
  Timer,
  UserRound,
  Zap,
} from "lucide-react";
import { AvatarBubble } from "@/components/profile/avatar-bubble";
import { AppFrame } from "@/components/layout/app-frame";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { pickReminder } from "@/lib/notifications/reminders";
import { levelProgress } from "@/lib/gamification/levels";
import { overallProgress } from "@/lib/stats/derived";
import { useAppStore } from "@/lib/store/app-store";
import { ACHIEVEMENTS } from "@/lib/gamification/achievements";

export const Route = createFileRoute("/home")({ component: Home });

const MENU = [
  { to: "/perfil", label: "Perfil", desc: "Avatar, nivel y racha", icon: UserRound },
  { to: "/cursos", label: "Cursos", desc: "Temario de admisión", icon: BookOpen },
  { to: "/practicar", label: "Practicar", desc: "Preguntas con explicación", icon: Target },
  { to: "/simulacro", label: "Simulacro", desc: "Examen cronometrado", icon: Timer },
  { to: "/estadisticas", label: "Estadísticas", desc: "Aciertos y debilidades", icon: BarChart3 },
  { to: "/logros", label: "Logros", desc: "Insignias desbloqueadas", icon: Award },
  { to: "/configuracion", label: "Configuración", desc: "Tema y recordatorios", icon: Settings },
] as const;

function Home() {
  const profile = useAppStore((s) => s.profile);
  const xp = useAppStore((s) => s.xp);
  const streak = useAppStore((s) => s.streak);
  const topicStats = useAppStore((s) => s.topicStats);
  const settings = useAppStore((s) => s.settings);
  const lastUnlocked = useAppStore((s) => s.lastUnlocked);
  const clearLastUnlocked = useAppStore((s) => s.clearLastUnlocked);
  const progress = overallProgress({ topicStats });
  const level = levelProgress(xp);
  const reminder = settings.reminderMotivation
    ? pickReminder(streak > 0 && settings.reminderStreak ? "streak" : "motivation", streak)
    : null;
  const unlockedName = lastUnlocked[0] ? ACHIEVEMENTS.find((a) => a.id === lastUnlocked[0])?.name : null;

  return (
    <AppFrame>
      <div className="stagger-in space-y-5 px-4 pt-6">
        <div className="flex items-center gap-3">
          <AvatarBubble id={profile.avatarId} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">AdmiX</p>
            <h1 className="truncate font-display text-2xl font-semibold tracking-tight">
              Hola, {profile.name}
            </h1>
            <p className="text-sm text-muted">
              Nivel {level.current.id} · {level.current.name}
            </p>
          </div>
        </div>

        <Card className="p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted">XP · {xp}</span>
            <span className="tabular text-muted">
              {level.next ? `${level.into}/${level.span} al ${level.next.name}` : "Máximo"}
            </span>
          </div>
          <Progress value={level.ratio * 100} />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <StatChip icon={Zap} label="XP" value={String(xp)} />
            <StatChip icon={Flame} label="Racha" value={`${streak}d`} />
            <StatChip icon={BarChart3} label="Temario" value={`${progress}%`} />
          </div>
        </Card>

        {unlockedName ? (
          <button
            type="button"
            onClick={clearLastUnlocked}
            className="w-full rounded-2xl bg-primary/12 px-4 py-3 text-left text-sm text-primary shadow-[var(--shadow-border)]"
          >
            Logro desbloqueado: {unlockedName}
          </button>
        ) : reminder ? (
          <p className="rounded-2xl bg-surface px-4 py-3 text-sm text-muted shadow-[var(--shadow-border)]">
            {reminder}
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-3 pb-2">
          {MENU.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className={item.to === "/configuracion" ? "col-span-2" : ""}>
                <Card className="flex h-full min-h-[6.5rem] flex-col justify-between p-4 transition-[box-shadow] duration-[var(--motion-quick)] hover:shadow-[var(--shadow-border-hover)]">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg bg-surface-2 text-primary">
                      <Icon className="size-4" />
                    </span>
                    {item.to === "/simulacro" ? <Badge variant="primary">Examen</Badge> : null}
                  </div>
                  <div>
                    <p className="font-display font-semibold">{item.label}</p>
                    <p className="text-xs text-muted">{item.desc}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </AppFrame>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Zap;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-surface-2 px-3 py-2">
      <div className="flex items-center gap-1 text-muted">
        <Icon className="size-3.5" />
        <span className="text-[11px]">{label}</span>
      </div>
      <p className="tabular font-display text-lg font-semibold">{value}</p>
    </div>
  );
}
