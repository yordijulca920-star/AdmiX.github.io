import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("text-fg", className)}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="16" fill="#12151C" />
      <polygon points="32,10 10,54 54,54" fill="#EEF1F4" />
      <rect x="16" y="36" width="32" height="8" fill="#4FB8AE" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="size-9 rounded-lg" />
      <span className="font-display text-xl font-bold tracking-tight">
        AdmiX
      </span>
    </div>
  );
}
