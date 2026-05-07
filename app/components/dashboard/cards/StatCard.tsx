type StatCardProps = {
  label: string;
  value: string;
  change: string;
};

export default function StatCard({ label, value, change }: StatCardProps) {
  return (
    <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--muted-foreground)]">
            {label}
          </p>

          <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
            {value}
          </h3>

          <p className="mt-2 text-sm font-medium text-[var(--secondary)]">
            {change}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)] shadow-[var(--shadow-xs)]">
          ●
        </div>
      </div>
    </div>
  );
}