import { Queue } from "bullmq";

import bullmqConnection from "../../config/bullmq";
import { EmailJob } from "../types/email-job";

export const emailQueue = new Queue<EmailJob>("email", {
  connection: bullmqConnection,
});
