import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { UserPerCompaniesCharts } from "@/components/charts/user-per-companies-charts";
import StatsCard from "@/components/super-admin/stats-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStatsCardData } from "@/lib/data/super-admin/dashboard";
import { ChartNoAxesCombined, Users2 } from "lucide-react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home",
};

async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  const statsCardData = await getStatsCardData();

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h2 className="text-lg font-semibold md:text-xl">
          Welcome Back, {session.user.name} 👋
        </h2>
        <p className="text-muted-foreground text-sm">
          Here&apos;s an overview of the Emploria applications.
        </p>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {statsCardData.map((data, i) => (
          <StatsCard
            key={i}
            name={data.name}
            total={data.total}
            icon={data.icon}
            textColor={data.textColor}
          />
        ))}
      </div>

      <div className="grid h-full w-full grid-cols-1 gap-4 lg:grid-cols-2">
        {/* User Per Company Card */}
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-1.5">
                  <Users2 />
                  User Per Company
                </CardTitle>
                <CardDescription>Total users from each company</CardDescription>
              </div>
              <Link href={"/dashboard/super-admin/company"}>
                <Button variant={"outline"} size={"sm"}>
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <UserPerCompaniesCharts />
          </CardContent>
        </Card>

        {/* Recently Added Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <ChartNoAxesCombined />
              Growth
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
