import { Salary } from "@prisma/client";

export type EmployeeSalaryHistoryProps = Salary & {
  employee: {
    user: {
      name: string;
    };
  };
};
