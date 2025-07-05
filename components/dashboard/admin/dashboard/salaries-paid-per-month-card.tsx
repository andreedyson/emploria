import { SalariesPaidPerMonthCharts } from "@/components/charts/salaries-paid-per-month-charts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type SalariesPaidPerMonthCardProps = {
  companyId: string;
};

function SalariesPaidPerMonthCard({
  companyId,
}: SalariesPaidPerMonthCardProps) {
  return (
    <Card className="col-span-1 w-full">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold">Salaries Paid</CardTitle>
          <CardDescription>
            Monthly salaries paid for the past 6 months (in millions IDR).
          </CardDescription>
        </div>
        <Link href={"/dashboard/admin/salary"}>
          <Button variant={"outline"} size={"sm"}>
            View All
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        <SalariesPaidPerMonthCharts companyId={companyId} />
      </CardContent>
    </Card>
  );
}

export default SalariesPaidPerMonthCard;
