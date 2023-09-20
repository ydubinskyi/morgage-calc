import { memo } from "react";

import { Input } from "../ui/input";
import { useMortgageScheduleTableContext } from "./mortgage-schedule-table-context";

type AdditionalPaymentCellProps = {
  month: number;
  value: number;
};

export const AdditionalPaymentCell = memo(
  ({ month, value }: AdditionalPaymentCellProps) => {
    const { onAdditionalPaymentChange } = useMortgageScheduleTableContext();
    return (
      <Input
        defaultValue={value}
        onChange={(e) =>
          onAdditionalPaymentChange(month, Number(e.target.value) ?? 0)
        }
      />
    );
  }
);

AdditionalPaymentCell.displayName = "AdditionalPaymentCell";
