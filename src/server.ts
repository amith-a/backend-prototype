import env from "../src/config/env";
import app from "./app";
import logger from "./config/logger";
import pool from "./config/postgres";

async function start() {
  try {
    await pool.query("SELECT NOW()");

    logger.info("Database Connected");

    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });
  } catch (err) {
    logger.error("Database Connection Failed");
    logger.error(err);

    process.exit(1);
  }
}

start();
