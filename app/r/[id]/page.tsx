import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";
import { quizResults } from "@/lib/schema";
import { getBadge } from "@/lib/badges";
import { t, type Locale } from "@/lib/i18n";
import LangSync from "@/components/result/LangSync";
import ResultHeader from "@/components/result/ResultHeader";
import ScoreDonut from "@/components/result/ScoreDonut";
import CategoryBreakdown from "@/components/result/CategoryBreakdown";
import AnswerList from "@/components/result/AnswerList";
import ShareButtons from "@/components/result/ShareButtons";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const rows = await getDb().select().from(quizResults).where(eq(quizResults.resultId, id)).limit(1);

  if (rows.length === 0) {
    return { title: "Ergebnis nicht gefunden — A11y Quiz", robots: { index: false } };
  }

  const r = rows[0];
  const badge = getBadge(r.score, r.total);
  const badgeLabel = r.language === "de" ? badge.labelDe : badge.labelEn;

  return {
    title: `${badge.emoji} ${r.score}/${r.total} — A11y Quiz`,
    description: `${r.name} hat ${r.score} von ${r.total} Fragen richtig beantwortet. ${badgeLabel}`,
    robots: { index: false },
    openGraph: {
      title: `${badge.emoji} ${r.score}/${r.total} im A11y Quiz!`,
      description: `${r.name}: ${r.score}/${r.total} Punkte — ${badgeLabel}`,
    },
  };
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params;
  const rows = await getDb().select().from(quizResults).where(eq(quizResults.resultId, id)).limit(1);

  if (rows.length === 0) notFound();

  const result = rows[0];
  const lang = result.language as Locale;
  const labels = t[lang];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const resultUrl = `${baseUrl}/r/${result.resultId}`;

  // Kategorien aggregieren für den Radar/Balken-Chart
  const categoryMap: Record<string, { correct: number; total: number }> = {};
  for (const answer of result.answers) {
    if (!answer.category) continue;
    if (!categoryMap[answer.category]) categoryMap[answer.category] = { correct: 0, total: 0 };
    categoryMap[answer.category].total++;
    if (answer.is_correct) categoryMap[answer.category].correct++;
  }
  const categories = Object.entries(categoryMap).map(([subject, data]) => ({
    subject,
    score: Math.round((data.correct / data.total) * 100),
    fullMark: 100,
  }));

  const headingAnswers = lang === "de" ? "Frage für Frage" : "Question by Question";
  const headingCategories = lang === "de" ? "Nach Kategorie" : "By Category";
  const headingShare = lang === "de" ? "Ergebnis teilen" : "Share your result";
  const linkPlayAgain = lang === "de" ? "Quiz erneut spielen →" : "Play again →";

  return (
    <>
      <LangSync lang={lang} />
      <main id="main-content" className="mx-auto max-w-3xl px-4 py-10 space-y-8">
        <ResultHeader result={result} />

        <section aria-labelledby="chart-heading" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 id="chart-heading" className="sr-only">{labels.yourScore}</h2>
          <ScoreDonut
            score={result.score}
            total={result.total}
            labelCorrect={labels.correct}
            labelIncorrect={labels.incorrect}
            ariaLabel={labels.correctOf(result.score, result.total)}
          />
        </section>

        {categories.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <CategoryBreakdown categories={categories} heading={headingCategories} />
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <AnswerList answers={result.answers} lang={lang} heading={headingAnswers} />
        </div>

        <footer className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">{headingShare}</h2>
          <ShareButtons score={result.score} total={result.total} url={resultUrl} lang={lang} />
          <a
            href="https://chat.openai.com"
            className="inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {linkPlayAgain}
          </a>
        </footer>
      </main>
    </>
  );
}
