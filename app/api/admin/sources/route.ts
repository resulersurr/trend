import { NextResponse } from "next/server";
import { getSourceDefinitions, getSourceTypeOptions } from "@/lib/admin/source-service";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { jsonError } from "@/lib/api";

export async function GET() {
  const rl = checkRateLimit({ key: "admin-sources:global", limit: 120, windowMs: 60_000 });
  if (!rl.ok) return jsonError("Rate limit exceeded.", 429);
  return NextResponse.json({
    data: getSourceDefinitions(),
    sourceTypes: getSourceTypeOptions(),
  });
}
