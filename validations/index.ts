import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid Email" }),
  password: z
    .string()
    .min(6, { message: "Password should be atleast 6 characters" })
    .max(32, { message: "Password should be less than 32 characters" }),
});
