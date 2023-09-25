import { useFormatter } from "next-intl";

import { MortgageScheduleItem } from "@/types/mortgage";

type PaymentNumberCellProps = {
  item: MortgageScheduleItem;
};

export const PaymentNumberCell = ({ item }: PaymentNumberCellProps) => {
  const format = useFormatter();
  return (
    <span className="text-muted-foreground">
      <span className="font-medium">#{item.paymentNumber}</span>{" "}
      {format.dateTime(item.date, { month: "short", year: "2-digit" })}
    </span>
  );
};
