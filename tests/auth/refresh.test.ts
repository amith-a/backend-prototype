// Starter refresh.test.ts
import request from "supertest";
import app from "../../src/app";
import { clearDatabase, closeDatabase } from "../helpers/database";
import pool from "../../src/config/postgres";

describe("POST /api/v1/auth/refresh", () => {
  beforeEach(async () => {
    await clearDatabase();
  });
  afterAll(async () => {
    await closeDatabase();
  });

  it("should refresh access token successfully", async () => {
    // Arrange
    const agent = request.agent(app);

    const payload = {
      name: "Sam",
      email: `sam-${Date.now()}@example.com`,
      password: "Password@123",
    };

    // Register
    const registerResponse = await agent
      .post("/api/v1/auth/register")
      .send(payload);

    expect(registerResponse.status).toBe(201);

    // Login
    const loginResponse = await agent.post("/api/v1/auth/login").send({
      email: payload.email,
      password: payload.password,
    });

    expect(loginResponse.status).toBe(200);

    const userId = loginResponse.body.data.user.id;

    // Act
    const refreshResponse = await agent.post("/api/v1/auth/refresh");

    // Assert - HTTP Response
    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body.success).toBe(true);

    expect(refreshResponse.body.data.accessToken).toEqual(expect.any(String));

    // Assert - Cookie
    expect(refreshResponse.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringContaining("refreshToken=")]),
    );

    // Assert - Database
    const result = await pool.query(
      `
      SELECT *
      FROM refresh_sessions
      WHERE user_id = $1
      ORDER BY created_at;
    `,
      [userId],
    );

    expect(result.rows).toHaveLength(2);

    const activeSessions = result.rows.filter((row) => row.revoked_at === null);

    const revokedSessions = result.rows.filter(
      (row) => row.revoked_at !== null,
    );

    expect(activeSessions).toHaveLength(1);
    expect(revokedSessions).toHaveLength(1);
  });

  it("should reject missing refresh token", async () => {
    // Act
    const response = await request(app).post("/api/v1/auth/refresh");

    // Assert
    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Refresh token missing");
  });

  it("should reject invalid refresh token", async () => {
    // Act
    const response = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", "refreshToken=invalid-refresh-token");

    // Assert
    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Invalid refresh token");
  });

  it("should reject revoked refresh token", async () => {
    // Arrange
    const agent = request.agent(app);

    const payload = {
      name: "Sam",
      email: `sam-${Date.now()}@example.com`,
      password: "Password@123",
    };

    // Register
    const registerResponse = await agent
      .post("/api/v1/auth/register")
      .send(payload);

    expect(registerResponse.status).toBe(201);

    // Login
    const loginResponse = await agent.post("/api/v1/auth/login").send({
      email: payload.email,
      password: payload.password,
    });

    expect(loginResponse.status).toBe(200);

    const userId = loginResponse.body.data.user.id;

    // Revoke the refresh session
    await pool.query(
      `
      UPDATE refresh_sessions
      SET revoked_at = NOW()
      WHERE user_id = $1
    `,
      [userId],
    );

    // Act
    const response = await agent.post("/api/v1/auth/refresh");

    // Assert
    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Refresh token revoked");
  });

  it("should reject expired refresh token", async () => {
    // Arrange
    const agent = request.agent(app);

    const payload = {
      name: "Sam",
      email: `sam-${Date.now()}@example.com`,
      password: "Password@123",
    };

    // Register
    const registerResponse = await agent
      .post("/api/v1/auth/register")
      .send(payload);

    expect(registerResponse.status).toBe(201);

    // Login
    const loginResponse = await agent.post("/api/v1/auth/login").send({
      email: payload.email,
      password: payload.password,
    });

    expect(loginResponse.status).toBe(200);

    const userId = loginResponse.body.data.user.id;

    // Expire the refresh session
    await pool.query(
      `
      UPDATE refresh_sessions
      SET expires_at = NOW() - INTERVAL '1 minute'
      WHERE user_id = $1
    `,
      [userId],
    );

    // Act
    const response = await agent.post("/api/v1/auth/refresh");

    // Assert
    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Refresh token expired");
  });
});
