import request from "supertest";

import app from "../../src/app";
import pool from "../../src/config/postgres";

import { createAdmin, createCustomer } from "../helpers/auth";

describe("DELETE /api/v1/products/:id", () => {
  it("should delete product successfully", async () => {
    // Arrange
    const { accessToken } = await createAdmin();

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
      INSERT INTO products (
        category_id,
        sku,
        name,
        price,
        stock
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING id;
      `,
      [categoryId, "SKU-001", "Laptop", "1000.00", 10],
    );

    const productId = productResult.rows[0].id;

    // Act
    const response = await request(app)
      .delete(`/api/v1/products/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert - HTTP
    expect(response.status).toBe(204);

    // Assert - Database
    const result = await pool.query(
      `
      SELECT *
      FROM products
      WHERE id = $1;
      `,
      [productId],
    );

    expect(result.rowCount).toBe(0);
  });

  it("should return 404 when product does not exist", async () => {
    const { accessToken } = await createAdmin();

    const response = await request(app)
      .delete(`/api/v1/products/${crypto.randomUUID()}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Product not found");
  });

  it("should reject invalid product ID", async () => {
    const { accessToken } = await createAdmin();

    const response = await request(app)
      .delete("/api/v1/products/invalid-id")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject unauthenticated request", async () => {
    const response = await request(app).delete(
      `/api/v1/products/${crypto.randomUUID()}`,
    );

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });

  it("should reject customer role", async () => {
    const { accessToken } = await createCustomer();

    const response = await request(app)
      .delete(`/api/v1/products/${crypto.randomUUID()}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(403);

    expect(response.body.success).toBe(false);
  });
});
