import Link from "next/link";
import { formatViewCount, getStatusColor, getStatusLabel } from "@/lib/helpers";
import type { ContentWithRelations } from "@/types";

export default function ContentCard({ content }: { content: ContentWithRelations }) {
  return (
    <Link href={`/content/${content.slug}`} className="group">
      <article className="overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={content.coverImage}
            alt={content.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {content.isTrending && (
            <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white">
              🔥 Trend
            </span>
          )}
          <span className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusColor(content.status)}`}>
            {getStatusLabel(content.status)}
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
              {content.category.name}
            </span>
            {content.tags.slice(0, 2).map((tag) => (
              <span key={tag.id} className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-muted">
                {tag.name}
              </span>
            ))}
          </div>

          <h3 className="mb-2 text-base font-semibold text-foreground transition-colors group-hover:text-accent sm:text-lg">
            {content.title}
          </h3>

          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted">
            {content.excerpt}
          </p>

          <div className="flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {formatViewCount(content.viewCount)}
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {content.rating.toFixed(1)}
              </span>
            </div>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent transition-colors group-hover:bg-accent group-hover:text-white">
              Detay →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
