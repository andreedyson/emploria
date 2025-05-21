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
import { LoaderCircle, MapPin } from "lucide-react";
import { useMemo } from "react";

export function UserPerCompaniesCharts() {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ["user-per-companies"],
    queryFn: async () => getTotalUserPerCompanies(),
  });

  const chartConfig = {
    totalUsers: {
      label: "Total Users",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const totalUsers = useMemo(() => {
    return chartData?.reduce((acc, curr) => acc + curr.totalUsers, 0) || 0;
  }, [chartData]);

  if (isLoading)
    return (
      <div className="flex h-[200px] w-full flex-col items-center justify-center md:h-[350px]">
        <LoaderCircle className="text-main-violet-700 size-10 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-3.5">
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
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
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
      <div className="flex w-full flex-col items-center justify-center gap-y-1.5 text-center text-sm">
        <p className="flex items-center gap-1 leading-none font-medium">
          <MapPin className="h-4 w-4" />
          {chartData?.length ?? 0} Companies with a total of {totalUsers ?? 0}{" "}
          Users
        </p>
        <div className="text-muted-foreground leading-none">
          Showing a total number of users that are in each company
        </div>
      </div>
    </div>
  );
}
