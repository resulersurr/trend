import prisma from "@/lib/prisma";
import HeroSection from "@/components/HeroSection";
import TrendSection from "@/components/TrendSection";
import ContentGrid from "@/components/ContentGrid";
import SponsorBanner from "@/components/SponsorBanner";
import FeatureSection from "@/components/FeatureSection";
import type { ContentWithRelations, SponsorBlockType } from "@/types";

export default async function Home() {
  const [contents, trending, sponsors] = await Promise.all([
    prisma.content.findMany({
      where: { status: "published" },
      include: { category: true, tags: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.content.findMany({
      where: { status: "published", isTrending: true },
      include: { category: true, tags: true },
      orderBy: { viewCount: "desc" },
      take: 4,
    }),
    prisma.sponsorBlock.findMany({
      where: { isActive: true, position: { in: ["home_top", "home_mid"] } },
    }),
  ]);

  const typedContents = contents as unknown as ContentWithRelations[];
  const typedTrending = trending as unknown as ContentWithRelations[];
  const typedSponsors = sponsors as unknown as SponsorBlockType[];

  const topSponsor = typedSponsors.find((s) => s.position === "home_top");
  const midSponsor = typedSponsors.find((s) => s.position === "home_mid");

  return (
    <div className="flex flex-col">
      <HeroSection />

      {topSponsor && (
        <div className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <SponsorBanner sponsor={topSponsor} />
        </div>
      )}

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Öne Çıkan İçerikler</h2>
              <p className="mt-1 text-sm text-muted">En yeni ve güncel içerikler</p>
            </div>
          </div>
          <ContentGrid contents={typedContents} />
        </div>
      </section>

      {midSponsor && (
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SponsorBanner sponsor={midSponsor} />
        </div>
      )}

      <TrendSection contents={typedTrending} />
      <FeatureSection />
    </div>
  );
}
