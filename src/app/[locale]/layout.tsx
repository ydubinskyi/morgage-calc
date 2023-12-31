import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";

import { i18n } from "../../../i18n.config";

import "../globals.css";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className={cn(inter.className)}>
        <NextIntlClientProvider
          timeZone="Europe/Warsaw"
          locale={locale}
          messages={messages}
        >
          <header className="mx-auto flex max-w-7xl lg:px-8">
            <SiteHeader />
          </header>

          <main className="mx-auto flex max-w-7xl p-6 lg:px-8">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
