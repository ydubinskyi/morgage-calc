import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <header className="mx-auto flex max-w-7xl lg:px-8">
          <SiteHeader />
        </header>

        <main className="mx-auto flex max-w-7xl p-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
