import { Gender, LeaveStatus, LeaveType } from "@prisma/client";

export type LeaveColumnProps = {
  employee: {
    id: string;
    name: string;
    image: string | null;
    gender: Gender | null;
  };
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  status: LeaveStatus;
};
