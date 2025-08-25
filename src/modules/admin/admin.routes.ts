import {Router} from "express";
import {AdminController} from "./admin.controller";
import {authorize} from "../../middleware/check-user-role.middleware";
import {Role} from "../../../generated/prisma";
import isAuth from "../../middleware/auth.middleware";

const ctrl = new AdminController();
const adminRouter = Router();

adminRouter.post("/onboarding", isAuth, authorize(Role.ADMIN), ctrl.onboarding);

export default adminRouter;
