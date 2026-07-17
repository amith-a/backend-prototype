import request from "supertest";

import app from "../../src/app";
import pool from "../../src/config/postgres";

import { createCustomer } from "../helpers/auth";
import { clearDatabase, closeDatabase } from "../helpers/database";

describe("PATCH /api/v1/cart/items/:id", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("should update cart item quantity successfully", async () => {
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
      .patch(`/api/v1/cart/items/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        quantity: 5,
      });

    // Assert - HTTP
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe("Cart item updated successfully");

    // Assert - Database
    const result = await pool.query(
      `
      SELECT quantity
      FROM cart_items
      WHERE cart_id=$1
      AND product_id=$2;
      `,
      [cartId, productId],
    );

    expect(result.rowCount).toBe(1);

    expect(result.rows[0].quantity).toBe(5);
  });

  it("should return 404 when cart item does not exist", async () => {
    const { accessToken, user } = await createCustomer();

    await pool.query(
      `
      INSERT INTO carts(user_id)
      VALUES($1)
      RETURNING id;
      `,
      [user.id],
    );

    const response = await request(app)
      .patch(`/api/v1/cart/items/${crypto.randomUUID()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        quantity: 5,
      });

    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Cart item not found");
  });

  it("should reject invalid product ID", async () => {
    const { accessToken } = await createCustomer();

    const response = await request(app)
      .patch("/api/v1/cart/items/invalid-id")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        quantity: 5,
      });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject invalid quantity", async () => {
    const { accessToken } = await createCustomer();

    const response = await request(app)
      .patch(`/api/v1/cart/items/${crypto.randomUUID()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        quantity: 0,
      });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject empty request body", async () => {
    const { accessToken } = await createCustomer();

    const response = await request(app)
      .patch(`/api/v1/cart/items/${crypto.randomUUID()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({});

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject unauthenticated request", async () => {
    const response = await request(app)
      .patch(`/api/v1/cart/items/${crypto.randomUUID()}`)
      .send({
        quantity: 5,
      });

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });
});
