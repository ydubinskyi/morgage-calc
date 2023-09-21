import { format } from "date-fns";

import { MortgageScheduleItem } from "@/types/mortgage";

type PaymentNumberCellProps = {
  item: MortgageScheduleItem;
};

export const PaymentNumberCell = ({ item }: PaymentNumberCellProps) => (
  <span className="font-medium text-muted-foreground">
    {format(item.date, "LLL yy")}
  </span>
);
