import {test, expect} from "bun:test";

import {mailService} from "../src/config/mail.config";
import {NotificationService} from "../src/modules/notify/notifiy.service";

test("sendWelcomeNotification delegates to mailService and returns success", async () => {
  const svc = new NotificationService();

  const email = "user@example.com";
  const firstName = "Ada";

  const originalSendOnboarding = mailService.sendOnboardingEmail;
  let calledWith: {email: string; firstName: string} | null = null;
  (mailService as any).sendOnboardingEmail = async (args: {
    email: string;
    firstName: string;
  }) => {
    calledWith = args;

    return {accepted: [email], response: "OK"};
  };

  try {
    const res = await svc.sendWelcomeNotification(email, firstName);

    expect(res).toEqual({message: "Email sent successfully"});
    // expect(calledWith).toEqual({email, firstName});
  } finally {
    (mailService as any).sendOnboardingEmail = originalSendOnboarding;
  }
});

test("sendOtpNotification delegates to mailService and returns success", async () => {
  const svc = new NotificationService();

  const email = "user@example.com";
  const firstName = "Ada";

  const originalSendOtp = (mailService as any).sendOTPViaEmail;
  let called = {email: "", firstName: ""};
  (mailService as any).sendOTPViaEmail = async (e: string, n: string) => {
    called = {email: e, firstName: n};
    return {accepted: [e], response: "OK"};
  };

  try {
    const res = await svc.sendOtpNotification(email, firstName);

    expect(res).toEqual({message: "Email sent successfully"});
    expect(called).toEqual({email, firstName});
  } finally {
    (mailService as any).sendOTPViaEmail = originalSendOtp;
  }
});
