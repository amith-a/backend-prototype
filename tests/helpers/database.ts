import pool from "../../src/config/postgres";

export async function clearDatabase(): Promise<void> {
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
  await pool.end();
}
