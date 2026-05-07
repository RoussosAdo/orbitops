type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel?: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
}: PageHeaderProps) {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-[var(--border)] bg-white shadow-[var(--shadow-sm)]">
      <div className="bg-[linear-gradient(180deg,#ffffff_0%,#fbfbff_100%)] px-6 py-6 md:px-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {eyebrow ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                {eyebrow}
              </p>
            ) : null}

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              {title}
            </h1>

            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              {description}
            </p>
          </div>

          {actionLabel ? (
            <button className="inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--foreground)] px-5 text-sm font-semibold text-white shadow-[var(--shadow-xs)] transition hover:bg-black">
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}