/**
 * Notification architecture (client-ready).
 * MVP: in-app banners on launch when reminders are enabled.
 * Later: Web Push / Android alarms without changing Settings keys.
 */

export type ReminderKind = "study" | "simulacro" | "motivation" | "streak";

const COPY: Record<ReminderKind, string[]> = {
  study: [
    "Veinte minutos de práctica rinden más que una noche entera.",
    "Abre un tema débil y resuelve diez preguntas ahora.",
  ],
  simulacro: [
    "Un simulacro esta semana mide de verdad tu avance.",
    "Examen cronometrado: misma presión, menos sorpresas el día real.",
  ],
  motivation: [
    "Prepárate. Practica. Ingresa.",
    "Cada pregunta correcta es un metro más cerca de la universidad.",
  ],
  streak: [
    "Tu racha te espera. No la rompas hoy.",
    "Un día cuenta. Abre AdmiX y resuelve al menos cinco preguntas.",
  ],
};

export function pickReminder(kind: ReminderKind, streak: number): string {
  const pool = COPY[kind];
  if (kind === "streak" && streak > 0) {
    return `Llevas ${streak} día${streak === 1 ? "" : "s"} seguidos. Sigue la cadena.`;
  }
  const i = Math.abs(Math.floor(Date.now() / 86_400_000)) % pool.length;
  return pool[i]!;
}

export async function requestBrowserPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

export function sendLocalNotification(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/favicon.svg" });
  } catch {
    /* ignore: unsupported in this frame */
  }
}
