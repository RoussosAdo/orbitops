"use client";

type WorkspaceOption = {
  workspaceId: string;
  workspaceName: string;
  role: string;
};

type WorkspaceSwitcherProps = {
  currentWorkspaceId: string;
  workspaces: WorkspaceOption[];
};

export default function WorkspaceSwitcher({
  currentWorkspaceId,
  workspaces,
}: WorkspaceSwitcherProps) {
  if (workspaces.length <= 1) {
    return null;
  }

  return (
    <form action="/api/workspaces/switch" method="POST">
      <select
        name="workspaceId"
        defaultValue={currentWorkspaceId}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)] shadow-sm outline-none transition hover:border-[var(--primary-light)]"
      >
        {workspaces.map((workspace) => (
          <option key={workspace.workspaceId} value={workspace.workspaceId}>
            {workspace.workspaceName} ({workspace.role})
          </option>
        ))}
      </select>
    </form>
  );
}