import { memo } from "react";

import { Input } from "../ui/input";
// import { useMortgageScheduleTableContext } from "./mortgage-schedule-table-context";

type AdditionalPaymentCellProps = {
  paymentNumber: number;
  value: number;
};

export const AdditionalPaymentCell = memo(
  ({ paymentNumber, value }: AdditionalPaymentCellProps) => {

    return (
      <Input
        key={value}
        type="number"
        defaultValue={value}
        onChange={(e) =>
          // onAdditionalPaymentChange(paymentNumber, e.target.valueAsNumber ?? 0)
        }
      />
    );
  }
);

AdditionalPaymentCell.displayName = "AdditionalPaymentCell";
