import request from "supertest";

import app from "../../src/app";
import pool from "../../src/config/postgres";

import { createAdmin, createCustomer } from "../helpers/auth";
import { clearDatabase, closeDatabase } from "../helpers/database";

describe("PATCH /api/v1/products/:id", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("should update product successfully", async () => {
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
        description,
        price,
        stock
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING id;
      `,
      [categoryId, "SKU-001", "Laptop", "Gaming Laptop", "1000.00", 10],
    );

    const productId = productResult.rows[0].id;

    // Act
    const response = await request(app)
      .patch(`/api/v1/products/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "MacBook Pro",
        price: "2500.00",
        stock: 5,
      });

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe("Product updated successfully");

    const result = await pool.query(
      `
      SELECT *
      FROM products
      WHERE id = $1;
      `,
      [productId],
    );

    expect(result.rows[0].name).toBe("MacBook Pro");
    expect(result.rows[0].price).toBe("2500.00");
    expect(result.rows[0].stock).toBe(5);

    // unchanged
    expect(result.rows[0].sku).toBe("SKU-001");
    expect(result.rows[0].category_id).toBe(categoryId);
  });

  it("should update only provided fields", async () => {
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
      description,
      price,
      stock
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;
    `,
      [categoryId, "SKU-001", "Laptop", "Gaming Laptop", "1000.00", 10],
    );

    const productId = productResult.rows[0].id;

    // Act
    const response = await request(app)
      .patch(`/api/v1/products/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        stock: 50,
      });

    // Assert - HTTP
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    // Assert - Database
    const result = await pool.query(
      `
    SELECT *
    FROM products
    WHERE id = $1;
    `,
      [productId],
    );

    expect(result.rowCount).toBe(1);

    // Updated field
    expect(result.rows[0].stock).toBe(50);

    // Unchanged fields
    expect(result.rows[0].category_id).toBe(categoryId);
    expect(result.rows[0].sku).toBe("SKU-001");
    expect(result.rows[0].name).toBe("Laptop");
    expect(result.rows[0].description).toBe("Gaming Laptop");
    expect(result.rows[0].price).toBe("1000.00");
    expect(result.rows[0].is_active).toBe(true);
  });

  it("should update category successfully", async () => {
    const { accessToken } = await createAdmin();

    const electronics = await pool.query(
      `
    INSERT INTO categories(name)
    VALUES ('Electronics')
    RETURNING id;
    `,
    );

    const grocery = await pool.query(
      `
    INSERT INTO categories(name)
    VALUES ('Groceries')
    RETURNING id;
    `,
    );

    const productResult = await pool.query(
      `
    INSERT INTO products
    (category_id, sku, name, price, stock)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING id;
    `,
      [electronics.rows[0].id, "SKU-001", "Laptop", "1000.00", 10],
    );

    const productId = productResult.rows[0].id;

    const response = await request(app)
      .patch(`/api/v1/products/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        categoryId: grocery.rows[0].id,
      });

    expect(response.status).toBe(200);

    const result = await pool.query(
      `
    SELECT category_id
    FROM products
    WHERE id = $1;
    `,
      [productId],
    );

    expect(result.rows[0].category_id).toBe(grocery.rows[0].id);
  });

  it("should reject duplicate SKU", async () => {
    const { accessToken } = await createAdmin();

    const categoryResult = await pool.query(
      `
    INSERT INTO categories(name)
    VALUES ('Electronics')
    RETURNING id;
    `,
    );

    const categoryId = categoryResult.rows[0].id;

    const product1 = await pool.query(
      `
    INSERT INTO products
    (category_id, sku, name, price, stock)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING id;
    `,
      [categoryId, "SKU-001", "Laptop", "1000.00", 10],
    );

    await pool.query(
      `
    INSERT INTO products
    (category_id, sku, name, price, stock)
    VALUES ($1,$2,$3,$4,$5);
    `,
      [categoryId, "SKU-002", "Phone", "500.00", 5],
    );

    const response = await request(app)
      .patch(`/api/v1/products/${product1.rows[0].id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        sku: "SKU-002",
      });

    expect(response.status).toBe(409);

    expect(response.body.message).toBe("SKU already exists");
  });

  it("should return 404 when product does not exist", async () => {
    const { accessToken } = await createAdmin();

    const response = await request(app)
      .patch(`/api/v1/products/${crypto.randomUUID()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Updated",
      });

    expect(response.status).toBe(404);

    expect(response.body.message).toBe("Product not found");
  });

  it("should return 404 when category does not exist", async () => {
    const { accessToken } = await createAdmin();

    const categoryResult = await pool.query(
      `
    INSERT INTO categories(name)
    VALUES ('Electronics')
    RETURNING id;
    `,
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

    const response = await request(app)
      .patch(`/api/v1/products/${productResult.rows[0].id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        categoryId: crypto.randomUUID(),
      });

    expect(response.status).toBe(404);

    expect(response.body.message).toBe("Category not found");
  });

  it("should reject invalid product ID", async () => {
    const { accessToken } = await createAdmin();

    const response = await request(app)
      .patch("/api/v1/products/invalid-id")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Updated Product",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject empty request body", async () => {
    const { accessToken } = await createAdmin();

    const response = await request(app)
      .patch(`/api/v1/products/${crypto.randomUUID()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
  it("should reject invalid price", async () => {
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
    INSERT INTO products
      (category_id, sku, name, price, stock)
    VALUES
      ($1,$2,$3,$4,$5)
    RETURNING id;
    `,
      [categoryId, "SKU-001", "Laptop", "1000.00", 10],
    );

    const response = await request(app)
      .patch(`/api/v1/products/${productResult.rows[0].id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        price: "invalid-price",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject negative stock", async () => {
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
    INSERT INTO products
      (category_id, sku, name, price, stock)
    VALUES
      ($1,$2,$3,$4,$5)
    RETURNING id;
    `,
      [categoryId, "SKU-001", "Laptop", "1000.00", 10],
    );

    const response = await request(app)
      .patch(`/api/v1/products/${productResult.rows[0].id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        stock: -1,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject unauthenticated request", async () => {
    const response = await request(app)
      .patch(`/api/v1/products/${crypto.randomUUID()}`)
      .send({
        name: "Updated Product",
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should reject customer role", async () => {
    const { accessToken } = await createCustomer();

    const response = await request(app)
      .patch(`/api/v1/products/${crypto.randomUUID()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Updated Product",
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
});
