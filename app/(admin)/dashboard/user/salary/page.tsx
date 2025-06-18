import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import SalaryHistoryCard from "@/components/dashboard/user/salary/salary-history-card";

import { getUserProfileData } from "@/lib/data/user/profile";
import {
  getDepartmentSalaries,
  getEmployeeSalaryHistory,
} from "@/lib/data/user/salary";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Salary",
  description: "Salary page view for Emploria Employee Dashboard",
};

async function UserSalaryPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const userId = session.user.id;

  const userData = await getUserProfileData(userId);
  const salaries = await getEmployeeSalaryHistory(userId);
  const departmentSalaries = await getDepartmentSalaries(
    session.user.companyId ?? "",
    userData?.department.id ?? "",
  );

  return (
    <section className="space-y-4">
      <SalaryHistoryCard
        employeeRole={userData?.employee.role}
        salaries={salaries}
        departmentSalaries={departmentSalaries.filter(
          (attendance) => attendance.employee.id !== userData?.employee.id,
        )}
      />
    </section>
  );
}

export default UserSalaryPage;
