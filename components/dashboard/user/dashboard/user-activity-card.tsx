import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity } from "@prisma/client";
import { Banknote, CalendarDays, CalendarX } from "lucide-react";
import ActivityList from "../../admin/dashboard/activity-list";
import Image from "next/image";

type UserActivityCardProps = {
  activities: Activity[];
};

function UserActivityCard({ activities }: UserActivityCardProps) {
  const attendanceActivities = activities
    .filter((act) => act.targetType === "ATTENDANCE")
    .slice(0, 5);
  const salaryActivities = activities
    .filter((act) => act.targetType === "SALARY")
    .slice(0, 5);
  const leaveActivities = activities
    .filter((act) => act.targetType === "LEAVE")
    .slice(0, 5);
  return (
    <Card className="col-span-1 w-full">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Activities</CardTitle>
        <CardDescription>Your latest activity</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="attendance" className="h-full w-full">
          <div className="w-full">
            <TabsList className="w-[160px]">
              <TabsTrigger value="attendance" className="w-full">
                <CalendarDays size={16} />
              </TabsTrigger>
              <TabsTrigger value="salary" className="w-full">
                <Banknote size={16} />
              </TabsTrigger>
              <TabsTrigger value="leave" className="w-full">
                <CalendarX size={16} />
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent
            value="attendance"
            className="mt-2 grid grid-cols-1 gap-4"
          >
            {attendanceActivities.length > 0 ? (
              attendanceActivities.map((act) => (
                <ActivityList key={act.id} activity={act} />
              ))
            ) : (
              <div className="col-span-full flex h-full flex-col items-center justify-center gap-3 text-center">
                <Image
                  src={"/assets/empty-activities-card.svg"}
                  width={500}
                  height={300}
                  alt="Activities Not Found"
                  className="aspect-video w-[180px] lg:w-[280px]"
                  priority
                />
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold md:text-base">
                    No Activities Found
                  </h4>
                  <p className="text-muted-foreground max-w-sm text-xs md:text-sm">
                    Showing a list of your latest attendance activities.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent
            value="salary"
            className="mt-2 grid h-full grid-cols-1 gap-4"
          >
            {salaryActivities.length > 0 ? (
              salaryActivities.map((act) => (
                <ActivityList key={act.id} activity={act} />
              ))
            ) : (
              <div className="col-span-full flex h-full flex-col items-center justify-center gap-3 text-center">
                <Image
                  src={"/assets/empty-activities-card.svg"}
                  width={500}
                  height={300}
                  alt="Activities Not Found"
                  className="aspect-video w-[180px] lg:w-[280px]"
                  priority
                />
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold md:text-base">
                    No Activities Found
                  </h4>
                  <p className="text-muted-foreground max-w-sm text-xs md:text-sm">
                    Showing a list of your latest salary activities.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent
            value="leave"
            className="mt-2 grid h-full grid-cols-1 gap-4"
          >
            {leaveActivities.length > 0 ? (
              leaveActivities.map((act) => (
                <ActivityList key={act.id} activity={act} />
              ))
            ) : (
              <div className="col-span-full flex h-full flex-col items-center justify-center gap-3 text-center">
                <Image
                  src={"/assets/empty-activities-card.svg"}
                  width={500}
                  height={300}
                  alt="Activities Not Found"
                  className="aspect-video w-[180px] lg:w-[280px]"
                  priority
                />
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold md:text-base">
                    No Activities Found
                  </h4>
                  <p className="text-muted-foreground max-w-sm text-xs md:text-sm">
                    Showing a list of your latest leave activities.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default UserActivityCard;
