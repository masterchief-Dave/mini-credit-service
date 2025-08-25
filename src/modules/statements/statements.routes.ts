import {Router} from "express";
import {asyncHandler} from "../../middleware/http.middleware";
import {StatementsController} from "./statements.controller";
import isAuth from "../../middleware/auth.middleware";

const ctrl = new StatementsController();
const statementRouter = Router();

statementRouter.post("/upload", isAuth, asyncHandler(ctrl.upload));

export default statementRouter;
