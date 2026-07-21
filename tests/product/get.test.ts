import request from "supertest";

import app from "../../src/app";
import pool from "../../src/config/postgres";

import { createAdmin } from "../helpers/auth";

describe("GET /api/v1/products/:id", () => {
  it("should return product successfully", async () => {
    // Arrange
    const { accessToken } = await createAdmin();

    const categoryResult = await pool.query(
      `
      INSERT INTO categories (name)
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
        description,
        price,
        stock
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
      `,
      [categoryId, "IPHONE-001", "iPhone 16", "Latest iPhone", "999.99", 10],
    );

    const productId = productResult.rows[0].id;

    // Act
    const response = await request(app)
      .get(`/api/v1/products/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toMatchObject({
      id: productId,
      categoryId,
      sku: "IPHONE-001",
      name: "iPhone 16",
      description: "Latest iPhone",
      price: "999.99",
      stock: 10,
      isActive: true,
    });
  });

  it("should return 404 when product does not exist", async () => {
    const { accessToken } = await createAdmin();

    const response = await request(app)
      .get(`/api/v1/products/${crypto.randomUUID()}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Product not found");
  });

  it("should reject invalid product ID", async () => {
    const { accessToken } = await createAdmin();

    const response = await request(app)
      .get("/api/v1/products/invalid-id")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject unauthenticated request", async () => {
    const response = await request(app).get(
      `/api/v1/products/${crypto.randomUUID()}`,
    );

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });
});
