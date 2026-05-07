import PageHeader from "@/app/components/dashboard/PageHeader";
import { prisma } from "@/app/lib/prisma";
import { updateWorkspaceSettings } from "@/app/actions/settingsActions";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";

function PreferenceRow({
  label,
  description,
  checked,
  name,
}: {
  label: string;
  description: string;
  checked: boolean;
  name: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-[var(--border)] bg-white px-4 py-4">
      <div>
        <p className="text-sm font-semibold text-[var(--foreground)]">{label}</p>
        <p className="mt-1 text-xs leading-6 text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        name={name}
        defaultChecked={checked}
        className="h-5 w-5 rounded"
      />
    </label>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

function StatusRow({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
      <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
      <span
        className={`text-sm font-semibold ${
          enabled ? "text-emerald-600" : "text-[var(--muted-foreground)]"
        }`}
      >
        {enabled ? "Enabled" : "Disabled"}
      </span>
    </div>
  );
}

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

        <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-10 text-center shadow-[var(--shadow-sm)]">
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
        description="Manage workspace identity, brand preferences and communication settings."
        actionLabel="Save Settings"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Workspace" value={settings.workspaceName} />
        <SummaryCard label="Brand" value={settings.brandColor} />
        <SummaryCard label="Timezone" value={settings.timezone} />
      </div>

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
        <div className="mb-5">
          <p className="text-sm text-[var(--muted-foreground)]">
            Current workspace:{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {workspace.name}
            </span>
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.9fr]">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Workspace Preferences
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              General Settings
            </h3>

            <form action={updateWorkspaceSettings} className="mt-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                    Workspace Name
                  </label>
                  <input
                    name="workspaceName"
                    defaultValue={settings.workspaceName}
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--foreground)] outline-none"
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
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    defaultValue={settings.timezone}
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--foreground)] outline-none"
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
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--foreground)] outline-none"
                  >
                    <option value="Neo Mint">Neo Mint</option>
                    <option value="Ocean Blue">Ocean Blue</option>
                    <option value="Sunset Orange">Sunset Orange</option>
                    <option value="Slate Gray">Slate Gray</option>
                  </select>
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--muted)] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Notifications
                </p>
                <h4 className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  Communication Preferences
                </h4>

                <div className="mt-5 space-y-4">
                  <PreferenceRow
                    label="Email Notifications"
                    description="Receive account and workspace email alerts."
                    checked={settings.emailNotifications}
                    name="emailNotifications"
                  />

                  <PreferenceRow
                    label="Product Updates"
                    description="Receive updates about new features and improvements."
                    checked={settings.productUpdates}
                    name="productUpdates"
                  />

                  <PreferenceRow
                    label="Weekly Reports"
                    description="Get a weekly summary of workspace activity."
                    checked={settings.weeklyReports}
                    name="weeklyReports"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="rounded-2xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                Save Changes
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                Workspace Summary
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                Current Configuration
              </h3>

              <div className="mt-5 space-y-4">
                <SummaryCard label="Workspace" value={settings.workspaceName} />
                <SummaryCard label="Brand" value={settings.brandColor} />
                <SummaryCard label="Timezone" value={settings.timezone} />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                Status
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                Preferences Status
              </h3>

              <div className="mt-5 space-y-3">
                <StatusRow
                  label="Email Notifications"
                  enabled={settings.emailNotifications}
                />
                <StatusRow
                  label="Product Updates"
                  enabled={settings.productUpdates}
                />
                <StatusRow
                  label="Weekly Reports"
                  enabled={settings.weeklyReports}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}