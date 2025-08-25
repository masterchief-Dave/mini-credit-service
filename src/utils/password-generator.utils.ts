import {randomBytes} from "crypto";

export function generateSecurePassword(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = randomBytes(6);
  let password = "";

  for (let i = 0; i < 6; i++) {
    password += chars[bytes[i] % chars.length];
  }

  return password;
}
