import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import CompanyAdminActivityClientPage from "@/components/dashboard/admin/activity/company-admin-activity-page";
import { getActivitiesByCompany } from "@/lib/data/admin/activity";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Activity",
  description: "Activity page view for Emploria Super Admin Company Dashboard",
};

async function CompanyAdminActivityPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const companyId = session.user.companyId ?? "";

  const activities = await getActivitiesByCompany(companyId);

  return <CompanyAdminActivityClientPage activities={activities} />;
}

export default CompanyAdminActivityPage;
