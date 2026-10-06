import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  back,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  back?: string | true;
  action?: ReactNode;
  className?: string;
}) {
  const navigate = useNavigate();
  return (
    <header className={cn("safe-top flex items-start gap-2 px-4 pb-3", className)}>
      {back ? (
        <Button
          variant="ghost"
          size="icon"
          className="mt-0.5 shrink-0"
          aria-label="Volver"
          onClick={() => {
            if (typeof back === "string") navigate({ to: back });
            else window.history.back();
          }}
        >
          <ChevronLeft className="size-5" />
        </Button>
      ) : null}
      <div className="min-w-0 flex-1 pt-2">
        <h1 className="font-display text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-0.5 text-sm text-muted">{subtitle}</p> : null}
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </header>
  );
}
