import autoBind from "auto-bind";
import {RegisterDTO} from "../auth/auth.interface";
import {AuthService} from "../auth/auth.service";

export class AdminService {
  private authService = new AuthService();

  constructor() {
    autoBind(this);
  }

  public onboarding = async (dto: RegisterDTO) => {
    const result = await this.authService.onboardUser(dto);
    // note: I will normally send an email notification to the user, informing them that an account has been created for them with a login credentials which will contain (email, password), the password is supposed to be temporary because in the email the user will be advised to update thier password.

    // await this.userService.sendWelcomeNotification(user.email, user.firstName);
    return result;
  };
}
