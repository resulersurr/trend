import prisma from "@/lib/prisma";
import FilterBar from "@/components/FilterBar";
import ContentGrid from "@/components/ContentGrid";
import type { ContentWithRelations } from "@/types";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ExplorePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const search = typeof params.search === "string" ? params.search : "";
  const categorySlug = typeof params.category === "string" ? params.category : "";
  const timeRange = typeof params.timeRange === "string" ? params.timeRange : "";
  const trending = params.trending === "true";

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
    ];
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  where.status = "published";

  if (trending) {
    where.isTrending = true;
  }

  if (timeRange) {
    const days = parseInt(timeRange);
    const since = new Date();
    since.setDate(since.getDate() - days);
    where.publishDate = { gte: since };
  }

  const [contents, categories] = await Promise.all([
    prisma.content.findMany({
      where,
      include: { category: true, tags: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany(),
  ]);

  const typedContents = contents as unknown as ContentWithRelations[];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Keşfet</h1>
          <p className="mt-1 text-muted">İçerikleri filtrele ve keşfet</p>
        </div>

        <div className="mb-8">
          <FilterBar categories={categories} />
        </div>

        <ContentGrid contents={typedContents} />
      </div>
    </div>
  );
}
