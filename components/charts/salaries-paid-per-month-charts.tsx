"use client";

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getSalariesPaidPerMonth } from "@/lib/data/admin/dashboard";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";

export const description = "A line chart with a label";

type SalariesPaidPerMonthChartsProps = {
  companyId: string;
};

export function SalariesPaidPerMonthCharts({
  companyId,
}: SalariesPaidPerMonthChartsProps) {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ["salaries-per-month"],
    queryFn: async () => getSalariesPaidPerMonth(companyId),
  });

  const chartConfig = {
    totalPaidInMillions: {
      label: "Total",
      color: "#1273ef",
    },
  } satisfies ChartConfig;

  if (isLoading)
    return (
      <div className="flex h-[200px] w-full flex-col items-center justify-center md:h-[350px]">
        <LoaderCircle className="text-main-violet-700 size-10 animate-spin" />
      </div>
    );

  return (
    <ChartContainer
      config={chartConfig}
      className="h-[80%] min-h-[200px] w-full md:h-[85%]"
    >
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 20,
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" currency />}
        />
        <Line
          dataKey="totalPaidInMillions"
          type="natural"
          stroke="var(--color-totalPaidInMillions)"
          strokeWidth={2}
          dot={{
            fill: "var(--color-totalPaidInMillions)",
          }}
          activeDot={{
            r: 6,
          }}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Line>
      </LineChart>
    </ChartContainer>
  );
}
