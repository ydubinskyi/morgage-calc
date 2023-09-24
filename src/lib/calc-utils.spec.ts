import { describe, expect, test } from "vitest";

import {
  AdditionalPayments,
  MortgageScheduleItem,
  OVERPAYMENT_EFFECT,
} from "../types/mortgage";
import {
  calculateMonthlyPaymentForFixedInstallment,
  calculateMortgageScheduleDecreasingInstallment,
  calculateMortgageScheduleFixedInstallment,
  roundToFixedTwo,
} from "./calc-utils";

describe("calc-utils", () => {
  describe("roundToFixedTwo", () => {
    test("should round up to fixed 2", () => {
      expect(roundToFixedTwo(1.2345)).toEqual(1.23);
    });
  });

  describe("calculateMonthlyPaymentForFixedInstallment", () => {
    test("should calculate monthly payment correctly", () => {
      const principal = 10000;
      const monthlyInterestRate = 0.01;
      const loanTermInMonths = 12;
      const expectedMonthlyPayment = 888.49;

      const monthlyPayment = calculateMonthlyPaymentForFixedInstallment(
        principal,
        monthlyInterestRate,
        loanTermInMonths
      );

      expect(monthlyPayment).toBeCloseTo(expectedMonthlyPayment, 2);
    });
  });

  describe("calculateMortgageScheduleFixedInstallment", () => {
    test("should calculate mortgage schedule with no additional payments", () => {
      const principal = 100000;
      const annualInterestRate = 0.12;
      const loanTermInMonths = 12;
      const additionalPayments: AdditionalPayments = {};
      const startingDate = new Date("2022-01-01");

      const schedule = calculateMortgageScheduleFixedInstallment({
        principal,
        annualInterestRate,
        loanTermInMonths,
        additionalPayments,
        startingDate,
      });

      const expectedPayment = 8884.88;
      const expectedEndDate = new Date("2022-12-01");

      const firstItem = schedule[0];
      const lastItem = schedule[schedule.length - 1];

      // check payment is equal for first and last item
      expect(firstItem.payment).toBeCloseTo(expectedPayment, 2);
      expect(lastItem.payment).toBeCloseTo(expectedPayment, 2);

      // check date is set properly
      expect(firstItem.date).toEqual(startingDate);
      expect(lastItem.date).toEqual(expectedEndDate);
    });
  });

  describe("calculateMortgageScheduleDecreasingInstallment", () => {
    test("should calculate mortgage schedule with no additional payments", () => {
      const principal = 100000;
      const annualInterestRate = 0.12;
      const loanTermInMonths = 12;
      const additionalPayments: AdditionalPayments = {};
      const startingDate = new Date("2022-01-01");

      const schedule = calculateMortgageScheduleDecreasingInstallment({
        principal,
        annualInterestRate,
        loanTermInMonths,
        additionalPayments,
        startingDate,
      });

      const expectedFirstPayment = 9333.33;
      const expectedPrincipalPayment = 8333.33;
      const expectedEndDate = new Date("2022-12-01");

      const firstItem = schedule[0];
      const lastItem = schedule[schedule.length - 1];

      // check first payment is properly calculated
      expect(firstItem.payment).toBeCloseTo(expectedFirstPayment, 2);

      // check principal payment is equal for first and last item
      expect(firstItem.principalPayment).toBeCloseTo(
        expectedPrincipalPayment,
        2
      );
      expect(lastItem.principalPayment).toBeCloseTo(
        expectedPrincipalPayment,
        2
      );

      // check date is set properly
      expect(firstItem.date).toEqual(startingDate);
      expect(lastItem.date).toEqual(expectedEndDate);
    });
  });
});
