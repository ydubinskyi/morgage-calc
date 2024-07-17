"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Label, Pie, PieChart, PieLabelRenderProps } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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

  const totalPayment = principalPayment + interestPayment + additionalPayment;

  const config = useMemo(
    () =>
      ({
        principal: {
          label: t("columns.principal"),
          color: PAYMENT_PART_COLOR.Principal,
        },
        interest: {
          label: t("columns.interest"),
          color: PAYMENT_PART_COLOR.Interest,
        },
        additionalPayment: {
          label: t("columns.additionalPayment"),
          color: PAYMENT_PART_COLOR.Additional,
        },
      }) as const satisfies ChartConfig,
    [t],
  );

  const data = useMemo(
    () => [
      {
        name: "principal",
        value: principalPayment,
        percent: principalPayment / totalPayment,
        fill: PAYMENT_PART_COLOR.Principal,
      },
      {
        name: "interest",
        value: interestPayment,
        percent: interestPayment / totalPayment,
        fill: PAYMENT_PART_COLOR.Interest,
      },
      ...(additionalPayment
        ? [
            {
              name: "additionalPayment",
              value: additionalPayment,
              percent: additionalPayment / totalPayment,
              fill: PAYMENT_PART_COLOR.Additional,
            },
          ]
        : []),
    ],
    [principalPayment, totalPayment, interestPayment, additionalPayment],
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
                  <ColorPointTitle
                    title={config[item.name as keyof typeof config].label}
                    color={config[item.name as keyof typeof config].color}
                  />
                </TableHead>
                <TableCell className="text-right">
                  {formatMoneyValue(item.value)} (
                  {(item.percent * 100).toFixed(2)}%)
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

      <div className="flex-1">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[360px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelClassName="mr-1"
                  valueFormatter={(value, _name, item) => {
                    return (
                      <span className="ml-2">
                        {`${formatMoneyValue(value as number)} (${(item?.payload.percent * 100).toFixed(0)}%)`}
                      </span>
                    );
                  }}
                />
              }
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={90}
              strokeWidth={5}
              stroke="0"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold"
                        >
                          {formatMoneyValue(totalPayment)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {t("columns.total")}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
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
