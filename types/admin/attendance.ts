import { AttendanceStatus } from "@prisma/client";

export type AttendanceColumnsProps = {
  employee: {
    id: string;
    name: string;
    image: string | null;
  };
  company: {
    id?: string;
    name?: string;
  };
  department: {
    id?: string;
    name?: string;
  };
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  status: AttendanceStatus;
  duration?: number;
};
