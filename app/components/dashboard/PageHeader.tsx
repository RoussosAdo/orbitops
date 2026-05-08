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
    <div className="fade-in-up overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-white shadow-[var(--shadow-sm)]">
      <div className="bg-[linear-gradient(180deg,#ffffff_0%,#fcfcff_45%,#f8faff_100%)] px-6 py-7 md:px-7 md:py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            {eyebrow ? (
              <div className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                  {eyebrow}
                </p>
              </div>
            ) : null}

            <h1 className="mt-4 text-[2.1rem] font-semibold tracking-[-0.05em] text-[var(--foreground)] md:text-[2.45rem]">
              {title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] md:text-[15px]">
              {description}
            </p>
          </div>

          {actionLabel ? (
            <button className="control-hover soft-ring inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--foreground)] px-6 text-sm font-semibold text-white shadow-[var(--shadow-xs)] hover:bg-black">
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}