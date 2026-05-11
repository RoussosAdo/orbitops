import Image from "next/image";
import Link from "next/link";
import { getCurrentLanguage } from "@/app/lib/get-current-language";
import { dashboardCopy } from "@/app/lib/i18n";

export default async function HomePage() {
  const language = await getCurrentLanguage();
  const copy = dashboardCopy[language].homePage;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#f5f7fb] text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-5rem] h-72 w-72 rounded-full bg-[rgba(109,94,252,0.10)] blur-3xl animate-float-slow" />
        <div className="absolute bottom-[-8rem] right-[-6rem] h-80 w-80 rounded-full bg-[rgba(56,189,248,0.10)] blur-3xl animate-float-soft" />
        <div className="absolute left-[35%] top-[65%] h-48 w-48 rounded-full bg-[rgba(16,185,129,0.08)] blur-3xl animate-float-delayed" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-6 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 xl:gap-20">
        <div className="max-w-2xl">
          <div className="animate-fade-up inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-white/90 px-4 py-2 shadow-[var(--shadow-xs)] backdrop-blur">
            <div className="relative h-6 w-6 overflow-hidden rounded-full border border-[var(--border)] bg-white">
              <Image
                src="/orbitops-logo.png"
                alt="OrbitOps logo"
                fill
                priority
                sizes="24px"
                className="object-contain p-1"
              />
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">
              OrbitOps
            </span>

            <span className="rounded-full bg-[rgba(109,94,252,0.10)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
              {copy.badge}
            </span>
          </div>

          <h1 className="animate-fade-up-delay-1 mt-8 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.07em] text-[var(--foreground)] sm:text-6xl xl:text-7xl">
            {copy.titleStart}{" "}
            <span className="bg-[linear-gradient(135deg,#5b5cf0_0%,#4f7cff_55%,#23b6d2_100%)] bg-clip-text text-transparent">
              {copy.titleHighlight}
            </span>
            .
          </h1>

          <p className="animate-fade-up-delay-2 mt-6 max-w-xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
            {copy.description}
          </p>

          <div className="animate-fade-up-delay-2 mt-7 flex flex-wrap gap-3">
            {copy.featurePills.map((pill) => (
              <div
                key={pill}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-xs)]"
              >
                <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-live-pulse" />
                {pill}
              </div>
            ))}
          </div>

          <div className="animate-fade-up-delay-3 mt-9">
            <Link
              href="/dashboard"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[var(--foreground)] px-6 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-black"
            >
              {copy.openDashboard}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="animate-fade-up-delay-3 mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.4rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)]">
              <p className="text-xs font-medium leading-5 text-[var(--muted-foreground)]">
                {copy.stats.activeWorkspaces}
              </p>
              <p className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                12+
              </p>
            </div>

            <div className="rounded-[1.4rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)]">
              <p className="text-xs font-medium leading-5 text-[var(--muted-foreground)]">
                {copy.stats.operationalClarity}
              </p>
              <p className="mt-2 text-[1.5rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                {copy.stats.realtime}
              </p>
            </div>

            <div className="rounded-[1.4rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)]">
              <p className="text-xs font-medium leading-5 text-[var(--muted-foreground)]">
                {copy.stats.projectTracking}
              </p>
              <p className="mt-3 text-[1.6rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                {copy.stats.smart}
              </p>
            </div>

            <div className="rounded-[1.4rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)]">
              <p className="text-xs font-medium leading-5 text-[var(--muted-foreground)]">
                {copy.stats.billingOversight}
              </p>
              <p className="mt-0.5 text-[1.6rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                {copy.stats.secure}
              </p>
            </div>
          </div>
        </div>

        <div className="animate-fade-up-delay-2">
          <div className="relative mx-auto max-w-[520px] rounded-[2rem] border border-[var(--border)] bg-white p-4 shadow-[0_30px_80px_rgba(17,24,39,0.10)]">
            <div className="rounded-[1.6rem] border border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#f9fbff_100%)] p-4">
              <div className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[var(--border)] bg-white">
                    <Image
                      src="/orbitops-logo.png"
                      alt="OrbitOps logo"
                      fill
                      sizes="40px"
                      className="object-contain p-1.5"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      OrbitOps Control
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {copy.preview.subtitle}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-live-pulse" />
                  {copy.preview.live}
                </div>
              </div>

              <div className="mt-4 rounded-[1.4rem] border border-[var(--border)] bg-[var(--muted)] p-4 animate-float-soft">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                      {copy.preview.workspaceSignal}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                      {copy.preview.premiumVisibility}
                    </h3>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--primary)] shadow-[var(--shadow-xs)]">
                    {copy.preview.stable}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.2rem] border border-[var(--border)] bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                      {copy.preview.teamAccess}
                    </p>
                    <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                      Owner • Admin • Member
                    </p>
                  </div>

                  <div className="rounded-[1.2rem] border border-[var(--border)] bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                      {copy.preview.workspaceSwitch}
                    </p>
                    <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                      {copy.preview.seamless}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {copy.preview.cards.map((item, index) => (
                  <div
                    key={item.label}
                    className={`rounded-[1.25rem] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-xs)] ${
                      index === 1 ? "animate-float-delayed" : "animate-float-soft"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                          {item.label}
                        </p>
                        <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                          {item.meta}
                        </p>
                      </div>

                      <div
                        className={`h-14 w-14 rounded-2xl ${
                          index === 0
                            ? "bg-[rgba(109,94,252,0.16)]"
                            : index === 1
                            ? "bg-[rgba(56,189,248,0.18)]"
                            : "bg-[rgba(16,185,129,0.16)]"
                        } animate-gentle-bob`}
                      />
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                      <div className="h-full w-1/2 rounded-full bg-[linear-gradient(90deg,#6d5efc_0%,#56a5ff_100%)] animate-live-bar" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-[#0f172a] px-4 py-4 text-white shadow-[var(--shadow-sm)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                      {copy.why.eyebrow}
                    </p>
                    <h4 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
                      {copy.why.title}
                    </h4>
                  </div>

                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <span className="text-lg">✦</span>
                  </div>
                </div>

                <p className="mt-3 max-w-md text-sm leading-7 text-white/75">
                  {copy.why.description}
                </p>

                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <div className="animate-marquee flex min-w-max items-center gap-3 px-4 py-3">
                    {[...copy.liveFeed, ...copy.liveFeed].map((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/85"
                      >
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-live-pulse" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-4 top-10 hidden h-20 w-20 rounded-full border border-[rgba(109,94,252,0.18)] bg-white/80 shadow-[var(--shadow-md)] backdrop-blur md:block animate-float-slow" />
            <div className="pointer-events-none absolute -left-4 bottom-16 hidden h-16 w-16 rounded-3xl border border-[rgba(56,189,248,0.18)] bg-white/80 shadow-[var(--shadow-md)] backdrop-blur md:block animate-float-delayed" />
          </div>
        </div>
      </div>
    </main>
  );
}