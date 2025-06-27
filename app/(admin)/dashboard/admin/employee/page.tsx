import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import AddEmployeeDialog from "@/components/dashboard/admin/employee/add-employee-dialog";
import EmployeeGalleryCard from "@/components/dashboard/admin/employee/employee-gallery-card";
import EmployeeTable from "@/components/dashboard/admin/employee/employee-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllEmployees } from "@/lib/data/admin/employee";
import { Image as ImageIcon, Table, Users, UserX2 } from "lucide-react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Employee",
  description: "Employee page view for Emploria Super Admin Company Dashboard",
};

async function SuperAdminCompanyEmployeePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const companyId = session.user.companyId;
  const employees = await getAllEmployees(companyId as string);

  return (
    <section className="space-y-4">
      <div className="bg-background space-y-3 rounded-lg border-2 p-4">
        {/* Employees Page Header */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full space-y-2">
            <h2 className="flex items-center gap-2 text-2xl leading-none font-bold md:text-3xl">
              <Users className="size-6 md:size-8" />
              Employees
            </h2>
            <p className="text-muted-foreground text-sm leading-none md:text-base">
              Organize and manage all employees that are using this SAP
              Dashboard.
            </p>
          </div>
          <div className="flex w-full justify-end">
            <AddEmployeeDialog />
          </div>
        </div>
        {/* Employee Data Table & Gallery View */}
        <div>
          <Tabs defaultValue="table" className="h-full w-full">
            <div className="flex w-full max-md:justify-end">
              <TabsList className="w-[160px]">
                <TabsTrigger
                  value="table"
                  className="w-full"
                  title="Employees Table"
                >
                  <Table size={20} />
                </TabsTrigger>
                <TabsTrigger
                  value="gallery"
                  className="w-full"
                  title="Employees Gallery"
                >
                  <ImageIcon size={20} />
                </TabsTrigger>
                <TabsTrigger
                  value="inactive-employees"
                  className="w-full"
                  title="Inactive Employees"
                >
                  <UserX2 size={20} />
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="table" className="mt-2 grid grid-cols-1 gap-4">
              <div className="flex items-center gap-2">
                <Table size={24} className="text-picton-blue-500" />
                <div className="text-sm">
                  <h4 className="font-semibold">All Employees</h4>
                  <p className="text-muted-foreground">
                    Showing a list of iall active employees in the company.
                  </p>
                </div>
              </div>
              <EmployeeTable
                employees={employees.filter((emp) => emp.isActive === true)}
              />
            </TabsContent>
            <TabsContent
              value="gallery"
              className="mt-2 grid h-full grid-cols-1 gap-4"
            >
              <div className="flex items-center gap-2">
                <ImageIcon size={32} className="text-yellow-500" />
                <div className="text-sm">
                  <h4 className="font-semibold">Employees Gallery</h4>
                  <p className="text-muted-foreground">
                    Showing a list of employees in gallery view.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {employees.map((employee) => (
                  <EmployeeGalleryCard key={employee.id} employee={employee} />
                ))}
              </div>
            </TabsContent>
            <TabsContent
              value="inactive-employees"
              className="mt-2 grid grid-cols-1 gap-4"
            >
              <div className="flex items-center gap-2">
                <UserX2 size={32} className="text-red-500" />
                <div className="text-sm">
                  <h4 className="font-semibold">Inactive Employees</h4>
                  <p className="text-muted-foreground">
                    Showing a list of inactive employees on the company.
                  </p>
                </div>
              </div>
              <EmployeeTable
                employees={employees.filter((emp) => emp.isActive === false)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

export default SuperAdminCompanyEmployeePage;
