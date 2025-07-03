import { UserPerCompaniesCharts } from "@/components/charts/user-per-companies-charts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users2 } from "lucide-react";
import Link from "next/link";
import React from "react";

function UserPerCompanycard() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users2 className="size-8" />
            <div>
              <CardTitle>User Per Company</CardTitle>
              <CardDescription>Total users from each company</CardDescription>
            </div>
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
  );
}

export default UserPerCompanycard;
