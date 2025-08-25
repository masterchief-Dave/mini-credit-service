import {test, expect} from "bun:test";
import {AuthService} from "../src/modules/auth/auth.service";

test("AuthService.register creates a new user and returns payload", async () => {
  const svc = new AuthService();

  const dto = {
    email: "user@example.com",
    password: "Passw0rd!",
    firstName: "Ada",
    lastName: "Lovelace",
  } as any;

  const originalFind = (svc as any).userService.findUser;
  const originalCreate = (svc as any).userService.createUser;
  const originalNotify = (svc as any).notificationService.sendOtpNotification;

  (svc as any).userService.findUser = async () => null;
  (svc as any).notificationService.sendOtpNotification = async () => ({
    message: "ok",
  });
  (svc as any).userService.createUser = async () => ({
    id: "usr_1",
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    role: "USER",
    isActive: true,
    isVerified: false,
  });

  try {
    const res = await svc.register(dto);
    expect((res as any).success).toBe(true);
    expect((res as any).message).toBe("User created successfully");
    const data = (res as any).data;
    expect(data.id).toBe("usr_1");
    expect(data.email).toBe(dto.email);
    expect(data.firstName).toBe(dto.firstName);
    expect(data.lastName).toBe(dto.lastName);
    expect(data.role).toBe("USER");
    expect(data.isActive).toBe(true);
    expect(data.isVerified).toBe(false);
  } finally {
    (svc as any).userService.findUser = originalFind;
    (svc as any).userService.createUser = originalCreate;
    (svc as any).notificationService.sendOtpNotification = originalNotify;
  }
});
