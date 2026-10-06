import { useEffect, useState, type ReactNode } from "react";
import { useAppStore } from "@/lib/store/app-store";
import { LogoMark } from "@/components/brand/logo";

export function StoreGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => {
      useAppStore.getState().setHydrated(true);
      setReady(true);
    });
    void useAppStore.persist.rehydrate();
    if (useAppStore.persist.hasHydrated()) {
      useAppStore.getState().setHydrated(true);
      setReady(true);
    }
    return unsub;
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-bg text-fg">
        <LogoMark className="size-16" />
        <p className="mt-4 font-display text-lg tracking-tight">AdmiX</p>
      </div>
    );
  }

  return children;
}
