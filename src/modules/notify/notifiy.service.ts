import autoBind from "auto-bind";
import {mailService} from "../../config/mail.config";

export class NotificationService {
  constructor() {
    autoBind(this);
  }

  public sendWelcomeNotification = async (email: string, firstName: string) => {
    await mailService.sendOnboardingEmail({email, firstName});
    return {message: "Email sent successfully"};
  };

  public sendOtpNotification = async (email: string, firstName: string) => {
    await mailService.sendOTPViaEmail(email, firstName);
    return {message: "Email sent successfully"};
  };
}
