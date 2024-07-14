import { notFound } from "next/navigation";
import { LocalePrefix, Pathnames } from "next-intl/routing";
import { getRequestConfig } from "next-intl/server";

export const defaultLocale = "en" as const;
export const locales = ["en", "pl", "uk"] as const;

export const pathnames: Pathnames<typeof locales> = {
  "/": "/",
  "/mortgage-calculator": "/mortgage-calculator",
};

export const localePrefix: LocalePrefix<typeof locales> = "always";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (
      await (locale === "en"
        ? // When using Turbopack, this will enable HMR for `en`
          import("../messages/en.json")
        : import(`../messages/${locale}.json`))
    ).default,
  };
});
