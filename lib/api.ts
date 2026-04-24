import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logger } from "@/lib/logger";

export function jsonError(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    { error: message, ...(details !== undefined ? { details } : {}) },
    { status },
  );
}

export function handleApiError(error: unknown, fallbackMessage: string) {
  if (error instanceof ZodError) {
    return jsonError("Validation failed.", 400, error.flatten());
  }

  logger.error(fallbackMessage, {
    error: error instanceof Error ? error.message : "Unknown error",
  });
  return jsonError(fallbackMessage, 500);
}
