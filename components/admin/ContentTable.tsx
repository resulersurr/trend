"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Row = {
  id: string;
  title: string;
  slug: string;
  status: string;
  isTrending: boolean;
  rating: number;
  category: { name: string };
};

export default function ContentTable({ items }: { items: Row[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const router = useRouter();

  async function onDelete(id: string) {
    setDeletingId(id);
    const response = await fetch(`/api/admin/contents/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (!response.ok) {
      window.alert("Silme islemi basarisiz oldu.");
      return;
    }

    router.refresh();
  }

  async function onPublish(id: string) {
    setPublishingId(id);
    const response = await fetch(`/api/admin/contents/${id}/publish`, { method: "PATCH" });
    setPublishingId(null);

    if (!response.ok) {
      window.alert("Yayinlama islemi basarisiz oldu.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-900/70 text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Baslik</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">Trend</th>
              <th className="px-4 py-3 font-medium">Puan</th>
              <th className="px-4 py-3 font-medium">Islem</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted">{item.slug}</p>
                </td>
                <td className="px-4 py-3 text-muted">{item.category.name}</td>
                <td className="px-4 py-3 text-muted">{item.status}</td>
                <td className="px-4 py-3 text-muted">{item.isTrending ? "Evet" : "Hayir"}</td>
                <td className="px-4 py-3 text-muted">{item.rating.toFixed(1)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/contents/${item.id}/edit`}
                      className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:border-accent/40"
                    >
                      Duzenle
                    </Link>
                    {item.status === "draft" && (
                      <button
                        type="button"
                        onClick={() => onPublish(item.id)}
                        disabled={publishingId === item.id}
                        className="rounded-md border border-emerald-700/60 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {publishingId === item.id ? "Yayinlaniyor" : "Yayinla"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="rounded-md border border-red-700/60 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === item.id ? "Siliniyor" : "Sil"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-muted" colSpan={6}>
                  Icerik bulunamadi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
