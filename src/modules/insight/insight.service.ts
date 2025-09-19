import autoBind from "auto-bind";
import {Role, TransactionType} from "../../../generated/prisma";
import {prisma} from "../../db/prisma";
import {ApiError, ApiSuccess} from "../../utils/api.response.utils";
import {percentageCalculator} from "../../utils/helpers.utils";
import {AuthenticatedUser} from "../user/user.interface";
import {bucketFor, NecessityBucket} from "./insight.config";
import {RunInsightsBodyDTO, SpendBucket} from "./insight.interface";

export class InsightService {
  constructor() {
    autoBind(this);
  }

  async run(input: RunInsightsBodyDTO, userId: string) {
    const statementIds =
      "statementId" in input ? [input.statementId] : input.statementIds;

    const txns = await prisma.transaction.findMany({
      where: {statementId: {in: statementIds}},
      select: {
        date: true,
        description: true,
        type: true,
        amount: true,
        balance: true,
      },
      orderBy: {date: "asc"},
    });
    if (txns.length === 0) {
      throw new Error("No transactions found for the provided statement(s).");
    }

    const periodFrom = txns[0].date;
    const periodTo = txns[txns.length - 1].date;

    let inflow = 0;
    let outflow = 0;

    const bucketTotals: Record<NecessityBucket, number> = {
      food_groceries: 0,
      transport: 0,
      housing_rent: 0,
      utilities_power_water: 0,
      telecom_airtime_data: 0,
      healthcare: 0,
      education: 0,
      others: 0,
    };

    for (const t of txns) {
      const amt = Number(t.amount);
      if (t.type === TransactionType.CREDIT) {
        inflow += amt;
      } else {
        outflow += amt;
        const key = bucketFor(t.description);
        bucketTotals[key] += amt;
      }
    }

    const net = inflow - outflow;

    const spendBuckets: SpendBucket[] = (
      Object.keys(bucketTotals) as NecessityBucket[]
    )
      .map((key) => {
        const amount = Number(bucketTotals[key].toFixed(2));
        return {
          key,
          amount,
          share: outflow ? Number((amount / outflow).toFixed(4)) : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    const stats = await prisma.statement.findMany({
      where: {id: {in: statementIds}},
      select: {rowsTotal: true, rowsParsed: true},
    });
    const rowsTotal = stats.reduce((a, s) => a + s.rowsTotal, 0);
    const rowsParsed = stats.reduce((a, s) => a + s.rowsParsed, 0);
    const parsingSuccessRate = percentageCalculator(rowsParsed, rowsTotal);

    const insight = await prisma.insight.create({
      data: {
        userId,
        statementIds,
        periodFrom,
        periodTo,
        inflow: inflow.toFixed(2),
        outflow: outflow.toFixed(2),
        net: net.toFixed(2),
        avgMonthlyIncome3m: null,
        spendBuckets,
        riskFlags: [],
        parsingSuccessRate,
      },
      select: {id: true},
    });

    return ApiSuccess.created("Insight created successfully", {
      record: insight,
    });
  }

  public getById = async (id: string, user: AuthenticatedUser) => {
    const insight = await prisma.insight.findUnique({where: {id}});
    if (!insight) throw ApiError.notFound("Insight not found");
    const isOwner = insight.userId === user.id;
    const isAdmin = user.role === Role.ADMIN;
    if (!isOwner && !isAdmin)
      throw ApiError.forbidden("You do not have access to this insight");

    return ApiSuccess.ok("Insight found", {record: insight});
  };
}
