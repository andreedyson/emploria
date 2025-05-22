import { ALLOWED_FILE_TYPE } from "@/constants";
import { EmployeeRole } from "@prisma/client";
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
