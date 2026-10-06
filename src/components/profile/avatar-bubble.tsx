import { getAvatar } from "@/data/avatars";
import { cn } from "@/lib/utils";

export function AvatarBubble({
  id,
  size = "md",
  className,
}: {
  id: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const avatar = getAvatar(id);
  const dim = size === "sm" ? "size-9 text-sm" : size === "lg" ? "size-20 text-3xl" : "size-12 text-lg";
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-display font-semibold",
        dim,
        className,
      )}
      style={{ background: avatar.bg, color: avatar.fg }}
      aria-label={avatar.label}
    >
      {avatar.glyph}
    </div>
  );
}
