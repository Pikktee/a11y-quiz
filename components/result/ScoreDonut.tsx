"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type Props = {
  score: number;
  total: number;
  labelCorrect: string;
  labelIncorrect: string;
  ariaLabel: string;
};

const COLORS = ["var(--success)", "var(--error)"];

export default function ScoreDonut({ score, total, labelCorrect, labelIncorrect, ariaLabel }: Props) {
  const data = [
    { name: labelCorrect, value: score },
    { name: labelIncorrect, value: total - score },
  ];

  return (
    <div role="img" aria-label={ariaLabel} className="flex flex-col items-center gap-4">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            aria-hidden="true"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} stroke="none" />
            ))}
          </Pie>
          <Tooltip formatter={(val, name) => [`${val}`, name]} />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex gap-6 text-sm" aria-hidden="true">
        {data.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[i] }}
            />
            <span>{entry.name}: <strong>{entry.value}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}
