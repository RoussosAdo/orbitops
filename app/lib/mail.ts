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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const logoUrl = `${appUrl}/orbitops-logo.png`;

  const subject = `You're invited to join ${workspaceName} on OrbitOps`;

  const inviterLine = invitedByName
    ? `${invitedByName} invited you to join ${workspaceName}.`
    : `You were invited to join ${workspaceName}.`;

  const html = `
  <div style="margin:0;padding:32px 16px;background:#f4f6fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
    <div style="max-width:640px;margin:0 auto;">

      <div style="background:#ffffff;border:1px solid #e7eaf3;border-radius:28px;overflow:hidden;box-shadow:0 18px 40px rgba(15,23,42,0.08);">
        
        <div style="padding:32px;background:linear-gradient(180deg,#ffffff 0%,#fbfbff 100%);border-bottom:1px solid #e7eaf3;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="vertical-align:middle;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <div style="width:56px;height:56px;border-radius:18px;overflow:hidden;border:1px solid #e7eaf3;background:#ffffff;box-shadow:0 1px 2px rgba(15,23,42,0.04);">
                        <img
                          src="${logoUrl}"
                          alt="OrbitOps"
                          width="56"
                          height="56"
                          style="display:block;width:56px;height:56px;object-fit:contain;"
                        />
                      </div>
                    </td>
                    <td style="width:14px;"></td>
                    <td style="vertical-align:middle;">
                      <div style="font-size:20px;line-height:1.2;font-weight:700;color:#0f172a;">
                        OrbitOps
                      </div>
                      <div style="margin-top:4px;font-size:13px;line-height:1.5;color:#667085;">
                        Workspace platform
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
              <td style="text-align:right;vertical-align:top;">
                <span style="display:inline-block;padding:8px 12px;border:1px solid #e7eaf3;background:#f8faff;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#667085;">
                  Invitation
                </span>
              </td>
            </tr>
          </table>

          <div style="margin-top:28px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#6d5efc;">
              Workspace Invitation
            </div>

            <h1 style="margin:14px 0 0;font-size:42px;line-height:1.02;font-weight:700;letter-spacing:-0.05em;color:#0f172a;">
              Join your team on OrbitOps
            </h1>

            <p style="margin:18px 0 0;font-size:15px;line-height:1.8;color:#667085;">
              ${inviterLine}
            </p>
          </div>
        </div>

        <div style="padding:32px;">
          <div style="border:1px solid #e7eaf3;background:#f8faff;border-radius:22px;padding:20px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#667085;">
              Workspace
            </div>
            <div style="margin-top:10px;font-size:28px;line-height:1.15;font-weight:700;letter-spacing:-0.04em;color:#0f172a;">
              ${workspaceName}
            </div>
            <div style="margin-top:8px;font-size:14px;line-height:1.7;color:#667085;">
              Shared projects, tasks, billing and team collaboration in one place.
            </div>
          </div>

          <p style="margin:24px 0 0;font-size:15px;line-height:1.85;color:#667085;">
            Accept this invitation to access your workspace and start collaborating securely with your team inside OrbitOps.
          </p>

          <div style="margin-top:28px;">
            <a
              href="${inviteLink}"
              style="display:inline-flex;align-items:center;justify-content:center;height:50px;padding:0 24px;border-radius:16px;background:#0f172a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;box-shadow:0 1px 2px rgba(15,23,42,0.04);"
            >
              Accept invitation
            </a>
          </div>

          <div style="margin-top:28px;border:1px solid #e7eaf3;background:#ffffff;border-radius:20px;padding:18px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#667085;">
              Access details
            </div>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:12px;">
              <tr>
                <td style="padding:6px 0;font-size:14px;line-height:1.6;color:#667085;">
                  Invited email
                </td>
                <td style="padding:6px 0;font-size:14px;line-height:1.6;font-weight:600;color:#0f172a;text-align:right;">
                  ${to}
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:14px;line-height:1.6;color:#667085;">
                  Access
                </td>
                <td style="padding:6px 0;font-size:14px;line-height:1.6;font-weight:600;color:#0f172a;text-align:right;">
                  Workspace invitation
                </td>
              </tr>
            </table>
          </div>

          <div style="margin-top:24px;border:1px solid #e7eaf3;background:#f8faff;border-radius:20px;padding:18px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#667085;">
              Fallback link
            </div>
            <p style="margin:10px 0 0;font-size:13px;line-height:1.8;color:#667085;">
              If the button does not work, copy and paste this link into your browser:
            </p>
            <p style="margin:10px 0 0;word-break:break-all;font-size:13px;line-height:1.8;color:#5546f0;">
              ${inviteLink}
            </p>
          </div>

          <p style="margin:24px 0 0;font-size:12px;line-height:1.7;color:#98a2b3;">
            This invitation can only be accepted by the email address it was sent to. If you didn’t expect this invite, you can safely ignore this email.
          </p>
        </div>
      </div>

      <p style="margin:16px 0 0;text-align:center;font-size:12px;line-height:1.6;color:#98a2b3;">
        © ${new Date().getFullYear()} OrbitOps. All rights reserved.
      </p>
    </div>
  </div>
  `;

  const text = `${inviterLine}

Workspace: ${workspaceName}

Accept invitation:
${inviteLink}

This invitation can only be accepted by the email address it was sent to. If you didn’t expect this invite, you can safely ignore this email.`;

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
    text,
  });

  if (error) {
    console.error("❌ Email error:", error);
    return { error };
  }

  return data;
}