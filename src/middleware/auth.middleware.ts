import {NextFunction, Request, Response} from "express";
import {asyncHandler} from "./http.middleware";
import {ApiError} from "../utils/api.response.utils";
import {verifyToken} from "../config/token.config";
import {UserService} from "../modules/user/user.service";
import {AuthenticatedUser} from "../modules/user/user.interface";

const isAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.cookies.accessToken;

    if (!authHeader) {
      throw ApiError.unauthorized("No Token Provided");
    }

    const token = authHeader;
    const payload = verifyToken(token as string);

    if (!payload || !payload.userId) {
      throw ApiError.unauthorized("Unauthorized");
    }

    const user = await new UserService().findUser("id", payload.userId);

    if (
      !user ||
      !user.isActive ||
      !user.isVerified ||
      user.passwordVersion !== payload.passwordVersion
    ) {
      throw ApiError.unauthorized("Session expired, please login again");
    }

    const userPayload: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
    };
    req.user = userPayload;
    next();
  }
);

export default isAuth;
