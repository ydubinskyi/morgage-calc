import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";

import { MortgageCalculator } from "@/components/mortgage-calculator/mortgage-calculator";

export default function MortgageCalculatorPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return <MortgageCalculator />;
}
