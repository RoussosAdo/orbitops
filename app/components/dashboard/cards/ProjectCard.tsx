type ProjectCardProps = {
  name: string;
  status: string;
  progress: string;
};

export default function ProjectCard({
  name,
  status,
  progress,
}: ProjectCardProps) {
  return (
    <div className="rounded-[1.2rem] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-xs)] transition hover:shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold text-[var(--foreground)]">
            {name}
          </h4>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {status}
          </p>
        </div>

        <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
          {progress}
        </span>
      </div>
    </div>
  );
}