import pinoHttp from "pino-http";
import {logger} from "./logger.utils";

const minimalSerializers = {
  req: (req: any) => ({
    id: req.id,
    method: req.method,
    url: req.url,
    userAgent: req.headers?.["user-agent"],
  }),
  res: (res: any) => ({
    statusCode: res.statusCode,
  }),
  err: (err: any) => ({
    message: err?.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err?.stack,
  }),
};

export const httpLogger = pinoHttp({
  logger,
  serializers: minimalSerializers,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.body.password",
      "req.body.*.password",
    ],
    remove: true,
  },

  autoLogging: {
    ignore: (req) =>
      req.method === "OPTIONS" ||
      // req.url?.startsWith("/api/v1/health") ||
      req.url?.startsWith("/docs") ||
      req.url === "/favicon.ico",
  },

  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },

  customSuccessMessage: (req, res) =>
    `${req.method} ${req.url} -> ${res.statusCode}`,
  customErrorMessage: (req, res, err) =>
    `${req.method} ${req.url} -> ${res.statusCode} ${err?.message ?? ""}`,
});
