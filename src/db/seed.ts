import logger from "../config/logger";
import { runSeeds } from "./seedRunner";

runSeeds().catch((err: Error) => {
  logger.error(err);
  process.exit(1);
});
