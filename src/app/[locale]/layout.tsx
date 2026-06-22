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
        <footer className="border-t bg-white py-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Mission Pro</p>
        </footer>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
