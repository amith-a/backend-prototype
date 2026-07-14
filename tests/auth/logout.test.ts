import request from "supertest";

import app from "../../src/app";
import pool from "../../src/config/postgres";
import { clearDatabase, closeDatabase } from "../helpers/database";

describe("POST /api/v1/auth/logout", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("should logout successfully", async () => {
    // Arrange
    const agent = request.agent(app);

    const payload = {
      name: "Sam",
      email: `sam-${Date.now()}@example.com`,
      password: "Password@123",
    };

    const registerResponse = await agent
      .post("/api/v1/auth/register")
      .send(payload);

    expect(registerResponse.status).toBe(201);

    const loginResponse = await agent.post("/api/v1/auth/login").send({
      email: payload.email,
      password: payload.password,
    });

    expect(loginResponse.status).toBe(200);

    const userId = loginResponse.body.data.user.id;

    // Act
    const response = await agent.post("/api/v1/auth/logout");

    // Assert
    expect(response.status).toBe(204);

    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringContaining("refreshToken=")]),
    );

    // Assert - Database
    const result = await pool.query(
      `
        SELECT revoked_at
        FROM refresh_sessions
        WHERE user_id = $1
      `,
      [userId],
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].revoked_at).not.toBeNull();
  });

  it("should clear refresh cookie when refresh token is missing", async () => {
    // Act
    const response = await request(app).post("/api/v1/auth/logout");

    // Assert
    expect(response.status).toBe(204);

    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringContaining("refreshToken=")]),
    );
  });

  it("should ignore invalid refresh token", async () => {
    // Act
    const response = await request(app)
      .post("/api/v1/auth/logout")
      .set("Cookie", "refreshToken=invalid-refresh-token");

    // Assert
    expect(response.status).toBe(204);

    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringContaining("refreshToken=")]),
    );
  });

  it("should ignore already revoked refresh token", async () => {
    // Arrange
    const agent = request.agent(app);

    const payload = {
      name: "Sam",
      email: `sam-${Date.now()}@example.com`,
      password: "Password@123",
    };

    const registerResponse = await agent
      .post("/api/v1/auth/register")
      .send(payload);

    expect(registerResponse.status).toBe(201);

    const loginResponse = await agent.post("/api/v1/auth/login").send({
      email: payload.email,
      password: payload.password,
    });

    expect(loginResponse.status).toBe(200);

    const userId = loginResponse.body.data.user.id;

    await pool.query(
      `
        UPDATE refresh_sessions
        SET revoked_at = NOW()
        WHERE user_id = $1
      `,
      [userId],
    );

    // Act
    const response = await agent.post("/api/v1/auth/logout");

    // Assert
    expect(response.status).toBe(204);

    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringContaining("refreshToken=")]),
    );
  });
});
