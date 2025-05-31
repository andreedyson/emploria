import { EmployeeRole } from "@prisma/client";

export type EmployeeColumnProps = {
  id: string;
  name: string;
  email: string;
  gender: string | null;
  position: string;
  isActive: boolean;
  image: string | null;
  phone: string | null;
  address: string | null;
  dateOfBirth: Date | null;
  userId: string;
  company?: {
    id: string;
    name: string;
  };
  department?: {
    id?: string;
    name?: string;
  };
  employeeRole: EmployeeRole;
  joinDate: Date;
  baseSalary?: number;
};
