import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD?.trim() || null;
}

async function sha256(input: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAdminSessionValue(): Promise<string | null> {
  const password = getAdminPassword();
  if (!password) return null;
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${expiresAt}`;
  const signature = await sha256(`${password}:trend-admin-session:${payload}`);
  return `${payload}.${signature}`;
}

export function isAdminPasswordValid(value: string): boolean {
  const expected = getAdminPassword();
  if (!expected) return false;
  return value === expected;
}

export async function verifyAdminSessionValue(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const password = getAdminPassword();
  if (!password) return false;

  const [expiresAtRaw, signature] = value.split(".");
  if (!expiresAtRaw || !signature) return false;
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) return false;

  const expected = await sha256(`${password}:trend-admin-session:${expiresAtRaw}`);
  return signature === expected;
}

export async function isAdminAuthenticatedFromCookies(): Promise<boolean> {
  const cookieStore = await cookies();
  return await verifyAdminSessionValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export const adminSessionConfig = {
  name: SESSION_COOKIE_NAME,
  ttlSeconds: SESSION_TTL_SECONDS,
};
