export type MortgageScheduleItem = {
  month: number;
  payment: number;
  principalPayment: number;
  additionalPayment: number;
  interestPayment: number;
  remainingPrincipal: number;
};

export type AdditionalPayments = {
  [month: number]: number;
};

export const INSTALLMENT_TYPE = {
  Fixed: "Fixed",
  Decreasing: "Decreasing",
} as const;

export type InstallmentType = keyof typeof INSTALLMENT_TYPE;