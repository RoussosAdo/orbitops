import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendInviteEmailParams = {
  to: string;
  workspaceName: string;
  inviteLink: string;
  invitedByName?: string | null;
};

export async function sendInviteEmail({
  to,
  workspaceName,
  inviteLink,
  invitedByName,
}: SendInviteEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
  }

  if (!process.env.EMAIL_FROM) {
    throw new Error("Missing EMAIL_FROM");
  }

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
    from: process.env.EMAIL_FROM,
    to: [to],
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message || "Failed to send invite email");
  }

  return data;
}