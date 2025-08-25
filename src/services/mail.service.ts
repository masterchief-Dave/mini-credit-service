import fs from "fs";
import handlebars from "handlebars";
import type {SentMessageInfo, Transporter} from "nodemailer";
import path from "path";
import {fileURLToPath} from "url";
import {env} from "../utils/env-config.utils";
import {logger} from "../utils/logger.utils";
import {generateSecurePassword} from "../utils/password-generator.utils";
import generateOTP from "../utils/otp-generator.utils";
import {prisma} from "../server";
import {hashOTP} from "../utils/validation.utils";
import {ApiError} from "../utils/api.response.utils";
import {OtpService} from "../modules/otp/otp.service";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export class MailService {
  private transporter: Transporter;
  private defaultFrom: string;
  private otpService = new OtpService();

  constructor(transporter: Transporter, defaultFrom: string) {
    this.transporter = transporter;
    this.defaultFrom = defaultFrom;
  }

  private static loadTemplate(templateName: string, data: object): string {
    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      `${templateName}.html`
    );
    const templateSource = fs.readFileSync(templatePath, "utf8");
    const compiledTemplate = handlebars.compile(templateSource);
    return compiledTemplate(data);
  }

  public async sendEmail({
    to,
    subject,
    text,
    html,
    from,
  }: EmailOptions): Promise<SentMessageInfo> {
    try {
      const mailOptions = {
        from: from ?? this.defaultFrom,
        to,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info("Email sent:", info.response);
      logger.info({info});

      return info;
    } catch (error: any) {
      logger.fatal("Error sending email:", error);
      throw error;
    }
  }

  public async sendOnboardingEmail({
    email,
    firstName,
  }: {
    email: string;
    firstName: string;
  }): Promise<SentMessageInfo> {
    const subject = "Welcome to Mini Credit";
    const tempPassword = generateSecurePassword();

    const html = MailService.loadTemplate("onboarding-email", {
      appName: env.APP_NAME,
      brandInitials: "MC",
      firstName,
      userEmail: email,
      tempPassword,
      loginUrl: env.CLIENT_BASE_URL + "/auth/login",
      supportEmail: env.SUPPORT_EMAIL,
      companyAddress: "Hidden Leaf Village",
      year: new Date().getFullYear(),
      subject,
    });

    const text =
      `Hello ${firstName},\n\n` +
      `Your ${env.APP_NAME ?? "Mini Credit"} account is ready.\n` +
      `Email: ${email}\n` +
      (tempPassword ? `Temporary password: ${tempPassword}\n` : ``) +
      `Login: ${env.CLIENT_BASE_URL}/auth/login\n\n` +
      `Support: ${env.SUPPORT_EMAIL}\n`;

    return await this.sendEmail({
      to: email,
      subject,
      html,
      text,
      from: env.SUPPORT_EMAIL,
    });
  }

  public async sendOTPViaEmail(
    email: string,
    firstName: string
  ): Promise<SentMessageInfo> {
    const {otp} = await this.otpService.issueOTP(email);
    if (!otp) {
      throw ApiError.badRequest("OTP not processed");
    }
    const subject = "OTP Request";
    const date = new Date().toLocaleString();
    const emailText = `Hello ${firstName},\n\nYour OTP is: ${otp}`;

    const html = MailService.loadTemplate("otp", {
      userName: firstName,
      otp,
      date,
      appName: env.APP_NAME,
      companyAddress: "Hidden Leaf Village",
      year: new Date().getFullYear(),
    });

    return await this.sendEmail({
      to: email,
      subject,
      text: emailText,
      html,
    });
  }
}
