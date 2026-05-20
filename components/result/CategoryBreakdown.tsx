"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type CategoryData = { subject: string; score: number; fullMark: number };

type Props = {
  categories: CategoryData[];
  heading: string;
};

export default function CategoryBreakdown({ categories, heading }: Props) {
  if (categories.length === 0) return null;

  const ariaLabel = categories
    .map((c) => `${c.subject}: ${c.score}%`)
    .join(", ");

  return (
    <section aria-labelledby="category-heading">
      <h2 id="category-heading" className="text-xl font-semibold mb-4">
        {heading}
      </h2>

      {categories.length >= 3 ? (
        <div role="img" aria-label={ariaLabel} className="w-full">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={categories}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <Radar
                dataKey="score"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.25}
              />
              <Tooltip formatter={(val) => [`${val}%`]} />
            </RadarChart>
          </ResponsiveContainer>
          <p className="sr-only">{ariaLabel}</p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label={ariaLabel}>
          {categories.map((cat) => (
            <li key={cat.subject}>
              <div className="flex justify-between text-sm mb-1">
                <span>{cat.subject}</span>
                <span className="font-medium">{cat.score}%</span>
              </div>
              <div
                className="h-3 w-full rounded-full bg-secondary overflow-hidden"
                role="presentation"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
