import { useMemo } from "react";
import { useFormatter, useTranslations } from "next-intl";
import {
  Bar,
  Brush,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

import { formatMoneyValue } from "@/lib/utils";
import { MortgageScheduleItem, PAYMENT_PART_COLOR } from "@/types/mortgage";

type PaymentsScheduleChartProps = {
  mortgagePaymentsSchedule: MortgageScheduleItem[];
};

export const PaymentsScheduleChart = ({
  mortgagePaymentsSchedule: data,
}: PaymentsScheduleChartProps) => {
  const t = useTranslations("mortgage-calculator");
  const format = useFormatter();

  const chartConfig = useMemo(
    () =>
      ({
        date: {
          label: t("columns.date"),
        },
        principalPayment: {
          label: t("columns.principal"),
          color: PAYMENT_PART_COLOR.Principal,
        },
        interestPayment: {
          label: t("columns.interest"),
          color: PAYMENT_PART_COLOR.Interest,
        },
        additionalPayment: {
          label: t("columns.additionalPayment"),
          color: PAYMENT_PART_COLOR.Additional,
        },
        remainingPrincipal: {
          label: t("columns.remainingPrincipal"),
          color: "black",
        },
      }) as const satisfies ChartConfig,
    [t],
  );

  return (
    <div className="flex flex-col space-y-6">
      <p className="text-l font-semibold leading-none tracking-tight">
        {t("paymentsStructureChartTitle")}
      </p>

      <ChartContainer config={chartConfig}>
        <ComposedChart
          data={data}
          margin={{
            right: 70,
            left: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            name={t("columns.date")}
            tickFormatter={(value: Date) =>
              format.dateTime(value, { month: "short", year: "2-digit" })
            }
          />

          <YAxis
            yAxisId="left"
            orientation="left"
            dataKey="payment"
            tickFormatter={(value: string) => formatMoneyValue(Number(value))}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            dataKey="remainingPrincipal"
            tickFormatter={(value: string) => formatMoneyValue(Number(value))}
          />

          <Brush
            dataKey="date"
            height={24}
            stroke="#8884d8"
            startIndex={0}
            endIndex={60}
            tickFormatter={(value: Date) =>
              format.dateTime(value, { month: "short", year: "numeric" })
            }
          />

          <Bar
            yAxisId="left"
            dataKey="principalPayment"
            stackId="a"
            fill={PAYMENT_PART_COLOR.Principal}
          />
          <Bar
            yAxisId="left"
            dataKey="interestPayment"
            stackId="a"
            fill={PAYMENT_PART_COLOR.Interest}
          />
          <Bar
            yAxisId="left"
            dataKey="additionalPayment"
            stackId="a"
            fill={PAYMENT_PART_COLOR.Additional}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="remainingPrincipal"
            stroke="black"
          />

          <ChartTooltip
            content={
              <ChartTooltipContent
                labelKey="date"
                labelFormatter={(_label, payload) => {
                  const item = payload?.[0]?.payload as MortgageScheduleItem;
                  return `#${item.paymentNumber} ${format.dateTime(item.date, {
                    month: "short",
                    year: "numeric",
                  })} `;
                }}
                valueFormatter={(value) => {
                  return (
                    <span className="ml-2">
                      {`${formatMoneyValue(value as number)}`}
                    </span>
                  );
                }}
                hideIndicator
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  const t = useTranslations("mortgage-calculator");
  const format = useFormatter();

  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border bg-background p-4">
        <p className="text-muted-foreground">
          {t("columns.date")}:{" "}
          {format.dateTime(label, { month: "short", year: "numeric" })}
        </p>
        {payload.map((item) =>
          item.value ? (
            <p key={item.name}>{`${item.name} : ${formatMoneyValue(
              Number(item.value),
            )}`}</p>
          ) : null,
        )}
      </div>
    );
  }

  return null;
};
