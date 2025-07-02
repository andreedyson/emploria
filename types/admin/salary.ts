import { SalaryStatus } from "@prisma/client";

export type SalaryColumnsProps = {
  id: string;
  company: {
    id: string;
    name: string;
    image: string | null;
  };
  employee: {
    id: string;
    name: string;
    image: string | null;
  };
  month: string | number;
  year: string | number;
  baseSalary: number;
  bonus: number;
  deduction: number;
  attendanceBonus: number;
  total: number;
  totalPresentAttendance: number;
  totalLateAttendance: number;
  attendanceBonusRate: number | null;
  lateAttendancePenaltyRate: number | null;
  date: Date;
  status: SalaryStatus;
  paidAt: Date | null;
};
