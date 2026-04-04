type StatCardProps = {
  label: string;
  value: string;
  change: string;
};

export default function StatCard({ label, value, change }: StatCardProps) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5 shadow-[0_15px_40px_rgba(15,46,40,0.06)] transition hover:shadow-[0_20px_50px_rgba(18,185,129,0.15)]">
      <p className="text-sm text-[var(--muted-foreground)]">{label}</p>

      <h3 className="mt-3 text-3xl font-bold text-[var(--foreground)]">
        {value}
      </h3>

      <p className="mt-2 text-sm font-semibold text-[var(--primary-dark)]">
        {change}
      </p>
    </div>
  );
}