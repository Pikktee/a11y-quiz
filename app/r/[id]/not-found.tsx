import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-6xl" aria-hidden="true">🔍</p>
      <h1 className="text-2xl font-bold">Ergebnis nicht gefunden</h1>
      <p className="text-muted-foreground max-w-sm">
        Dieses Ergebnis existiert nicht oder wurde bereits gelöscht. Ergebnisse werden nach 90 Tagen entfernt.
      </p>
      <Link
        href="/"
        className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Zur Startseite
      </Link>
    </main>
  );
}
