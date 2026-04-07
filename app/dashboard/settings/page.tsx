import PageHeader from "@/app/components/dashboard/PageHeader";
import { prisma } from "@/app/lib/prisma";
import { updateWorkspaceSettings } from "@/app/actions/settingsActions";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";

export default async function SettingsPage() {
  const workspace = await requireCurrentWorkspace();

  const settings = await prisma.workspaceSettings.findUnique({
    where: {
      workspaceId: workspace.id,
    },
  });

  if (!settings) {
    return (
      <section className="space-y-6">
        <PageHeader
          eyebrow="Workspace"
          title="Settings"
          description="Manage your workspace details, brand preferences and notifications."
          actionLabel="Settings"
        />

        <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-10 text-center shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
          <p className="text-lg font-semibold text-[var(--foreground)]">
            No settings found
          </p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            This workspace does not have settings yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Manage your workspace details, preferences and notifications."
        actionLabel="Save Settings"
      />

      <div className="mb-2">
        <p className="text-sm text-[var(--muted-foreground)]">
          Current workspace:{" "}
          <span className="font-semibold text-[var(--foreground)]">
            {workspace.name}
          </span>
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
          <form action={updateWorkspaceSettings} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Workspace Name
                </label>
                <input
                  name="workspaceName"
                  defaultValue={settings.workspaceName}
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Company Email
                </label>
                <input
                  name="companyEmail"
                  type="email"
                  defaultValue={settings.companyEmail}
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Timezone
                </label>
                <select
                  name="timezone"
                  defaultValue={settings.timezone}
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                >
                  <option value="Europe/Athens">Europe/Athens</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Brand Color
                </label>
                <select
                  name="brandColor"
                  defaultValue={settings.brandColor}
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                >
                  <option value="Neo Mint">Neo Mint</option>
                  <option value="Ocean Blue">Ocean Blue</option>
                  <option value="Sunset Orange">Sunset Orange</option>
                  <option value="Slate Gray">Slate Gray</option>
                </select>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--muted)] p-5">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Notifications
              </h3>

              <div className="mt-4 space-y-4">
                <label className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      Email Notifications
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Receive account and workspace email alerts.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    defaultChecked={settings.emailNotifications}
                    className="h-5 w-5"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      Product Updates
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Receive updates about new features and improvements.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="productUpdates"
                    defaultChecked={settings.productUpdates}
                    className="h-5 w-5"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      Weekly Reports
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Get a weekly summary of workspace activity.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="weeklyReports"
                    defaultChecked={settings.weeklyReports}
                    className="h-5 w-5"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
            >
              Save Changes
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
            <h3 className="text-xl font-bold text-[var(--foreground)]">
              Workspace Summary
            </h3>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl bg-[var(--muted)] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  Workspace
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  {settings.workspaceName}
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--muted)] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  Brand
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  {settings.brandColor}
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--muted)] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  Timezone
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  {settings.timezone}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_8px_30px_rgba(15,46,40,0.04)]">
            <h3 className="text-xl font-bold text-[var(--foreground)]">
              Preferences Status
            </h3>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-[var(--muted)] px-4 py-3">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  Email Notifications
                </span>
                <span className="text-sm font-semibold text-[var(--primary-dark)]">
                  {settings.emailNotifications ? "Enabled" : "Disabled"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[var(--muted)] px-4 py-3">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  Product Updates
                </span>
                <span className="text-sm font-semibold text-[var(--primary-dark)]">
                  {settings.productUpdates ? "Enabled" : "Disabled"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[var(--muted)] px-4 py-3">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  Weekly Reports
                </span>
                <span className="text-sm font-semibold text-[var(--primary-dark)]">
                  {settings.weeklyReports ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}