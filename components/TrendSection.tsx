import Link from "next/link";
import { formatViewCount } from "@/lib/helpers";
import type { ContentWithRelations } from "@/types";

export default function TrendSection({ contents }: { contents: ContentWithRelations[] }) {
  if (contents.length === 0) return null;

  return (
    <section className="border-t border-border bg-card/50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">🔥 Trend İçerikler</h2>
            <p className="mt-1 text-sm text-muted">En çok görüntülenen ve en yüksek puanlı içerikler</p>
          </div>
          <Link
            href="/explore?trending=true"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent"
          >
            Tümünü Gör
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contents.slice(0, 4).map((content, i) => (
            <Link key={content.id} href={`/content/${content.slug}`} className="group">
              <div className="overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={content.coverImage}
                    alt={content.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <div className="p-3 sm:p-4">
                  <span className="mb-1 inline-block rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                    {content.category.name}
                  </span>
                  <h3 className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-accent">
                    {content.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                    <span>{formatViewCount(content.viewCount)} görüntülenme</span>
                    <span>★ {content.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
