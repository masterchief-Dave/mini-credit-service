import * as z from "zod/v4";

export class AuthSchema {
  static loginSchema = z.object({
    email: z.email(),
    password: z.string().max(100),
  });

  static registerSchema = z.object({
    email: z.email(),
    firstName: z.string().max(50),
    lastName: z.string().max(50),
    password: z.string().min(6).max(100),
  });

  static verifyOtp = z.object({
    otpCode: z.string().min(4).max(4),
    email: z.email(),
  });

  static onboardUserSchema = z.object({});
}
