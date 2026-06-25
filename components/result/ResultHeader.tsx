import { getBadge } from "@/lib/badges";
import { getEvaluationText } from "@/lib/evaluation";
import { t, type Locale } from "@/lib/i18n";
import type { QuizResult } from "@/lib/schema";

type Props = {
  result: QuizResult;
  weakCategories?: string[];
};

export default function ResultHeader({ result, weakCategories = [] }: Props) {
  const lang = result.language as Locale;
  const labels = t[lang];
  const badge = getBadge(result.score, result.total);
  const pct = Math.round((result.score / result.total) * 100);
  const badgeLabel = lang === "de" ? badge.labelDe : badge.labelEn;
  const evaluationText = getEvaluationText(
    result.score,
    result.total,
    result.name,
    result.difficulty,
    weakCategories,
    lang
  );

  const date = new Date(result.createdAt).toLocaleDateString(
    lang === "de" ? "de-DE" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const difficultyLabel = labels.difficulty[result.difficulty as keyof typeof labels.difficulty];

  const progressColor =
    pct >= 80 ? "var(--success)" : pct >= 60 ? "var(--primary)" : pct >= 40 ? "#f59e0b" : "var(--error)";

  return (
    <header className="rounded-2xl overflow-hidden border border-border shadow-sm">
      {/* Gradient hero */}
      <div
        className="px-8 pt-8 pb-6"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, transparent), color-mix(in srgb, var(--accent) 60%, transparent))",
        }}
      >
        {/* Meta row */}
        <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          {date}&nbsp;·&nbsp;{result.module}&nbsp;·&nbsp;{difficultyLabel}
        </p>

        {/* Greeting */}
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          {labels.hello}, {result.name}!
        </h1>

        {/* Score */}
        <div
          className="mt-6 flex flex-wrap items-end gap-4"
          aria-label={`${labels.yourScore}: ${result.score} von ${result.total}`}
        >
          <div className="flex items-baseline gap-1 leading-none">
            <span className="text-[5.5rem] font-black text-primary tabular-nums leading-none">
              {result.score}
            </span>
            <span className="text-4xl font-semibold text-muted-foreground">
              /{result.total}
            </span>
          </div>

          <div className="mb-2 flex flex-col gap-1.5">
            <span className="text-3xl font-bold tabular-nums">{pct}%</span>
            <span
              className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-sm font-semibold backdrop-blur-sm"
              role="img"
              aria-label={badgeLabel}
            >
              <span aria-hidden="true" className="text-base">{badge.emoji}</span>
              {badgeLabel}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 h-2.5 w-full rounded-full bg-black/10 overflow-hidden" aria-hidden="true">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: progressColor }}
          />
        </div>
        <p className="sr-only">{labels.correctOf(result.score, result.total)}</p>
      </div>

      {/* Personalized evaluation text */}
      <div className="bg-card border-t border-border px-8 py-5 flex items-start gap-4">
        <span className="text-3xl shrink-0 leading-none mt-0.5" aria-hidden="true">
          {badge.emoji}
        </span>
        <p className="text-base text-muted-foreground leading-relaxed">
          {evaluationText}
        </p>
      </div>
    </header>
  );
}
