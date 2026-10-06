import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store/app-store";

export const Route = createFileRoute("/")({ component: Welcome });

function Welcome() {
  const navigate = useNavigate();
  const onboarded = useAppStore((s) => s.profile.onboarded);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const existingName = useAppStore((s) => s.profile.name);
  const [name, setName] = useState(existingName === "Estudiante" ? "" : existingName);

  useEffect(() => {
    if (onboarded) navigate({ to: "/home", replace: true });
  }, [onboarded, navigate]);

  function start() {
    completeOnboarding(name);
    navigate({ to: "/home" });
  }

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-bg text-fg">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 -left-20 size-64 rounded-full border border-border" />
      <svg className="pointer-events-none absolute top-24 left-6 size-28 text-fg/10" viewBox="0 0 100 100" aria-hidden>
        <polygon points="50,8 92,88 8,88" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg className="pointer-events-none absolute right-8 bottom-40 size-24 text-primary/30" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 50 H92 M50 8 V92" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-between px-6 py-10">
        <div className="stagger-in mt-8 space-y-5">
          <LogoMark className="size-[4.5rem] rounded-[1.25rem] shadow-[var(--shadow-border)]" />
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-primary uppercase">Admisión · Ingeniería</p>
            <h1 className="mt-2 font-display text-5xl font-extrabold tracking-tight">AdmiX</h1>
            <p className="mt-3 max-w-[16rem] text-base text-muted">Prepárate. Practica. Ingresa.</p>
          </div>
        </div>

        <form
          className="stagger-in space-y-4 pb-4"
          onSubmit={(e) => {
            e.preventDefault();
            start();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Tu nombre</Label>
            <Input
              id="name"
              placeholder="Cómo te llamamos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="given-name"
              maxLength={32}
            />
          </div>
          <Button type="submit" size="xl" className="w-full">
            Comenzar
            <ArrowRight className="size-4" />
          </Button>
          <p className="text-center text-xs text-subtle">
            Progreso local en este dispositivo. Sin cuenta, listo para usar.
          </p>
        </form>
      </div>
    </main>
  );
}
