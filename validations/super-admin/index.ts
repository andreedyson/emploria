import { z } from "zod";
const ALLOWED_FILE_TYPE = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const companySchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Company Name should be atleast 1 character" })
    .max(50, { message: "Company Name should be less than 50 characters" }),
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

export const superAdminUserSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid Email" }),
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name should be atleast 1 character" })
    .max(50, { message: "Name should be less than 50 characters" }),
  password: z
    .string()
    .min(6, { message: "Password should be atleast 6 characters" })
    .max(32, { message: "Password should be less than 32 characters" }),
  companyId: z
    .string({ required_error: "Company is required" })
    .trim()
    .min(1, { message: "Company is required" }),
});
