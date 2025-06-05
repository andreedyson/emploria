import { Gender } from "@prisma/client";

export type EmployeePerDepartmentProps = {
  name: string;
  count: number;
  color: string | null;
};

export type TopEmployeeListProps = {
  id: string;
  name: string;
  image: string | null;
  department: string | null;
  attendance: number;
};

export type GenderDiversityProps = {
  gender: Gender;
  total: number;
  fill?: string;
};
