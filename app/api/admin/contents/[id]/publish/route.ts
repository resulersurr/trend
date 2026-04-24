import { NextResponse } from "next/server";
import { publishAdminContent } from "@/lib/admin/content-service";
import { handleApiError } from "@/lib/api";
import { logger } from "@/lib/logger";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const published = await publishAdminContent(id);
    logger.info("Content published", { id: published.id, slug: published.slug });
    return NextResponse.json({ data: published });
  } catch (error) {
    return handleApiError(error, "Failed to publish content.");
  }
}
