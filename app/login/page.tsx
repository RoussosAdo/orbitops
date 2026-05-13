"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Languages } from "lucide-react";
import type { AppLanguage } from "@/app/lib/i18n";
import { dashboardCopy, DEFAULT_LANGUAGE } from "@/app/lib/i18n";

const LANGUAGE_COOKIE_NAME = "orbitops-language";

function getCookieLanguage(): AppLanguage | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LANGUAGE_COOKIE_NAME}=`));

  const value = match?.split("=")[1];

  if (value === "en" || value === "el") {
    return value;
  }

  return null;
}

function setLanguageCookie(language: AppLanguage) {
  document.cookie = `${LANGUAGE_COOKIE_NAME}=${language}; path=/; max-age=${
    60 * 60 * 24 * 365
  }; SameSite=Lax`;
}

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [language, setLanguage] = useState<AppLanguage>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const savedLanguage =
      getCookieLanguage() || window.localStorage.getItem("orbitops-language");

    if (savedLanguage === "en" || savedLanguage === "el") {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage((currentLanguage) => {
      const nextLanguage = currentLanguage === "en" ? "el" : "en";

      window.localStorage.setItem("orbitops-language", nextLanguage);
      setLanguageCookie(nextLanguage);

      return nextLanguage;
    });
  };

  const copy = dashboardCopy[language];
  const loginCopy = copy.loginPage;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-6 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-[rgba(109,94,252,0.10)] blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-80 w-80 rounded-full bg-[rgba(59,130,246,0.08)] blur-3xl" />
      </div>

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white shadow-[var(--shadow-lg)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden border-r border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#f8faff_100%)] p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-xs)]">
                <Image
                  src="/orbitops-logo.png"
                  alt="OrbitOps logo"
                  fill
                  priority
                  className="object-contain p-1.5"
                />
              </div>

              <div>
                <p className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                  OrbitOps
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {loginCopy.brandSubtitle}
                </p>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                {loginCopy.eyebrow}
              </p>

              <h1 className="mt-4 max-w-md text-5xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                {loginCopy.heroTitle}
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--muted-foreground)]">
                {loginCopy.heroDescription}
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.35rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  {loginCopy.deliveryLabel}
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  {loginCopy.deliveryTitle}
                </p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  {loginCopy.deliveryDescription}
                </p>
              </div>

              <div className="rounded-[1.35rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  {loginCopy.controlLabel}
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  {loginCopy.controlTitle}
                </p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  {loginCopy.controlDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              {loginCopy.productAccess}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              {loginCopy.productAccessDescription}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between gap-3 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-xs)]">
                  <Image
                    src="/orbitops-logo.png"
                    alt="OrbitOps logo"
                    fill
                    priority
                    className="object-contain p-1.5"
                  />
                </div>

                <div>
                  <p className="text-base font-semibold text-[var(--foreground)]">
                    OrbitOps
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {loginCopy.brandSubtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleLanguage}
                aria-label={loginCopy.languageLabel}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:border-[var(--primary-light)] hover:text-[var(--primary)]"
              >
                <Languages className="h-4 w-4" />
                {copy.languageShort}
              </button>
            </div>

            <div className="mb-5 hidden justify-end lg:flex">
              <button
                type="button"
                onClick={toggleLanguage}
                aria-label={loginCopy.languageLabel}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:border-[var(--primary-light)] hover:text-[var(--primary)]"
              >
                <Languages className="h-4 w-4" />
                {copy.languageShort}
              </button>
            </div>

            <div className="rounded-[1.6rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                {loginCopy.welcomeBack}
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                {loginCopy.signIn}
              </h2>

              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                {loginCopy.signInDescription}
              </p>

              {error && (
                <div className="mt-5 rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {loginCopy.signInFailed}{" "}
                  {error === "OAuthAccountNotLinked"
                    ? loginCopy.accountNotLinked
                    : loginCopy.providerError}
                </div>
              )}

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl })}
                  className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-5 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:bg-[var(--muted)]"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-sm font-bold text-[#4285F4]">
                    G
                  </span>
                  {loginCopy.continueWithGoogle}
                </button>

                <button
                  type="button"
                  onClick={() => signIn("github", { callbackUrl })}
                  className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--foreground)] px-5 text-sm font-semibold text-white shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:bg-black"
                >
                  {loginCopy.continueWithGithub}
                </button>
              </div>

              <div className="mt-6 rounded-[1.2rem] border border-[var(--border)] bg-[var(--muted)] px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  {loginCopy.secureAccess}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  {loginCopy.secureAccessDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <LoginContent />
    </Suspense>
  );
}