import { Worker } from "bullmq";

import bullmqConnection from "../../config/bullmq";
import { emailProcessor } from "../processors/email.processor";

export const emailWorker = new Worker("email", emailProcessor, {
  connection: bullmqConnection,
});
