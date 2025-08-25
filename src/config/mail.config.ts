import nodemailer from "nodemailer";
import {MailService} from "../services/mail.service";
import {env} from "../utils/env-config.utils";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: env.BREVO_EMAIL,
    pass: env.BREVO_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const mailService = new MailService(transporter, env.MAIL_FROM);
