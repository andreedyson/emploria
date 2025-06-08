import { GenderDiversityCharts } from "@/components/charts/gender-diversity-charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

type GenderDiversityCardProps = {
  companyId: string;
};

function GenderDiversityCard({ companyId }: GenderDiversityCardProps) {
  return (
    <Card className="col-span-1 w-full">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Gender Diversity
        </CardTitle>
        <CardDescription>Total employees by gender</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <GenderDiversityCharts companyId={companyId} />
      </CardContent>
    </Card>
  );
}

export default GenderDiversityCard;
