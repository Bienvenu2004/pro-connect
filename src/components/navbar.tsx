"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [mobileOpen, setMobileOpen] = useState(false);

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale as "en" | "fr" });
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-blue-700">
          Mission Pro
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
          >
            {t("login")}
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            {t("register")}
          </Link>
          <button
            onClick={() => switchLocale(locale === "fr" ? "en" : "fr")}
            className="ml-2 rounded border px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            {locale === "fr" ? "EN" : "FR"}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t bg-white px-4 py-3 space-y-3">
          <Link
            href="/auth/login"
            className="block text-sm font-medium text-gray-700"
            onClick={() => setMobileOpen(false)}
          >
            {t("login")}
          </Link>
          <Link
            href="/auth/register"
            className="block text-sm font-medium text-blue-600"
            onClick={() => setMobileOpen(false)}
          >
            {t("register")}
          </Link>
          <button
            onClick={() => {
              switchLocale(locale === "fr" ? "en" : "fr");
              setMobileOpen(false);
            }}
            className="text-xs font-medium text-gray-500"
          >
            {locale === "fr" ? "Switch to English" : "Passer en Français"}
          </button>
        </div>
      )}
    </header>
  );
}
