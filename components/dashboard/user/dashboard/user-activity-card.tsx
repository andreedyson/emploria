import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Banknote, CalendarDays, CalendarX } from "lucide-react";
import React from "react";

function UserActivityCard() {
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
            Attendance Tabs
          </TabsContent>
          <TabsContent
            value="salary"
            className="mt-2 grid h-full grid-cols-1 gap-4"
          >
            Salary Tabs
          </TabsContent>
          <TabsContent
            value="leave"
            className="mt-2 grid h-full grid-cols-1 gap-4"
          >
            Leave Tabs
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default UserActivityCard;
