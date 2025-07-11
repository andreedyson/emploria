import { ALLOWED_FILE_TYPE } from "@/constants";
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

export const changeProfileImageSchema = z.object({
  image: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file) return true; // Allow empty
        return ALLOWED_FILE_TYPE.includes(file.type);
      },
      {
        message: "File type is not allowed",
      },
    )
    .refine(
      (file) => {
        if (!file) return true;
        return file.size <= 1024 * 1024 * 2; // Max file size is 2MB
      },
      {
        message: "File size must be less than 2MB",
      },
    ),
});

export const updateUserProfileSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  address: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  dateOfBirth: z.string().optional(),
});
