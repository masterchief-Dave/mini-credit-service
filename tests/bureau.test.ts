import {test, expect} from "bun:test";

import {BureauService} from "../src/modules/bureau/bureau.service";
import {STATIC_REPORT} from "../src/modules/bureau/bureau.mock";
import {prisma} from "../src/db/prisma";

test("BureauService.check returns static normalized report and persists", async () => {
  const svc = new BureauService();

  (svc as any).mockUrl = undefined;

  const originalCreate = prisma.bureauReport.create as any;
  (prisma as any).bureauReport.create = async (_args: any) => ({
    id: "br_test_id",
  });

  try {
    const result = await svc.check("req_user_123");

    expect(result).toBeDefined();

    const record = (result as any)?.data?.record;
    expect(record).toBeDefined();

    expect(record.bureauReportId).toBe("br_test_id");

    expect(record.score).toBe(STATIC_REPORT.score);
    expect(record.riskBand).toBe(STATIC_REPORT.riskBand);
    expect(record.enquiries6m).toBe(STATIC_REPORT.enquiries6m);
    expect(record.defaults).toBe(STATIC_REPORT.defaults);
    expect(record.openLoans).toBe(STATIC_REPORT.openLoans);
    expect(record.tradeLines).toEqual(STATIC_REPORT.tradeLines);
  } finally {
    (prisma as any).bureauReport.create = originalCreate;
  }
});
