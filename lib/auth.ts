export function verifyApiKey(request: Request): boolean {
  const key = request.headers.get("X-API-Key");
  const expected = process.env.QUIZ_API_KEY;
  if (!expected) return true; // dev mode: no key required
  return key === expected;
}
