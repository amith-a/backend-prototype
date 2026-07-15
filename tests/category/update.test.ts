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

  it("should update category name", async () => {
    // Arrange
    const { accessToken } = await createAdmin();

    const createResponse = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Electronics",
      });

    // Act
    const response = await request(app)
      .patch(`/api/v1/categories/${createResponse.body.data.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Home Electronics",
      });

    // Assert - HTTP Response
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toEqual(
      expect.objectContaining({
        id: createResponse.body.data.id,
        name: "Home Electronics",
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
      [createResponse.body.data.id],
    );

    expect(result.rowCount).toBe(1);

    expect(result.rows[0]).toEqual(
      expect.objectContaining({
        name: "Home Electronics",
        is_active: true,
      }),
    );
  });

  it("should reject duplicate category name", async () => {
    // Arrange
    const { accessToken } = await createAdmin();

    const electronics = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Electronics",
      });

    await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Furniture",
      });

    // Act
    const response = await request(app)
      .patch(`/api/v1/categories/${electronics.body.data.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Furniture",
      });

    // Assert
    expect(response.status).toBe(409);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Category already exists");
  });

  it("should reject duplicate category name", async () => {
    // Arrange
    const { accessToken } = await createAdmin();

    const electronics = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Electronics",
      });

    await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Furniture",
      });

    // Act
    const response = await request(app)
      .patch(`/api/v1/categories/${electronics.body.data.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Furniture",
      });

    // Assert
    expect(response.status).toBe(409);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Category already exists");
  });

  it("should return 404 when category does not exist", async () => {
    // Arrange
    const { accessToken } = await createAdmin();

    // Act
    const response = await request(app)
      .patch("/api/v1/categories/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Electronics",
      });

    // Assert
    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Category not found");
  });

  it("should reject missing access token", async () => {
    // Act
    const response = await request(app)
      .patch("/api/v1/categories/00000000-0000-0000-0000-000000000000")
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

    const { accessToken: adminToken } = await createAdmin();

    const createResponse = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Electronics",
      });

    // Act
    const response = await request(app)
      .patch(`/api/v1/categories/${createResponse.body.data.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Home Electronics",
      });

    // Assert
    expect(response.status).toBe(403);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Forbidden");
  });
});
