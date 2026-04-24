import Link from "next/link";
import { getAdminContents } from "@/lib/admin/content-service";

export default async function AdminDashboardPage() {
  const contents = await getAdminContents();
  const total = contents.length;
  const published = contents.filter((item) => item.status === "published").length;
  const draft = contents.filter((item) => item.status === "draft").length;
  const trending = contents.filter((item) => item.isTrending).length;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-sm text-muted">Icerik ve kaynak yonetim ozeti</p>
        </div>
        <Link href="/admin/contents/new" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">
          Yeni Icerik
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Toplam Icerik" value={total} />
        <StatCard title="Yayinda" value={published} />
        <StatCard title="Taslak" value={draft} />
        <StatCard title="Trend" value={trending} />
      </div>
    </section>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </article>
  );
}
