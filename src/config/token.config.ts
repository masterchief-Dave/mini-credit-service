import jwt, {
  type JwtPayload,
  type SignOptions,
  type VerifyOptions,
} from "jsonwebtoken";
import {AuthenticatedUser} from "../modules/user/user.interface";
import {env} from "../utils/env-config.utils";
import {ApiError} from "../utils/api.response.utils";

interface CustomJwtPayload extends JwtPayload, AuthenticatedUser {}

interface TokenPayload {
  [key: string]: any;
}

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES = 24 * 60 * 60; // 24 hours

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export const generateToken = (payload: TokenPayload): string => {
  const options: SignOptions = {expiresIn: JWT_EXPIRES};
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): CustomJwtPayload => {
  const options: VerifyOptions = {};
  try {
    const payload = jwt.verify(token, JWT_SECRET, options) as CustomJwtPayload;
    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Token Expired");
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid Token");
    }

    throw error;
  }
};
