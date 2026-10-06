import { createFileRoute } from "@tanstack/react-router";
import { Award, Lock } from "lucide-react";
import { AppFrame } from "@/components/layout/app-frame";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { ACHIEVEMENTS } from "@/lib/gamification/achievements";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/logros")({ component: Logros });

function Logros() {
  const unlocked = useAppStore((s) => s.unlockedAchievements);
  const done = Object.keys(unlocked).length;

  return (
    <AppFrame>
      <PageHeader title="Logros" subtitle={`${done} de ${ACHIEVEMENTS.length} desbloqueados`} />
      <div className="space-y-2 px-4 pb-8">
        {ACHIEVEMENTS.map((a) => {
          const at = unlocked[a.id];
          const open = Boolean(at);
          return (
            <Card
              key={a.id}
              className={cn("flex items-start gap-3 p-4", !open && "opacity-70")}
            >
              <span
                className={cn(
                  "inline-flex size-10 shrink-0 items-center justify-center rounded-xl",
                  open ? "bg-primary/15 text-primary" : "bg-surface-2 text-muted",
                )}
              >
                {open ? <Award className="size-5" /> : <Lock className="size-4" />}
              </span>
              <div>
                <p className="font-display font-semibold">{a.name}</p>
                <p className="text-sm text-muted">{open ? a.description : a.hint}</p>
                {open ? (
                  <p className="mt-1 text-xs text-subtle">{new Date(at).toLocaleDateString("es")}</p>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>
    </AppFrame>
  );
}
