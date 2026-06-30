import Link from "next/link";
import { 
  Accessibility, 
  ArrowRight, 
  BarChart3, 
  MessageSquare, 
  Sparkles,
  Trophy
} from "lucide-react";
import { getDb } from "@/lib/db";
import { quizResults } from "@/lib/schema";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch live stats from SQLite
  let totalSubmissions = 0;
  let avgScorePercent = 0;
  
  try {
    const results = await getDb().select().from(quizResults);
    totalSubmissions = results.length;
    if (totalSubmissions > 0) {
      const sumScores = results.reduce((acc, r) => acc + r.score, 0);
      const sumTotal = results.reduce((acc, r) => acc + r.total, 0);
      avgScorePercent = Math.round((sumScores / sumTotal) * 100) || 0;
    }
  } catch (error) {
    console.error("Fehler beim Laden der Statistik:", error);
  }

  // Get Custom GPT Link from env (or fallback to ChatGPT homepage)
  const customGptUrl = process.env.NEXT_PUBLIC_CUSTOM_GPT_URL ?? "https://chatgpt.com";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-lg font-bold">♿</span>
            <span className="text-xl font-bold tracking-tight">A11y Quiz</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">
              Admin-Bereich
            </Link>
            <a
              href={customGptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Quiz starten
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Gradient background decoration */}
          <div className="absolute inset-0 -z-10 bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-70 blur-3xl pointer-events-none" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 animate-pulse">
              <Sparkles className="h-4 w-4" />
              <span>WCAG 2.2 Wissens-Check</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl max-w-3xl mx-auto leading-[1.1]">
              Meistere digitale <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Barrierefreiheit</span>
            </h1>
            
            <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground mx-auto">
              Teste dein WCAG 2.2-Wissen im interaktiven ChatGPT-Quiz. Beantworte Fragen zu Kontrasten, Tastaturbedienbarkeit und mehr und erhalte deine persönliche Auswertung.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <a
                href={customGptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                In ChatGPT starten
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <Link
                href="/admin"
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl border border-input bg-card px-8 py-3 text-base font-semibold hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Ergebnisse & Statistiken
              </Link>
            </div>

            {/* Live Stats */}
            {totalSubmissions > 0 && (
              <div className="pt-10 flex flex-col sm:flex-row justify-center items-center gap-6 max-w-lg mx-auto border-t border-border mt-12">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold tracking-tight text-foreground">{totalSubmissions}</span>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mt-1">Teilnahmen gesamt</span>
                </div>
                <div className="hidden sm:block h-8 w-px bg-border" />
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-1">
                    <Trophy className="h-6 w-6 text-amber-500" />
                    {avgScorePercent}%
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mt-1">Ø Erfolgsquote</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30 border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Warum dieses Quiz?</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">Der einfache Weg, dein Wissen zur Barrierefreiheit zu prüfen und zu vertiefen.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border border-border/80 bg-card/60 backdrop-blur-sm shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-primary/10 text-primary w-fit rounded-lg">
                    <Accessibility className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">WCAG 2.2 Fokus</h3>
                  <p className="text-muted-foreground text-sm">
                    Die Fragen decken die neuesten Kriterien ab – von visuellen Kontrasten bis hin zu komplexen Tastatur-Fokus-Handlungen.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border/80 bg-card/60 backdrop-blur-sm shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit rounded-lg">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Interaktiver Dialog</h3>
                  <p className="text-muted-foreground text-sm">
                    Der Custom GPT führt dich durch das Quiz, stellt Zusatzfragen und liefert verständliche Erklärungen zu jeder Antwort.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border/80 bg-card/60 backdrop-blur-sm shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit rounded-lg">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Barrierefreier Report</h3>
                  <p className="text-muted-foreground text-sm">
                    Erhalte nach Abschluss ein detailliertes Dashboard mit Punkteverteilung, Kategorien-Details und A11y-Optimierungen.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Wie es funktioniert</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">In nur drei Schritten von der ersten Frage zur barrierefreien Auswertung.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
              {/* Process line for large screens */}
              <div className="hidden lg:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-border -z-10" />

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold border-4 border-background shadow-lg">
                  1
                </div>
                <h3 className="text-lg font-bold">Starte das Quiz</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Klicke auf den Button, um den Custom GPT direkt in deiner ChatGPT-Sitzung zu öffnen.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold border-4 border-background shadow-lg">
                  2
                </div>
                <h3 className="text-lg font-bold">Beantworte die Fragen</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Spiele die Fragen in der gewünschten Schwierigkeitsstufe durch und sammle Punkte.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold border-4 border-background shadow-lg">
                  3
                </div>
                <h3 className="text-lg font-bold">Erhalte die Auswertung</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Über den personalisierten Link gelangst du direkt zu deinem voll barrierefreien Dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-90" />
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Bereit für den Wissenscheck?</h2>
            <p className="mx-auto max-w-xl text-lg text-primary-foreground/90">
              Starte jetzt das barrierefreie Quiz und teste, wie fit du in den neuesten Richtlinien zur Web-Barrierefreiheit bist.
            </p>
            <div className="pt-4">
              <a
                href={customGptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-background px-8 py-3 text-base font-semibold text-primary hover:bg-muted transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Jetzt Quiz starten
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} A11y Quiz. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              Admin-Dashboard
            </Link>
            <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              ChatGPT
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
