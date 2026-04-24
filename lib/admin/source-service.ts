export const SOURCE_TYPES = ["manual", "ai", "rss", "external_api"] as const;

export type SourceType = (typeof SOURCE_TYPES)[number];

export type SourceDefinition = {
  id: string;
  name: string;
  type: SourceType;
  enabled: boolean;
  description: string;
  config: Record<string, string>;
};

export function getSourceTypeOptions(): SourceType[] {
  return [...SOURCE_TYPES];
}

export function getSourceDefinitions(): SourceDefinition[] {
  return [
    {
      id: "manual-default",
      name: "Manual Admin Entry",
      type: "manual",
      enabled: true,
      description: "Editör veya admin panelinden elle içerik üretimi.",
      config: {},
    },
    {
      id: "ai-pipeline-draft",
      name: "AI Draft Generator",
      type: "ai",
      enabled: false,
      description: "AI ile taslak içerik üretimi için hazırlık hattı.",
      config: { provider: "mock" },
    },
    {
      id: "rss-placeholder",
      name: "RSS Collector",
      type: "rss",
      enabled: false,
      description: "RSS kaynaklarından içerik önerisi toplama altyapısı.",
      config: { refreshIntervalMinutes: "30" },
    },
    {
      id: "external-api-placeholder",
      name: "External API Ingestion",
      type: "external_api",
      enabled: false,
      description: "Google Places / News API benzeri harici API entegrasyonu için şablon.",
      config: { retryPolicy: "exponential-backoff" },
    },
  ];
}
