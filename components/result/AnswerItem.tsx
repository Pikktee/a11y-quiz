import { Check, X, ChevronDown } from "lucide-react";
import { t, type Locale } from "@/lib/i18n";
import type { Answer } from "@/lib/schema";

type Props = { answer: Answer; index: number; lang: Locale };

export default function AnswerItem({ answer, index, lang }: Props) {
  const labels = t[lang];

  return (
    <li
      className={[
        "rounded-2xl border p-5 shadow-sm",
        answer.is_correct
          ? "bg-success/5 border-success/20"
          : "bg-error/5 border-error/20",
      ].join(" ")}
    >
      {/* Top row: meta + status icon */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {lang === "de" ? "Frage" : "Question"} {index + 1}
          </span>
          {answer.sc_reference && (
            <span className="rounded border border-border bg-card px-2 py-0.5 text-xs font-mono text-muted-foreground">
              SC {answer.sc_reference}
            </span>
          )}
          {answer.category && (
            <span className="rounded-full bg-card border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
              {answer.category}
            </span>
          )}
        </div>

        <div
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            answer.is_correct ? "bg-success text-white" : "bg-error text-white",
          ].join(" ")}
          aria-label={answer.is_correct ? labels.correct : labels.incorrect}
        >
          {answer.is_correct ? (
            <Check aria-hidden="true" size={16} strokeWidth={2.5} />
          ) : (
            <X aria-hidden="true" size={16} strokeWidth={2.5} />
          )}
        </div>
      </div>

      {/* Question text */}
      <h3 className="mt-3 font-semibold leading-snug">
        {answer.question}
      </h3>

      {/* Answer boxes */}
      <div className="mt-3 space-y-2">
        <div
          className={[
            "rounded-xl px-4 py-3 text-sm",
            answer.is_correct
              ? "bg-success/10"
              : "bg-muted/60",
          ].join(" ")}
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {labels.yourAnswer}
          </p>
          <p className={answer.is_correct ? "" : "line-through text-muted-foreground"}>
            {answer.user_answer}
          </p>
        </div>

        {!answer.is_correct && (
          <div className="rounded-xl bg-success/10 px-4 py-3 text-sm">
            <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-success mb-1">
              {labels.correctAnswer}
            </p>
            <p>{answer.correct_answer}</p>
          </div>
        )}
      </div>

      {/* Explanation */}
      {answer.explanation && (
        <details className="group mt-3">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded w-fit">
            <ChevronDown
              aria-hidden="true"
              size={15}
              className="transition-transform duration-200 group-open:rotate-180"
            />
            {labels.explanation}
          </summary>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed pl-5">
            {answer.explanation}
          </p>
        </details>
      )}
    </li>
  );
}
