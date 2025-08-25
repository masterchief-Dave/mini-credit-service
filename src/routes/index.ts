import {Router} from "express";
import authRouter from "../modules/auth/auth.routes";
import adminRouter from "../modules/admin/admin.routes";
import statementRouter from "../modules/statements/statements.routes";
import insightRouter from "../modules/insight/insight.routes";
import bureauRouter from "../modules/bureau/bureau.routes";

const apiRouter = Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/statements", statementRouter);
apiRouter.use("/insights", insightRouter);
apiRouter.use("/bureau", bureauRouter);

// TODO: add /statements, /insights, /bureau routers similarly
apiRouter.get("/health", (_req, res) =>
  res.json({
    success: true,
    message: "healthy",
    data: {uptime: process.uptime()},
  })
);

export default apiRouter;
