import { CheckCircle, XCircle } from "lucide-react";
import { t, type Locale } from "@/lib/i18n";
import type { Answer } from "@/lib/schema";

type Props = { answer: Answer; index: number; lang: Locale };

export default function AnswerItem({ answer, index, lang }: Props) {
  const labels = t[lang];

  return (
    <li
      className={[
        "rounded-xl border bg-card p-5 shadow-sm",
        "border-l-4",
        answer.is_correct ? "border-l-success" : "border-l-error",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "mt-0.5 flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
            answer.is_correct
              ? "bg-success/10 text-success"
              : "bg-error/10 text-error",
          ].join(" ")}
          aria-label={answer.is_correct ? labels.correct : labels.incorrect}
        >
          {answer.is_correct ? (
            <CheckCircle aria-hidden="true" size={13} strokeWidth={2.5} />
          ) : (
            <XCircle aria-hidden="true" size={13} strokeWidth={2.5} />
          )}
          <span>{answer.is_correct ? labels.correct : labels.incorrect}</span>
        </div>

        {answer.sc_reference && (
          <span className="mt-0.5 rounded border border-border px-2 py-0.5 text-xs text-muted-foreground font-mono">
            SC {answer.sc_reference}
          </span>
        )}
      </div>

      <h3 className="mt-3 font-semibold leading-snug">
        {index + 1}. {answer.question}
      </h3>

      <dl className="mt-3 space-y-1 text-sm">
        <div>
          <dt className="inline font-medium text-muted-foreground">
            {labels.yourAnswer}:{" "}
          </dt>
          <dd className="inline">{answer.user_answer}</dd>
        </div>

        {!answer.is_correct && (
          <div>
            <dt className="inline font-medium text-success">
              {labels.correctAnswer}:{" "}
            </dt>
            <dd className="inline">{answer.correct_answer}</dd>
          </div>
        )}
      </dl>

      {answer.explanation && (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
            {labels.explanation}
          </summary>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {answer.explanation}
          </p>
        </details>
      )}
    </li>
  );
}
