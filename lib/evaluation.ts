import type { Locale } from "./i18n";

export function getEvaluationText(
  score: number,
  total: number,
  name: string,
  difficulty: string,
  weakCategories: string[],
  lang: Locale
): string {
  const pct = total > 0 ? (score / total) * 100 : 0;
  const isExpert = difficulty === "experte";
  const weakHint = weakCategories.length > 0 ? weakCategories.slice(0, 2).join(" und ") : null;

  if (lang === "de") {
    if (pct >= 95) {
      return `Außergewöhnlich, ${name}! Mit ${score} von ${total} richtigen Antworten gehörst du zur absoluten Spitzengruppe – kaum jemand kennt WCAG 2.2 so gut wie du. Dein Wissen über Barrierefreiheit ist tief verankert und praxistauglich.`;
    }
    if (pct >= 80) {
      const weakSentence = weakHint
        ? ` Ein bisschen mehr Tiefe bei „${weakHint}" würde dich in die Expertenkategorie bringen.`
        : " Du bist bestens gerüstet, um barrierefreie Produkte zu entwickeln und dein Team zu beraten.";
      return `Starke Leistung, ${name}! Du verstehst die zentralen Prinzipien der Webzugänglichkeit wirklich gut.${weakSentence}`;
    }
    if (pct >= 60) {
      const weakSentence = weakHint
        ? ` Besonders bei „${weakHint}" lohnt sich noch etwas Vertiefung.`
        : " Mit gezielter Übung erreichst du schnell das nächste Level.";
      const expertNote = isExpert ? " Für das Experten-Niveau ist das ein respektables Ergebnis." : "";
      return `Gut gemacht, ${name}! Du kennst viele WCAG-Kriterien und hast ein solides Fundament.${weakSentence}${expertNote}`;
    }
    if (pct >= 40) {
      const weakSentence = weakHint
        ? ` Besonders die Bereiche „${weakHint}" bieten noch Lernpotenzial.`
        : " Ein paar gezielte Lerneinheiten werden schnell den Unterschied machen.";
      const expertNote = isExpert ? " Bedenke: Das Experten-Level stellt hohe Anforderungen." : "";
      return `Du bist auf einem guten Weg, ${name}! Ein Fundament ist gelegt – jetzt geht es ums Ausbauen.${weakSentence}${expertNote}`;
    }
    const expertNote = isExpert
      ? " Du hast das Experten-Level gewählt – das zeigt Mut. Starte vielleicht mit dem Einsteiger-Modus, um ein solides Fundament aufzubauen."
      : " Starte am besten mit dem Einsteiger-Modus und arbeite dich Schritt für Schritt vor.";
    return `Jede Reise beginnt mit einem ersten Schritt, ${name}! WCAG 2.2 ist ein breites Thema – es ist völlig normal, nicht alle Feinheiten sofort zu kennen.${expertNote}`;
  }

  // English
  if (pct >= 95) {
    return `Outstanding, ${name}! With ${score} out of ${total} correct answers, you are in the top tier – very few people know WCAG 2.2 as well as you do. Your accessibility knowledge is both deep and practical.`;
  }
  if (pct >= 80) {
    const weakSentence = weakHint
      ? ` A little more depth in "${weakHint}" would push you into expert territory.`
      : " You are well-equipped to build accessible products and guide your team.";
    return `Strong performance, ${name}! You have a solid grasp of the core principles of web accessibility.${weakSentence}`;
  }
  if (pct >= 60) {
    const weakSentence = weakHint
      ? ` Diving a bit deeper into "${weakHint}" will help you level up.`
      : " With some targeted practice you will reach the next level quickly.";
    const expertNote = isExpert ? " For the expert level, this is a respectable result." : "";
    return `Well done, ${name}! You know many WCAG criteria and have a solid foundation.${weakSentence}${expertNote}`;
  }
  if (pct >= 40) {
    const weakSentence = weakHint
      ? ` The areas "${weakHint}" offer the most room to grow.`
      : " A few focused study sessions will make a big difference.";
    const expertNote = isExpert ? " Keep in mind: the expert level sets a high bar." : "";
    return `You are on the right track, ${name}! A foundation is in place – now it is time to build on it.${weakSentence}${expertNote}`;
  }
  const expertNote = isExpert
    ? " You chose the expert level – that takes courage. Consider starting with the beginner mode to build a solid base."
    : " Try starting with the beginner mode and work your way up step by step.";
  return `Every journey starts with a first step, ${name}! WCAG 2.2 is a broad topic – it is perfectly normal not to know every detail right away.${expertNote}`;
}
