// import {PrismaClient} from "../generated/prisma";
import {createApp} from "./app";
import {env} from "./utils/env-config.utils";
import {logger} from "./utils/logger.utils";
import {dbHealthcheck, prisma} from "./db/prisma";

export {prisma};

const main = async () => {
  await dbHealthcheck();
  const app = createApp();
  app.listen(env.PORT, "0.0.0.0", () => {
    logger.info({port: env.PORT}, "server started");
  });
};

if (process.env.NODE_ENV !== "test") {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
