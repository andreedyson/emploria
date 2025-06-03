import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function SuperAdminCompanyPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }
  return (
    <section className="space-y-4">
      {/* Company Admin Dashboard Header */}
      <div>
        <h1 className="text-lg font-bold md:text-xl lg:text-2xl">
          Welcome back, {session.user.name} 👋
        </h1>
        <p className="text-muted-foreground">
          Your central hub for system administration and company analytics.
        </p>
      </div>

      {/* Statistics Card */}

      {/* Department Overview */}
      {/* Top Employees List */}
      {/* Gender Diversity Chart */}
      {/* Salaries Paid per Month Chart */}
      {/* Employee Activity */}
    </section>
  );
}

export default SuperAdminCompanyPage;
