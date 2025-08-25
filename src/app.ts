import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import {httpLogger} from "./utils/request-context.utils";
import {limiter} from "./middleware/http.middleware";
import {notFound} from "./middleware/not-found.middleware";
import {errorHandler} from "./middleware/error-handler.middleware";
import apiRouter from "./routes";
import {env} from "./utils/env-config.utils";
import fileUpload from "express-fileupload";

export const createApp = () => {
  const app = express();
  app.use(helmet());
  app.use(cors({origin: [...env.CORS_ORIGIN.split(",")], credentials: true}));
  app.use(cookieParser());
  app.use(express.json({limit: "10mb"}));
  app.use(express.urlencoded({extended: true}));
  app.use(
    fileUpload({limits: {fileSize: 1024 * 1024 * 2}, useTempFiles: false})
  );
  app.use(httpLogger);
  app.use(limiter);

  app.use("/api/v1", apiRouter);
  app.use(notFound);
  app.use(errorHandler);
  return app;
};
