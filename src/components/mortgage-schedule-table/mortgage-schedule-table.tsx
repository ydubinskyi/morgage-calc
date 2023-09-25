import { memo, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "../data-table";
import { ColorPointTitle } from "../ui/color-point-title";
import { MortgageScheduleTableContext } from "./mortgage-schedule-table-context";
import { PaymentNumberCell } from "./payment-number-cell";

import { formatMoneyValue, sumArrayOfNumbers } from "@/lib/utils";
import { MortgageScheduleItem, PAYMENT_PART_COLOR } from "@/types/mortgage";

type MortgageScheduleTableProps = {
  data: MortgageScheduleItem[];
  onAdditionalPaymentChange: (month: number, value: number) => void;
};

export const MortgageScheduleTable = memo(
  ({ data, onAdditionalPaymentChange }: MortgageScheduleTableProps) => {
    const t = useTranslations("mortgage-calculator");

    const columns: ColumnDef<MortgageScheduleItem>[] = useMemo(
      () => [
        {
          accessorKey: "date",
          header: t("columns.date"),
          footer: t("columns.total"),
          cell: ({ row }) => <PaymentNumberCell item={row.original} />,
        },
        {
          accessorKey: "payment",
          header: t("columns.payment"),
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
            <ColorPointTitle
              title={t("columns.interest")}
              color={PAYMENT_PART_COLOR.Interest}
            />
          ),
          cell: ({ row }) => row.original.fInterestPayment,
          footer: ({ table }) =>
            formatMoneyValue(
              sumArrayOfNumbers(
                table
                  .getRowModel()
                  .rows.map((item) => item.original.interestPayment)
              )
            ),
        },
        {
          accessorKey: "principalPayment",
          header: () => (
            <ColorPointTitle
              title={t("columns.principal")}
              color={PAYMENT_PART_COLOR.Principal}
            />
          ),
          cell: ({ row }) => row.original.fPrincipalPayment,
          footer: ({ table }) =>
            formatMoneyValue(
              sumArrayOfNumbers(
                table
                  .getRowModel()
                  .rows.map((item) => item.original.principalPayment)
              )
            ),
        },
        {
          accessorKey: "additionalPayment",
          header: () => (
            <ColorPointTitle
              title={t("columns.additionalPayment")}
              color={PAYMENT_PART_COLOR.Additional}
            />
          ),
          cell: ({ row }) => row.original.fAdditionalPayment,
          footer: ({ table }) =>
            formatMoneyValue(
              sumArrayOfNumbers(
                table
                  .getRowModel()
                  .rows.map((item) => item.original.additionalPayment)
              )
            ),
        },
        {
          accessorKey: "remainingPrincipal",
          header: t("columns.remainingPrincipal"),
          cell: ({ row }) => row.original.fRemainingPrincipal,
        },
      ],
      [t]
    );

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
