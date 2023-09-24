import { addMonths, getYear } from "date-fns";

import { formatMoneyValue } from "./utils";

import {
  CalcMortgageScheduleArgs,
  MortgageScheduleItem,
} from "@/types/mortgage";

export const roundToFixedTwo = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export function calculateMonthlyPaymentForFixedInstallment(
  principal: number,
  monthlyInterestRate: number,
  loanTermInMonths: number
): number {
  return (
    (principal *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, loanTermInMonths)) /
    (Math.pow(1 + monthlyInterestRate, loanTermInMonths) - 1)
  );
}

export function calculateMortgageScheduleFixedInstallment({
  principal,
  annualInterestRate,
  loanTermInMonths,
  additionalPayments,
  startingDate,
}: CalcMortgageScheduleArgs): MortgageScheduleItem[] {
  const mortgageSchedule: MortgageScheduleItem[] = [];
  const monthlyInterestRate = annualInterestRate / 12;
  let remainingPrincipal = principal;
  let paymentNumber = 1;

  while (remainingPrincipal > 0 && paymentNumber <= loanTermInMonths) {
    const monthlyPayment = calculateMonthlyPaymentForFixedInstallment(
      remainingPrincipal,
      monthlyInterestRate,
      loanTermInMonths - paymentNumber + 1
    );

    const userProvidedAdditionalPayment =
      additionalPayments[paymentNumber]?.value || 0;

    let additionalPayment = userProvidedAdditionalPayment;

    let interestPayment = remainingPrincipal * monthlyInterestRate;
    let principalPayment = monthlyPayment - interestPayment;

    if (additionalPayment) {
      if (principalPayment + additionalPayment > remainingPrincipal) {
        additionalPayment = roundToFixedTwo(
          remainingPrincipal - principalPayment
        );
        remainingPrincipal = 0;
      } else {
        remainingPrincipal -= principalPayment + additionalPayment;
      }
    } else {
      remainingPrincipal -= principalPayment;
    }

    const date = addMonths(startingDate, paymentNumber - 1);

    mortgageSchedule.push(
      addFormattedValues({
        paymentNumber,
        date,
        year: getYear(date),
        payment: principalPayment + interestPayment + additionalPayment,
        principalPayment,
        additionalPayment: additionalPayment,
        interestPayment,
        remainingPrincipal: remainingPrincipal >= 0 ? remainingPrincipal : 0,
      })
    );

    paymentNumber++;
  }

  return mortgageSchedule;
}

export function calculateMortgageScheduleDecreasingInstallment({
  principal,
  annualInterestRate,
  loanTermInMonths,
  additionalPayments,
  startingDate,
}: CalcMortgageScheduleArgs) {
  const mortgageSchedule: MortgageScheduleItem[] = [];
  const monthlyInterestRate = annualInterestRate / 12;
  const basePrincipalPayment = principal / loanTermInMonths;

  let remainingPrincipal = principal;
  let paymentNumber = 1;

  while (remainingPrincipal > 0 && paymentNumber <= loanTermInMonths) {
    let additionalPayment = additionalPayments[paymentNumber]?.value || 0;

    let principalPayment = basePrincipalPayment;
    let interestPayment = remainingPrincipal * monthlyInterestRate;

    if (additionalPayment) {
      if (principalPayment + additionalPayment > remainingPrincipal) {
        principalPayment = remainingPrincipal;
        remainingPrincipal = 0;
        additionalPayment = 0;
      } else {
        remainingPrincipal -= principalPayment + additionalPayment;
      }
    } else {
      remainingPrincipal -= principalPayment;
    }

    const date = addMonths(startingDate, paymentNumber - 1);

    mortgageSchedule.push(
      addFormattedValues({
        paymentNumber,
        date,
        year: getYear(date),
        payment: principalPayment + interestPayment + additionalPayment,
        principalPayment: principalPayment,
        additionalPayment,
        interestPayment,
        remainingPrincipal: remainingPrincipal >= 0 ? remainingPrincipal : 0,
      })
    );

    paymentNumber++;
  }

  return mortgageSchedule;
}

const addFormattedValues = (
  item: Omit<
    MortgageScheduleItem,
    | "fPayment"
    | "fPrincipalPayment"
    | "fAdditionalPayment"
    | "fInterestPayment"
    | "fRemainingPrincipal"
  >
) => ({
  ...item,
  fPayment: formatMoneyValue(item.payment),
  fPrincipalPayment: formatMoneyValue(item.principalPayment),
  fAdditionalPayment: formatMoneyValue(item.additionalPayment),
  fInterestPayment: formatMoneyValue(item.interestPayment),
  fRemainingPrincipal: formatMoneyValue(item.remainingPrincipal),
});
