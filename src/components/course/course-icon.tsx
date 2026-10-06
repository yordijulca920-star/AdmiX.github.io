import {
  Atom,
  Binary,
  Calculator,
  Pyramid,
  Sigma,
  Triangle,
} from "lucide-react";
import type { CourseId } from "@/lib/models/types";
import { cn } from "@/lib/utils";

const ICONS = {
  razonamiento: Sigma,
  fisica: Atom,
  algebra: Binary,
  geometria: Triangle,
  trigonometria: Pyramid,
  aritmetica: Calculator,
} as const;

export function CourseIcon({ id, className }: { id: CourseId; className?: string }) {
  const Icon = ICONS[id] ?? Sigma;
  return <Icon className={cn("size-5", className)} strokeWidth={1.8} />;
}
