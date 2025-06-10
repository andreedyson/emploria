import { AttendanceStatus } from "@prisma/client";
import { LucideIcon } from "lucide-react";

export type AttendanceStatsCardProps = {
  status: AttendanceStatus;
  total: number;
  icon: LucideIcon;
  textColor: string;
};
