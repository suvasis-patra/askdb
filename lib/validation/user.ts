import * as z from "zod";

export const ZSignup = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email"),
  password: z
    .string("Enter a strong password")
    .min(6, "Password must be at least 6 characters"),
});

export const ZSignin = z.object({
  email: z.email("Enter a valid email"),
  password: z
    .string("Enter a strong password")
    .min(6, "Password must be at least 6 characters"),
});
