import {type NextFunction, type Request, type Response} from "express";
import {logger} from "../utils/logger.utils";
import {ApiError} from "../utils/api.response.utils";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    logger.error({err, code: err.code}, err.message);
    return res.status(err.status_code).json({
      success: false,
      message: err.message,
      code: err.code,
      statusCode: err.status_code,
      details: err.details,
    });
  }
  logger.error({err}, "unhandled error");
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
    statusCode: 500,
  });
};
