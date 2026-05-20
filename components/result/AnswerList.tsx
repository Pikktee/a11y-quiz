import AnswerItem from "./AnswerItem";
import type { Answer } from "@/lib/schema";
import type { Locale } from "@/lib/i18n";

type Props = { answers: Answer[]; lang: Locale; heading: string };

export default function AnswerList({ answers, lang, heading }: Props) {
  return (
    <section aria-labelledby="answers-heading">
      <h2 id="answers-heading" className="text-xl font-semibold mb-4">
        {heading}
      </h2>
      <ul className="space-y-4">
        {answers.map((answer, i) => (
          <AnswerItem key={i} answer={answer} index={i} lang={lang} />
        ))}
      </ul>
    </section>
  );
}
