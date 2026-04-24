import ContentForm from "@/components/admin/ContentForm";
import { getContentFormMeta } from "@/lib/admin/content-service";

export default async function NewContentPage() {
  const { categories, tags } = await getContentFormMeta();

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Yeni Icerik</h2>
        <p className="text-sm text-muted">Icerik ekleme formu</p>
      </div>
      <ContentForm mode="create" categories={categories} tags={tags} />
    </section>
  );
}
