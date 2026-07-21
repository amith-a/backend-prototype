import pool from "../../src/config/postgres";
import { redis } from "../../src/config/redis";
import { emailQueue } from "../../src/jobs/queues/email.queue";

export async function clearDatabase(): Promise<void> {
  if (redis.status === "ready" || redis.status === "connect") {
    await redis.flushdb();
  }
  await pool.query(`
    TRUNCATE TABLE
      refresh_sessions,
      order_items,
      orders,
      cart_items,
      carts,
      products,
      categories,
      users
    RESTART IDENTITY CASCADE;
  `);
}

export async function closeDatabase(): Promise<void> {
  await Promise.all([
    emailQueue.close(),
    redis.status !== "end" ? redis.quit() : Promise.resolve(),
    pool.end(),
  ]);
}
