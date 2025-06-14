import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { CompanySettingInput } from "@/components/dashboard/admin/settings/company-settings-input";
import LeavePolicyInput from "@/components/dashboard/admin/settings/leave-policy-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCompanyLeavePolicies } from "@/lib/data/admin/leave";
import { getCompanyById } from "@/lib/data/super-admin/company";
import { LeaveFrequency, LeaveType } from "@prisma/client";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Company Admin Settings page view for Emploria Super Admin Company Dashboard",
};

async function SuperAdminCompanySettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const companyId = session.user.companyId as string;

  const company = await getCompanyById(companyId);
  const companyLeavePolicies = await getCompanyLeavePolicies(companyId);
  const leavePolicyMap = new Map(
    companyLeavePolicies.map((policy) => [policy.leaveType, policy]),
  );

  // Only these leave types should be shown
  const displayedLeaveTypes: LeaveType[] = [
    LeaveType.ANNUAL,
    LeaveType.SICK,
    LeaveType.MATERNITY,
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Settings</CardTitle>
        <CardDescription>
          Manage the company&apos;s information, settings, and integrations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="mb-3" />
        <div className="space-y-3">
          <p className="text-sm font-semibold">Employee Attendance Settings</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CompanySettingInput
              companyId={companyId}
              initialValue={company?.attendanceBonusRate ?? 0}
              type="attendanceBonus"
            />
            <CompanySettingInput
              companyId={companyId}
              initialValue={company?.lateAttendancePenaltyRate ?? 0}
              type="lateAttendance"
            />
          </div>
        </div>
        <Separator className="my-3" />
        <div className="space-y-3">
          <p className="text-sm font-semibold">Leave Policy Settings</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {displayedLeaveTypes.map((leaveType) => {
              const policy = leavePolicyMap.get(leaveType);

              return (
                <LeavePolicyInput
                  key={leaveType}
                  companyId={companyId}
                  type={leaveType}
                  policyId={policy?.id as string}
                  frequency={policy?.frequency ?? LeaveFrequency.YEARLY}
                  allowedDays={policy?.allowedDays ?? 0}
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SuperAdminCompanySettingsPage;
