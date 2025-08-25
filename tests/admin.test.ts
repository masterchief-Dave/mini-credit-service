import {test, expect} from "bun:test";
import {AdminService} from "../src/modules/admin/admin.service";

test("AdminService.onboarding returns ApiSuccess from AuthService", async () => {
  const svc = new AdminService();
  const dto = {
    email: "email",
    password: "x",
    firstName: "firstName",
    lastName: "lastName",
  } as any;

  const original = (svc as any).authService.onboardUser;
  (svc as any).authService.onboardUser = async () => ({
    success: true,
    status_code: 201,
    message: "User created successfully",
    data: {
      id: "usr_1",
      email: "email",
      firstName: "firstName",
      lastName: "lastName",
      role: "USER",
      isActive: true,
      isVerified: true,
    },
  });

  try {
    const res = await svc.onboarding(dto);
    expect(res).toMatchObject({
      success: true,
      status_code: 201,
      message: "User created successfully",
      data: {
        id: "usr_1",
        email: "email",
        firstName: "firstName",
        lastName: "lastName",
        role: "USER",
        isActive: true,
        isVerified: true,
      },
    });
  } finally {
    (svc as any).authService.onboardUser = original;
  }
});
