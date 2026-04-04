import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
      <div className="max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
          OrbitOps
        </p>

        <h1 className="mt-4 text-5xl font-bold text-[var(--foreground)] md:text-6xl">
          Multi-Tenant SaaS Dashboard
        </h1>

        <p className="mt-5 text-base leading-7 text-[var(--muted-foreground)] md:text-lg">
          A modern SaaS admin platform concept focused on responsive dashboard
          architecture, reusable components, interactive task flows, and clean
          product UI.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
          >
            Open Dashboard
          </Link>

          <Link
            href="/dashboard/projects"
            className="rounded-2xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
          >
            View Projects
          </Link>
        </div>
      </div>
    </main>
  );
}