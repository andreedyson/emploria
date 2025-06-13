import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { CompanySettingInput } from "@/components/dashboard/admin/settings/company-settings-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCompanyById } from "@/lib/data/super-admin/company";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

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
      </CardContent>
    </Card>
  );
}

export default SuperAdminCompanySettingsPage;
