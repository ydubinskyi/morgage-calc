"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";

import { i18n } from "../../i18n.config";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onLocaleChange = (locale: string) => {
    router.replace(pathname, { locale });
  };

  return (
    <Select onValueChange={onLocaleChange} defaultValue={locale}>
      <SelectTrigger>
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {i18n.locales.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {lang.toLocaleUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
