import { EmployeeRole, Gender } from "@prisma/client";

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
  companyName: string;
  isActive: boolean;
  departmentName: string;
  employee: {
    id?: string;
    position: string;
    role: EmployeeRole;
  };
};
