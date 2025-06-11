import { LeaveType } from "@prisma/client";
import { z } from "zod";

export const applyLeaveSchema = z.object({
  userId: z.string({ required_error: "User ID is required" }),
  startDate: z.coerce.date({ required_error: "Start Date is required" }),
  endDate: z.coerce.date({ required_error: "End Date is required" }),
  reason: z
    .string()
    .min(1, { message: "Reason should be at least 1 character" })
    .max(250, { message: "Reason should be less than 250 characters" }),
  leaveType: z.nativeEnum(LeaveType, {
    required_error: "Leave Type is required",
    invalid_type_error:
      "Invalid leave type. Must be ANNUAL, SICK, MATERNITY, or UNPAID",
  }),
});
