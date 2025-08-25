import {createHash} from "crypto";
import {ApiError} from "./api.response.utils";

export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw ApiError.badRequest("Please provide a password");
  }
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });
  return hashedPassword;
}

/**
 * Compares an incoming password with an existing hashed password.
 *
 * @param incomingPassword - The password to verify.
 * @param existingPassword - The hashed password to compare against.
 * @throws {ApiError} If either password is not provided or if the passwords do not match.
 */
export async function comparePassword(
  incomingPassword: string,
  existingPassword: string
): Promise<void> {
  if (!incomingPassword || !existingPassword) {
    throw ApiError.badRequest("Please provide a password");
  }
  const isMatch = await Bun.password.verify(incomingPassword, existingPassword);
  if (!isMatch) {
    throw ApiError.unauthorized("Password or email is incorrect");
  }
}

export async function hashOTP(otpCode: string) {
  if (!otpCode) {
    throw ApiError.badRequest("Please provide a password");
  }
  const hashedOTP = await Bun.password.hash(otpCode, {
    algorithm: "bcrypt",
    cost: 10,
  });
  return hashedOTP;
}

export async function compareOTP(incomingOTP: string, existingOTP: string) {
  if (!incomingOTP || !existingOTP) {
    throw ApiError.badRequest("Please provide a password");
  }
  const isMatch = await Bun.password.verify(incomingOTP, existingOTP);
  if (!isMatch) {
    throw ApiError.unauthorized("Password or email is incorrect");
  }
}

export function sha256String(input: string) {
  return createHash("sha256").update(input).digest("hex");
}
