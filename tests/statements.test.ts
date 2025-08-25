import {test, expect} from "bun:test";
import type {UploadedFile} from "express-fileupload";

import {StatementsService} from "../src/modules/statements/statements.service";
import {prisma} from "../src/db/prisma";

test("StatementsService.uploadCsv parses, persists, and returns success payload", async () => {
  const svc = new StatementsService();

  // --- Arrange: a tiny valid CSV buffer (2 rows) ---
  const csv = [
    "date,description,type,amount,balance",
    "2025-01-01,Salary,CREDIT,1000,1000",
    "2025-01-02,Groceries,DEBIT,200,800",
  ].join("\n");
  const file: UploadedFile = {
    name: "sample.csv",
    data: Buffer.from(csv, "utf8"),
  } as any; // cast minimal properties only

  // --- Stub Prisma calls to avoid real DB ---
  const originalFindUnique = (prisma as any).statement.findUnique;
  const originalCreate = (prisma as any).statement.create;
  const originalCreateMany = (prisma as any).transaction.createMany;

  (prisma as any).statement.findUnique = async () => null; // not a duplicate
  (prisma as any).statement.create = async (_args: any) => ({id: "st_test_id"});
  (prisma as any).transaction.createMany = async (_args: any) => ({count: 2});

  try {
    // --- Act ---
    const res = await svc.uploadCsv({
      file,
      userId: "usr_123",
      statementName: "Jan Sample",
    });

    // --- Assert (ApiSuccess wrapper shape) ---
    expect(res).toBeDefined();
    // Your ApiSuccess usually looks like: { success, message, data: {...} }
    const data = (res as any).data;
    expect((res as any).success).toBe(true);
    expect((res as any).message).toBe("Statement uploaded successfully");

    // Core fields from the service payload
    expect(data.duplicated).toBe(false);
    expect(data.statementId).toBe("st_test_id");
    expect(data.name).toBe("Jan Sample");
    expect(data.rowsTotal).toBe(2);
    expect(data.rowsParsed).toBe(2);
    expect(data.rowsRejected).toBe(0);
    expect(data.parsingSuccessRate).toBe(100); // percentage 0–100
    // period.from/to are Dates — you can assert truthiness if you like:
    expect(data.period.from).toBeTruthy();
    expect(data.period.to).toBeTruthy();
  } finally {
    // --- Restore stubs ---
    (prisma as any).statement.findUnique = originalFindUnique;
    (prisma as any).statement.create = originalCreate;
    (prisma as any).transaction.createMany = originalCreateMany;
  }
});
