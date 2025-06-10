import { SalariesGrowthCharts } from "@/components/charts/salaries-growth-charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SalariesGrowthCardProps = {
  userId: string;
};

function SalariesGrowthCard({ userId }: SalariesGrowthCardProps) {
  return (
    <Card className="col-span-1 w-full">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Salaries Growth</CardTitle>
        <CardDescription>
          Your salaries for the past 6 months (in Millions IDR)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <SalariesGrowthCharts userId={userId} />
      </CardContent>
    </Card>
  );
}

export default SalariesGrowthCard;
