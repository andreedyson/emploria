import { LeaveType } from "@prisma/client";
import { LucideIcon } from "lucide-react";

export type LeaveStatsCardProps = {
  type: LeaveType;
  title?: string;
  total: number;
  icon: LucideIcon;
  textColor: string;
};
