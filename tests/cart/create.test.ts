import request from "supertest";

import app from "../../src/app";
import pool from "../../src/config/postgres";

import { createCustomer } from "../helpers/auth";
import { clearDatabase, closeDatabase } from "../helpers/database";

describe("POST /api/v1/cart/items", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("should add item to cart successfully", async () => {
    // Arrange
    const { accessToken } = await createCustomer();

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
      .post("/api/v1/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId,
        quantity: 2,
      });

    // Assert - HTTP
    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe("Item added to cart");

    // Assert - Database
    const cartResult = await pool.query(
      `
      SELECT *
      FROM carts;
      `,
    );

    expect(cartResult.rowCount).toBe(1);

    const cartId = cartResult.rows[0].id;

    const itemResult = await pool.query(
      `
      SELECT *
      FROM cart_items
      WHERE cart_id = $1;
      `,
      [cartId],
    );

    expect(itemResult.rowCount).toBe(1);

    expect(itemResult.rows[0].product_id).toBe(productId);
    expect(itemResult.rows[0].quantity).toBe(2);
  });

  it("should increase quantity when product already exists", async () => {
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
      .post("/api/v1/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId,
        quantity: 3,
      });

    // Assert
    expect(response.status).toBe(201);

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

  it("should return 404 when product does not exist", async () => {
    const { accessToken } = await createCustomer();

    const response = await request(app)
      .post("/api/v1/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId: crypto.randomUUID(),
        quantity: 1,
      });

    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Product not found");
  });

  it("should reject invalid product ID", async () => {
    const { accessToken } = await createCustomer();

    const response = await request(app)
      .post("/api/v1/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId: "invalid-id",
        quantity: 1,
      });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject invalid quantity", async () => {
    const { accessToken } = await createCustomer();

    const response = await request(app)
      .post("/api/v1/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId: crypto.randomUUID(),
        quantity: 0,
      });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject missing required fields", async () => {
    const { accessToken } = await createCustomer();

    const response = await request(app)
      .post("/api/v1/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({});

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject unauthenticated request", async () => {
    const response = await request(app).post("/api/v1/cart/items").send({});

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });
});
