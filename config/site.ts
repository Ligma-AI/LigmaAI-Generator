export const siteConfig: any = {
  name: "Ligma AI",
  url: process.env.NEXTAUTH_URL || "https://ligma-ai.net/",
  domain: "ligma-ai.net",
  mail: "support@fluximage.org",
  effectiveDate: "2024.8.9"
};  

import { Pathnames, LocalePrefix } from "next-intl/routing";

export const defaultLocale = "en" as const;
export const languages = [
  { lang: "en", label: "English", hrefLang: "en-US" },
] as const;

export const locales = languages.map((lang) => lang.lang);

export const localePrefix: LocalePrefix<typeof locales> = "as-needed";//"always";
