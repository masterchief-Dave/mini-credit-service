import autoBind from "auto-bind";
import {User} from "../../../generated/prisma";
import {generateToken} from "../../config/token.config";
import {prisma} from "../../db/prisma";
import {ApiError, ApiSuccess} from "../../utils/api.response.utils";
import {comparePassword} from "../../utils/validation.utils";
import {AuthenticatedUser} from "../user/user.interface";
import {UserService} from "../user/user.service";
import {LoginDTO, RegisterDTO, VerifyOTPDTO} from "./auth.interface";
import {NotificationService} from "../notify/notifiy.service";
import {logger} from "../../utils/logger.utils";
import {OtpService} from "../otp/otp.service";

export class AuthService {
  private userService = new UserService();
  private notificationService = new NotificationService();
  private otpService = new OtpService();

  constructor() {
    autoBind(this);
  }

  private static userPayload(user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
    };
  }

  public login = async (dto: LoginDTO) => {
    const user = await prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw ApiError.notFound("User with this email does not exist");
    }

    await comparePassword(dto.password, user.password);

    if (!user.isVerified) {
      throw ApiError.badRequest("Please verify your account");
    }

    const token = generateToken({
      userId: user.id,
      passwordVersion: user.passwordVersion,
    });

    const payload = AuthService.userPayload(user);
    return ApiSuccess.ok("Login successful", {
      ...payload,
      token: {accessToken: token},
    });
  };

  public register = async (dto: RegisterDTO) => {
    const record = await this.userService.findUser("email", dto.email);
    if (record) {
      throw ApiError.badRequest("User with this email already exists");
    }

    const emailResponse = await this.notificationService.sendOtpNotification(
      dto.email,
      dto.firstName
    );
    logger.info(emailResponse);
    const user = await this.userService.createUser(dto);
    if (!user) {
      throw ApiError.badRequest("User not created");
    }
    const payload = AuthService.userPayload(user);
    return ApiSuccess.created("User created successfully", payload);
  };

  public onboardUser = async (dto: RegisterDTO) => {
    const record = await this.userService.findUser("email", dto.email);
    if (record) {
      throw ApiError.badRequest("User already exists with this email");
    }
    const userPayload: RegisterDTO & {isVerified: boolean} = {
      ...dto,
      isVerified: true, // in this place, I am assuming that the admin has verified the user, usually I don't do this, i will send an email to the user for the onboarding process, where they will see a link to verify their account.
    };
    const user = await this.userService.createUser(userPayload);
    if (!user) {
      throw ApiError.badRequest("User not created");
    }
    const payload = AuthService.userPayload(user);
    return ApiSuccess.created("User created successfully", payload);
  };

  public verifyOTP = async (dto: VerifyOTPDTO) => {
    const result = await this.otpService.verifyOTP(dto.otpCode, dto.email);
    const user = await this.userService.findUser("email", dto.email);
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    const record = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
      },
    });
    if (!record) {
      throw ApiError.badRequest("User not verified");
    }
    return ApiSuccess.ok("OTP verified successfully", result);
  };

  public async validateUser(dto: AuthenticatedUser) {
    const user = await this.userService.findUser("id", dto.id);
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    user.password = undefined as any;

    const payload = AuthService.userPayload(user);
    return ApiSuccess.ok("User Validated Successfully", {user: payload});
  }

  public forgotPassword = async () => {};

  public resetPassword = async () => {};
}
