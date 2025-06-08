import { LucideIcon } from "lucide-react";

type BaseProps = {
  title: string;
  icon: LucideIcon;
  textColor: string;
};

export type UserStatsCardDataProps =
  | (BaseProps & { text: string; data?: never })
  | (BaseProps & {
      data: { month: string; year: string; total: number } | null;
      text?: never;
    });
