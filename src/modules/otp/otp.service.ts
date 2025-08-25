import autoBind from "auto-bind";
import {prisma} from "../../db/prisma";
import generateOTP from "../../utils/otp-generator.utils";
import {compareOTP, hashOTP} from "../../utils/validation.utils";
import {ApiError} from "../../utils/api.response.utils";

export class OtpService {
  constructor() {
    autoBind(this);
  }

  public issueOTP = async (email: string) => {
    await prisma.otp.deleteMany({where: {email}});
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const record = await prisma.otp.upsert({
      where: {email},
      update: {
        otp: hashedOTP,
        expiresAt,
      },
      create: {
        email,
        otp: hashedOTP,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
    if (!record) {
      throw ApiError.badRequest("OTP not processed");
    }

    return {otp: otp};
  };

  public verifyOTP = async (otp: string, email: string) => {
    const record = await prisma.otp.findFirst({where: {email}});
    if (!record || record.expiresAt < new Date()) {
      throw ApiError.badRequest("Expired or missing otp");
    }

    await compareOTP(otp, record.otp);
    return true;
  };
}
