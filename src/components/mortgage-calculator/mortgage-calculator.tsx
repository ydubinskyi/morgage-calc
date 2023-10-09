"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useDebounce } from "use-debounce";

import {
  AdditionalPaymentItem,
  AdditionalPaymentsSection,
} from "../additional-payments-section/additional-payments-section";
import { MortgageScheduleTable } from "../mortgage-schedule-table/mortgage-schedule-table";
import { MortgageSummarySection } from "../mortgage-summary-section/mortgage-summary-section";
import {
  MortgageArgs,
  MortgageCalculatorForm,
} from "./mortgage-calculator-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalcWorker } from "@/hooks/useCalcWorker";
import { AdditionalPayments, MortgageScheduleItem } from "@/types/mortgage";

export const MortgageCalculator = () => {
  const t = useTranslations("mortgage-calculator");

  const calcWorkerApiRef = useCalcWorker();

  const [mortgageArgs, setMortgageArgs] = useState<MortgageArgs>();
  const [additionalPayments, setAdditionalPayments] =
    useState<AdditionalPayments>({});

  const [deferredAdditionalPayments] = useDebounce(additionalPayments, 1000);

  const [mortgagePaymentsSchedule, setMortgagePaymentsSchedule] = useState<
    MortgageScheduleItem[]
  >([]);

  const hasSchedule = mortgagePaymentsSchedule.length > 0;

  const onAdditionalPaymentChange = useCallback(
    (values: AdditionalPaymentItem[]) => {
      console.log({ values });
    },
    [],
  );

  const onBulkAdditionalPaymentsChange = useCallback(
    (values: AdditionalPayments) => {
      setAdditionalPayments((prev) => ({
        ...prev,
        ...values,
      }));
    },
    [],
  );

  const calculateSchedule = useCallback(
    async (values: MortgageArgs) => {
      const {
        installmentType,
        principal,
        annualInterestRate,
        loanTermInMonths,
        startDate,
      } = values;
      let schedule;

      if (installmentType === "Fixed") {
        schedule =
          await calcWorkerApiRef.current?.calculateMortgageScheduleFixedInstallment(
            {
              principal,
              annualInterestRate,
              loanTermInMonths,
              additionalPayments: deferredAdditionalPayments,
              startingDate: startDate,
            },
          );
      } else {
        schedule =
          await calcWorkerApiRef.current?.calculateMortgageScheduleDecreasingInstallment(
            {
              principal,
              annualInterestRate,
              loanTermInMonths,
              additionalPayments: deferredAdditionalPayments,
              startingDate: startDate,
            },
          );
      }

      setMortgagePaymentsSchedule(schedule ?? []);
    },
    [calcWorkerApiRef, deferredAdditionalPayments],
  );

  const onSubmit = (values: MortgageArgs) => {
    setMortgageArgs(values);

    calculateSchedule(values);
  };

  useEffect(() => {
    if (mortgageArgs) {
      calculateSchedule(mortgageArgs);
    }
  }, [calculateSchedule, mortgageArgs]);

  return (
    <div className="w-full">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <MortgageCalculatorForm onSubmit={onSubmit}></MortgageCalculatorForm>
        </CardContent>
      </Card>

      {hasSchedule && (
        <>
          <AdditionalPaymentsSection
            onAdditionalPaymentsChange={onAdditionalPaymentChange}
          />
          <MortgageSummarySection
            mortgagePaymentsSchedule={mortgagePaymentsSchedule}
          />
          <MortgageScheduleTable data={mortgagePaymentsSchedule} />
        </>
      )}
    </div>
  );
};
