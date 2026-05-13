import PageHeader from "@/app/components/dashboard/PageHeader";
import { prisma } from "@/app/lib/prisma";
import { updateWorkspaceSettings } from "@/app/actions/settingsActions";
import { requireCurrentWorkspace } from "@/app/lib/get-current-workspace";
import { getCurrentLanguage } from "@/app/lib/get-current-language";
import { dashboardCopy } from "@/app/lib/i18n";

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
    <label className="card-hover flex items-start justify-between gap-4 rounded-[1.25rem] border border-[var(--border)] bg-white px-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {label}
        </p>
        <p className="mt-1 text-xs leading-6 text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        name={name}
        defaultChecked={checked}
        className="mt-1 h-5 w-5 shrink-0 rounded"
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
    <div className="card-hover rounded-[1.35rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-xs)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
        {label}
      </p>

      <p className="mt-2 break-words text-lg font-semibold text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

function StatusRow({
  label,
  enabled,
  enabledLabel,
  disabledLabel,
}: {
  label: string;
  enabled: boolean;
  enabledLabel: string;
  disabledLabel: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 transition hover:bg-white sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </span>

      <span
        className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold sm:text-sm ${
          enabled
            ? "bg-emerald-100 text-emerald-700"
            : "bg-white text-[var(--muted-foreground)]"
        }`}
      >
        {enabled ? enabledLabel : disabledLabel}
      </span>
    </div>
  );
}

export default async function SettingsPage() {
  const workspace = await requireCurrentWorkspace();
  const language = await getCurrentLanguage();
  const copy = dashboardCopy[language];
  const settingsCopy = copy.settingsPage;

  const settings = await prisma.workspaceSettings.findUnique({
    where: {
      workspaceId: workspace.id,
    },
  });

  if (!settings) {
    return (
      <section className="space-y-6">
        <PageHeader
          eyebrow={settingsCopy.eyebrow}
          title={settingsCopy.title}
          description={settingsCopy.emptyDescription}
          actionLabel={settingsCopy.settings}
        />

        <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--muted)] p-5">
          <p className="text-lg font-semibold text-[var(--foreground)]">
            {settingsCopy.noSettingsFound}
          </p>

          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {settingsCopy.noSettingsDescription}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow={settingsCopy.eyebrow}
        title={settingsCopy.title}
        description={settingsCopy.description}
        actionLabel={settingsCopy.saveSettings}
      />

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <SummaryCard
          label={settingsCopy.workspace}
          value={settings.workspaceName}
        />
        <SummaryCard label={settingsCopy.brand} value={settings.brandColor} />
        <SummaryCard label={settingsCopy.timezone} value={settings.timezone} />
      </div>

      <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)] sm:p-6">
        <div className="mb-5">
          <p className="text-sm text-[var(--muted-foreground)]">
            {settingsCopy.currentWorkspace}:{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {workspace.name}
            </span>
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.9fr]">
          <div className="card-hover rounded-[1.35rem] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-xs)] sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {settingsCopy.workspacePreferences}
            </p>

            <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              {settingsCopy.generalSettings}
            </h3>

            <form action={updateWorkspaceSettings} className="mt-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                    {settingsCopy.workspaceName}
                  </label>

                  <input
                    name="workspaceName"
                    defaultValue={settings.workspaceName}
                    className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 text-sm text-[var(--foreground)] outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                    {settingsCopy.companyEmail}
                  </label>

                  <input
                    name="companyEmail"
                    type="email"
                    defaultValue={settings.companyEmail}
                    className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 text-sm text-[var(--foreground)] outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                    {settingsCopy.timezone}
                  </label>

                  <select
                    name="timezone"
                    defaultValue={settings.timezone}
                    className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 text-sm text-[var(--foreground)] outline-none"
                  >
                    <option value="Europe/Athens">Europe/Athens</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                    {settingsCopy.brandColor}
                  </label>

                  <select
                    name="brandColor"
                    defaultValue={settings.brandColor}
                    className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 text-sm text-[var(--foreground)] outline-none"
                  >
                    <option value="Neo Mint">Neo Mint</option>
                    <option value="Ocean Blue">Ocean Blue</option>
                    <option value="Sunset Orange">Sunset Orange</option>
                    <option value="Slate Gray">Slate Gray</option>
                  </select>
                </div>
              </div>

              <div className="card-hover rounded-[1.35rem] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-xs)] sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  {settingsCopy.notifications}
                </p>

                <h4 className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  {settingsCopy.communicationPreferences}
                </h4>

                <div className="mt-5 space-y-4">
                  <PreferenceRow
                    label={settingsCopy.emailNotifications}
                    description={settingsCopy.emailNotificationsDescription}
                    checked={settings.emailNotifications}
                    name="emailNotifications"
                  />

                  <PreferenceRow
                    label={settingsCopy.productUpdates}
                    description={settingsCopy.productUpdatesDescription}
                    checked={settings.productUpdates}
                    name="productUpdates"
                  />

                  <PreferenceRow
                    label={settingsCopy.weeklyReports}
                    description={settingsCopy.weeklyReportsDescription}
                    checked={settings.weeklyReports}
                    name="weeklyReports"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="h-12 w-full rounded-2xl bg-[var(--foreground)] px-5 text-sm font-semibold text-white transition hover:bg-black sm:w-auto"
              >
                {settingsCopy.saveChanges}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="card-hover rounded-[1.35rem] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-xs)] sm:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {settingsCopy.workspaceSummary}
              </p>

              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                {settingsCopy.currentConfiguration}
              </h3>

              <div className="mt-5 space-y-4">
                <SummaryCard
                  label={settingsCopy.workspace}
                  value={settings.workspaceName}
                />
                <SummaryCard
                  label={settingsCopy.brand}
                  value={settings.brandColor}
                />
                <SummaryCard
                  label={settingsCopy.timezone}
                  value={settings.timezone}
                />
              </div>
            </div>

            <div className="card-hover rounded-[1.35rem] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-xs)] sm:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {settingsCopy.status}
              </p>

              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                {settingsCopy.preferencesStatus}
              </h3>

              <div className="mt-5 space-y-3">
                <StatusRow
                  label={settingsCopy.emailNotifications}
                  enabled={settings.emailNotifications}
                  enabledLabel={settingsCopy.enabled}
                  disabledLabel={settingsCopy.disabled}
                />

                <StatusRow
                  label={settingsCopy.productUpdates}
                  enabled={settings.productUpdates}
                  enabledLabel={settingsCopy.enabled}
                  disabledLabel={settingsCopy.disabled}
                />

                <StatusRow
                  label={settingsCopy.weeklyReports}
                  enabled={settings.weeklyReports}
                  enabledLabel={settingsCopy.enabled}
                  disabledLabel={settingsCopy.disabled}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}