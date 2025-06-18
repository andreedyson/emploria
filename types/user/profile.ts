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
  isActive: boolean;
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
    position: string;
    role: EmployeeRole;
  };
};
