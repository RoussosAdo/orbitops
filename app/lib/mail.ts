import { Resend } from "resend";

type SendInviteEmailParams = {
  to: string;
  workspaceName: string;
  inviteLink: string;
  invitedByName?: string | null;
};

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("⚠️ RESEND_API_KEY missing - emails disabled");
    return null;
  }

  return new Resend(apiKey);
}

export async function sendInviteEmail({
  to,
  workspaceName,
  inviteLink,
  invitedByName,
}: SendInviteEmailParams) {
  const resend = getResendClient();

  if (!resend) {
    console.log("📧 [DEV MODE] Invite email skipped:", {
      to,
      workspaceName,
      inviteLink,
      invitedByName,
    });

    return { skipped: true };
  }

  const from = process.env.EMAIL_FROM || "OrbitOps <onboarding@resend.dev>";

  const subject = `You're invited to join ${workspaceName}`;

  const invitedByText = invitedByName
    ? `<p><strong>${invitedByName}</strong> invited you to join <strong>${workspaceName}</strong>.</p>`
    : `<p>You were invited to join <strong>${workspaceName}</strong>.</p>`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin-bottom: 16px;">Join ${workspaceName}</h2>
      ${invitedByText}
      <p style="margin-bottom: 16px;">
        Click the button below to accept your invitation and access the workspace.
      </p>
      <p style="margin: 24px 0;">
        <a
          href="${inviteLink}"
          style="display:inline-block;padding:12px 20px;background:#10b981;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;"
        >
          Accept Invitation
        </a>
      </p>
      <p style="margin-top: 16px;">If the button doesn't work, use this link:</p>
      <p style="word-break: break-all;">${inviteLink}</p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
  });

  if (error) {
    console.error("❌ Email error:", error);
    return { error };
  }

  return data;
}