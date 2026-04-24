import { NextResponse } from "next/server";
import { handleApiError, jsonError } from "@/lib/api";
import { isAdminPasswordValid, createAdminSessionValue, adminSessionConfig } from "@/lib/security/admin-auth";
import { adminLoginSchema } from "@/lib/validation/admin";

export async function POST(request: Request) {
  try {
    const body = adminLoginSchema.parse(await request.json());
    if (!isAdminPasswordValid(body.password)) {
      return jsonError("Invalid credentials.", 401);
    }

    const sessionValue = await createAdminSessionValue();
    if (!sessionValue) {
      return jsonError("ADMIN_PASSWORD is not configured.", 500);
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: adminSessionConfig.name,
      value: sessionValue,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: adminSessionConfig.ttlSeconds,
    });
    return response;
  } catch (error) {
    return handleApiError(error, "Login failed.");
  }
}
