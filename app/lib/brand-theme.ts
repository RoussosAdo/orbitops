import type { CSSProperties } from "react";

type ThemeStyle = CSSProperties & Record<`--${string}`, string>;

const brandThemes: Record<string, ThemeStyle> = {
  "Neo Mint": {
    "--background": "#f4f6fb",
    "--background-elevated": "#eef2ff",
    "--muted": "#f8faff",
    "--primary": "#6d5efc",
    "--primary-dark": "#5546f0",
    "--primary-light": "#a5b4fc",
    "--ring": "rgba(109, 94, 252, 0.24)",
    "--brand-gradient":
      "linear-gradient(135deg,#5b5cf0 0%,#4f7cff 55%,#23b6d2 100%)",
    "--brand-page-bg":
      "radial-gradient(circle at 10% 10%, rgba(109,94,252,0.16), transparent 30%), radial-gradient(circle at 90% 20%, rgba(35,182,210,0.14), transparent 28%), linear-gradient(135deg,#f8faff 0%,#f4f6fb 55%,#eef7ff 100%)",
  },

  "Ocean Blue": {
    "--background": "#eff8ff",
    "--background-elevated": "#e0f2fe",
    "--muted": "#f0f9ff",
    "--primary": "#0284c7",
    "--primary-dark": "#0369a1",
    "--primary-light": "#7dd3fc",
    "--ring": "rgba(2, 132, 199, 0.24)",
    "--brand-gradient":
      "linear-gradient(135deg,#0284c7 0%,#2563eb 55%,#22d3ee 100%)",
    "--brand-page-bg":
      "radial-gradient(circle at 12% 12%, rgba(2,132,199,0.16), transparent 30%), radial-gradient(circle at 88% 18%, rgba(34,211,238,0.16), transparent 28%), linear-gradient(135deg,#f0f9ff 0%,#eff6ff 55%,#e0f2fe 100%)",
  },

  "Sunset Orange": {
    "--background": "#fff7ed",
    "--background-elevated": "#ffedd5",
    "--muted": "#fff7ed",
    "--primary": "#f97316",
    "--primary-dark": "#ea580c",
    "--primary-light": "#fdba74",
    "--ring": "rgba(249, 115, 22, 0.24)",
    "--brand-gradient":
      "linear-gradient(135deg,#f97316 0%,#fb923c 55%,#facc15 100%)",
    "--brand-page-bg":
      "radial-gradient(circle at 10% 10%, rgba(249,115,22,0.15), transparent 30%), radial-gradient(circle at 88% 18%, rgba(250,204,21,0.16), transparent 28%), linear-gradient(135deg,#fff7ed 0%,#fffaf0 52%,#ffedd5 100%)",
  },

  "Slate Gray": {
    "--background": "#f8fafc",
    "--background-elevated": "#e2e8f0",
    "--muted": "#f8fafc",
    "--primary": "#475569",
    "--primary-dark": "#334155",
    "--primary-light": "#94a3b8",
    "--ring": "rgba(71, 85, 105, 0.24)",
    "--brand-gradient":
      "linear-gradient(135deg,#475569 0%,#64748b 55%,#94a3b8 100%)",
    "--brand-page-bg":
      "radial-gradient(circle at 10% 10%, rgba(71,85,105,0.14), transparent 30%), radial-gradient(circle at 90% 18%, rgba(148,163,184,0.16), transparent 28%), linear-gradient(135deg,#f8fafc 0%,#f1f5f9 55%,#e2e8f0 100%)",
  },
};

export function getBrandThemeStyles(brandColor?: string | null): ThemeStyle {
  return brandThemes[brandColor ?? "Neo Mint"] ?? brandThemes["Neo Mint"];
}