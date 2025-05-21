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
  totalUsers: number;
};
