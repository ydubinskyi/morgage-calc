import { AdditionalPayments, MortgageScheduleItem } from "@/types/mortgage";

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

export function calculateMortgageScheduleFixedInstallment(
  principal: number,
  annualInterestRate: number,
  loanTermInMonths: number,
  additionalPayments: AdditionalPayments = {},
  desiredMonthlyPayment: number = 0
): MortgageScheduleItem[] {
  const mortgageSchedule: MortgageScheduleItem[] = [];
  const monthlyInterestRate = annualInterestRate / 12;
  let remainingPrincipal = principal;
  let month = 1;

  while (remainingPrincipal > 0 && month <= loanTermInMonths) {
    const monthlyPayment = calculateMonthlyPaymentForFixedInstallment(
      remainingPrincipal,
      monthlyInterestRate,
      loanTermInMonths - month + 1
    );

    const userProvidedAdditionalPayment = additionalPayments[month] || 0;

    const desiredPaymentAdditionalPart =
      desiredMonthlyPayment > monthlyPayment
        ? roundToFixedTwo(desiredMonthlyPayment - monthlyPayment)
        : 0;

    const additionalPayment =
      userProvidedAdditionalPayment || desiredPaymentAdditionalPart;

    let interestPayment = remainingPrincipal * monthlyInterestRate;
    let principalPayment = monthlyPayment - interestPayment;

    if (additionalPayment) {
      if (principalPayment + additionalPayment > remainingPrincipal) {
        principalPayment = remainingPrincipal;
        remainingPrincipal = 0;
      } else {
        remainingPrincipal -= principalPayment + additionalPayment;
        // principalPayment += additionalPayment;
      }
    } else {
      remainingPrincipal -= principalPayment;
    }

    mortgageSchedule.push({
      month,
      payment: monthlyPayment + additionalPayment,
      principalPayment,
      additionalPayment: additionalPayment,
      interestPayment,
      remainingPrincipal: remainingPrincipal >= 0 ? remainingPrincipal : 0,
    });

    month++;
  }

  return mortgageSchedule;
}

export function calculateMortgageScheduleDecreasingInstallment(
  principal: number,
  annualInterestRate: number,
  loanTermInMonths: number,
  additionalPayments: AdditionalPayments = {}
) {
  const mortgageSchedule: MortgageScheduleItem[] = [];
  const monthlyInterestRate = annualInterestRate / 12;
  const basePrincipalPayment = principal / loanTermInMonths;

  let remainingPrincipal = principal;
  let month = 1;

  while (remainingPrincipal > 0 && month <= loanTermInMonths) {
    const additionalPayment = additionalPayments[month] || 0;

    const principalPayment = basePrincipalPayment + additionalPayment;
    const interestPayment = remainingPrincipal * monthlyInterestRate;
    const monthlyPayment = principalPayment + interestPayment;

    remainingPrincipal -= principalPayment + additionalPayment;

    mortgageSchedule.push({
      month,
      payment: monthlyPayment,
      principalPayment,
      additionalPayment,
      interestPayment,
      remainingPrincipal: remainingPrincipal >= 0 ? remainingPrincipal : 0,
    });

    month++;
  }

  return mortgageSchedule;
}
