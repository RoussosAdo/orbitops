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
  <div style="background:#f6f9fc;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px 28px;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

      <!-- Logo / Brand -->
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="margin:0;font-size:14px;letter-spacing:4px;color:#10b981;font-weight:700;">
          ORBITOPS
        </h1>
      </div>

      <!-- Title -->
      <h2 style="margin:0 0 16px 0;font-size:22px;color:#0f172a;text-align:center;">
        You're invited 🚀
      </h2>

      <!-- Message -->
      <p style="margin:0 0 16px 0;color:#475569;font-size:15px;text-align:center;">
        ${
          invitedByName
            ? `<strong style="color:#0f172a;">${invitedByName}</strong> invited you to join`
            : `You've been invited to join`
        }
      </p>

      <p style="margin:0 0 24px 0;color:#0f172a;font-size:18px;font-weight:600;text-align:center;">
        ${workspaceName}
      </p>

      <!-- Button -->
      <div style="text-align:center;margin:30px 0;">
        <a 
          href="${inviteLink}"
          style="
            display:inline-block;
            padding:14px 26px;
            background:#10b981;
            color:#ffffff;
            text-decoration:none;
            border-radius:10px;
            font-weight:600;
            font-size:14px;
            box-shadow:0 6px 14px rgba(16,185,129,0.25);
          "
        >
          Accept Invitation
        </a>
      </div>

      <!-- Divider -->
      <div style="height:1px;background:#e2e8f0;margin:24px 0;"></div>

      <!-- Fallback link -->
      <p style="margin:0 0 8px 0;font-size:13px;color:#64748b;text-align:center;">
        Or copy and paste this link:
      </p>

      <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;word-break:break-all;">
        ${inviteLink}
      </p>

      <!-- Footer -->
      <p style="margin-top:24px;font-size:12px;color:#94a3b8;text-align:center;">
        If you didn’t expect this invite, you can safely ignore this email.
      </p>

    </div>

    <!-- Bottom -->
    <p style="text-align:center;margin-top:16px;font-size:11px;color:#94a3b8;">
      © ${new Date().getFullYear()} OrbitOps. All rights reserved.
    </p>
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