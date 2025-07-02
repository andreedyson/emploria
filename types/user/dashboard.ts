import { LucideIcon } from "lucide-react";

type BaseProps = {
  title: string;
  icon: LucideIcon;
  bgColor: string;
};

export type UserStatsCardDataProps =
  | (BaseProps & { text: string; data?: never })
  | (BaseProps & {
      data: { month: string; year: string; total: number } | null;
      text?: never;
    });
