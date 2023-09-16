import { createContext, useContext } from "react";

export const MortgageScheduleTableContext = createContext<{
  onAdditionalPaymentChange: (month: number, value: number) => void;
}>({ onAdditionalPaymentChange: () => null });

export const useMortgageScheduleTableContext = () =>
  useContext(MortgageScheduleTableContext);
