import z from "zod/v4";
import {NecessityBucket} from "./insight.config";
import {InsightSchema} from "./insight.schema";

export interface InsightInterface {}

export type RunInput =
  | {userId: string; statementId: string}
  | {userId: string; statementIds: string[]};

export type SpendBucket = {key: NecessityBucket; amount: number; share: number};

export type RunInsightsBodyDTO = z.infer<typeof InsightSchema.runSchema>;
export type RunInsightsSingleDTO = z.infer<typeof InsightSchema.insightSchema>;
export type RunInsightsManyDTO = z.infer<
  typeof InsightSchema.manyInsightSchema
>;

export function normalizeRunInsightsBody(
  userId: string,
  body: RunInsightsBodyDTO
): {userId: string; statementIds: string[]} {
  if ("statementId" in body) return {userId, statementIds: [body.statementId]};
  return {userId, statementIds: body.statementIds};
}
