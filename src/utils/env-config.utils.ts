import {z} from "zod";

const EnvConfig = z.object({
  APP_NAME: z.string().min(1),
  BREVO_EMAIL: z.string().min(1),
  BREVO_PASSWORD: z.string().min(1),
  BUREAU_API_KEY: z.string().min(1),
  CLIENT_BASE_URL: z.string().min(1),
  CORS_ORIGIN: z.string(),
  DATABASE_URL: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_SECRET: z.string().min(10),
  LOG_LEVEL: z.string().default("info"),
  MAIL_FROM: z.string().min(1),
  MOCK_BUREAU_URL: z.string().min(1),
  MOCK_BUREAU_RETRIES: z.coerce.number().default(2),
  MOCK_BUREAU_BASE_DELAY_MS: z.coerce.number().default(400),
  MOCK_BUREAU_TIMEOUT_MS: z.coerce.number().default(3000),
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(5000),
  PRETTY_LOGS: z.string().default("true"),
  SUPPORT_EMAIL: z.string().min(1),
  SEED_ADMIN_EMAIL: z.string().min(1),
  SEED_ADMIN_FIRST_NAME: z.string().min(1),
  SEED_ADMIN_LAST_NAME: z.string().min(1),
  SEED_ADMIN_PASSWORD: z.string().min(1),
});

export type Env = z.infer<typeof EnvConfig>;
export const env: Env = EnvConfig.parse(process.env);
