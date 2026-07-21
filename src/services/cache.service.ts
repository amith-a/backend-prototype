import logger from "../config/logger";
import { redis } from "../config/redis";

class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);

      if (value === null) {
        logger.debug({ key }, "Cache miss");
        return null;
      }

      logger.debug({ key }, "Cache hit");

      return JSON.parse(value) as T;
    } catch (error) {
      logger.error({ err: error, key }, "Redis GET failed");
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlInSeconds: number): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(value), "EX", ttlInSeconds);
      logger.debug(
        {
          key,
          ttlInSeconds,
        },
        "Cache set",
      );
    } catch (error) {
      logger.error({ err: error, key }, "Redis SET failed");
    }
  }

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
      logger.debug({ key }, "Cache invalidated");
    } catch (error) {
      logger.error({ err: error, key }, "Redis DEL failed");
    }
  }

  async delByPrefix(prefix: string): Promise<void> {
    try {
      let cursor = "0";

      do {
        const [nextCursor, keys] = await redis.scan(
          cursor,
          "MATCH",
          `${prefix}*`,
          "COUNT",
          100,
        );

        cursor = nextCursor;

        if (keys.length > 0) {
          await redis.del(...keys);

          logger.debug(
            {
              prefix,
              deletedKeys: keys.length,
            },
            "Cache invalidated by prefix",
          );
        }
      } while (cursor !== "0");
    } catch (error) {
      logger.error(
        {
          err: error,
          prefix,
        },
        "Redis prefix deletion failed",
      );
    }
  }
}

export default new CacheService();
