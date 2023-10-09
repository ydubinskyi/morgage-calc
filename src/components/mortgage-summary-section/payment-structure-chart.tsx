"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Cell,
  Pie,
  PieChart,
  PieLabelRenderProps,
  ResponsiveContainer,
} from "recharts";

import { ColorPointTitle } from "@/components/ui/color-point-title";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { formatMoneyValue } from "@/lib/utils";
import { PAYMENT_PART_COLOR } from "@/types/mortgage";

export type TotalPaymentsStructureChartProps = {
  title: string;
  principalPayment: number;
  interestPayment: number;
  additionalPayment: number;
};

export const PaymentStructureChart = ({
  title,
  principalPayment,
  interestPayment,
  additionalPayment = 0,
}: TotalPaymentsStructureChartProps) => {
  const t = useTranslations("mortgage-calculator");

  const data = useMemo(
    () => [
      {
        name: t("columns.principal"),
        value: principalPayment,
        color: PAYMENT_PART_COLOR.Principal,
      },
      {
        name: t("columns.interest"),
        value: interestPayment,
        color: PAYMENT_PART_COLOR.Interest,
      },
      ...(additionalPayment
        ? [
            {
              name: t("columns.additionalPayment"),
              value: additionalPayment,
              color: PAYMENT_PART_COLOR.Additional,
            },
          ]
        : []),
    ],
    [t, principalPayment, interestPayment, additionalPayment],
  );

  return (
    <div className="flex flex-col space-y-6">
      <p className="text-l font-semibold leading-none tracking-tight">
        {title}
      </p>

      <div className="rounded-md border">
        <Table>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.name} className="hover:bg-transparent">
                <TableHead>
                  <ColorPointTitle title={item.name} color={item.color} />
                </TableHead>
                <TableCell className="text-right">
                  {formatMoneyValue(item.value)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="border-b-0 border-t hover:bg-transparent">
              <TableHead>{t("columns.total")}</TableHead>
              <TableHead className="text-right">
                {formatMoneyValue(
                  principalPayment + interestPayment + additionalPayment,
                )}
              </TableHead>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={renderCustomizedLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  const RADIAN = Math.PI / 180;

  const radius =
    Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
  const x = Number(cx) + radius * Math.cos(-Number(midAngle) * RADIAN);
  const y = Number(cy) + radius * Math.sin(-Number(midAngle) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > Number(cx) ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(Number(percent) * 100).toFixed(0)}%`}
    </text>
  );
};
