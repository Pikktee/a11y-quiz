import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getDb } from "@/lib/db";
import { quizResults } from "@/lib/schema";
import { quizSubmissionSchema } from "@/lib/validators";
import { verifyApiKey } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!verifyApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = quizSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const resultId = nanoid(8);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  await getDb().insert(quizResults).values({
    resultId,
    name: parsed.data.name,
    language: parsed.data.language,
    module: parsed.data.module,
    difficulty: parsed.data.difficulty,
    score: parsed.data.score,
    total: parsed.data.total,
    answers: parsed.data.answers,
  });

  return NextResponse.json({
    result_id: resultId,
    result_url: `${baseUrl}/r/${resultId}`,
    created_at: new Date().toISOString(),
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://chat.openai.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
    },
  });
}
