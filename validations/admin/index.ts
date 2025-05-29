import { ALLOWED_FILE_TYPE } from "@/constants";
import {
  AttendanceStatus,
  EmployeeRole,
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
  position: z
    .string({ required_error: "Position is required" })
    .min(1, { message: "Position is required" })
    .max(50, { message: "Position should be less than 50 characters" }),
  employeeRole: z.nativeEnum(EmployeeRole, {
    required_error: "Employee role is required",
    invalid_type_error: "Invalid employee role. Must be MANAGER or USER",
  }),
});

export const editEmployeeSchema = employeeSchema.omit({ password: true });

export const departmentSchema = z.object({
  name: z
    .string({ required_error: "Department Name is required" })
    .min(1, { message: "Department should be at least 1 character" })
    .max(50, { message: "Department should be less than 50 characters" }),
  companyId: z.string({ required_error: "Company ID is required" }).min(1),
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
  baseSalary: z
    .number({
      required_error: "Base salary is required",
    })
    .nonnegative("Base salary must be non-negative"),
  bonus: z
    .number({
      required_error: "Bonus is required",
    })
    .nonnegative("Bonus must be non-negative"),
  deduction: z
    .number({
      required_error: "Deduction is required",
    })
    .nonnegative("Deduction must be non-negative"),
  attendanceBonus: z
    .number({
      required_error: "Attendance bonus is required",
    })
    .nonnegative("Attendance bonus must be non-negative"),
  total: z
    .number({
      required_error: "Total salary is required",
    })
    .nonnegative("Total salary must be non-negative"),
});
