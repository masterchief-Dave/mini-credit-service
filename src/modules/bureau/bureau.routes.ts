import {Router} from "express";
import isAuth from "../../middleware/auth.middleware";
import {asyncHandler} from "../../middleware/http.middleware";
import {BureauController} from "./bureau.controller";

const ctrl = new BureauController();
const bureauRouter = Router();

bureauRouter.post("/check", isAuth, asyncHandler(ctrl.check));

export default bureauRouter;
