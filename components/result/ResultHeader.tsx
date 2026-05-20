import { getBadge } from "@/lib/badges";
import { t, type Locale } from "@/lib/i18n";
import type { QuizResult } from "@/lib/schema";

type Props = { result: QuizResult };

export default function ResultHeader({ result }: Props) {
  const lang = result.language as Locale;
  const labels = t[lang];
  const badge = getBadge(result.score, result.total);
  const pct = Math.round((result.score / result.total) * 100);
  const badgeLabel = lang === "de" ? badge.labelDe : badge.labelEn;

  const date = new Date(result.createdAt).toLocaleDateString(
    lang === "de" ? "de-DE" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const difficultyLabel = labels.difficulty[result.difficulty];

  return (
    <header className="rounded-2xl bg-card border border-border p-8 shadow-sm">
      <p className="text-sm text-muted-foreground">
        {date} · {result.module} · {difficultyLabel}
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight">
        {labels.hello}, {result.name}!
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-6">
        <div
          className="flex items-baseline gap-1"
          aria-label={`${labels.yourScore}: ${result.score} von ${result.total}`}
        >
          <span className="text-7xl font-bold text-primary leading-none">
            {result.score}
          </span>
          <span className="text-4xl font-semibold text-muted-foreground">
            /{result.total}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold">{pct}%</span>
          <span
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-lg font-semibold text-accent-foreground"
            role="img"
            aria-label={badgeLabel}
          >
            <span aria-hidden="true">{badge.emoji}</span>
            {badgeLabel}
          </span>
        </div>
      </div>

      <p className="sr-only">
        {labels.correctOf(result.score, result.total)}
      </p>
    </header>
  );
}
