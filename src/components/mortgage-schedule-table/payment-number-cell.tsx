import { format } from "date-fns";

import { MortgageScheduleItem } from "@/types/mortgage";

type PaymentNumberCellProps = {
  item: MortgageScheduleItem;
};

export const PaymentNumberCell = ({ item }: PaymentNumberCellProps) => (
  <span className="text-muted-foreground">
    <span className="font-medium">#{item.paymentNumber}</span>{" "}
    {format(item.date, "LLL yy")}
  </span>
);
