import pino from "pino";

const level = process.env.LOG_LEVEL || "info";
const wantPretty = process.env.PRETTY_LOGS === "true";

export const logger = pino({
  level,
  transport: wantPretty
    ? {target: "pino-pretty", options: {colorize: true}}
    : undefined,
  base: undefined,
});
