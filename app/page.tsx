import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
      <div className="text-center space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
          OrbitOps
        </p>

        <h1 className="text-5xl font-bold text-[var(--foreground)]">
          Neo Mint SaaS
        </h1>

        <p className="text-[var(--foreground)]/65">
          Initial dashboard shell is ready.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-xl bg-[var(--primary)] px-5 py-3 text-white transition hover:bg-[var(--primary-light)]"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/clients"
            className="rounded-xl border border-[var(--border)] px-5 py-3 text-[var(--foreground)] transition hover:bg-[var(--muted)]"
          >
            Clients
          </Link>
        </div>
      </div>
    </main>
  );
}