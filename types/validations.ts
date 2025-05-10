import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid Email" }),
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name should be atleast 1 character" })
    .max(50, { message: "Name should be less than 50 characters" }),
  phone: z
    .string({ required_error: "Phone Number is required" })
    .min(1, { message: "Phone Number can't be empty" })
    .max(16, { message: "Phone Number has a maximum of 16 digits" }),
  address: z
    .string({ required_error: "Address is required" })
    .min(1, { message: "Address can't be empty" }),
  gender: z.enum(["MALE", "FEMALE"]),
  dateOfBirth: z.string(),
  password: z
    .string()
    .min(6, { message: "Password should be atleast 6 characters" })
    .max(32, { message: "Password should be less than 32 characters" }),
  image: z.string().url().optional(),
});

export const signInSchema = registerSchema.pick({
  email: true,
  password: true,
});
