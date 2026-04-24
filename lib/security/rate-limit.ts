type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

type RateLimitInput = {
  key: string;
  limit: number;
  windowMs: number;
};

export function checkRateLimit(input: RateLimitInput): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = buckets.get(input.key);
  if (!existing || existing.resetAt <= now) {
    const next: Bucket = { count: 1, resetAt: now + input.windowMs };
    buckets.set(input.key, next);
    return { ok: true, remaining: input.limit - 1, resetAt: next.resetAt };
  }

  if (existing.count >= input.limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  buckets.set(input.key, existing);
  return { ok: true, remaining: input.limit - existing.count, resetAt: existing.resetAt };
}
