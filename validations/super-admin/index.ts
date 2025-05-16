import { z } from "zod";

export const companySchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Company Name should be atleast 1 character" })
    .max(50, { message: "Company Name should be less than 50 characters" }),
  image: z.string().optional(),
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
});
