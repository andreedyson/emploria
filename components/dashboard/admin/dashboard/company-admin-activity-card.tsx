import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity } from "@prisma/client";
import Image from "next/image";
import React from "react";
import ActivityList from "./activity-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type CompanyAdminActivityCardProps = {
  activities: Activity[];
};

function CompanyAdminActivityCard({
  activities,
}: CompanyAdminActivityCardProps) {
  return (
    <Card className="col-span-1 w-full">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold">Activities</CardTitle>
          <CardDescription>
            Latest activities by users of this company
          </CardDescription>
        </div>
        <Link href={"/dashboard/admin/activity"}>
          <Button variant={"outline"} size={"sm"}>
            View All
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        {activities.length > 0 ? (
          <div className="space-y-2">
            {activities.map((activity) => (
              <ActivityList key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="col-span-full flex h-full flex-col items-center justify-center gap-3 text-center">
            <Image
              src={"/assets/empty-activities-card.svg"}
              width={500}
              height={300}
              alt="Activities Not Found"
              className="aspect-video w-[180px] md:h-[200px] lg:w-[280px]"
              priority
            />
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold md:text-base">
                No Activities Found
              </h4>
              <p className="text-muted-foreground max-w-sm text-xs md:text-sm">
                Showing the latest activity of your company members.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CompanyAdminActivityCard;
