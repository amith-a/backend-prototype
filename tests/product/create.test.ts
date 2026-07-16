import request from "supertest";

import app from "../../src/app";
import pool from "../../src/config/postgres";

import { createAdmin, createCustomer } from "../helpers/auth";
import { clearDatabase, closeDatabase } from "../helpers/database";

describe("POST /api/v1/products", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("should create product successfully", async () => {
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

    // Act
    const response = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        categoryId,
        sku: "IPHONE-001",
        name: "iPhone 16",
        description: "Latest iPhone",
        price: "999.99",
        stock: 10,
      });

    // Assert - HTTP Response
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Product created successfully");

    // Assert - Database
    const result = await pool.query(
      `
      SELECT *
      FROM products
      WHERE id = $1;
      `,
      [response.body.data.id],
    );

    expect(result.rowCount).toBe(1);

    expect(result.rows[0].category_id).toBe(categoryId);
    expect(result.rows[0].sku).toBe("IPHONE-001");
    expect(result.rows[0].name).toBe("iPhone 16");
    expect(result.rows[0].description).toBe("Latest iPhone");
    expect(result.rows[0].price).toBe("999.99");
    expect(result.rows[0].stock).toBe(10);
    expect(result.rows[0].is_active).toBe(true);
  });

  it("should reject duplicate SKU", async () => {
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

    await pool.query(
      `
      INSERT INTO products (
        category_id,
        sku,
        name,
        price,
        stock
      )
      VALUES ($1, $2, $3, $4, $5);
      `,
      [categoryId, "IPHONE-001", "Existing Product", "999.99", 10],
    );

    // Act
    const response = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        categoryId,
        sku: "IPHONE-001",
        name: "New Product",
        price: "1200.00",
        stock: 5,
      });

    // Assert
    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("SKU already exists");
  });

  it("should return 404 when category does not exist", async () => {
    const { accessToken } = await createAdmin();

    const response = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        categoryId: crypto.randomUUID(),
        sku: "IPHONE-001",
        name: "iPhone",
        price: "999.99",
        stock: 5,
      });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Category not found");
  });

  it("should reject invalid category ID", async () => {
    const { accessToken } = await createAdmin();

    const response = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        categoryId: "invalid-id",
        sku: "IPHONE-001",
        name: "iPhone",
        price: "999.99",
        stock: 5,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject missing required fields", async () => {
    const { accessToken } = await createAdmin();

    const response = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject invalid price", async () => {
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

    const response = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        categoryId,
        sku: "IPHONE-001",
        name: "iPhone",
        price: "invalid-price",
        stock: 5,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject negative stock", async () => {
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

    const response = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        categoryId,
        sku: "IPHONE-001",
        name: "iPhone",
        price: "999.99",
        stock: -1,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject unauthenticated request", async () => {
    const response = await request(app).post("/api/v1/products").send({});

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should reject customer role", async () => {
    const { accessToken } = await createCustomer();

    const response = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({});

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
});
