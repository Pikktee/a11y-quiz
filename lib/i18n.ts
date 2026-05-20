export type Locale = "de" | "en";

export const t = {
  de: {
    hello: "Hallo",
    yourScore: "Dein Ergebnis",
    correctOf: (score: number, total: number) => `${score} von ${total} Fragen richtig`,
    yourAnswer: "Deine Antwort",
    correctAnswer: "Korrekte Antwort",
    explanation: "Erklärung",
    reference: "Referenz",
    correct: "Richtig",
    incorrect: "Falsch",
    playAgain: "Quiz erneut spielen",
    shareText: (score: number, total: number) =>
      `Ich habe ${score}/${total} im A11y-Quiz erreicht! ♿`,
    copyLink: "Link kopieren",
    linkCopied: "Link kopiert!",
    difficulty: {
      anfaenger: "Einsteiger",
      fortgeschritten: "Fortgeschritten",
      experte: "Experte",
    },
    notFound: "Ergebnis nicht gefunden",
    notFoundDesc: "Dieses Ergebnis existiert nicht oder wurde bereits gelöscht.",
  },
  en: {
    hello: "Hello",
    yourScore: "Your Result",
    correctOf: (score: number, total: number) => `${score} of ${total} questions correct`,
    yourAnswer: "Your answer",
    correctAnswer: "Correct answer",
    explanation: "Explanation",
    reference: "Reference",
    correct: "Correct",
    incorrect: "Incorrect",
    playAgain: "Play quiz again",
    shareText: (score: number, total: number) =>
      `I scored ${score}/${total} in the A11y Quiz! ♿`,
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    difficulty: {
      anfaenger: "Beginner",
      fortgeschritten: "Intermediate",
      experte: "Expert",
    },
    notFound: "Result not found",
    notFoundDesc: "This result does not exist or has already been deleted.",
  },
} as const;
