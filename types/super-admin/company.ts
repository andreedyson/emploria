import { Department } from "@prisma/client";

export type AllCompaniesProps = {
  id: string;
  name: string;
  image: string | null;
  isActive: boolean;
  totalUsers: number;
  createdAt: Date;
  updatedAt: Date;
  department: Department[];
};
