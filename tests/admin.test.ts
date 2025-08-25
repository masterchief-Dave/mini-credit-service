import {test, expect} from "bun:test";
import {AdminService} from "../src/modules/admin/admin.service";

test("AdminService.onboarding delegates to AuthService.onboardUser and returns result", async () => {
  const svc = new AdminService();
  const dto = {
    email: "user@example.com",
    password: "Passw0rd!",
    firstName: "Ada",
    lastName: "Lovelace",
  } as any;

  const original = (svc as any).authService.onboardUser;
  let captured: any = null;
  (svc as any).authService.onboardUser = async (arg: any) => {
    captured = arg;
    return {
      success: true,
      message: "ok",
      data: {
        id: "usr_1",
        email: "email",
        firstName: "firstName",
        isActive: true,
        isVerified: true,
        lastName: "lastName",
        role: "USER",
      },
    };
  };

  try {
    const res = await svc.onboarding(dto);
    expect(captured).toEqual(dto);
    expect(res).toEqual({
      success: true,
      message: "ok",
      status_code: 200,
      data: {
        id: "usr_1",
        email: "email",
        firstName: "firstName",
        isActive: true,
        isVerified: true,
        lastName: "lastName",
        role: "USER",
      },
    });
  } finally {
    (svc as any).authService.onboardUser = original;
  }
});
