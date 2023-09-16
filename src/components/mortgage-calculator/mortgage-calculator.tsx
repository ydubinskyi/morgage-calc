"use client";

import { useCallback, useEffect, useState } from "react";

import { MortgageScheduleTable } from "../mortgage-schedule-table/mortgage-schedule-table";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  MortgageArgs,
  MortgageCalculatorForm,
} from "./mortgage-calculator-form";

import {
  calculateMortgageScheduleDecreasingInstallment,
  calculateMortgageScheduleFixedInstallment,
} from "@/lib/calc-utils";
import { AdditionalPayments, MortgageScheduleItem } from "@/types/mortgage";

export const MortgageCalculator = () => {
  const [mortgageArgs, setMortgageArgs] = useState<MortgageArgs>();
  const [additionalPayments, setAdditionalPayments] =
    useState<AdditionalPayments>({});

  const [mortgagePaymentsSchedule, setMortgagePaymentsSchedule] = useState<
    MortgageScheduleItem[]
  >([]);

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
          additionalPayments,
          7000
        );
      } else {
        schedule = calculateMortgageScheduleDecreasingInstallment(
          principal,
          annualInterestRate,
          loanTermInMonths,
          additionalPayments
        );
      }

      setMortgagePaymentsSchedule(schedule);
    },
    [additionalPayments]
  );

  const onSubmit = (values: MortgageArgs) => {
    setMortgageArgs(values);

    calculateSchedule(values);
  };

  useEffect(() => {
    if (mortgageArgs) {
      calculateSchedule(mortgageArgs);
    }
  }, [additionalPayments, calculateSchedule, mortgageArgs]);

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
          <Button variant="secondary" onClick={onAddMultiAdditionalPayments}>
            Add bulk additional payment
          </Button>
        </CardFooter>
      </Card>

      <MortgageScheduleTable
        data={mortgagePaymentsSchedule}
        onAdditionalPaymentChange={onAdditionalPaymentChange}
      />
    </div>
  );
};
