"use client";

import { ChevronDown, Layers3 } from "lucide-react";

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
    <form action="/api/workspaces/switch" method="POST" className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[var(--muted-foreground)]">
        <Layers3 className="h-4 w-4" />
      </div>

      <div className="pointer-events-none absolute right-4 top-1/2 z-10 -translate-y-1/2 text-[var(--muted-foreground)]">
        <ChevronDown className="h-4 w-4" />
      </div>

      <select
        name="workspaceId"
        defaultValue={currentWorkspaceId}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="w-full appearance-none rounded-2xl border border-[var(--border)] bg-white py-3 pl-11 pr-11 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-xs)] transition hover:border-[var(--primary-light)]"
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