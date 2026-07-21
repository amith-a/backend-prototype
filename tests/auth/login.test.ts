import request from "supertest";

import app from "../../src/app";
import pool from "../../src/config/postgres";

describe("POST /api/v1/auth/login", () => {
  it("should login successfully", async () => {
    // Arrange
    const payload = {
      name: "Sam",
      email: `sam-${Date.now()}@example.com`,
      password: "Password@123",
    };

    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send(payload);

    expect(registerResponse.status).toBe(201);

    // Act
    const response = await request(app).post("/api/v1/auth/login").send({
      email: payload.email,
      password: payload.password,
    });

    // Assert - HTTP
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.data.accessToken).toEqual(expect.any(String));

    expect(response.body.data.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: payload.name,
        email: payload.email,
        roleId: 2,
      }),
    );

    // Assert - Cookie
    expect(response.headers["set-cookie"]).toBeDefined();

    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringContaining("refreshToken=")]),
    );

    // Assert - Refresh Session
    const result = await pool.query(
      `
      SELECT *
      FROM refresh_sessions
      WHERE user_id = $1
      `,
      [response.body.data.user.id],
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].revoked_at).toBeNull();
    expect(result.rows[0].token_hash).toBeDefined();
  });

  it("should reject unknown email", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: `unknown-${Date.now()}@example.com`,
        password: "Password@123",
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid email or password");

    expect(response.headers["set-cookie"]).toBeUndefined();
  });

  it("should reject invalid password", async () => {
    const payload = {
      name: "Sam",
      email: `sam-${Date.now()}@example.com`,
      password: "Password@123",
    };

    await request(app).post("/api/v1/auth/register").send(payload);

    const response = await request(app).post("/api/v1/auth/login").send({
      email: payload.email,
      password: "WrongPassword@123",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid email or password");

    expect(response.headers["set-cookie"]).toBeUndefined();

    const result = await pool.query(
      `
      SELECT *
      FROM refresh_sessions
      WHERE user_id IN (
        SELECT id
        FROM users
        WHERE email = $1
      )
      `,
      [payload.email],
    );

    expect(result.rows).toHaveLength(0);
  });

  it("should reject missing email", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "",
      password: "Password@123",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject missing password", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: `sam-${Date.now()}@example.com`,
        password: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
