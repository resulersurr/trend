import { NextResponse } from "next/server";
import { createAdminContent, getAdminContents } from "@/lib/admin/content-service";
import { contentPayloadSchema } from "@/lib/validation/admin";
import { handleApiError } from "@/lib/api";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const contents = await getAdminContents();
    return NextResponse.json({ data: contents });
  } catch (error) {
    return handleApiError(error, "Failed to fetch contents.");
  }
}

export async function POST(request: Request) {
  try {
    const payload = contentPayloadSchema.parse(await request.json());
    const content = await createAdminContent(payload);
    logger.info("Content created", { id: content.id, slug: content.slug });
    return NextResponse.json({ data: content }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "Failed to create content.");
  }
}
