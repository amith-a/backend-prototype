import request from "supertest";

import app from "../../src/app";
import pool from "../../src/config/postgres";

import { createAdmin } from "../helpers/auth";

import { Product } from "../../src/types/product.types";

describe("GET /api/v1/products", () => {
  

  

  it("should return paginated products", async () => {
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

    for (let i = 1; i <= 15; i++) {
      await pool.query(
        `
        INSERT INTO products (
          category_id,
          sku,
          name,
          price,
          stock
        )
        VALUES ($1,$2,$3,$4,$5);
        `,
        [categoryId, `SKU-${i}`, `Product ${i}`, "100.00", 10],
      );
    }

    // Act
    const response = await request(app)
      .get("/api/v1/products?page=1&limit=10")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toHaveLength(10);

    expect(response.body.page).toBe(1);

    expect(response.body.limit).toBe(10);

    expect(response.body.total).toBe(15);

    expect(response.body.totalPages).toBe(2);
  });

  it("should return an empty list when no products exist", async () => {
    // Arrange
    const { accessToken } = await createAdmin();

    // Act
    const response = await request(app)
      .get("/api/v1/products")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toEqual([]);

    expect(response.body.page).toBe(1);

    expect(response.body.limit).toBe(10);

    expect(response.body.total).toBe(0);

    expect(response.body.totalPages).toBe(0);
  });

  it("should search products by name", async () => {
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

    await pool.query(
      `
    INSERT INTO products
    (category_id, sku, name, price, stock)
    VALUES
    ($1,'SKU-1','iPhone 16','1000',10),
    ($1,'SKU-2','Samsung S25','900',10),
    ($1,'SKU-3','iPhone Charger','50',10);
    `,
      [categoryId],
    );

    // Act
    const response = await request(app)
      .get("/api/v1/products?search=iPhone")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.data).toHaveLength(2);

    expect(response.body.total).toBe(2);

    expect(response.body.data[0].name).toContain("iPhone");

    expect(response.body.data[1].name).toContain("iPhone");
  });

  it("should filter products by category", async () => {
    // Arrange
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

    await pool.query(
      `
    INSERT INTO products
    (category_id, sku, name, price, stock)
    VALUES
    ($1,'SKU-1','Laptop','1000',5),
    ($2,'SKU-2','Rice','50',20);
    `,
      [electronics.rows[0].id, grocery.rows[0].id],
    );

    // Act
    const response = await request(app)
      .get(`/api/v1/products?categoryId=${electronics.rows[0].id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.total).toBe(1);

    expect(response.body.data).toHaveLength(1);

    expect(response.body.data[0].name).toBe("Laptop");
  });

  it("should sort products by name ascending", async () => {
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

    await pool.query(
      `
    INSERT INTO products
      (category_id, sku, name, price, stock)
    VALUES
      ($1,'SKU-1','Laptop','1000',10),
      ($1,'SKU-2','Camera','500',10),
      ($1,'SKU-3','Phone','800',10);
    `,
      [categoryId],
    );

    // Act
    const response = await request(app)
      .get("/api/v1/products?sort=name&order=asc")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.data.map((p: Product) => p.name)).toEqual([
      "Camera",
      "Laptop",
      "Phone",
    ]);
  });

  it("should sort products by name descending", async () => {
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

    await pool.query(
      `
    INSERT INTO products
      (category_id, sku, name, price, stock)
    VALUES
      ($1,'SKU-1','Laptop','1000',10),
      ($1,'SKU-2','Camera','500',10),
      ($1,'SKU-3','Phone','800',10);
    `,
      [categoryId],
    );

    const response = await request(app)
      .get("/api/v1/products?sort=name&order=desc")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.data.map((p: Product) => p.name)).toEqual([
      "Phone",
      "Laptop",
      "Camera",
    ]);
  });

  it("should sort products by price ascending", async () => {
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

    await pool.query(
      `
    INSERT INTO products
      (category_id, sku, name, price, stock)
    VALUES
      ($1,'SKU-1','Laptop','1000',10),
      ($1,'SKU-2','Camera','500',10),
      ($1,'SKU-3','Phone','800',10);
    `,
      [categoryId],
    );

    const response = await request(app)
      .get("/api/v1/products?sort=price&order=asc")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.data.map((p: Product) => p.price)).toEqual([
      "500.00",
      "800.00",
      "1000.00",
    ]);
  });

  it("should sort products by price descending", async () => {
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

    await pool.query(
      `
    INSERT INTO products
      (category_id, sku, name, price, stock)
    VALUES
      ($1,'SKU-1','Laptop','1000',10),
      ($1,'SKU-2','Camera','500',10),
      ($1,'SKU-3','Phone','800',10);
    `,
      [categoryId],
    );

    const response = await request(app)
      .get("/api/v1/products?sort=price&order=desc")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.data.map((p: Product) => p.price)).toEqual([
      "1000.00",
      "800.00",
      "500.00",
    ]);
  });

  it("should sort products by createdAt ascending", async () => {
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

    for (const name of ["Product A", "Product B", "Product C"]) {
      await pool.query(
        `
      INSERT INTO products
      (category_id, sku, name, price, stock)
      VALUES ($1, $2, $3, $4, $5);
      `,
        [categoryId, crypto.randomUUID(), name, "100.00", 10],
      );

      await new Promise((resolve) => setTimeout(resolve, 5));
    }

    const response = await request(app)
      .get("/api/v1/products?sort=createdAt&order=asc")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.data.map((p: Product) => p.name)).toEqual([
      "Product A",
      "Product B",
      "Product C",
    ]);
  });

  it("should sort products by createdAt descending", async () => {
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

    for (const name of ["Product A", "Product B", "Product C"]) {
      await pool.query(
        `
      INSERT INTO products
      (category_id, sku, name, price, stock)
      VALUES ($1, $2, $3, $4, $5);
      `,
        [categoryId, crypto.randomUUID(), name, "100.00", 10],
      );

      await new Promise((resolve) => setTimeout(resolve, 5));
    }

    const response = await request(app)
      .get("/api/v1/products?sort=createdAt&order=desc")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.data.map((p: Product) => p.name)).toEqual([
      "Product C",
      "Product B",
      "Product A",
    ]);
  });

  it("should reject invalid page", async () => {
    const { accessToken } = await createAdmin();

    const response = await request(app)
      .get("/api/v1/products?page=0")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject invalid limit", async () => {
    const { accessToken } = await createAdmin();

    const response = await request(app)
      .get("/api/v1/products?limit=101")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject invalid category ID", async () => {
    const { accessToken } = await createAdmin();

    const response = await request(app)
      .get("/api/v1/products?categoryId=invalid")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject invalid sort field", async () => {
    const { accessToken } = await createAdmin();

    const response = await request(app)
      .get("/api/v1/products?sort=invalid")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject invalid order", async () => {
    const { accessToken } = await createAdmin();

    const response = await request(app)
      .get("/api/v1/products?order=invalid")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject unauthenticated request", async () => {
    const response = await request(app).get("/api/v1/products");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
