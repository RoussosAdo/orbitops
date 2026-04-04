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
    <div className="flex flex-col gap-4 rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)] md:flex-row md:items-center md:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-sm font-medium text-[var(--muted-foreground)]">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">
          {title}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>

      {actionLabel ? (
        <button className="rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}