type PaymentNumberCellProps = {
  month: number;
};

export const PaymentNumberCell = ({ month }: PaymentNumberCellProps) =>
  month % 12 === 0 ? (
    <span className="font-medium text-muted-foreground">{month / 12} year</span>
  ) : (
    month
  );
