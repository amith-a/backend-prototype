import { ConnectionOptions } from "bullmq";

import env from "./env";

const bullmqConnection: ConnectionOptions = {
  url: env.REDIS_URL,
};

export default bullmqConnection;
