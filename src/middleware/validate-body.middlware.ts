import type {NextFunction, Request, Response} from "express";
import * as z from "zod/v4";

export const validateBody =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err) => {
          return {
            field: err.path.join("."),
            message:
              err.code === "unrecognized_keys"
                ? `Unrecognized key(s): ${err.keys?.join(", ")}`
                : err.message,
          };
        });

        console.log({errors});

        return void res.status(422).json({
          success: false,
          status: "Validation Error",
          status_code: 422,
          errors,
        });
      }

      return next(error);
    }
  };
