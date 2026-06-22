import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  const t = useTranslations();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:py-32 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            {t("home.hero")}
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
            {t("home.subtitle")}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="rounded-lg bg-orange-500 px-6 py-3 text-lg font-semibold text-white shadow hover:bg-orange-600 transition"
            >
              {t("home.ctaClient")}
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-white/10 border border-white/30 px-6 py-3 text-lg font-semibold text-white shadow hover:bg-white/20 transition"
            >
              {t("home.ctaPro")}
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
          {t("home.howItWorks")}
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          <Step number={1} title={t("home.step1Title")} desc={t("home.step1Desc")} />
          <Step number={2} title={t("home.step2Title")} desc={t("home.step2Desc")} />
          <Step number={3} title={t("home.step3Title")} desc={t("home.step3Desc")} />
        </div>
      </section>
    </div>
  );
}

function Step({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-xl">
        {number}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{desc}</p>
    </div>
  );
}
