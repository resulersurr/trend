"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Option = {
  id: string;
  name: string;
};

type FormValue = {
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  coverImage: string;
  status: string;
  publishDate: string;
  isTrending: boolean;
  rating: number;
  categoryId: string;
  tagIds: string[];
};

type Props = {
  mode: "create" | "edit";
  contentId?: string;
  categories: Option[];
  tags: Option[];
  initialValue?: Partial<FormValue>;
};

const DEFAULT_VALUE: FormValue = {
  title: "",
  slug: "",
  excerpt: "",
  description: "",
  coverImage: "",
  status: "draft",
  publishDate: "",
  isTrending: false,
  rating: 0,
  categoryId: "",
  tagIds: [],
};

export default function ContentForm({ mode, contentId, categories, tags, initialValue }: Props) {
  const [value, setValue] = useState<FormValue>({ ...DEFAULT_VALUE, ...initialValue });
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const endpoint = mode === "create" ? "/api/admin/contents" : `/api/admin/contents/${contentId}`;
  const method = mode === "create" ? "POST" : "PUT";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...value,
        publishDate: value.publishDate || null,
      }),
    });

    setPending(false);

    if (!response.ok) {
      window.alert("Kayit islemi basarisiz oldu.");
      return;
    }

    router.push("/admin/contents");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-card p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Title" value={value.title} onChange={(title) => setValue((p) => ({ ...p, title }))} required />
        <Input label="Slug" value={value.slug} onChange={(slug) => setValue((p) => ({ ...p, slug }))} required />
        <Input label="Excerpt" value={value.excerpt} onChange={(excerpt) => setValue((p) => ({ ...p, excerpt }))} required />
        <Input
          label="Cover Image"
          value={value.coverImage}
          onChange={(coverImage) => setValue((p) => ({ ...p, coverImage }))}
          required
        />
        <Input
          label="Publish Date"
          type="datetime-local"
          value={value.publishDate}
          onChange={(publishDate) => setValue((p) => ({ ...p, publishDate }))}
        />
        <Input
          label="Rating"
          type="number"
          value={String(value.rating)}
          onChange={(rating) => setValue((p) => ({ ...p, rating: Number(rating) || 0 }))}
        />
        <label className="flex flex-col gap-2">
          <span className="text-sm text-muted">Status</span>
          <select
            className="rounded-lg border border-border bg-zinc-900 px-3 py-2 text-sm text-foreground outline-none focus:border-accent/50"
            value={value.status}
            onChange={(event) => setValue((p) => ({ ...p, status: event.target.value }))}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm text-muted">Category</span>
          <select
            className="rounded-lg border border-border bg-zinc-900 px-3 py-2 text-sm text-foreground outline-none focus:border-accent/50"
            value={value.categoryId}
            onChange={(event) => setValue((p) => ({ ...p, categoryId: event.target.value }))}
            required
          >
            <option value="">Seciniz</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm text-muted">Description</span>
        <textarea
          className="min-h-28 rounded-lg border border-border bg-zinc-900 px-3 py-2 text-sm text-foreground outline-none focus:border-accent/50"
          value={value.description}
          onChange={(event) => setValue((p) => ({ ...p, description: event.target.value }))}
          required
        />
      </label>

      <div className="rounded-lg border border-border p-3">
        <p className="mb-2 text-sm text-muted">Tags</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={value.tagIds.includes(tag.id)}
                onChange={(event) =>
                  setValue((prev) => ({
                    ...prev,
                    tagIds: event.target.checked ? [...prev.tagIds, tag.id] : prev.tagIds.filter((id) => id !== tag.id),
                  }))
                }
              />
              <span>{tag.name}</span>
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={value.isTrending}
          onChange={(event) => setValue((p) => ({ ...p, isTrending: event.target.checked }))}
        />
        <span>Is Trending</span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Kaydediliyor" : mode === "create" ? "Icerik Ekle" : "Degisiklikleri Kaydet"}
      </button>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm text-muted">{label}</span>
      <input
        className="rounded-lg border border-border bg-zinc-900 px-3 py-2 text-sm text-foreground outline-none focus:border-accent/50"
        value={value}
        required={required}
        type={type}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
