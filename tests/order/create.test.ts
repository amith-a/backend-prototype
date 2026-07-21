import request from "supertest";

import app from "../../src/app";
import pool from "../../src/config/postgres";

import { createCustomer } from "../helpers/auth";

describe("POST /api/v1/orders", () => {
  it("should create order successfully", async () => {
    // Arrange
    const { accessToken, user } = await createCustomer();

    const categoryResult = await pool.query(`
    INSERT INTO categories (name)
    VALUES ('Electronics')
    RETURNING id;
  `);

    const categoryId = categoryResult.rows[0].id;

    const productResult = await pool.query(
      `
      INSERT INTO products
      (category_id, sku, name, price, stock)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `,
      [categoryId, "SKU-001", "Laptop", "1000.00", 10],
    );

    const productId = productResult.rows[0].id;

    const cartResult = await pool.query(
      `
      INSERT INTO carts (user_id)
      VALUES ($1)
      RETURNING id;
    `,
      [user.id],
    );

    const cartId = cartResult.rows[0].id;

    await pool.query(
      `
      INSERT INTO cart_items
      (cart_id, product_id, quantity)
      VALUES ($1, $2, $3);
    `,
      [cartId, productId, 2],
    );

    // Act
    const response = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toMatchObject({
      userId: user.id,
      status: "PENDING",
      totalAmount: 2000,
    });

    const orderId = response.body.data.id;

    const orderResult = await pool.query(`SELECT * FROM orders WHERE id = $1`, [
      orderId,
    ]);

    expect(orderResult.rowCount).toBe(1);

    const orderItemsResult = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [orderId],
    );

    expect(orderItemsResult.rowCount).toBe(1);

    expect(orderItemsResult.rows[0]).toMatchObject({
      product_id: productId,
      quantity: 2,
    });

    const stockResult = await pool.query(
      `SELECT stock FROM products WHERE id = $1`,
      [productId],
    );

    expect(stockResult.rows[0].stock).toBe(8);

    const cartItemsResult = await pool.query(
      `SELECT * FROM cart_items WHERE cart_id = $1`,
      [cartId],
    );

    expect(cartItemsResult.rowCount).toBe(0);
  });

  it("should create order with multiple items", async () => {
    // Arrange
    const { accessToken, user } = await createCustomer();

    const categoryResult = await pool.query(`
    INSERT INTO categories (name)
    VALUES ('Electronics')
    RETURNING id;
  `);

    const categoryId = categoryResult.rows[0].id;

    const product1Result = await pool.query(
      `
      INSERT INTO products
      (category_id, sku, name, price, stock)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `,
      [categoryId, "SKU-001", "Laptop", "1000.00", 10],
    );

    const product2Result = await pool.query(
      `
      INSERT INTO products
      (category_id, sku, name, price, stock)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `,
      [categoryId, "SKU-002", "Mouse", "500.00", 20],
    );

    const product1Id = product1Result.rows[0].id;
    const product2Id = product2Result.rows[0].id;

    const cartResult = await pool.query(
      `
      INSERT INTO carts (user_id)
      VALUES ($1)
      RETURNING id;
    `,
      [user.id],
    );

    const cartId = cartResult.rows[0].id;

    await pool.query(
      `
      INSERT INTO cart_items
      (cart_id, product_id, quantity)
      VALUES
        ($1, $2, $3),
        ($1, $4, $5);
    `,
      [cartId, product1Id, 2, product2Id, 3],
    );

    // Act
    const response = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data.totalAmount).toBe(3500);

    const orderId = response.body.data.id;

    const itemsResult = await pool.query(
      `
      SELECT *
      FROM order_items
      WHERE order_id = $1
      ORDER BY product_id;
    `,
      [orderId],
    );

    expect(itemsResult.rowCount).toBe(2);

    const stockResult = await pool.query(
      `
      SELECT id, stock
      FROM products
      ORDER BY id;
    `,
    );

    expect(stockResult.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: product1Id,
          stock: 8,
        }),
        expect.objectContaining({
          id: product2Id,
          stock: 17,
        }),
      ]),
    );

    const cartItemsResult = await pool.query(
      `
      SELECT *
      FROM cart_items
      WHERE cart_id = $1;
    `,
      [cartId],
    );

    expect(cartItemsResult.rowCount).toBe(0);
  });

  it("should return 400 when cart is empty", async () => {
    // Arrange
    const { accessToken, user } = await createCustomer();

    await pool.query(
      `
      INSERT INTO carts (user_id)
      VALUES ($1);
    `,
      [user.id],
    );

    // Act
    const response = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "Cart is empty",
    });

    const orderResult = await pool.query(`
    SELECT *
    FROM orders;
  `);

    expect(orderResult.rowCount).toBe(0);

    const orderItemsResult = await pool.query(`
    SELECT *
    FROM order_items;
  `);

    expect(orderItemsResult.rowCount).toBe(0);
  });

  it("should return 400 when stock is insufficient", async () => {
    // Arrange
    const { accessToken, user } = await createCustomer();

    const categoryResult = await pool.query(`
    INSERT INTO categories (name)
    VALUES ('Electronics')
    RETURNING id;
  `);

    const categoryId = categoryResult.rows[0].id;

    const productResult = await pool.query(
      `
      INSERT INTO products
      (category_id, sku, name, price, stock)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `,
      [categoryId, "SKU-001", "Laptop", "1000.00", 1],
    );

    const productId = productResult.rows[0].id;

    const cartResult = await pool.query(
      `
      INSERT INTO carts (user_id)
      VALUES ($1)
      RETURNING id;
    `,
      [user.id],
    );

    const cartId = cartResult.rows[0].id;

    await pool.query(
      `
      INSERT INTO cart_items
      (cart_id, product_id, quantity)
      VALUES ($1, $2, $3);
    `,
      [cartId, productId, 2],
    );

    // Act
    const response = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "Insufficient stock",
    });

    const orderResult = await pool.query(`
    SELECT *
    FROM orders;
  `);

    expect(orderResult.rowCount).toBe(0);

    const orderItemsResult = await pool.query(`
    SELECT *
    FROM order_items;
  `);

    expect(orderItemsResult.rowCount).toBe(0);

    const stockResult = await pool.query(
      `
      SELECT stock
      FROM products
      WHERE id = $1;
    `,
      [productId],
    );

    expect(stockResult.rows[0].stock).toBe(1);

    const cartItemsResult = await pool.query(
      `
      SELECT *
      FROM cart_items
      WHERE cart_id = $1;
    `,
      [cartId],
    );

    expect(cartItemsResult.rowCount).toBe(1);
  });

  it("should reject unauthenticated request", async () => {
    // Act
    const response = await request(app).post("/api/v1/orders");

    // Assert
    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      success: false,
      message: "Unauthorized",
    });

    const ordersResult = await pool.query(`
    SELECT *
    FROM orders;
  `);

    expect(ordersResult.rowCount).toBe(0);

    const orderItemsResult = await pool.query(`
    SELECT *
    FROM order_items;
  `);

    expect(orderItemsResult.rowCount).toBe(0);
  });
});
