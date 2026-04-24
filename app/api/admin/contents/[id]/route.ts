import { NextResponse } from "next/server";
import { deleteAdminContent, getAdminContentById, updateAdminContent } from "@/lib/admin/content-service";
import { contentPayloadSchema } from "@/lib/validation/admin";
import { handleApiError, jsonError } from "@/lib/api";
import { logger } from "@/lib/logger";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const content = await getAdminContentById(id);

    if (!content) {
      return jsonError("Content not found.", 404);
    }

    return NextResponse.json({ data: content });
  } catch (error) {
    return handleApiError(error, "Failed to fetch content.");
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const payload = contentPayloadSchema.parse(await request.json());
    const updated = await updateAdminContent(id, payload);
    logger.info("Content updated", { id: updated.id, slug: updated.slug });
    return NextResponse.json({ data: updated });
  } catch (error) {
    return handleApiError(error, "Failed to update content.");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteAdminContent(id);
    logger.info("Content deleted", { id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "Failed to delete content.");
  }
}
