import { memo } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "../data-table";
import { AdditionalPaymentCell } from "./additional-payment-cell";
import { MortgageScheduleTableContext } from "./mortgage-schedule-table-context";
import { PaymentNumberCell } from "./payment-number-cell";

import { formatMoneyValue, sumArrayOfNumbers } from "@/lib/utils";
import { MortgageScheduleItem } from "@/types/mortgage";

export const columns = [
  {
    accessorKey: "month",
    header: "Month",
    footer: "Total",
    cell: ({ row }) => <PaymentNumberCell month={row.original.month} />,
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
    header: "Interest part",
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
    header: "Principal part",
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
    header: "Additional payment",
    cell: ({ row }) => (
      <AdditionalPaymentCell
        month={row.original.month}
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
