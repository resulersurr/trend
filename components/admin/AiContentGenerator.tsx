"use client";

import { useState } from "react";

type GeneratedContent = {
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  coverImage: string;
  status: "draft";
  isTrending: boolean;
  rating: number;
  tags: string[];
  category: string;
};

type TrendingIdea = {
  keyword: string;
  category: string;
  source: string;
  priority: number;
};

export default function AiContentGenerator() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("rehber");
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [ideas, setIdeas] = useState<TrendingIdea[]>([]);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState<"" | "generate" | "draft" | "ideas">("");

  async function generateContent() {
    setPending("generate");
    setMessage("");
    const response = await fetch("/api/admin/ai/generate-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword, category }),
    });
    setPending("");

    const data = (await response.json()) as GeneratedContent | { error?: string };
    if (!response.ok || "error" in data) {
      setMessage("Icerik uretilemedi. Keyword alanini kontrol edin.");
      return;
    }

    setGenerated(data as GeneratedContent);
    setMessage("Taslak icerik olusturuldu.");
  }

  async function createDraft(ideaKeyword?: string, ideaCategory?: string) {
    setPending("draft");
    setMessage("");
    const response = await fetch("/api/admin/ai/create-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keyword: ideaKeyword ?? keyword,
        category: ideaCategory ?? category,
      }),
    });
    setPending("");

    if (!response.ok) {
      setMessage("Draft kaydi basarisiz oldu.");
      return;
    }

    setMessage("Draft basariyla kaydedildi. Icerikler sayfasindan kontrol edebilirsiniz.");
  }

  async function getIdeas() {
    setPending("ideas");
    setMessage("");
    const response = await fetch("/api/admin/ai/trending-ideas");
    setPending("");

    if (!response.ok) {
      setMessage("Fikirler getirilemedi.");
      return;
    }

    const data = (await response.json()) as TrendingIdea[];
    setIdeas(data);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-4 md:p-6">
        <h3 className="text-lg font-semibold text-foreground">AI Icerik Uretimi</h3>
        <p className="mt-1 text-sm text-muted">Keyword ile SEO uyumlu Turkce taslak icerik uretin ve draft olarak kaydedin.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-muted">Keyword</span>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Istanbul'da hafta sonu yapilacak etkinlikler"
              className="rounded-lg border border-border bg-zinc-900 px-3 py-2 text-sm text-foreground outline-none focus:border-accent/50"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm text-muted">Category</span>
            <input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="etkinlik"
              className="rounded-lg border border-border bg-zinc-900 px-3 py-2 text-sm text-foreground outline-none focus:border-accent/50"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending !== ""}
            onClick={generateContent}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Icerik Uret
          </button>
          <button
            type="button"
            disabled={pending !== ""}
            onClick={() => createDraft()}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground disabled:opacity-60"
          >
            Taslak Olarak Kaydet
          </button>
          <button
            type="button"
            disabled={pending !== ""}
            onClick={getIdeas}
            className="rounded-lg border border-accent/50 px-4 py-2 text-sm font-semibold text-accent disabled:opacity-60"
          >
            Guncel Fikirleri Getir
          </button>
        </div>

        {message && <p className="mt-3 text-sm text-muted">{message}</p>}
      </section>

      {generated && (
        <section className="rounded-xl border border-border bg-card p-4 md:p-6">
          <h4 className="text-base font-semibold text-foreground">{generated.title}</h4>
          <p className="mt-2 text-sm text-muted">{generated.excerpt}</p>
          <p className="mt-3 whitespace-pre-line text-sm text-foreground/90">{generated.description}</p>
        </section>
      )}

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Guncel Icerik Fikirleri</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {ideas.map((idea) => (
            <article key={`${idea.keyword}-${idea.priority}`} className="rounded-xl border border-border bg-card p-4">
              <p className="font-medium text-foreground">{idea.keyword}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-muted">
                <span>{idea.category}</span>
                <span>{idea.priority}</span>
              </div>
              <button
                type="button"
                disabled={pending !== ""}
                onClick={() => createDraft(idea.keyword, idea.category)}
                className="mt-3 rounded-lg bg-accent/90 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                Bu fikirden taslak olustur
              </button>
            </article>
          ))}
          {ideas.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted">
              Henuz fikir listesi yok. &quot;Guncel Fikirleri Getir&quot; ile yukleyin.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
