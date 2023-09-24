"use client";

import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { MortgageScheduleTable } from "../mortgage-schedule-table/mortgage-schedule-table";
import { MortgageSummarySection } from "../mortgage-summary-section/mortgage-summary-section";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AdditionalPaymentsDialog } from "./additional-payments-dialog";
import {
  MortgageArgs,
  MortgageCalculatorForm,
} from "./mortgage-calculator-form";

import { useCalcWorker } from "@/hooks/useCalcWorker";
import { AdditionalPayments, MortgageScheduleItem } from "@/types/mortgage";

export const MortgageCalculator = () => {
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
    (paymentNumber: number, value: number) => {
      // setAdditionalPayments((prev) => ({
      //   ...prev,
      //   [paymentNumber]: {
      //     value,
      //   },
      // }));
    },
    []
  );

  const onBulkAdditionalPaymentsChange = useCallback(
    (values: AdditionalPayments) => {
      setAdditionalPayments((prev) => ({
        ...prev,
        ...values,
      }));
    },
    []
  );

  const calculateSchedule = useCallback(
    async (values: MortgageArgs) => {
      const {
        installmentType,
        principal,
        annualInterestRate,
        loanTermInMonths,
        startDate,
        overpaymentEffect,
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
            }
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
            }
          );
      }

      setMortgagePaymentsSchedule(schedule ?? []);
    },
    [calcWorkerApiRef, deferredAdditionalPayments]
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
          <MortgageCalculatorForm onSubmit={onSubmit}>
            {mortgageArgs && (
              <AdditionalPaymentsDialog
                startDate={mortgageArgs?.startDate}
                loanTermInMonths={
                  mortgageArgs?.loanTermInMonths >
                  mortgagePaymentsSchedule.length
                    ? mortgageArgs?.loanTermInMonths
                    : mortgagePaymentsSchedule.length
                }
                onAdditionalPaymentsChange={onBulkAdditionalPaymentsChange}
              />
            )}
          </MortgageCalculatorForm>
        </CardContent>
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
