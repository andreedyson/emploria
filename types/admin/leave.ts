import { Gender, LeaveStatus, LeaveType } from "@prisma/client";

export type LeaveColumnProps = {
  id: string;
  employee: {
    id: string;
    name: string;
    image: string | null;
    gender: Gender | null;
  };
  company: {
    id: string;
    name: string;
  };
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  status: LeaveStatus;
  reason: string;
  createdAt: Date;
};
