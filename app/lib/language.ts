import "server-only";
import { cookies } from "next/headers";
import type { AppLanguage } from "@/app/lib/i18n";
import { DEFAULT_LANGUAGE } from "@/app/lib/i18n";

export const LANGUAGE_COOKIE_NAME = "orbitops-language";

export async function getCurrentLanguage(): Promise<AppLanguage> {
  const cookieStore = await cookies();
  const language = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;

  if (language === "en" || language === "el") {
    return language;
  }

  return DEFAULT_LANGUAGE;
}