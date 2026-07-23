import fs from "fs";
import path from "path";
import { PoolClient } from "pg";
import pool from "../config/postgres";
import logger from "../config/logger";

const SEED_LOCK_ID = 987654322;

async function executeSQLFile(client: PoolClient, filePath: string) {
  const sql = fs.readFileSync(filePath, "utf8");
  await client.query(sql);
}

export async function runSeeds(): Promise<void> {
  const client = await pool.connect();

  try {
    //
    // Prevent multiple seed executions
    //
    await client.query(`SELECT pg_advisory_lock(${SEED_LOCK_ID})`);

    //
    // Seed history
    //
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_seeds (
          version VARCHAR(255) PRIMARY KEY,
          applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    //
    // Already executed seeds
    //
    const { rows } = await client.query("SELECT version FROM schema_seeds");

    const executed = new Set<string>(rows.map((r) => r.version));

    //
    // Seed directory
    //
    const seedDir = path.join(__dirname, "seeds");

    if (!fs.existsSync(seedDir)) {
      logger.warn(`Seed directory not found: ${seedDir}`);
      return;
    }

    const seedFiles = fs
      .readdirSync(seedDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    if (seedFiles.length === 0) {
      logger.info("No seed files found.");
      return;
    }

    const seedPattern = /^\d{3}_.+\.sql$/;

    for (const file of seedFiles) {
      if (!seedPattern.test(file)) {
        throw new Error(
          `Invalid seed filename "${file}".
Expected format: 001_seed_roles.sql`,
        );
      }
    }

    //
    // Execute seeds
    //
    for (const file of seedFiles) {
      if (executed.has(file)) {
        logger.debug(`Skipping seed ${file}`);
        continue;
      }

      const start = Date.now();

      logger.info(`Running seed ${file}`);

      await client.query("BEGIN");

      try {
        await executeSQLFile(client, path.join(seedDir, file));

        await client.query(
          `
          INSERT INTO schema_seeds(version)
          VALUES($1)
          `,
          [file],
        );

        await client.query("COMMIT");

        logger.info(` Seed ${file} completed in ${Date.now() - start} ms`);
      } catch (error) {
        await client.query("ROLLBACK");

        logger.error({
          seed: file,
          error,
        });

        throw error;
      }
    }

    logger.info("All seeds completed successfully.");
  } finally {
    try {
      await client.query(`SELECT pg_advisory_unlock(${SEED_LOCK_ID})`);
    } finally {
      client.release();
      await pool.end();
    }
  }
}
