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
    <div className="rounded-2xl bg-[var(--muted)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="font-semibold text-[var(--foreground)]">{name}</h4>
          <p className="text-sm text-[var(--muted-foreground)]">{status}</p>
        </div>

        <span className="text-sm font-bold text-[var(--primary-dark)]">
          {progress}
        </span>
      </div>
    </div>
  );
}