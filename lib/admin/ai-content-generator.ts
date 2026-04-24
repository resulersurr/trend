import { safeText, toSlug } from "@/lib/admin/slugify";

export type GenerateContentInput = {
  keyword: string;
  category?: string;
};

export type GeneratedContent = {
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  coverImage: string;
  status: "draft";
  isTrending: false;
  rating: 0;
  tags: string[];
  category: string;
};

export type TrendingIdea = {
  keyword: string;
  category: string;
  source: "mock" | "api";
  priority: number;
};

function buildUnsplashCover(keyword: string): string {
  const encoded = encodeURIComponent(keyword);
  return `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80&${encoded}`;
}

function buildMockContent(input: GenerateContentInput): GeneratedContent {
  const keyword = safeText(input.keyword);
  const category = toSlug(input.category?.trim() || "rehber") || "rehber";
  const title = `${keyword}: 2026 icin guncel oneriler ve kesif rehberi`;
  const paragraphOne =
    `${keyword} arayisinda olanlar icin bu rehber, karar verme surecini hizlandiran temel bilgileri bir araya getirir. ` +
    "Oncelikle hedefi netlestirmek, butceyi ve zaman planini dogru kurmak daha iyi sonuc getirir.";
  const paragraphTwo =
    `Ikinci adimda ${keyword} odaqli secenekleri karsilastirarak daha verimli bir liste cikartabilirsiniz. ` +
    "Ozellikle yogun saatler, lokasyon, ulasim ve fiyat/performans dengesini birlikte degerlendirmek gerekir.";
  const paragraphThree =
    "Son asamada kucuk bir aksiyon plani olusturmak, deneyimi daha akici hale getirir. " +
    "Bu taslak metin, admin panelde hizli revize edilip yayina hazir hale getirilebilecek sekilde olusturulmustur.";

  return {
    title,
    slug: toSlug(title),
    excerpt: `${keyword} icin en iyi secenekleri hizlica karsilastirin, zaman kazandiran pratik onerileri kesfedin.`,
    description: [paragraphOne, paragraphTwo, paragraphThree].map(safeText).join("\n\n"),
    coverImage: buildUnsplashCover(keyword),
    status: "draft",
    isTrending: false,
    rating: 0,
    tags: [keyword, `${category} onerileri`, "guncel trendler"].map((tag) => toSlug(tag)).filter(Boolean),
    category,
  };
}

async function tryGenerateWithOpenAI(input: GenerateContentInput): Promise<GeneratedContent | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You generate Turkish SEO-friendly content drafts. Return strict JSON only. Never include HTML or script tags.",
        },
        {
          role: "user",
          content:
            `keyword: ${input.keyword}\ncategory: ${input.category ?? "rehber"}\n` +
            "Return fields: title, slug, excerpt, description, coverImage, tags(array), category. " +
            "description must have 3 paragraphs in Turkish.",
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;

  const parsed = JSON.parse(content) as {
    title?: string;
    slug?: string;
    excerpt?: string;
    description?: string;
    coverImage?: string;
    tags?: string[];
    category?: string;
  };

  if (!parsed.title || !parsed.excerpt || !parsed.description) return null;

  const finalTitle = safeText(parsed.title);
  const finalCategory = toSlug(parsed.category || input.category || "rehber") || "rehber";

  return {
    title: finalTitle,
    slug: toSlug(parsed.slug || finalTitle),
    excerpt: safeText(parsed.excerpt),
    description: safeText(parsed.description).split("\n").filter(Boolean).join("\n\n"),
    coverImage: parsed.coverImage?.startsWith("http") ? parsed.coverImage : buildUnsplashCover(input.keyword),
    status: "draft",
    isTrending: false,
    rating: 0,
    tags: (parsed.tags ?? []).map((tag) => toSlug(safeText(tag))).filter(Boolean).slice(0, 6),
    category: finalCategory,
  };
}

export async function generateContentDraft(input: GenerateContentInput): Promise<GeneratedContent> {
  const keyword = safeText(input.keyword || "");
  if (!keyword) {
    throw new Error("keyword is required");
  }

  const generated = await tryGenerateWithOpenAI({
    keyword,
    category: input.category,
  });

  if (generated) return generated;
  return buildMockContent({ keyword, category: input.category });
}

export function getMockTrendingIdeas(): TrendingIdea[] {
  return [
    { keyword: "Istanbul'da Bu Hafta Sonu Gidilecek Etkinlikler", category: "etkinlik", source: "mock", priority: 95 },
    { keyword: "2026 Yazi Icin En Populer Tatil Rotalari", category: "rehber", source: "mock", priority: 92 },
    { keyword: "Kapadokya'da Balon Turu Rehberi", category: "rehber", source: "mock", priority: 90 },
    { keyword: "Istanbul'da En Iyi Kahvalti Mekanlari", category: "mekan", source: "mock", priority: 89 },
    { keyword: "Ege'de Kesfedilecek Sakli Koylar", category: "rehber", source: "mock", priority: 88 },
    { keyword: "Uygun Fiyatli Hafta Sonu Kacamaklari", category: "kampanya", source: "mock", priority: 86 },
  ];
}
