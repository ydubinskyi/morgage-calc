import { Input } from "../ui/input";
import { useMortgageScheduleTableContext } from "./mortgage-schedule-table-context";

type AdditionalPaymentCellProps = {
  month: number;
  value: number;
};

export const AdditionalPaymentCell = ({
  month,
  value,
}: AdditionalPaymentCellProps) => {
  const { onAdditionalPaymentChange } = useMortgageScheduleTableContext();
  return (
    <Input
      value={value}
      onChange={(e) =>
        onAdditionalPaymentChange(month, Number(e.target.value) ?? 0)
      }
    />
  );
};
