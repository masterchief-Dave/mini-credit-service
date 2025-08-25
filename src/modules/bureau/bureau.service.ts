import autoBind from "auto-bind";
import {Prisma} from "../../../generated/prisma";
import {fetchJsonWithRetry} from "../../middleware/http.middleware";
import {prisma} from "../../db/prisma";
import {ApiSuccess} from "../../utils/api.response.utils";
import {env} from "../../utils/env-config.utils";
import {logger} from "../../utils/logger.utils";
import {STATIC_REPORT} from "./bureau.mock";

export class BureauService {
  private mockUrl?: string;
  private bureauApiKey?: string;

  constructor() {
    autoBind(this);
    this.mockUrl = env.MOCK_BUREAU_URL;
    this.bureauApiKey = env.BUREAU_API_KEY;
  }

  public async check(requestedById: string) {
    let raw: any = {static: true};
    if (this.mockUrl) {
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (this.bureauApiKey) headers["X-API-KEY"] = this.bureauApiKey;

        raw = await fetchJsonWithRetry<any>(
          this.mockUrl,
          {
            method: "POST",
            headers,
            body: JSON.stringify({requestedById}),
          },
          {
            retries: env.MOCK_BUREAU_RETRIES,
            baseDelayMs: env.MOCK_BUREAU_BASE_DELAY_MS,
            timeoutMs: env.MOCK_BUREAU_TIMEOUT_MS,
          }
        );
      } catch (err) {
        logger.warn({err}, "Mock bureau API failed — returning static report");
      }
    }

    const normalized = {...STATIC_REPORT, raw};

    const saved = await prisma.bureauReport.create({
      data: {
        requestedById,
        provider: "mock",
        score: normalized.score,
        riskBand: normalized.riskBand,
        enquiries6m: normalized.enquiries6m,
        defaults: normalized.defaults,
        openLoans: normalized.openLoans,
        tradeLines: normalized.tradeLines as unknown as Prisma.InputJsonValue,
        raw: normalized.raw as Prisma.InputJsonValue,
      },
      select: {id: true},
    });

    return ApiSuccess.created("Bureau report created", {
      record: {
        bureauReportId: saved.id,
        ...STATIC_REPORT,
      },
    });
  }
}
