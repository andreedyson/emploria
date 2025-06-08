import { SalariesPaidPerMonthCharts } from "@/components/charts/salaries-paid-per-month-charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SalariesPaidPerMonthCardProps = {
  companyId: string;
};

function SalariesPaidPerMonthCard({
  companyId,
}: SalariesPaidPerMonthCardProps) {
  return (
    <Card className="col-span-1 w-full">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Salaries Paid</CardTitle>
        <CardDescription>
          Total salaries paid per month for the past 6 months (in Millions IDR)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <SalariesPaidPerMonthCharts companyId={companyId} />
      </CardContent>
    </Card>
  );
}

export default SalariesPaidPerMonthCard;
