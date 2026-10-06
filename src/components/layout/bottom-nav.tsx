import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, House, Target, Timer, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/home", label: "Inicio", icon: House },
  { to: "/cursos", label: "Cursos", icon: BookOpen },
  { to: "/practicar", label: "Practicar", icon: Target },
  { to: "/simulacro", label: "Simulacro", icon: Timer },
  { to: "/perfil", label: "Perfil", icon: UserRound },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-lg -translate-x-1/2 border-t border-border bg-bg/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5 px-1 pt-1">
        {ITEMS.map((item) => {
          const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[11px] font-medium transition-colors duration-[var(--motion-quick)]",
                  active ? "text-primary" : "text-muted hover:text-fg",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
