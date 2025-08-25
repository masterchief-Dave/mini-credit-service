import csv from "csv-parser";
import {Readable} from "stream";

export type RawTxnRow = {
  date?: string;
  description?: string;
  type?: string;
  amount?: string;
  balance?: string;
};

export type NormalizedTxn = {
  date: Date;
  description: string;
  type: "CREDIT" | "DEBIT";
  amount: string;
  balance?: string;
};

function normalizeType(
  type: string | undefined,
  amountNum: number | null
): "CREDIT" | "DEBIT" | null {
  if (type) {
    const t = type.trim().toLowerCase();
    if (t === "credit" || t === "cr" || t === "c") return "CREDIT";
    if (t === "debit" || t === "dr" || t === "d") return "DEBIT";
  }
  if (amountNum !== null) {
    return amountNum >= 0 ? "CREDIT" : "DEBIT";
  }
  return null;
}

function parseDateFlex(input: string | undefined): Date | null {
  if (!input) return null;
  const s = input.trim();

  const t = Date.parse(s);
  if (!Number.isNaN(t)) return new Date(t);

  const m1 = s.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
  if (m1) {
    const [_, dd, mm, yyyy] = m1;
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    if (!isNaN(d.getTime())) return d;
  }

  const m2 = s.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
  if (m2) {
    const [_, mm, dd, yyyy] = m2;
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    if (!isNaN(d.getTime())) return d;
  }

  return null;
}

function parseAmount(input: string | undefined): number | null {
  if (!input) return null;
  const s = input.replace(/,/g, "").trim();
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

const headerAlias = (h: string) => {
  const key = h.trim().toLowerCase().replace(/\s+/g, "_");
  if (["transaction_date", "date", "value_date", "posting_date"].includes(key))
    return "date";
  if (
    [
      "description",
      "narration",
      "details",
      "transaction_details",
      "memo",
    ].includes(key)
  )
    return "description";
  if (["type", "transaction_type", "credit_debit", "dr_cr"].includes(key))
    return "type";
  if (["amount", "transaction_amount", "amt", "amount_(ngn)"].includes(key))
    return "amount";
  if (["balance", "running_balance", "closing_balance", "bal"].includes(key))
    return "balance";

  return key;
};

export async function parseCsvTransactions(fileBuffer: Buffer): Promise<{
  rows: NormalizedTxn[];
  rowsTotal: number;
  rowsRejected: number;
  periodFrom?: Date;
  periodTo?: Date;
}> {
  return new Promise((resolve, reject) => {
    const rows: NormalizedTxn[] = [];
    let rowsTotal = 0;
    let rowsRejected = 0;
    let minDate: Date | undefined;
    let maxDate: Date | undefined;

    const decoded = fileBuffer
      .toString("utf8")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");
    const stream = Readable.from([decoded]);

    stream
      .pipe(csv({mapHeaders: ({header}) => headerAlias(header)}))
      .on("data", (row: RawTxnRow) => {
        rowsTotal++;

        const date = parseDateFlex(row.date);
        const desc = (row.description ?? "").toString().trim();
        const amtNum = parseAmount(row.amount);
        const type = normalizeType(row.type, amtNum);

        if (!date || !desc || type === null || amtNum === null) {
          rowsRejected++;
          return;
        }

        const abs = Math.abs(amtNum).toFixed(2);
        const balStr = row.balance
          ? String(row.balance).replace(/,/g, "").trim()
          : "";
        const balNum = balStr ? Number(balStr) : NaN;

        rows.push({
          date,
          description: desc,
          type,
          amount: abs,
          balance: Number.isNaN(balNum) ? undefined : balNum.toFixed(2),
        });

        if (!minDate || date < minDate) minDate = date;
        if (!maxDate || date > maxDate) maxDate = date;
      })
      .on("end", () => {
        resolve({
          rows,
          rowsTotal,
          rowsRejected,
          periodFrom: minDate,
          periodTo: maxDate,
        });
      })
      .on("error", reject);
  });
}
