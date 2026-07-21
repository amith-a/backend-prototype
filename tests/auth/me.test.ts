// Starter me.test.ts
import request from "supertest";
import app from "../../src/app";

describe("GET /api/v1/auth/me", () => {
  it("should return current authenticated user", async () => {
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

    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: payload.email,
      password: payload.password,
    });

    expect(loginResponse.status).toBe(200);

    const accessToken = loginResponse.body.data.accessToken;
    const user = loginResponse.body.data.user;

    // Act
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.data).toEqual(
      expect.objectContaining({
        id: user.id,
        name: payload.name,
        email: payload.email,
        role: expect.any(String), // or roleId depending on your API
      }),
    );
  });

  it("should reject missing access token", async () => {
    // Act
    const response = await request(app).get("/api/v1/auth/me");

    // Assert
    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Unauthorized");
  });

  it("should reject invalid access token", async () => {
    // Act
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer invalid-access-token");

    // Assert
    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Unauthorized");
  });
});
