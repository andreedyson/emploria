import { ALLOWED_FILE_TYPE } from "@/constants";
import {
  AttendanceStatus,
  EmployeeRole,
  LeaveFrequency,
  LeaveStatus,
  LeaveType,
} from "@prisma/client";
import { z } from "zod";

export const employeeSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name should be less than 50 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid Email" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be minimum of 6 characters" })
    .max(32, { message: "Password must be less than 32 characters" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]),
  dateOfBirth: z.string().optional(),
  isActive: z.boolean(),
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
  companyId: z.string({ required_error: "Company ID is required" }).min(1),
  departmentId: z.string().optional(),
  employeeRole: z.nativeEnum(EmployeeRole, {
    required_error: "Employee role is required",
    invalid_type_error: "Invalid employee role. Must be MANAGER or USER",
  }),
  baseSalary: z.coerce
    .number({
      required_error: "Base Salary is required",
    })
    .nonnegative("Base Salary must be non-negative"),
});

export const editEmployeeSchema = employeeSchema.omit({ password: true });

export const departmentSchema = z.object({
  name: z
    .string({ required_error: "Department Name is required" })
    .min(1, { message: "Department should be at least 1 character" })
    .max(50, { message: "Department should be less than 50 characters" }),
  color: z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Invalid color"),
});

export const attendanceSchema = z.object({
  employeeId: z.string({ required_error: "Employee is required" }),
  date: z.coerce.date({ required_error: "Date is required" }),
  status: z.nativeEnum(AttendanceStatus, {
    required_error: "Attendance Status is required",
    invalid_type_error:
      "Invalid employee role. Must be ABSENT, PRESENT, LATE, or ON LEAVE",
  }),
  checkIn: z.string().nullable().optional(),
  checkOut: z.string().nullable().optional(),
});

export const leaveSchema = z.object({
  employeeId: z.string({ required_error: "Employee is required" }),
  startDate: z.coerce.date({ required_error: "Start Date is required" }),
  endDate: z.coerce.date({ required_error: "End Date is required" }),
  reason: z
    .string()
    .min(1, { message: "Reason should be at least 1 character" })
    .max(250, { message: "Reason should be less than 250 characters" }),
  status: z.nativeEnum(LeaveStatus, {
    required_error: "Leave Status is required",
    invalid_type_error:
      "Invalid leave status. Must be PENDING, REJECTED, CANCELLED, or APPROVED",
  }),
  leaveType: z.nativeEnum(LeaveType, {
    required_error: "Leave Type is required",
    invalid_type_error:
      "Invalid leave type. Must be ANNUAL, SICK, MATERNITY, or UNPAID",
  }),
});

export const editLeaveSchema = leaveSchema.pick({ status: true });

export const salarySchema = z.object({
  employeeId: z.string({
    required_error: "Employee is required",
  }),
  month: z
    .string({
      required_error: "Month is required",
    })
    .min(1, "Month is required"),
  year: z
    .string({
      required_error: "Year is required",
    })
    .regex(/^\d{4}$/, "Year must be in YYYY format"),
  bonus: z.coerce
    .number({
      required_error: "Bonus is required",
    })
    .nonnegative("Bonus must be non-negative"),
  deduction: z.coerce
    .number()
    .nonnegative("Deduction must be non-negative")
    .optional(),
});

export const leavePolicySchema = z.object({
  companyId: z.string({
    required_error: "Company is required",
  }),
  leaveType: z.nativeEnum(LeaveType, {
    required_error: "Leave Type is required",
    invalid_type_error:
      "Invalid leave type. Must be ANNUAL, SICK, MATERNITY, or UNPAID",
  }),
  frequency: z.nativeEnum(LeaveFrequency, {
    required_error: "Leave Frequency is required",
    invalid_type_error: "Invalid leave frequency. Must be MONTHLY or YEARLY",
  }),
  allowedDays: z
    .number({ required_error: "Total allowed days is required" })
    .min(1, { message: "Allowed Days must be at least 1 day" }),
});
