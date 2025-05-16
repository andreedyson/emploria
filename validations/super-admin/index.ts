import { z } from "zod";

export const companySchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Company Name should be atleast 1 character" })
    .max(50, { message: "Company Name should be less than 50 characters" }),
  image: z.string().optional(),
});
