"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getTotalUserPerCompanies } from "@/lib/data/super-admin/dashboard";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";

export function UserPerCompaniesCharts() {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ["user-per-companies"],
    queryFn: async () => getTotalUserPerCompanies(),
  });

  const chartConfig = {
    totalUsers: {
      label: "Total Users",
      color: "#459ef1",
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
      <BarChart
        accessibilityLayer
        data={chartData?.slice(0, 6)}
        margin={{
          top: 10,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar dataKey="totalUsers" fill="var(--color-totalUsers)" radius={4}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
