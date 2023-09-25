import { memo, useMemo } from "react";
import { useTranslations } from "next-intl";

import { Card } from "../ui/card";
import { PaymentStructureChart } from "./payment-structure-chart";
import { PaymentsScheduleChart } from "./payments-schedule-chart";

import { roundToFixedTwo } from "@/lib/calc-utils";
import { sumArrayOfNumbers } from "@/lib/utils";
import { MortgageScheduleItem } from "@/types/mortgage";

type MortgageSummarySectionProps = {
  mortgagePaymentsSchedule: MortgageScheduleItem[];
  pending?: boolean;
};

export const MortgageSummarySection = memo(
  ({ mortgagePaymentsSchedule, pending }: MortgageSummarySectionProps) => {
    const t = useTranslations("mortgage-calculator");

    const totalPrincipalPayment = useMemo(
      () =>
        roundToFixedTwo(
          sumArrayOfNumbers(
            mortgagePaymentsSchedule.map((item) => item.principalPayment)
          )
        ),
      [mortgagePaymentsSchedule]
    );

    const totalInterestPayment = useMemo(
      () =>
        roundToFixedTwo(
          sumArrayOfNumbers(
            mortgagePaymentsSchedule.map((item) => item.interestPayment)
          )
        ),
      [mortgagePaymentsSchedule]
    );

    const totalAdditionalPayment = useMemo(
      () =>
        roundToFixedTwo(
          sumArrayOfNumbers(
            mortgagePaymentsSchedule.map((item) => item.additionalPayment)
          )
        ),
      [mortgagePaymentsSchedule]
    );

    const firstPaymentPrincipalPayment =
      mortgagePaymentsSchedule.length > 0
        ? roundToFixedTwo(mortgagePaymentsSchedule[0].principalPayment)
        : 0;

    const firstPaymentInterestPayment =
      mortgagePaymentsSchedule.length > 0
        ? roundToFixedTwo(mortgagePaymentsSchedule[0].interestPayment)
        : 0;

    const firstPaymentAdditionalPayment =
      mortgagePaymentsSchedule.length > 0
        ? roundToFixedTwo(mortgagePaymentsSchedule[0].additionalPayment)
        : 0;

    return (
      <>
        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6 mb-6" pending={pending}>
            <PaymentStructureChart
              title={t("totalPaymentsStructureTitle")}
              principalPayment={totalPrincipalPayment}
              interestPayment={totalInterestPayment}
              additionalPayment={totalAdditionalPayment}
            />
          </Card>
          <Card className="p-6 mb-6" pending={pending}>
            <PaymentStructureChart
              title={t("firstPaymentStructureTitle")}
              principalPayment={firstPaymentPrincipalPayment}
              interestPayment={firstPaymentInterestPayment}
              additionalPayment={firstPaymentAdditionalPayment}
            />
          </Card>
        </div>

        <Card className="p-6 mb-6" pending={pending}>
          <PaymentsScheduleChart
            mortgagePaymentsSchedule={mortgagePaymentsSchedule}
          />
        </Card>
      </>
    );
  }
);

MortgageSummarySection.displayName = "MortgageSummarySection";
