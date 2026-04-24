import Link from "next/link";
import { getAdminContents } from "@/lib/admin/content-service";
import ContentTable from "@/components/admin/ContentTable";

export default async function AdminContentsPage() {
  const contents = await getAdminContents();

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Icerikler</h2>
          <p className="text-sm text-muted">Tum icerikleri listele, duzenle veya sil.</p>
        </div>
        <Link href="/admin/contents/new" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">
          Yeni Icerik
        </Link>
      </div>
      <ContentTable items={contents} />
    </section>
  );
}
