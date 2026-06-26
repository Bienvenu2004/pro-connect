import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/navbar";
import { SessionProvider } from "@/components/session-provider";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <SessionProvider>
      <NextIntlClientProvider messages={messages}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#2a2a2a] bg-[#0a0a0a] py-8 text-center text-sm text-gray-500">
          <p className="font-semibold text-white mb-1">Mission Pro</p>
          <p>&copy; {new Date().getFullYear()} Mission Pro. Tous droits réservés.</p>
        </footer>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
