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
  companyName: string;
  departmentName: string;
  employeePosition: string;
  employeeRole: EmployeeRole;
};
