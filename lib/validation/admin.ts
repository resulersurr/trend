import { z } from "zod";

export const aiGenerateSchema = z.object({
  keyword: z.string().trim().min(2),
  category: z.string().trim().min(2).max(64).optional(),
});

export const adminLoginSchema = z.object({
  password: z.string().min(1),
});

export const contentPayloadSchema = z.object({
  title: z.string().trim().min(2),
  slug: z.string().trim().min(2),
  excerpt: z.string().trim().min(5),
  description: z.string().trim().min(10),
  coverImage: z.string().trim().url(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  publishDate: z.string().datetime().nullable().optional(),
  isTrending: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
  categoryId: z.string().trim().min(1),
  tagIds: z.array(z.string().trim().min(1)).optional(),
});
