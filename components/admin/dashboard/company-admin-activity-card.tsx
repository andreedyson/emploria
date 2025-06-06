import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

function CompanyAdminActivityCard() {
  return (
    <Card className="col-span-1 w-full">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Activities</CardTitle>
        <CardDescription>
          Latest activities by users of this company
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4"></CardContent>
    </Card>
  );
}

export default CompanyAdminActivityCard;
