import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDate, formatViewCount, getStatusColor, getStatusLabel } from "@/lib/helpers";
import SponsorBanner from "@/components/SponsorBanner";
import ContentGrid from "@/components/ContentGrid";
import type { ContentWithRelations, SponsorBlockType } from "@/types";

type ContentRouteParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ContentRouteParams): Promise<Metadata> {
  const { slug } = await params;
  const content = await prisma.content.findUnique({
    where: { slug },
    select: {
      title: true,
      excerpt: true,
      description: true,
      coverImage: true,
      slug: true,
      status: true,
    },
  });

  if (!content || content.status !== "published") {
    return {
      title: "Icerik bulunamadi",
      robots: { index: false, follow: false },
    };
  }

  const canonicalPath = `/content/${content.slug}`;
  const description = content.excerpt || content.description.slice(0, 160);

  return {
    title: content.title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "article",
      url: canonicalPath,
      title: content.title,
      description,
      images: content.coverImage ? [content.coverImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description,
      images: content.coverImage ? [content.coverImage] : undefined,
    },
  };
}

export default async function ContentDetailPage({ params }: ContentRouteParams) {
  const { slug } = await params;

  const content = await prisma.content.findUnique({
    where: { slug },
    include: { category: true, tags: true },
  });

  if (!content || content.status !== "published") notFound();

  const [similar, sponsors] = await Promise.all([
    prisma.content.findMany({
      where: {
        categoryId: content.categoryId,
        id: { not: content.id },
        status: "published",
      },
      include: { category: true, tags: true },
      orderBy: { viewCount: "desc" },
      take: 3,
    }),
    prisma.sponsorBlock.findMany({
      where: { isActive: true, position: "detail_sidebar" },
    }),
  ]);

  const typedContent = content as unknown as ContentWithRelations;
  const typedSimilar = similar as unknown as ContentWithRelations[];
  const typedSponsors = sponsors as unknown as SponsorBlockType[];

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      <div className="relative h-64 w-full sm:h-80 lg:h-96">
        <img
          src={typedContent.coverImage}
          alt={typedContent.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-white">
                {typedContent.category.name}
              </span>
              <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusColor(typedContent.status)}`}>
                {getStatusLabel(typedContent.status)}
              </span>
              {typedContent.isTrending && (
                <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                  🔥 Trend
                </span>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              {typedContent.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Stats Bar */}
            <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-sm text-muted">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {formatViewCount(typedContent.viewCount)} görüntülenme
              </div>
              <div className="flex items-center gap-1 text-sm">
                <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium text-foreground">{typedContent.rating.toFixed(1)}</span>
                <span className="text-muted">/ 5</span>
              </div>
              {typedContent.publishDate && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(typedContent.publishDate)}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8 rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Açıklama</h2>
              <p className="leading-relaxed text-muted">{typedContent.description}</p>
            </div>

            {/* Tags */}
            {typedContent.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Etiketler</h3>
                <div className="flex flex-wrap gap-2">
                  {typedContent.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mb-8 rounded-2xl border border-accent/20 bg-accent/5 p-6 text-center">
              <h3 className="mb-2 text-lg font-semibold text-foreground">İlgileniyor musunuz?</h3>
              <p className="mb-4 text-sm text-muted">Bu içeriği arkadaşlarınızla paylaşın veya daha fazla keşfedin.</p>
              <div className="flex justify-center gap-3">
                <button className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90">
                  Paylaş
                </button>
                <Link
                  href="/explore"
                  className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/40"
                >
                  Daha Fazla Keşfet
                </Link>
              </div>
            </div>

            {/* Similar Content */}
            {typedSimilar.length > 0 && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-foreground">Benzer İçerikler</h2>
                <ContentGrid contents={typedSimilar} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-80">
            <div className="sticky top-20 space-y-6">
              {/* Sponsor */}
              {typedSponsors.map((s) => (
                <SponsorBanner key={s.id} sponsor={s} />
              ))}

              {/* Quick Info */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-4 text-sm font-semibold text-foreground">Hızlı Bilgi</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">Kategori</dt>
                    <dd className="font-medium text-foreground">{typedContent.category.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Durum</dt>
                    <dd className="font-medium text-foreground">{getStatusLabel(typedContent.status)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Puan</dt>
                    <dd className="font-medium text-foreground">{typedContent.rating.toFixed(1)} / 5</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Görüntülenme</dt>
                    <dd className="font-medium text-foreground">{formatViewCount(typedContent.viewCount)}</dd>
                  </div>
                  {typedContent.publishDate && (
                    <div className="flex justify-between">
                      <dt className="text-muted">Yayın Tarihi</dt>
                      <dd className="font-medium text-foreground">{formatDate(typedContent.publishDate)}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Back Link */}
              <Link
                href="/explore"
                className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent"
              >
                ← Tüm İçeriklere Dön
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
