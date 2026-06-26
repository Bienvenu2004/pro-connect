import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  const t = useTranslations();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-36">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-orange-500 font-medium text-sm tracking-wide uppercase mb-4">
                {t("home.tagline")}
              </p>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                {t("home.hero")}
              </h1>
              <p className="mt-6 text-lg text-gray-400 max-w-lg">
                {t("home.subtitle")}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/register"
                  className="rounded-full bg-orange-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition flex items-center justify-center gap-2"
                >
                  {t("home.ctaClient")}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-full border border-[#3a3a3a] px-7 py-3.5 text-base font-semibold text-gray-300 hover:border-gray-500 hover:text-white transition text-center"
                >
                  {t("home.ctaPro")}
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-[#2a2a2a] p-8">
                <div className="grid grid-cols-2 gap-4">
                  <StatCard number="500+" label={t("home.statPros")} />
                  <StatCard number="2min" label={t("home.statTime")} />
                  <StatCard number="98%" label={t("home.statSatisfaction")} />
                  <StatCard number="24/7" label={t("home.statAvailability")} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-[#2a2a2a] bg-[#0d0d0d]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <span className="text-xs uppercase tracking-wider">{t("home.trustedCategories")}</span>
            <CategoryPill icon="🔧" label={t("categories.PLOMBERIE")} />
            <CategoryPill icon="⚡" label={t("categories.ELECTRICITE")} />
            <CategoryPill icon="🧱" label={t("categories.MACONNERIE")} />
            <CategoryPill icon="🔩" label={t("categories.MECANIQUE")} />
            <CategoryPill icon="📐" label={t("categories.INGENIERIE")} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-orange-500 font-medium text-sm tracking-wide uppercase mb-3">
              {t("home.howItWorksLabel")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              {t("home.howItWorks")}
            </h2>
            <p className="mt-4 text-gray-400 max-w-md">
              {t("home.howItWorksSubtitle")}
            </p>
            <Link
              href="/auth/register"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition"
            >
              {t("home.getStarted")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="space-y-6">
            <Step
              number="01"
              title={t("home.step1Title")}
              desc={t("home.step1Desc")}
            />
            <Step
              number="02"
              title={t("home.step2Title")}
              desc={t("home.step2Desc")}
            />
            <Step
              number="03"
              title={t("home.step3Title")}
              desc={t("home.step3Desc")}
            />
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="border-t border-[#2a2a2a]">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            {t("home.ctaTitle")}
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            {t("home.ctaSubtitle")}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="rounded-full bg-orange-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition"
            >
              {t("home.ctaClient")}
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full border border-[#3a3a3a] px-7 py-3.5 text-base font-semibold text-gray-300 hover:border-gray-500 hover:text-white transition"
            >
              {t("home.ctaPro")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-5 text-center">
      <p className="text-2xl font-bold text-orange-500">{number}</p>
      <p className="mt-1 text-xs text-gray-400">{label}</p>
    </div>
  );
}

function CategoryPill({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="flex items-center gap-2 text-gray-400">
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="flex gap-5 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5 hover:border-orange-500/30 transition">
      <span className="text-orange-500 font-bold text-sm">#{number}</span>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-400">{desc}</p>
      </div>
    </div>
  );
}
