export type MortgageScheduleItem = {
  date: Date;
  year: number;
  paymentNumber: number;
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
  [paymentNumber: number]: {
    value: number;
    overpaymentEffect: OverpaymentEffectType;
  };
};

export type AdditionalPaymentV2 = {
  paymentNumberFrom: number;
  paymentNumberTo: number;
  value: number;
  overpaymentEffect: OverpaymentEffectType;
}

export type CalcMortgageScheduleArgs = {
  principal: number;
  annualInterestRate: number;
  loanTermInMonths: number;
  additionalPayments: AdditionalPayments;
  startingDate: Date;
};

export const INSTALLMENT_TYPE = {
  Fixed: "Fixed",
  Decreasing: "Decreasing",
} as const;

export type InstallmentType = keyof typeof INSTALLMENT_TYPE;

export const OVERPAYMENT_EFFECT = {
  LowerInstallment: "LowerInstallment",
  ShortenedLoanTerm: "ShortenedLoanTerm",
} as const;

export type OverpaymentEffectType = keyof typeof OVERPAYMENT_EFFECT;

export const PAYMENT_PART_COLOR = {
  Principal: "#4caf50",
  Interest: "#ff5722",
  Additional: "#9c27b0",
} as const;
