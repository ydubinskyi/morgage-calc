"use client";

import { useState } from "react";

type MortgageScheduleItem = {
  month: number;
  payment: number;
  principalPayment: number;
  additionalPayment: number;
  interestPayment: number;
  remainingPrincipal: number;
};

const roundToFixedTwo = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

type AdditionalPayments = {
  [month: number]: number;
};

function calculateMonthlyPayment(
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

function sumNumbersFromArray(
  arr: MortgageScheduleItem[],
  propName: keyof MortgageScheduleItem
) {
  // Use the reduce method to iterate over the array and accumulate the sum
  const sum = arr.reduce((accumulator, currentValue) => {
    // Check if the current object has the specified property
    if (currentValue.hasOwnProperty(propName)) {
      // Add the value of the specified property to the accumulator
      return accumulator + currentValue[propName];
    } else {
      // If the property doesn't exist, return the accumulator unchanged
      return accumulator;
    }
  }, 0); // Initialize the accumulator with 0

  return sum;
}

function calculateMortgageScheduleDecreasingInstallment(
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
      remainingPrincipal,
    });

    month++;
  }

  return mortgageSchedule;
}

function calculateMortgageScheduleFixedInstallment(
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
    const monthlyPayment = calculateMonthlyPayment(
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
        principalPayment += additionalPayment;
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
      remainingPrincipal,
    });

    month++;
  }

  return mortgageSchedule;
}

export const MortgageCalculator = () => {
  const [overpayments, setOverpayments] = useState({});

  const principal = 440000;
  const monthCount = 240;
  const annualInterestRate = 0.058;

  const monthlyPayment = calculateMonthlyPayment(
    principal,
    annualInterestRate / 12,
    monthCount
  );

  const mortgagePaymentsSchedule =
    calculateMortgageScheduleDecreasingInstallment(
      principal,
      annualInterestRate,
      monthCount,
      overpayments
    );

  const onOverpaymentChange = (month: number, value: number) => {
    setOverpayments((prev) => ({
      ...prev,
      [month]: value ?? 0,
    }));
  };

  const onAddMultiAdditionalPayments = () => {
    const entries = Array.from({ length: monthCount }, (_, i) => i + 1).map(
      (item) => [item, 4000]
    );
    setOverpayments(() => Object.fromEntries(entries));
  };

  const totalPayments = sumNumbersFromArray(
    mortgagePaymentsSchedule,
    "payment"
  );

  const totalInterest = sumNumbersFromArray(
    mortgagePaymentsSchedule,
    "interestPayment"
  );

  const totalPrincipal = sumNumbersFromArray(
    mortgagePaymentsSchedule,
    "principalPayment"
  );

  const totalAdditionalPayments = sumNumbersFromArray(
    mortgagePaymentsSchedule,
    "additionalPayment"
  );

  return (
    <div className="w-full">
      <div className="py-3">
        <p>Amount: {principal}</p>
        <p>Month count: {monthCount}</p>
        <p>Percentage: {annualInterestRate}</p>

        <p>monthlyPayment: {monthlyPayment}</p>

        <button onClick={() => onAddMultiAdditionalPayments()}>
          Add payments
        </button>
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Month</th>
            <th className="px-6 py-3">Payment</th>
            <th className="px-6 py-3">Interest part</th>
            <th className="px-6 py-3">Principal part</th>
            <th className="px-6 py-3">Remaining principal</th>
            <th className="px-6 py-3">Overpayment</th>
          </tr>
        </thead>
        <tbody>
          {mortgagePaymentsSchedule.map((item) => (
            <tr
              key={item.month}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td className="px-6 py-4">
                {item.month % 12 === 0 ? `${item.month / 12} year` : item.month}
              </td>
              <td className="px-6 py-4">{item.payment.toFixed(2)}</td>
              <td className="px-6 py-4">{item.interestPayment.toFixed(2)}</td>
              <td className="px-6 py-4">{item.principalPayment.toFixed(2)}</td>
              <td className="px-6 py-4">
                {item.remainingPrincipal.toFixed(2)}
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) =>
                    onOverpaymentChange(item.month, Number(e.target.value) ?? 0)
                  }
                  value={item.additionalPayment}
                />
              </td>
            </tr>
          ))}
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th className="px-6 py-4">Total</th>
            <th className="px-6 py-4">{totalPayments.toFixed(2)}</th>
            <th className="px-6 py-4">{totalInterest.toFixed(2)}</th>
            <th className="px-6 py-4">{totalPrincipal.toFixed(2)}</th>
            <th className="px-6 py-4"> - </th>
            <th className="px-6 py-4">{totalAdditionalPayments.toFixed(2)}</th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
