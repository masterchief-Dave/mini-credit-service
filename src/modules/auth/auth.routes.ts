import {Router} from "express";
import {AuthController} from "./auth.controller";
import {asyncHandler} from "../../middleware/http.middleware";
import {validateBody} from "../../middleware/validate-body.middlware";
import {AuthSchema} from "./auth.schema";
import isAuth from "../../middleware/auth.middleware";

const ctrl = new AuthController();
const authRouter = Router();

authRouter.post(
  "/login",
  validateBody(AuthSchema.loginSchema),
  asyncHandler(ctrl.login)
);
authRouter.post(
  "/register",
  validateBody(AuthSchema.registerSchema),
  asyncHandler(ctrl.register)
);
authRouter.post(
  "/verify-otp",
  validateBody(AuthSchema.verifyOtp),
  asyncHandler(ctrl.verifyOTp)
);
authRouter.get("/validate-user", isAuth, asyncHandler(ctrl.validateUser));

export default authRouter;
