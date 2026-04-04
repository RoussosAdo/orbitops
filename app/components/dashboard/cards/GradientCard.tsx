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
    <div className="rounded-[1.75rem] border border-[#bfe7ea] bg-gradient-to-br from-[#dff8ee] via-[#dff6f4] to-[#dff0fb] p-6 shadow-[0_20px_45px_rgba(17,181,216,0.12)]">
      <p className="text-sm font-medium text-[var(--muted-foreground)]">
        {eyebrow}
      </p>

      <h3 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
        {title}
      </h3>

      <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--foreground)]/75">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-3">
        <button className="rounded-2xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]">
          {primaryAction}
        </button>

        <button className="rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-white">
          {secondaryAction}
        </button>
      </div>
    </div>
  );
}