"use client";

import { useActionState } from "react";
import { revokeInvitation } from "@/app/actions/teamActions";
import type { TeamActionState } from "@/app/types/team";
import TeamActionFeedback from "./team-action-feedback";

type RevokeInvitationFormProps = {
  invitationId: string;
};

const initialTeamActionState: TeamActionState = {
  ok: false,
  message: "",
};

export default function RevokeInvitationForm({
  invitationId,
}: RevokeInvitationFormProps) {
  const [state, formAction, pending] = useActionState(
    revokeInvitation,
    initialTeamActionState
  );

  return (
    <>
      <form action={formAction}>
        <input type="hidden" name="invitationId" value={invitationId} />

        <button
          type="submit"
          disabled={pending}
          className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Revoking..." : "Revoke"}
        </button>
      </form>

      <TeamActionFeedback state={state} />
    </>
  );
}