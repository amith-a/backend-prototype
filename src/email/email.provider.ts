import logger from "../config/logger";

export interface SendEmailInput {
  to: string;
  subject: string;
  body: string;
}

class EmailProvider {
  async send({ to, subject, body }: SendEmailInput): Promise<void> {
    // Temporary implementation

    logger.info(
      {
        to,
        subject,
        body,
      },
      "Sending email",
    );

    // Later:
    // await resend.emails.send(...)
    // await ses.send(...)
  }
}

export const emailProvider = new EmailProvider();
