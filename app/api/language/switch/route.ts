import { NextResponse } from "next/server";
import type { AppLanguage } from "@/app/lib/i18n";
import { LANGUAGE_COOKIE_NAME } from "@/app/lib/language";

export async function POST(req: Request) {
  const formData = await req.formData();
  const language = String(formData.get("language") ?? "").trim();

  const nextLanguage: AppLanguage = language === "el" ? "el" : "en";

  const response = NextResponse.json({
    ok: true,
    language: nextLanguage,
  });

  response.cookies.set(LANGUAGE_COOKIE_NAME, nextLanguage, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}