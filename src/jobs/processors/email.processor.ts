import { Job } from "bullmq";

import { emailService } from "../../email/email.service";
import { EmailJob } from "../types/email-job";

export const emailProcessor = async (job: Job<EmailJob>): Promise<void> => {
  await emailService.sendOrderConfirmation(job.data.orderId);
};
