import { NextResponse } from "next/server";
import { getMockTrendingIdeas } from "@/lib/admin/ai-content-generator";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { jsonError } from "@/lib/api";

export async function GET() {
  const rl = checkRateLimit({ key: "ai-trending:global", limit: 120, windowMs: 60_000 });
  if (!rl.ok) {
    return jsonError("Rate limit exceeded.", 429);
  }
  return NextResponse.json(getMockTrendingIdeas());
}
