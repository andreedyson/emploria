import EditEmployeeForm from "@/components/forms/edit-employee-form";
import { getEmployeeById } from "@/lib/data/admin/employee";
import React from "react";

async function AdminCompanyEmployeeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employee = await getEmployeeById(id);

  if (!employee) return <div>No Employee Found</div>;
  return (
    <div>
      <EditEmployeeForm employeeData={employee} />
    </div>
  );
}

export default AdminCompanyEmployeeEditPage;
