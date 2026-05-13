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
    <div className="fade-in-up overflow-hidden rounded-[1.35rem] border border-[var(--border)] bg-white shadow-[var(--shadow-sm)] sm:rounded-[1.75rem]">
      <div className="bg-[linear-gradient(180deg,#ffffff_0%,#fcfcff_45%,#f8faff_100%)] px-4 py-5 sm:px-6 sm:py-7 md:px-7 md:py-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 max-w-3xl">
            {eyebrow ? (
              <div className="inline-flex max-w-full items-center rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5">
                <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)] sm:text-[11px] sm:tracking-[0.22em]">
                  {eyebrow}
                </p>
              </div>
            ) : null}

            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.05em] text-[var(--foreground)] sm:text-[2.1rem] md:text-[2.45rem]">
              {title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)] sm:leading-7 md:text-[15px]">
              {description}
            </p>
          </div>

          {actionLabel ? (
            <button
              type="button"
              className="control-hover soft-ring inline-flex h-11 w-full items-center justify-center rounded-2xl bg-[var(--foreground)] px-5 text-sm font-semibold text-white shadow-[var(--shadow-xs)] hover:bg-black sm:h-12 sm:w-auto sm:px-6"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}