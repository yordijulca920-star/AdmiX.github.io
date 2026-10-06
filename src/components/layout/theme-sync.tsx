import { useEffect } from "react";
import { useAppStore } from "@/lib/store/app-store";

export function ThemeSync() {
  const theme = useAppStore((s) => s.settings.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#F3F1EB" : "#090B10");
  }, [theme]);

  return null;
}
