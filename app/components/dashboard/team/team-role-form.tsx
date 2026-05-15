"use client";

import { useActionState } from "react";
import { updateMemberRole } from "@/app/actions/teamActions";
import type { TeamActionState } from "@/app/types/team";
import TeamActionFeedback from "./team-action-feedback";

type TeamRoleFormProps = {
  membershipId: string;
  defaultRole: string;
  disabled?: boolean;
};

const initialTeamActionState: TeamActionState = {
  ok: false,
  message: "",
};

export default function TeamRoleForm({
  membershipId,
  defaultRole,
  disabled = false,
}: TeamRoleFormProps) {
  const [state, formAction, pending] = useActionState(
    updateMemberRole,
    initialTeamActionState
  );

  return (
    <>
      <form action={formAction} className="flex items-center gap-2">
        <input type="hidden" name="membershipId" value={membershipId} />

        <select
          name="role"
          defaultValue={defaultRole}
          disabled={disabled || pending}
          className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--foreground)] outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="OWNER">OWNER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="MEMBER">MEMBER</option>
        </select>

        <button
          type="submit"
          disabled={disabled || pending}
          className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save"}
        </button>
      </form>

      <TeamActionFeedback state={state} />
    </>
  );
}