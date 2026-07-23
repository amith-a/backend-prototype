import fs from "fs";
import path from "path";
import { PoolClient } from "pg";
import pool from "../config/postgres";
import logger from "../config/logger";

const MIGRATION_LOCK_ID = 987654321;

async function executeSQLFile(client: PoolClient, filePath: string) {
  const sql = fs.readFileSync(filePath, "utf8");
  await client.query(sql);
}

export async function runMigrations(): Promise<void> {
  const client = await pool.connect();

  try {
    //
    // Prevent multiple application instances
    //
    await client.query(
      `SELECT pg_advisory_lock(${MIGRATION_LOCK_ID})`
    );

    //
    // Migration table
    //
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
          version VARCHAR(255) PRIMARY KEY,
          applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    //
    // Already executed migrations
    //
    const { rows } = await client.query(
      "SELECT version FROM schema_migrations"
    );

    const executed = new Set<string>(
      rows.map((r) => r.version)
    );

    //
    // Migration directory
    //
    const migrationDir = path.join(__dirname, "migrations");

    if (!fs.existsSync(migrationDir)) {
      throw new Error(
        `Migration directory not found: ${migrationDir}`
      );
    }

    const migrationFiles = fs
      .readdirSync(migrationDir)
      .filter((file) => file.endsWith(".sql"));

    if (migrationFiles.length === 0) {
      logger.warn("No migration files found.");
      return;
    }

    //
    // Validate filenames
    //
    const migrationPattern = /^\d{3}_.+\.sql$/;

    for (const file of migrationFiles) {
      if (!migrationPattern.test(file)) {
        throw new Error(
          `Invalid migration filename "${file}".
Expected format: 001_create_users.sql`
        );
      }
    }

    migrationFiles.sort();

    //
    // Execute migrations
    //
    for (const file of migrationFiles) {
      if (executed.has(file)) {
        logger.debug(`Skipping ${file}`);
        continue;
      }

      const start = Date.now();

      logger.info(`Running ${file}`);

      await client.query("BEGIN");

      try {
        await executeSQLFile(
          client,
          path.join(migrationDir, file)
        );

        await client.query(
          `
          INSERT INTO schema_migrations(version)
          VALUES($1)
          `,
          [file]
        );

        await client.query("COMMIT");

        logger.info(
          `✓ ${file} completed in ${Date.now() - start} ms`
        );
      } catch (error) {
        await client.query("ROLLBACK");

        logger.error({
          migration: file,
          error,
        });

        throw error;
      }
    }

    logger.info("All migrations completed successfully.");
  } finally {
    try {
      await client.query(
        `SELECT pg_advisory_unlock(${MIGRATION_LOCK_ID})`
      );
    } finally {
      client.release();
      await pool.end();
    }
  }
}