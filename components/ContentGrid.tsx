import ContentCard from "./ContentCard";
import type { ContentWithRelations } from "@/types";

export default function ContentGrid({ contents }: { contents: ContentWithRelations[] }) {
  if (contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 text-4xl">🔍</div>
        <h3 className="text-lg font-semibold text-foreground">İçerik bulunamadı</h3>
        <p className="mt-1 text-sm text-muted">Filtrelerinizi değiştirmeyi deneyin.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {contents.map((content) => (
        <ContentCard key={content.id} content={content} />
      ))}
    </div>
  );
}
