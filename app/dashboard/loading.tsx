export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="rounded-[1.8rem] border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <div className="h-4 w-32 rounded bg-[var(--muted)]" />
          <div className="mt-4 h-12 w-96 max-w-full rounded bg-[var(--muted)]" />
          <div className="mt-4 h-5 w-[32rem] max-w-full rounded bg-[var(--muted)]" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)]"
              />
            ))}
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <div className="h-4 w-24 rounded bg-[var(--muted)]" />
          <div className="mt-4 h-10 w-56 rounded bg-[var(--muted)]" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)]"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="rounded-[1.8rem] border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <div className="h-4 w-24 rounded bg-[var(--muted)]" />
          <div className="mt-4 h-8 w-56 rounded bg-[var(--muted)]" />
          <div className="mt-6 h-[320px] rounded-[1.35rem] bg-[var(--muted)]" />
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.8rem] border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-sm)]">
            <div className="h-4 w-28 rounded bg-[var(--muted)]" />
            <div className="mt-4 h-8 w-40 rounded bg-[var(--muted)]" />
            <div className="mt-6 h-40 rounded-[1.35rem] bg-[var(--muted)]" />
          </div>

          <div className="rounded-[1.8rem] border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-sm)]">
            <div className="h-4 w-28 rounded bg-[var(--muted)]" />
            <div className="mt-4 h-8 w-40 rounded bg-[var(--muted)]" />
            <div className="mt-6 h-40 rounded-[1.35rem] bg-[var(--muted)]" />
          </div>
        </div>
      </div>
    </div>
  );
}