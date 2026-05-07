type GradientCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
};

export default function GradientCard({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
}: GradientCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--gradient-soft)] p-6 shadow-[var(--shadow-md)]">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[rgba(108,99,255,0.10)] blur-3xl" />
      <div className="absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-[rgba(34,197,94,0.08)] blur-3xl" />

      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
          {eyebrow}
        </p>

        <h3 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
          {title}
        </h3>

        <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--muted-foreground)]">
          {description}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button className="rounded-2xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black">
            {primaryAction}
          </button>

          <button className="rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-white">
            {secondaryAction}
          </button>
        </div>
      </div>
    </div>
  );
}