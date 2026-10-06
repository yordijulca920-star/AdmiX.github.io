export interface AvatarDef {
  id: string;
  label: string;
  bg: string;
  fg: string;
  glyph: string;
}

export const AVATARS: AvatarDef[] = [
  { id: "sigma", label: "Sigma", bg: "#1a2a2c", fg: "#4fb8ae", glyph: "Σ" },
  { id: "pi", label: "Pi", bg: "#1c2230", fg: "#9bb4d0", glyph: "π" },
  { id: "delta", label: "Delta", bg: "#241c1a", fg: "#d4a574", glyph: "Δ" },
  { id: "omega", label: "Omega", bg: "#1a1f2c", fg: "#8ea0c4", glyph: "Ω" },
  { id: "lambda", label: "Lambda", bg: "#1d2420", fg: "#7dba98", glyph: "λ" },
  { id: "phi", label: "Phi", bg: "#1e2420", fg: "#8fbfa8", glyph: "φ" },
  { id: "theta", label: "Theta", bg: "#222018", fg: "#c8c090", glyph: "θ" },
  { id: "nabla", label: "Nabla", bg: "#1a2428", fg: "#6ec4d4", glyph: "∇" },
  { id: "atom", label: "Átomo", bg: "#1c2430", fg: "#7eb8e0", glyph: "A" },
  { id: "hex", label: "Hex", bg: "#201c18", fg: "#e0c8a8", glyph: "⬡" },
];

export function getAvatar(id: string): AvatarDef {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0]!;
}
