import { SalaryStatus } from "@prisma/client";

export type SalaryColumnsProps = {
  id: string;
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
  date: Date;
  status: SalaryStatus;
  paidAt: Date | null;
};
