import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { UserAttendanceColumns } from "./user-attendance-columns";
import { Attendance } from "@prisma/client";

type AttendanceHistoryCardProps = {
  attendance: Attendance[];
};

function AttendanceHistoryCard({ attendance }: AttendanceHistoryCardProps) {
  return (
    <Card className="col-span-1 w-full">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Attendance History
        </CardTitle>
        <CardDescription>Your attendance history data</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <DataTable
          columns={UserAttendanceColumns}
          data={attendance}
          searchEnabled={false}
        />
      </CardContent>
    </Card>
  );
}

export default AttendanceHistoryCard;
