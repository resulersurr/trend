export type AIGenerateInput = {
  title?: string;
  keyword?: string;
};

export type AIGeneratedContent = {
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  suggestedTags: string[];
  suggestedCategory: string;
  seoTitle: string;
  seoDescription: string;
};

function slugify(input: string): string {
  return input
    .toLocaleLowerCase("tr-TR")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function generateMockAIContent(input: AIGenerateInput): AIGeneratedContent {
  const seed = input.title?.trim() || input.keyword?.trim() || "Trend Rehber";
  const generatedTitle = `${seed} için güncel keşif rehberi`;

  return {
    title: generatedTitle,
    slug: slugify(generatedTitle),
    excerpt: `${seed} odağında öne çıkan noktaları, fırsatları ve kısa önerileri tek içerikte toparladık.`,
    description:
      `${seed} hakkında bu içerikte en çok merak edilen başlıkları özetledik. ` +
      "Kısa karşılaştırmalar, pratik öneriler ve trend odaklı notlarla keşif sürecini hızlandırmayı amaçlayan bir taslak metindir.",
    suggestedTags: ["trend", "onerilen", "guncel"],
    suggestedCategory: "rehber",
    seoTitle: `${seed} 2026 Trend Rehberi`,
    seoDescription: `${seed} için güncel trendleri, önerileri ve dikkat edilmesi gereken noktaları keşfedin.`,
  };
}
