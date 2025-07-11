import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import AddAttendanceDialog from "@/components/dashboard/admin/attendance/add-attendance-dialog";
import AttendanceTable from "@/components/dashboard/admin/attendance/attendance-table";
import EvaluateAttendanceDayDialog from "@/components/dashboard/admin/attendance/evaluate-day-dialog";
import { getAllAttendances } from "@/lib/data/admin/attendance";
import { CalendarDays } from "lucide-react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Attendance",
  description:
    "Employee attendance page view for Emploria Super Admin Company Dashboard",
};

async function SuperAdminCompanyAttendancePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const companyId = session.user.companyId;
  const attendances = await getAllAttendances(companyId as string);
  return (
    <section className="space-y-4">
      <div className="bg-card space-y-3 rounded-lg border-2 p-4">
        {/* Attendance Page Header */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full space-y-2">
            <h2 className="flex items-center gap-2 text-2xl leading-none font-bold md:text-3xl">
              <CalendarDays className="size-6 md:size-8" />
              Attendances
            </h2>
            <p className="text-muted-foreground max-w-sm text-sm leading-5 md:text-base">
              View and manage attendance records for your employees by date,
              department, and status.
            </p>
          </div>
          <div className="flex w-full justify-end gap-2">
            <EvaluateAttendanceDayDialog companyId={companyId as string} />
            <AddAttendanceDialog companyId={companyId as string} />
          </div>
        </div>
        {/* Data Table */}
        <AttendanceTable attendances={attendances} />
      </div>
    </section>
  );
}

export default SuperAdminCompanyAttendancePage;
