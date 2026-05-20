export type Badge = {
  emoji: string;
  labelDe: string;
  labelEn: string;
};

export function getBadge(score: number, total: number): Badge {
  const pct = total > 0 ? (score / total) * 100 : 0;

  if (pct >= 95) return { emoji: "🎓", labelDe: "WCAG-Profi", labelEn: "WCAG Pro" };
  if (pct >= 80) return { emoji: "🏆", labelDe: "Hervorragend", labelEn: "Excellent" };
  if (pct >= 60) return { emoji: "⭐", labelDe: "Sehr gut", labelEn: "Very good" };
  if (pct >= 40) return { emoji: "📚", labelDe: "Solides Grundwissen", labelEn: "Solid foundation" };
  return { emoji: "🌱", labelDe: "Aller Anfang ist schwer", labelEn: "Keep learning" };
}
