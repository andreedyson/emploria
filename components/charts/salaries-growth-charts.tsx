"use client";

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getEmployeeSalariesGrowth } from "@/lib/data/user/dashboard";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";

export const description = "A line chart with a label";

type SalariesGrowthChartsProps = {
  userId: string;
};

export function SalariesGrowthCharts({ userId }: SalariesGrowthChartsProps) {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ["employee-salaries"],
    queryFn: async () => getEmployeeSalariesGrowth(userId),
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

  return chartData && chartData.length > 0 ? (
    <ChartContainer
      config={chartConfig}
      className="h-[80%] min-h-[200px] w-full md:h-full"
    >
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 20,
          left: 20,
          right: 20,
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
  ) : (
    <div className="col-span-full flex h-full flex-col items-center justify-center gap-3 text-center">
      <Image
        src={"/assets/empty-salaries-paid-per-month.svg"}
        width={500}
        height={300}
        alt="Salaries Not Found"
        className="aspect-video w-[180px] lg:w-[280px]"
        priority
      />
      <div className="space-y-0.5">
        <h4 className="text-sm font-semibold md:text-base">
          No Salaries Found
        </h4>
        <p className="text-muted-foreground max-w-sm text-xs md:text-sm">
          Showing a chart of total salaries earned per month from the past 6
          month.
        </p>
      </div>
    </div>
  );
}
