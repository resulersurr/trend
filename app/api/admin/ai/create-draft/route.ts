import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateContentDraft } from "@/lib/admin/ai-content-generator";
import { toSlug } from "@/lib/admin/slugify";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { logger } from "@/lib/logger";
import { aiGenerateSchema } from "@/lib/validation/admin";
import { handleApiError, jsonError } from "@/lib/api";

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 7);
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  const normalized = toSlug(baseSlug) || `draft-${randomSuffix()}`;
  let candidate = normalized;

  for (let i = 0; i < 10; i += 1) {
    const existing = await prisma.content.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing) return candidate;
    candidate = `${normalized}-${randomSuffix()}`;
  }

  return `${normalized}-${Date.now()}`;
}

export async function POST(request: Request) {
  try {
    const key = request.headers.get("x-forwarded-for") || "unknown";
    const rl = checkRateLimit({ key: `ai-create-draft:${key}`, limit: 20, windowMs: 60_000 });
    if (!rl.ok) {
      return jsonError("Rate limit exceeded.", 429);
    }
    const body = aiGenerateSchema.parse(await request.json());

    const generated = await generateContentDraft({
      keyword: body.keyword,
      category: body.category,
    });
    const duplicateContent = await prisma.content.findFirst({
      where: {
        OR: [
          { slug: generated.slug },
          { title: generated.title },
          { excerpt: generated.excerpt },
        ],
      },
      select: { id: true },
    });
    if (duplicateContent) {
      return jsonError("Similar content already exists.", 409);
    }

    const categorySlug = toSlug(generated.category || body.category || "rehber") || "rehber";
    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: {},
      create: {
        slug: categorySlug,
        name: categorySlug.replace(/-/g, " "),
      },
    });

    const tagConnect = await Promise.all(
      generated.tags.slice(0, 8).map(async (tag) => {
        const slug = toSlug(tag);
        const result = await prisma.tag.upsert({
          where: { slug },
          update: {},
          create: {
            slug,
            name: tag.replace(/-/g, " "),
          },
        });
        return { id: result.id };
      }),
    );

    const slug = await ensureUniqueSlug(generated.slug);

    const content = await prisma.content.create({
      data: {
        title: generated.title,
        slug,
        excerpt: generated.excerpt,
        description: generated.description,
        coverImage: generated.coverImage,
        status: "draft",
        isTrending: false,
        rating: 0,
        categoryId: category.id,
        tags: {
          connect: tagConnect,
        },
      },
      include: {
        category: true,
        tags: true,
      },
    });

    logger.info("AI draft created", { slug: content.slug, id: content.id });
    return NextResponse.json({ data: content }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "Failed to create draft content.");
  }
}
