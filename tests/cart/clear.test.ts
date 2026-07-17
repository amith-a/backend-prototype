import request from "supertest";

import app from "../../src/app";
import pool from "../../src/config/postgres";

import { createCustomer } from "../helpers/auth";
import { clearDatabase, closeDatabase } from "../helpers/database";

describe("DELETE /api/v1/cart", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("should clear cart successfully", async () => {
    // Arrange
    const { accessToken, user } = await createCustomer();

    const categoryResult = await pool.query(
      `
      INSERT INTO categories(name)
      VALUES ($1)
      RETURNING id;
      `,
      ["Electronics"],
    );

    const categoryId = categoryResult.rows[0].id;

    const productResult = await pool.query(
      `
      INSERT INTO products
      (category_id, sku, name, price, stock)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING id;
      `,
      [categoryId, "SKU-001", "Laptop", "1000.00", 10],
    );

    const productId = productResult.rows[0].id;

    const cartResult = await pool.query(
      `
      INSERT INTO carts(user_id)
      VALUES($1)
      RETURNING id;
      `,
      [user.id],
    );

    const cartId = cartResult.rows[0].id;

    await pool.query(
      `
      INSERT INTO cart_items
      (cart_id, product_id, quantity)
      VALUES ($1,$2,$3);
      `,
      [cartId, productId, 2],
    );

    // Act
    const response = await request(app)
      .delete("/api/v1/cart")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe("Cart cleared successfully");

    const result = await pool.query(
      `
      SELECT *
      FROM cart_items
      WHERE cart_id = $1;
      `,
      [cartId],
    );

    expect(result.rowCount).toBe(0);
  });

  it("should clear empty cart successfully", async () => {
    // Arrange
    const { accessToken } = await createCustomer();

    // Act
    const response = await request(app)
      .delete("/api/v1/cart")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe("Cart cleared successfully");
  });

  it("should reject unauthenticated request", async () => {
    const response = await request(app).delete("/api/v1/cart");

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });
});
