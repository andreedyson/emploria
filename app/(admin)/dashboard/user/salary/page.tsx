import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { UserSalaryColumns } from "@/components/dashboard/user/salary/user-salary-columns";
import { DataTable } from "@/components/ui/data-table";
import { getEmployeeSalaryHistory } from "@/lib/data/user/salary";
import { Banknote } from "lucide-react";
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

  const salaries = await getEmployeeSalaryHistory(userId);
  return (
    <section className="space-y-4">
      <div className="bg-background space-y-3 rounded-lg border-2 p-4">
        {/* Salary Page Header */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full space-y-2">
            <h2 className="flex items-center gap-2 text-2xl leading-none font-bold md:text-3xl">
              <Banknote className="size-6 md:size-8" />
              Your Salaries
            </h2>
            <p className="text-muted-foreground max-w-md text-sm leading-5 md:text-base">
              View a summary of your monthly salary records, including payment
              status and amounts.
            </p>
          </div>
        </div>
        {/* Data Table */}
        <div>
          <DataTable
            columns={UserSalaryColumns}
            data={salaries}
            searchEnabled={false}
          />
        </div>
      </div>
    </section>
  );
}

export default UserSalaryPage;
