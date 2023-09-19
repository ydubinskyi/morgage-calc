"use client";

import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { MortgageScheduleTable } from "../mortgage-schedule-table/mortgage-schedule-table";
import { MortgageSummarySection } from "../mortgage-summary-section/mortgage-summary-section";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AdditionalPaymentsDialog } from "./additional-payments-dialog";
import {
  MortgageArgs,
  MortgageCalculatorForm,
} from "./mortgage-calculator-form";

import {
  calculateMortgageScheduleDecreasingInstallment,
  calculateMortgageScheduleFixedInstallment,
} from "@/lib/calc-utils";
import { AdditionalPayments, MortgageScheduleItem } from "@/types/mortgage";
import { MonthPicker } from "../ui/month-picker";

export const MortgageCalculator = () => {
  const [mortgageArgs, setMortgageArgs] = useState<MortgageArgs>();
  const [additionalPayments, setAdditionalPayments] =
    useState<AdditionalPayments>({});

  const [deferredAdditionalPayments] = useDebounce(additionalPayments, 1000);

  const [mortgagePaymentsSchedule, setMortgagePaymentsSchedule] = useState<
    MortgageScheduleItem[]
  >([]);

  const hasSchedule = mortgagePaymentsSchedule.length > 0;

  const onAdditionalPaymentChange = (month: number, value: number) => {
    setAdditionalPayments((prev) => ({
      ...prev,
      [month]: value ?? 0,
    }));
  };

  const onAddMultiAdditionalPayments = () => {
    const entries = Array.from(
      { length: mortgageArgs?.loanTermInMonths ?? 0 },
      (_, i) => i + 1
    ).map((item) => [item, 4000]);
    setAdditionalPayments(() => Object.fromEntries(entries));
  };

  const calculateSchedule = useCallback(
    (values: MortgageArgs) => {
      const {
        installmentType,
        principal,
        annualInterestRate,
        loanTermInMonths,
      } = values;
      let schedule;

      if (installmentType === "Fixed") {
        schedule = calculateMortgageScheduleFixedInstallment(
          principal,
          annualInterestRate,
          loanTermInMonths,
          deferredAdditionalPayments
        );
      } else {
        schedule = calculateMortgageScheduleDecreasingInstallment(
          principal,
          annualInterestRate,
          loanTermInMonths,
          deferredAdditionalPayments
        );
      }

      setMortgagePaymentsSchedule(schedule);
    },
    [deferredAdditionalPayments]
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
          <CardTitle>Mortgage calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <MortgageCalculatorForm onSubmit={onSubmit} />
        </CardContent>
        <CardFooter>
          <AdditionalPaymentsDialog />
        </CardFooter>
      </Card>

      {hasSchedule && (
        <>
          <MortgageSummarySection
            mortgagePaymentsSchedule={mortgagePaymentsSchedule}
          />
          <MortgageScheduleTable
            data={mortgagePaymentsSchedule}
            onAdditionalPaymentChange={onAdditionalPaymentChange}
          />
        </>
      )}
    </div>
  );
};
