import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Lazy singleton — wird erst beim ersten Datenbankzugriff geöffnet,
// nicht beim Importieren des Moduls (wichtig für Next.js build phase).
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    const client = createClient({
      url: process.env.DATABASE_URL ?? "file:quiz.db",
    });
    _db = drizzle(client, { schema });
  }
  return _db;
}
