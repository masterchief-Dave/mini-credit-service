import z from "zod/v4";
import {AuthSchema} from "./auth.schema";

export type LoginDTO = z.infer<typeof AuthSchema.loginSchema>;
export type RegisterDTO = z.infer<typeof AuthSchema.registerSchema>;
export type VerifyOTPDTO = z.infer<typeof AuthSchema.verifyOtp>;
