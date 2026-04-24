import { NextResponse } from "next/server";
import { generateContentDraft } from "@/lib/admin/ai-content-generator";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { logger } from "@/lib/logger";
import { aiGenerateSchema } from "@/lib/validation/admin";
import { handleApiError, jsonError } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const key = request.headers.get("x-forwarded-for") || "unknown";
    const rl = checkRateLimit({ key: `ai-generate:${key}`, limit: 30, windowMs: 60_000 });
    if (!rl.ok) {
      return jsonError("Rate limit exceeded.", 429);
    }
    const body = aiGenerateSchema.parse(await request.json());

    const generated = await generateContentDraft({
      keyword: body.keyword,
      category: body.category,
    });

    logger.info("AI content generated", { keyword: body.keyword });
    return NextResponse.json(generated);
  } catch (error) {
    return handleApiError(error, "Failed to generate content.");
  }
}
