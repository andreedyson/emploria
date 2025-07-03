import { SystemRole } from "@prisma/client";

export type SuperAdminCompanyUserProps = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  image: string | null;
  createdAt: Date;
  role: SystemRole;
  company: {
    id?: string;
    name?: string;
  };
};
