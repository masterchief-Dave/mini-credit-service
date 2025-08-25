import {test, expect} from "bun:test";
import {prisma} from "../src/db/prisma";
import {InsightService} from "../src/modules/insight/insight.service";

test("InsightService.run aggregates necessities and persists an insight", async () => {
  const svc = new InsightService();

  const origTxFindMany = prisma.transaction.findMany;
  const origStmtFindMany = prisma.statement.findMany;
  const origInsightCreate = prisma.insight.create;

  (prisma as any).transaction.findMany = async () => [
    {
      date: new Date("2025-01-01"),
      description: "Salary",
      type: "CREDIT",
      amount: "1000.00",
      balance: "1000.00",
    },
    {
      date: new Date("2025-01-02"),
      description: "Shoprite Supermarket",
      type: "DEBIT",
      amount: "200.00",
      balance: "800.00",
    },
    {
      date: new Date("2025-01-03"),
      description: "Ikeja Electric Bill",
      type: "DEBIT",
      amount: "150.00",
      balance: "650.00",
    },
  ];

  (prisma as any).statement.findMany = async () => [
    {rowsTotal: 3, rowsParsed: 3},
  ];

  let capturedCreateArgs: any = null;
  (prisma as any).insight.create = async (args: any) => {
    capturedCreateArgs = args;
    return {id: "ins_test_id"};
  };

  try {
    const result = await svc.run({statementId: "st_1"} as any, "usr_1");

    expect(result).toBeDefined();
    expect((result as any).success).toBe(true);
    expect((result as any).message).toBe("Insight created successfully");
    const record = (result as any).data?.record;
    expect(record).toBeDefined();
    expect(record.id).toBe("ins_test_id");

    expect(capturedCreateArgs).toBeTruthy();
    const data = capturedCreateArgs.data;

    expect(data.userId).toBe("usr_1");
    expect(data.statementIds).toEqual(["st_1"]);

    expect(data.inflow).toBe("1000.00");
    expect(data.outflow).toBe("350.00");
    expect(data.net).toBe("650.00");

    expect(data.parsingSuccessRate).toBe(100);

    expect(new Date(data.periodFrom).toISOString()).toBe(
      new Date("2025-01-01").toISOString()
    );
    expect(new Date(data.periodTo).toISOString()).toBe(
      new Date("2025-01-03").toISOString()
    );

    const buckets = data.spendBuckets as Array<{
      key: string;
      amount: number;
      share: number;
    }>;
    const food = buckets.find((b) => b.key === "food_groceries");
    const utilities = buckets.find((b) => b.key === "utilities_power_water");
    expect(food?.amount).toBe(200);
    expect(utilities?.amount).toBe(150);
  } finally {
    (prisma as any).transaction.findMany = origTxFindMany;
    (prisma as any).statement.findMany = origStmtFindMany;
    (prisma as any).insight.create = origInsightCreate;
  }
});
