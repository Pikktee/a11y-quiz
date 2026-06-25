import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import { quizResults } from "@/lib/schema";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard — A11y Quiz",
  description: "Detaillierte Statistiken und Auswertungen zu den Quiz-Ergebnissen.",
  robots: {
    index: false,
  },
};

export default async function AdminPage() {
  // Fetch all quiz results, sorted by creation date descending
  const results = await getDb()
    .select()
    .from(quizResults)
    .orderBy(desc(quizResults.createdAt));

  return (
    <main id="main-content" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <AdminDashboard initialResults={results} />
    </main>
  );
}
