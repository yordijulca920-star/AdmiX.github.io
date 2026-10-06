import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BottomNav } from "./bottom-nav";

export function AppFrame({
  children,
  hideNav = false,
  className,
}: {
  children: ReactNode;
  hideNav?: boolean;
  className?: string;
}) {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div
        className={cn(
          "relative mx-auto flex min-h-dvh w-full max-w-lg flex-col",
          hideNav ? "pb-4" : "safe-bottom",
          className,
        )}
      >
        {children}
      </div>
      {hideNav ? null : <BottomNav />}
    </div>
  );
}
