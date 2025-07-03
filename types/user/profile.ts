import { EmployeeRole, Gender, SystemRole } from "@prisma/client";

export type UserProfileProps = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  gender: Gender | null;
  address: string | null;
  dateOfBirth: Date;
  joinedDate: Date;
  phone: string;
  isActive: boolean;
  systemRole: SystemRole;
  company: {
    id: string;
    name: string;
  };
  department: {
    id: string;
    name: string;
  };
  employee: {
    id?: string;
    role: EmployeeRole;
  };
};
