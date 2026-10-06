import { createFileRoute } from "@tanstack/react-router";
import { AppFrame } from "@/components/layout/app-frame";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { requestBrowserPermission } from "@/lib/notifications/reminders";
import { useAppStore } from "@/lib/store/app-store";

export const Route = createFileRoute("/configuracion")({ component: Configuracion });

function Configuracion() {
  const settings = useAppStore((s) => s.settings);
  const patch = useAppStore((s) => s.patchSettings);
  const resetAll = useAppStore((s) => s.resetAll);

  async function enableReminders(key: "reminderStudy" | "reminderSimulacro" | "reminderMotivation" | "reminderStreak", value: boolean) {
    patch({ [key]: value });
    if (value) await requestBrowserPermission();
  }

  return (
    <AppFrame>
      <PageHeader title="Configuración" subtitle="Apariencia, avisos y datos" />
      <div className="space-y-4 px-4 pb-8">
        <Card className="divide-y divide-border p-1">
          <Row
            title="Modo oscuro"
            desc="Identidad por defecto de AdmiX"
            checked={settings.theme === "dark"}
            onChange={(v) => patch({ theme: v ? "dark" : "light" })}
          />
          <Row
            title="Respuesta táctil"
            desc="Preparado para vibración en Android nativo"
            checked={settings.haptic}
            onChange={(v) => patch({ haptic: v })}
          />
        </Card>

        <div>
          <h2 className="mb-2 px-1 text-sm font-medium text-muted">Recordatorios</h2>
          <Card className="divide-y divide-border p-1">
            <Row
              title="Estudio diario"
              desc="Aviso para abrir una práctica"
              checked={settings.reminderStudy}
              onChange={(v) => enableReminders("reminderStudy", v)}
            />
            <Row
              title="Simulacros"
              desc="Recuerda agendar un examen semanal"
              checked={settings.reminderSimulacro}
              onChange={(v) => enableReminders("reminderSimulacro", v)}
            />
            <Row
              title="Motivación"
              desc="Mensajes cortos al entrar"
              checked={settings.reminderMotivation}
              onChange={(v) => enableReminders("reminderMotivation", v)}
            />
            <Row
              title="Racha"
              desc="Alerta si la cadena está en riesgo"
              checked={settings.reminderStreak}
              onChange={(v) => enableReminders("reminderStreak", v)}
            />
          </Card>
          <p className="mt-2 px-1 text-xs text-subtle">
            Los avisos en el navegador piden permiso. En la versión Android nativa se conectan a notificaciones del sistema.
          </p>
        </div>

        <Card className="p-4">
          <h2 className="font-display font-semibold">Datos</h2>
          <p className="mt-1 text-sm text-muted">
            Todo se guarda en este dispositivo. La arquitectura ya admite un adaptador de nube para sincronizar más adelante.
          </p>
          <Button
            variant="danger"
            className="mt-4 w-full"
            onClick={() => {
              if (window.confirm("Esto borra XP, historial y logros. El nombre se conserva.")) resetAll();
            }}
          >
            Reiniciar progreso
          </Button>
        </Card>

        <p className="px-1 text-center text-xs text-subtle">AdmiX · Prepárate. Practica. Ingresa.</p>
      </div>
    </AppFrame>
  );
}

function Row({
  title,
  desc,
  checked,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <div className="min-w-0 flex-1">
        <Label className="text-sm">{title}</Label>
        <p className="text-xs text-muted">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
