import request from "supertest";

import app from "../../src/app";
import pool from "../../src/config/postgres";

import { clearDatabase, closeDatabase } from "../helpers/database";
import { createAdmin, createCustomer } from "../helpers/auth";

describe("POST /api/v1/categories", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("should create category successfully", async () => {
    // Arrange
    const { accessToken } = await createAdmin();

    const payload = {
      name: "Electronics",
    };

    // Act
    const response = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(payload);

    // Assert - HTTP Response
    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: payload.name,
        isActive: true,
      }),
    );

    // Assert - Database
    const result = await pool.query(
      `
      SELECT
        name,
        is_active
      FROM categories
      WHERE id = $1;
      `,
      [response.body.data.id],
    );

    expect(result.rowCount).toBe(1);

    expect(result.rows[0]).toEqual(
      expect.objectContaining({
        name: payload.name,
        is_active: true,
      }),
    );
  });

  it("should reject duplicate category name", async () => {
    // Arrange
    const { accessToken } = await createAdmin();

    const payload = {
      name: "Electronics",
    };

    await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(payload);

    // Act
    const response = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(payload);

    // Assert
    expect(response.status).toBe(409);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Category already exists");
  });

  it("should reject missing category name", async () => {
    // Arrange
    const { accessToken } = await createAdmin();

    // Act
    const response = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({});

    // Assert
    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject empty category name", async () => {
    // Arrange
    const { accessToken } = await createAdmin();

    // Act
    const response = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "",
      });

    // Assert
    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject category name longer than 100 characters", async () => {
    // Arrange
    const { accessToken } = await createAdmin();

    // Act
    const response = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "A".repeat(101),
      });

    // Assert
    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject missing access token", async () => {
    // Act
    const response = await request(app).post("/api/v1/categories").send({
      name: "Electronics",
    });

    // Assert
    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Unauthorized");
  });

  it("should reject invalid access token", async () => {
    // Act
    const response = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", "Bearer invalid-token")
      .send({
        name: "Electronics",
      });

    // Assert
    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Unauthorized");
  });

  it("should reject customer role", async () => {
    // Arrange
    const { accessToken } = await createCustomer();

    // Act
    const response = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Electronics",
      });

    // Assert
    expect(response.status).toBe(403);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Forbidden");
  });
});
