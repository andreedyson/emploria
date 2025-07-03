"use client";

import { LoaderCircle } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getGenderDiversityTotal } from "@/lib/data/admin/dashboard";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useMemo } from "react";

type GenderDiversityChartsProps = {
  companyId: string;
};

export function GenderDiversityCharts({
  companyId,
}: GenderDiversityChartsProps) {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ["gender"],
    queryFn: async () => getGenderDiversityTotal(companyId),
  });

  const chartConfig = {
    MALE: {
      label: "Male",
    },
    FEMALE: {
      label: "Female",
    },
  } satisfies ChartConfig;

  const totalEmployees = useMemo(() => {
    return chartData?.reduce((acc, curr) => acc + curr.total, 0);
  }, [chartData]);

  if (isLoading)
    return (
      <div className="flex h-[200px] w-full flex-col items-center justify-center md:h-[350px]">
        <LoaderCircle className="text-main-violet-700 size-10 animate-spin" />
      </div>
    );

  return chartData && chartData.length > 0 ? (
    <ChartContainer
      config={chartConfig}
      className="h-[80%] min-h-[200px] w-full md:h-[85%]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="total"
          nameKey="gender"
          innerRadius={44}
          strokeWidth={5}
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
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalEmployees ? totalEmployees.toLocaleString() : 0}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Employees
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  ) : (
    <div className="col-span-full flex h-full flex-col items-center justify-center gap-3 text-center">
      <Image
        src={"/assets/empty-gallery.svg"}
        width={500}
        height={300}
        alt="Employees Not Found"
        className="aspect-video w-[180px] lg:w-[280px]"
        priority
      />
      <div className="space-y-0.5">
        <h4 className="text-sm font-semibold">No Gender Diversity Charts</h4>
        <p className="text-muted-foreground max-w-sm text-xs leading-4 md:text-sm">
          Showing the allocation of Male and Female employees.
        </p>
      </div>
    </div>
  );
}
