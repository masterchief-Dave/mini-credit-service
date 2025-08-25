import {type Request, type Response} from "express";
export const notFound = (_req: Request, res: Response) =>
  res.status(404).json({
    success: false,
    message: "Route not found",
    code: "NOT_FOUND",
    statusCode: 404,
  });
