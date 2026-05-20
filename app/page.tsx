export default function Home() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold">A11y Quiz ♿</h1>
      <p className="max-w-md text-muted-foreground">
        Teste dein WCAG 2.2-Wissen im interaktiven ChatGPT-Quiz. Starte über den Custom GPT und
        erhalte am Ende eine persönliche Auswertung.
      </p>
      <a
        href="https://chat.openai.com"
        className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Quiz starten →
      </a>
    </main>
  );
}
