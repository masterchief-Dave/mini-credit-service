import {Router} from "express";
import {validateBody} from "../../middleware/validate-body.middlware";
import {InsightSchema} from "./insight.schema";
import {asyncHandler} from "../../middleware/http.middleware";
import {InsightController} from "./insight.controller";
import isAuth from "../../middleware/auth.middleware";

const ctrl = new InsightController();
const insightRouter = Router();

insightRouter.post(
  "/run",
  validateBody(InsightSchema.runSchema),
  isAuth,
  asyncHandler(ctrl.run)
);

insightRouter.get("/:id", isAuth, asyncHandler(ctrl.getById));

export default insightRouter;
