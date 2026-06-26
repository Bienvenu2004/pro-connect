"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale as "en" | "fr" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#2a2a2a] bg-[#111111]/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-orange-500">
          Mission Pro
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-300 hover:text-white transition"
          >
            {t("home")}
          </Link>
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-300 hover:text-white transition"
              >
                {t("dashboard")}
              </Link>
              {(session.user as any).role === "PROFESSIONAL" && (
                <Link
                  href="/dashboard/profile"
                  className="text-sm font-medium text-gray-300 hover:text-white transition"
                >
                  {t("profile")}
                </Link>
              )}
              {(session.user as any).role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-gray-300 hover:text-white transition"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium text-gray-300 hover:text-white transition"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-300 hover:text-white transition"
            >
              {t("login")}
            </Link>
          )}
          <button
            onClick={() => switchLocale(locale === "fr" ? "en" : "fr")}
            className="rounded-full border border-[#3a3a3a] px-3 py-1 text-xs font-medium text-gray-400 hover:text-white hover:border-gray-500 transition"
          >
            {locale === "fr" ? "EN" : "FR"}
          </button>
          {!session?.user && (
            <Link
              href="/auth/register"
              className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition flex items-center gap-2"
            >
              {t("register")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          )}
        </div>

        <button
          className="md:hidden p-2 text-gray-300"
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

      {mobileOpen && (
        <div className="md:hidden border-t border-[#2a2a2a] bg-[#111111] px-4 py-4 space-y-3">
          <Link
            href="/"
            className="block text-sm font-medium text-gray-300"
            onClick={() => setMobileOpen(false)}
          >
            {t("home")}
          </Link>
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="block text-sm font-medium text-gray-300"
                onClick={() => setMobileOpen(false)}
              >
                {t("dashboard")}
              </Link>
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setMobileOpen(false);
                }}
                className="block text-sm font-medium text-gray-300"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="block text-sm font-medium text-gray-300"
                onClick={() => setMobileOpen(false)}
              >
                {t("login")}
              </Link>
              <Link
                href="/auth/register"
                className="block text-sm font-medium text-orange-500"
                onClick={() => setMobileOpen(false)}
              >
                {t("register")}
              </Link>
            </>
          )}
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
