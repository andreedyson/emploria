import { authOptions } from "@/app/api/auth/[...nextauth]/options";
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
  return <div>SuperAdminCompanySettingsPage</div>;
}

export default SuperAdminCompanySettingsPage;
