import prisma from "@/lib/prisma";

type ContentStatus = "draft" | "published" | "archived";

export type ContentPayload = {
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  coverImage: string;
  status: ContentStatus;
  publishDate: string | null;
  isTrending: boolean;
  rating: number;
  categoryId: string;
  tagIds: string[];
};

function normalizePayload(payload: Partial<ContentPayload>): ContentPayload {
  if (!payload.title || !payload.slug || !payload.excerpt || !payload.description || !payload.coverImage || !payload.categoryId) {
    throw new Error("Required fields are missing.");
  }

  return {
    title: payload.title.trim(),
    slug: payload.slug.trim(),
    excerpt: payload.excerpt.trim(),
    description: payload.description.trim(),
    coverImage: payload.coverImage.trim(),
    status: (payload.status ?? "draft") as ContentStatus,
    publishDate: payload.publishDate ?? null,
    isTrending: payload.isTrending ?? false,
    rating: Number(payload.rating ?? 0),
    categoryId: payload.categoryId,
    tagIds: Array.isArray(payload.tagIds) ? payload.tagIds : [],
  };
}

export async function getAdminContents() {
  return prisma.content.findMany({
    include: { category: true, tags: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getAdminContentById(id: string) {
  return prisma.content.findUnique({
    where: { id },
    include: { category: true, tags: true },
  });
}

export async function getContentFormMeta() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return { categories, tags };
}

export async function createAdminContent(rawPayload: Partial<ContentPayload>) {
  const payload = normalizePayload(rawPayload);
  const duplicate = await prisma.content.findFirst({
    where: {
      OR: [
        { slug: payload.slug },
        { title: payload.title },
      ],
    },
    select: { id: true },
  });
  if (duplicate) {
    throw new Error("Content with same slug or title already exists.");
  }

  return prisma.content.create({
    data: {
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt,
      description: payload.description,
      coverImage: payload.coverImage,
      status: payload.status,
      publishDate: payload.publishDate ? new Date(payload.publishDate) : null,
      isTrending: payload.isTrending,
      rating: payload.rating,
      categoryId: payload.categoryId,
      tags: {
        connect: payload.tagIds.map((id) => ({ id })),
      },
    },
    include: { category: true, tags: true },
  });
}

export async function updateAdminContent(id: string, rawPayload: Partial<ContentPayload>) {
  const payload = normalizePayload(rawPayload);
  const duplicate = await prisma.content.findFirst({
    where: {
      id: { not: id },
      OR: [
        { slug: payload.slug },
        { title: payload.title },
      ],
    },
    select: { id: true },
  });
  if (duplicate) {
    throw new Error("Another content already uses this slug or title.");
  }

  return prisma.content.update({
    where: { id },
    data: {
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt,
      description: payload.description,
      coverImage: payload.coverImage,
      status: payload.status,
      publishDate: payload.publishDate ? new Date(payload.publishDate) : null,
      isTrending: payload.isTrending,
      rating: payload.rating,
      categoryId: payload.categoryId,
      tags: {
        set: payload.tagIds.map((tagId) => ({ id: tagId })),
      },
    },
    include: { category: true, tags: true },
  });
}

export async function deleteAdminContent(id: string) {
  return prisma.content.delete({
    where: { id },
  });
}

export async function publishAdminContent(id: string) {
  const existing = await prisma.content.findUnique({
    where: { id },
    select: { id: true, publishDate: true },
  });

  if (!existing) {
    throw new Error("Content not found.");
  }

  return prisma.content.update({
    where: { id },
    data: {
      status: "published",
      publishDate: existing.publishDate ?? new Date(),
    },
    include: { category: true, tags: true },
  });
}
