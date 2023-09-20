export type MortgageScheduleItem = {
  month: number;
  payment: number;
  fPayment: string;
  principalPayment: number;
  fPrincipalPayment: string;
  additionalPayment: number;
  fAdditionalPayment: string;
  interestPayment: number;
  fInterestPayment: string;
  remainingPrincipal: number;
  fRemainingPrincipal: string;
};

export type AdditionalPayments = {
  [month: number]: number;
};

export const INSTALLMENT_TYPE = {
  Fixed: "Fixed",
  Decreasing: "Decreasing",
} as const;

export type InstallmentType = keyof typeof INSTALLMENT_TYPE;

export const PAYMENT_PART_COLOR = {
  Principal: "#4caf50",
  Interest: "#ff5722",
  Additional: "#9c27b0",
} as const;
