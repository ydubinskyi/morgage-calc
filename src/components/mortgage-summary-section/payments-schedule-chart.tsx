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

  return (
    <div className="flex flex-col space-y-6">
      <p className="text-l font-semibold leading-none tracking-tight">
        {t("paymentsStructureChartTitle")}
      </p>

      <ResponsiveContainer width="100%" height={500}>
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
          <Tooltip content={(props) => <CustomTooltip {...props} />} />
          <Legend />
          <Brush dataKey="date" height={20} stroke="#8884d8" />

          <Bar
            yAxisId="left"
            dataKey="principalPayment"
            name={t("columns.principal")}
            stackId="a"
            fill={PAYMENT_PART_COLOR.Principal}
          />
          <Bar
            yAxisId="left"
            dataKey="interestPayment"
            name={t("columns.interest")}
            stackId="a"
            fill={PAYMENT_PART_COLOR.Interest}
          />
          <Bar
            yAxisId="left"
            dataKey="additionalPayment"
            name={t("columns.additionalPayment")}
            stackId="a"
            fill={PAYMENT_PART_COLOR.Additional}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="remainingPrincipal"
            name={t("columns.remainingPrincipal")}
            stroke="black"
          />
        </ComposedChart>
      </ResponsiveContainer>
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
      <div className="rounded-md bg-background border p-4">
        <p className="text-muted-foreground">
          {t("columns.date")}:{" "}
          {format.dateTime(label, { month: "short", year: "numeric" })}
        </p>
        {payload.map((item) =>
          item.value ? (
            <p key={item.name}>{`${item.name} : ${formatMoneyValue(
              Number(item.value)
            )}`}</p>
          ) : null
        )}
      </div>
    );
  }

  return null;
};
