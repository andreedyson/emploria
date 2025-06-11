import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Leave } from "@prisma/client";
import { UserLeaveColumns } from "./user-leave-columns";

type LeaveHistoryCardProps = {
  leave: Leave[];
};

function LeaveHistoryCard({ leave }: LeaveHistoryCardProps) {
  return (
    <Card className="col-span-1 w-full">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Leave History</CardTitle>
        <CardDescription>
          A detailed log of all your past leave requests, including dates,
          types, and approval status.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <DataTable
          columns={UserLeaveColumns}
          data={leave}
          searchEnabled={false}
        />
      </CardContent>
    </Card>
  );
}

export default LeaveHistoryCard;
