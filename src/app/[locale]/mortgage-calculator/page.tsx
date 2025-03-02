import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";

import { MortgageCalculator } from "@/components/mortgage-calculator/mortgage-calculator";

export default async function MortgageCalculatorPage(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale);

  return <MortgageCalculator />;
}
