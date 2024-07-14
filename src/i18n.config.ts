import { LocalePrefix, Pathnames } from "next-intl/routing";

export const defaultLocale = "en" as const;
export const locales = ["en", "de"] as const;

export const pathnames: Pathnames<typeof locales> = {
  "/": "/",
  "/mortgage-calculator": "/mortgage-calculator",
};

export const localePrefix: LocalePrefix<typeof locales> = "always";

export const port = process.env.PORT || 3000;
export const host = `http://localhost:${port}`;
