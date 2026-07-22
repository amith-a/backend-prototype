/* eslint-disable no-console */
import bcrypt from "bcrypt";
import pool from "../config/postgres";
import env from "../config/env";
import { Role } from "../constants/roles";
import logger from "../config/logger";

async function createAdmin() {
  try {
    const email = "admin@example.com";
    const password = "Admin@123";

    // Check if admin already exists
    const existing = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1;
      `,
      [email],
    );

    if (existing.rowCount) {
      console.log("Admin already exists.");
      return;
    }

    const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

    await pool.query(
      `
      INSERT INTO users (
        id,
        role_id,
        name,
        email,
        password_hash
      )
      VALUES (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4
      );
      `,
      [Role.ADMIN, "System Administrator", email, passwordHash],
    );

    console.log("=================================");
    console.log("Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("=================================");
  } catch (error) {
    logger.error(error);
  } finally {
    await pool.end();
  }
}

createAdmin();
