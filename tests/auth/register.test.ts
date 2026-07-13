import request from "supertest";

import app from "../../src/app";
import pool from "../../src/config/postgres";
import { clearDatabase, closeDatabase } from "../helpers/database";

describe("POST /api/v1/auth/register", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("should register a new user successfully", async () => {
    // Arrange
    const payload = {
      name: "Sam",
      email: `sam-${Date.now()}@example.com`,
      password: "Password@123",
    };

    // Act
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(payload);

    // Assert - HTTP Response
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    expect(response.body.data).toEqual(
      expect.objectContaining({
        name: payload.name,
        email: payload.email,
      }),
    );

    // Assert - Database
    const result = await pool.query(
      `
        SELECT *
        FROM users
        WHERE email = $1
      `,
      [payload.email],
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].name).toBe(payload.name);
    expect(result.rows[0].email).toBe(payload.email);

    // Password should be hashed
    expect(result.rows[0].password_hash).not.toBe(payload.password);
  });

  it("should reject duplicate email", async () => {
    // Arrange
    const payload = {
      name: "Sam",
      email: `sam-${Date.now()}@example.com`,
      password: "Password@123",
    };

    // First registration
    const firstResponse = await request(app)
      .post("/api/v1/auth/register")
      .send(payload);

    expect(firstResponse.status).toBe(201);

    // Act - Register again with the same email
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(payload);

    // Assert - HTTP Response
    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Email already exists");


    // Assert - Database
    const result = await pool.query(
      `
        SELECT *
        FROM users
        WHERE email = $1
      `,
      [payload.email],
    );

    expect(result.rows).toHaveLength(1);
  });

  it("should reject invalid email", async () => {
    // Arrange
    const payload = {
      name: "Sam",
      email: "samexample.com",
      password: "Password@123",
    };

    // Act
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(payload);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject missing password", async () => {
    // Arrange
    const payload = {
      name: "Sam",
      email: `sam-${Date.now()}@example.com`,
      password: "",
    };

    // Act
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(payload);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject missing name", async () => {
    // Arrange
    const payload = {
      name: "",
      email: `sam-${Date.now()}@example.com`,
      password: "Password@123",
    };

    // Act
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(payload);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});