import { SystemRole } from "@prisma/client";
import { LucideIcon } from "lucide-react";

export type StatsCardProps = {
  name: string;
  total: number;
  icon: LucideIcon;
  textColor: string;
};

export type UserPerCompaniesProps = {
  id: string;
  name: string;
  image: string | null;
  totalUsers: number;
};

export type RecentlyAddedUsersProps = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  image: string | null;
  role: SystemRole;
  createdAt: Date;
  company: {
    id?: string;
    name?: string;
  };
};
