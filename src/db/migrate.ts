import logger from "../config/logger";
import { runMigrations } from "./migrationRunner";

runMigrations().catch((err) => {
  logger.error(err);
  process.exit(1);
});