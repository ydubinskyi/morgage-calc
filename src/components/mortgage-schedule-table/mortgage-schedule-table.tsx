import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "../data-table";
import { AdditionalPaymentCell } from "./additional-payment-cell";
import { MortgageScheduleTableContext } from "./mortgage-schedule-table-context";
import { PaymentNumberCell } from "./payment-number-cell";

import { sumArrayOfNumbers } from "@/lib/utils";
import { MortgageScheduleItem } from "@/types/mortgage";

const formatNumberValue = (val: number) => `${val.toFixed(2)} zł`;

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
    cell: ({ row }) => formatNumberValue(row.original.payment),
    footer: ({ table }) =>
      formatNumberValue(
        sumArrayOfNumbers(
          table.getRowModel().rows.map((item) => item.original.payment)
        )
      ),
  },
  {
    accessorKey: "interestPayment",
    header: "Interest part",
    cell: ({ row }) => formatNumberValue(row.original.interestPayment),
    footer: ({ table }) =>
      formatNumberValue(
        sumArrayOfNumbers(
          table.getRowModel().rows.map((item) => item.original.interestPayment)
        )
      ),
  },
  {
    accessorKey: "principalPayment",
    header: "Principal part",
    cell: ({ row }) => formatNumberValue(row.original.principalPayment),
    footer: ({ table }) =>
      formatNumberValue(
        sumArrayOfNumbers(
          table.getRowModel().rows.map((item) => item.original.principalPayment)
        )
      ),
  },
  {
    accessorKey: "remainingPrincipal",
    header: "Remaining principal",
    cell: ({ row }) => formatNumberValue(row.original.remainingPrincipal),
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
      formatNumberValue(
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

export const MortgageScheduleTable = ({
  data,
  onAdditionalPaymentChange,
}: MortgageScheduleTableProps) => {
  return (
    <MortgageScheduleTableContext.Provider
      value={{ onAdditionalPaymentChange }}
    >
      <DataTable columns={columns} data={data} />
    </MortgageScheduleTableContext.Provider>
  );
};
