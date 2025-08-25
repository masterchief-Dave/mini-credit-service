import * as z from "zod/v4";

export const Id = z.string().min(1, "id is required");

export class InsightSchema {
  static insightSchema = z.object({
    statementId: Id,
    mode: z.literal("aggregate").optional(),
  });

  static manyInsightSchema = z.object({
    statementIds: z.array(Id).min(1, "statementIds is required"),
    mode: z.literal("aggregate").optional(),
  });

  static runSchema = z
    .union([this.insightSchema, this.manyInsightSchema])
    .superRefine((val, ctx) => {
      const hasSingle = "statementId" in val;
      const hasMany = "statementIds" in val;
      if ((hasSingle && hasMany) || (!hasSingle && !hasMany)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Provide either 'statementId' or 'statementIds[]' (but not both).",
          path: [],
        });
      }
    });
}
