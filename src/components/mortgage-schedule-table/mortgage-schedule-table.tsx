import { memo } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "../data-table";
import { ColorPointTitle } from "../ui/color-point-title";
import { AdditionalPaymentCell } from "./additional-payment-cell";
import { MortgageScheduleTableContext } from "./mortgage-schedule-table-context";
import { PaymentNumberCell } from "./payment-number-cell";

import { formatMoneyValue, sumArrayOfNumbers } from "@/lib/utils";
import { MortgageScheduleItem, PAYMENT_PART_COLOR } from "@/types/mortgage";

export const columns = [
  {
    accessorKey: "date",
    header: "Date",
    footer: "Total",
    cell: ({ row }) => <PaymentNumberCell item={row.original} />,
  },
  {
    accessorKey: "payment",
    header: "Payment",
    cell: ({ row }) => row.original.fPayment,
    footer: ({ table }) =>
      formatMoneyValue(
        sumArrayOfNumbers(
          table.getRowModel().rows.map((item) => item.original.payment)
        )
      ),
  },
  {
    accessorKey: "interestPayment",
    header: () => (
      <ColorPointTitle title="Interest" color={PAYMENT_PART_COLOR.Interest} />
    ),
    cell: ({ row }) => row.original.fInterestPayment,
    footer: ({ table }) =>
      formatMoneyValue(
        sumArrayOfNumbers(
          table.getRowModel().rows.map((item) => item.original.interestPayment)
        )
      ),
  },
  {
    accessorKey: "principalPayment",
    header: () => (
      <ColorPointTitle title="Principal" color={PAYMENT_PART_COLOR.Principal} />
    ),
    cell: ({ row }) => row.original.fPrincipalPayment,
    footer: ({ table }) =>
      formatMoneyValue(
        sumArrayOfNumbers(
          table.getRowModel().rows.map((item) => item.original.principalPayment)
        )
      ),
  },
  {
    accessorKey: "remainingPrincipal",
    header: "Remaining principal",
    cell: ({ row }) => row.original.fRemainingPrincipal,
  },
  {
    accessorKey: "additionalPayment",
    header: () => (
      <ColorPointTitle
        title="Additional payment"
        color={PAYMENT_PART_COLOR.Additional}
      />
    ),
    cell: ({ row }) => (
      <AdditionalPaymentCell
        paymentNumber={row.original.paymentNumber}
        value={row.original.additionalPayment}
      />
    ),
    footer: ({ table }) =>
      formatMoneyValue(
        sumArrayOfNumbers(
          table
            .getRowModel()
            .rows.map((item) => item.original.additionalPayment)
        )
      ),
  },
] as ColumnDef<MortgageScheduleItem>[];

type MortgageScheduleTableProps = {
  data: MortgageScheduleItem[];
  onAdditionalPaymentChange: (month: number, value: number) => void;
};

export const MortgageScheduleTable = memo(
  ({ data, onAdditionalPaymentChange }: MortgageScheduleTableProps) => {
    return (
      <MortgageScheduleTableContext.Provider
        value={{ onAdditionalPaymentChange }}
      >
        <DataTable columns={columns} data={data} />
      </MortgageScheduleTableContext.Provider>
    );
  }
);

MortgageScheduleTable.displayName = "MortgageScheduleTable";
