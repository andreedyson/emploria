import { SalaryStatus } from "@prisma/client";

export type SalaryColumnsProps = {
  id: string;
  companyId: string;
  employee: {
    id: string;
    name: string;
    image: string | null;
  };
  month: string;
  year: string;
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
