import request from "supertest";

import app from "../../src/app";
import pool from "../../src/config/postgres";

import { createCustomer } from "../helpers/auth";

import { clearDatabase, closeDatabase } from "../helpers/database";
import { randomUUID } from "crypto";

describe("GET /api/v1/orders/:id", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("should return order details", async () => {
    // Arrange
    const { accessToken, user } = await createCustomer();

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
        price,
        stock
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `,
      [categoryId, "SKU-001", "Laptop", 1000, 10],
    );

    const productId = productResult.rows[0].id;

    const orderResult = await pool.query(
      `
      INSERT INTO orders (
        user_id,
        status,
        total_amount
      )
      VALUES ($1, $2, $3)
      RETURNING id;
    `,
      [user.id, "PENDING", 2000],
    );

    const orderId = orderResult.rows[0].id;

    await pool.query(
      `
      INSERT INTO order_items (
        order_id,
        product_id,
        quantity,
        unit_price,
        subtotal
      )
      VALUES ($1, $2, $3, $4, $5);
    `,
      [orderId, productId, 2, 1000, 2000],
    );

    // Act
    const response = await request(app)
      .get(`/api/v1/orders/${orderId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.data).toMatchObject({
      id: orderId,
      userId: user.id,
      status: "PENDING",
      totalAmount: 2000,
    });

    expect(response.body.data.items).toHaveLength(1);

    expect(response.body.data.items[0]).toMatchObject({
      productId,
      productName: "Laptop",
      quantity: 2,
      unitPrice: 1000,
      subtotal: 2000,
    });
  });

  it("should return 404 when order does not exist", async () => {
    // Arrange
    const { accessToken } = await createCustomer();

    const nonExistentOrderId = randomUUID();

    // Act
    const response = await request(app)
      .get(`/api/v1/orders/${nonExistentOrderId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      success: false,
      message: "Order not found",
    });
  });

  it("should return 404 when accessing another user's order", async () => {
    // Arrange
    const { accessToken } = await createCustomer();
    const { user: anotherUser } = await createCustomer();

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
        price,
        stock
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `,
      [categoryId, "SKU-001", "Laptop", 1000, 10],
    );

    const productId = productResult.rows[0].id;

    const orderResult = await pool.query(
      `
      INSERT INTO orders (
        user_id,
        status,
        total_amount
      )
      VALUES ($1, $2, $3)
      RETURNING id;
    `,
      [anotherUser.id, "PENDING", 2000],
    );

    const orderId = orderResult.rows[0].id;

    await pool.query(
      `
      INSERT INTO order_items (
        order_id,
        product_id,
        quantity,
        unit_price,
        subtotal
      )
      VALUES ($1, $2, $3, $4, $5);
    `,
      [orderId, productId, 2, 1000, 2000],
    );

    // Act
    const response = await request(app)
      .get(`/api/v1/orders/${orderId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      success: false,
      message: "Order not found",
    });
  });

  it("should reject unauthenticated request", async () => {
    // Arrange
    const orderId = randomUUID();

    // Act
    const response = await request(app).get(`/api/v1/orders/${orderId}`);

    // Assert
    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      success: false,
      message: "Unauthorized",
    });
  });
});
