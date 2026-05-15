"use client";

import { useActionState } from "react";
import { removeMember } from "@/app/actions/teamActions";
import type { TeamActionState } from "@/app/types/team";
import TeamActionFeedback from "./team-action-feedback";

type RemoveMemberFormProps = {
  membershipId: string;
  disabled?: boolean;
};

const initialTeamActionState: TeamActionState = {
  ok: false,
  message: "",
};

export default function RemoveMemberForm({
  membershipId,
  disabled = false,
}: RemoveMemberFormProps) {
  const [state, formAction, pending] = useActionState(
    removeMember,
    initialTeamActionState
  );

  return (
    <>
      <form action={formAction}>
        <input type="hidden" name="membershipId" value={membershipId} />

        <button
          type="submit"
          disabled={disabled || pending}
          className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Removing..." : "Remove"}
        </button>
      </form>

      <TeamActionFeedback state={state} />
    </>
  );
}