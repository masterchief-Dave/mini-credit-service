import autoBind from "auto-bind";
import {UploadedFile} from "express-fileupload";
import path from "path";
import {prisma} from "../../db/prisma";
import {ApiSuccess} from "../../utils/api.response.utils";
import {parseCsvTransactions} from "../../utils/csv-parser.utils";
import {percentageCalculator} from "../../utils/helpers.utils";
import {sha256String} from "../../utils/validation.utils";

const BATCH_SIZE = 1000;

export class StatementsService {
  constructor() {
    autoBind(this);
  }

  async uploadCsv(opts: {
    file: UploadedFile;
    userId: string;
    statementName?: string;
  }) {
    const {file, userId, statementName} = opts;

    const ext = path.extname(file.name || "").toLowerCase();
    if (ext !== ".csv") {
      throw new Error("Unsupported file format. Please upload a CSV.");
    }

    const buffer = file.data as Buffer;
    const csvHash = sha256String(buffer.toString("utf8"));

    const existing = await prisma.statement
      .findUnique({
        where: {userId_csvHash: {userId, csvHash}},
        select: {
          id: true,
          name: true,
          rowsTotal: true,
          rowsParsed: true,
          rowsRejected: true,
          periodFrom: true,
          periodTo: true,
        },
      })
      .catch(() => null);

    if (existing) {
      const successPct = percentageCalculator(
        existing.rowsParsed,
        existing.rowsTotal
      );
      const {
        id,
        name,
        rowsTotal,
        rowsParsed,
        rowsRejected,
        periodFrom,
        periodTo,
      } = existing;
      return ApiSuccess.ok("Statement already uploaded", {
        duplicated: true,
        statementId: id,
        name,
        rowsTotal,
        rowsParsed,
        rowsRejected,
        parsingSuccessRate: successPct,
        period: {from: periodFrom ?? null, to: periodTo ?? null},
      });
    }

    const {rows, rowsTotal, rowsRejected, periodFrom, periodTo} =
      await parseCsvTransactions(buffer);
    const rowsParsed = rows.length;
    const successPct = percentageCalculator(rowsParsed, rowsTotal);

    const statement = await prisma.statement.create({
      data: {
        userId,
        name: statementName || file.name || "statement.csv",
        csvHash,
        rowsTotal,
        rowsParsed,
        rowsRejected,
        parsingSuccessRate: successPct,
        periodFrom: periodFrom ?? undefined,
        periodTo: periodTo ?? undefined,
      },
      select: {id: true},
    });

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const chunk = rows.slice(i, i + BATCH_SIZE);
      await prisma.transaction.createMany({
        data: chunk.map((r) => ({
          statementId: statement.id,
          date: r.date,
          description: r.description,
          type: r.type,
          amount: r.amount,
          balance: r.balance,
        })),
      });
    }

    return ApiSuccess.created("Statement uploaded successfully", {
      duplicated: false,
      statementId: statement.id,
      name: statementName || file.name,
      rowsTotal,
      rowsParsed,
      rowsRejected,
      parsingSuccessRate: successPct,
      period: {from: periodFrom ?? null, to: periodTo ?? null},
    });
  }
}
