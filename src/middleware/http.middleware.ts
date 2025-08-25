import rateLimit from "express-rate-limit";
import type {Request, Response, NextFunction, RequestHandler} from "express";

export const asyncHandler =
  (fn: Function): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const limiter = rateLimit({windowMs: 15 * 60 * 1000, max: 300});

type RetryOpts = {
  retries?: number;
  baseDelayMs?: number;
  timeoutMs?: number;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchJsonWithRetry<T = any>(
  url: string,
  init: RequestInit,
  opts: RetryOpts = {}
): Promise<T> {
  const retries = opts.retries ?? 3;
  const baseDelayMs = opts.baseDelayMs ?? 500;
  const timeoutMs = opts.timeoutMs ?? 5000;

  let attempt = 0;
  let lastErr: any;

  while (attempt <= retries) {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), timeoutMs);
    try {
      const res = await fetch(url, {...init, signal: ac.signal});
      clearTimeout(timer);
      if (!res.ok) {
        if (res.status >= 500 && attempt < retries) {
          const delay =
            baseDelayMs * Math.pow(2, attempt) +
            Math.round(Math.random() * 100);
          await sleep(delay);
          attempt++;
          continue;
        }
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) return (await res.json()) as T;
      return (await res.text()) as unknown as T;
    } catch (err: any) {
      clearTimeout(timer);
      lastErr = err;
      const retryable =
        err.name === "AbortError" ||
        /ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN/i.test(String(err?.message));
      if (retryable && attempt < retries) {
        const delay =
          baseDelayMs * Math.pow(2, attempt) + Math.round(Math.random() * 100);
        await sleep(delay);
        attempt++;
        continue;
      }
      break;
    }
  }

  throw lastErr ?? new Error("fetch failed");
}
