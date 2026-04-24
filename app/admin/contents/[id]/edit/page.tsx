import { notFound } from "next/navigation";
import ContentForm from "@/components/admin/ContentForm";
import { getAdminContentById, getContentFormMeta } from "@/lib/admin/content-service";

type EditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditContentPage({ params }: EditPageProps) {
  const { id } = await params;
  const [content, meta] = await Promise.all([getAdminContentById(id), getContentFormMeta()]);

  if (!content) notFound();

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Icerik Duzenle</h2>
        <p className="text-sm text-muted">{content.title}</p>
      </div>
      <ContentForm
        mode="edit"
        contentId={content.id}
        categories={meta.categories}
        tags={meta.tags}
        initialValue={{
          title: content.title,
          slug: content.slug,
          excerpt: content.excerpt,
          description: content.description,
          coverImage: content.coverImage,
          status: content.status,
          publishDate: content.publishDate ? new Date(content.publishDate).toISOString().slice(0, 16) : "",
          isTrending: content.isTrending,
          rating: content.rating,
          categoryId: content.categoryId,
          tagIds: content.tags.map((tag) => tag.id),
        }}
      />
    </section>
  );
}
