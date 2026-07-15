import request from "supertest";

import app from "../../src/app";

import { clearDatabase, closeDatabase } from "../helpers/database";
import { createAdmin } from "../helpers/auth";

describe("POST /api/v1/categories", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("should return category by id", async () => {
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
      .get(`/api/v1/categories/${createResponse.body.data.id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toEqual(
      expect.objectContaining({
        id: createResponse.body.data.id,
        name: "Electronics",
        isActive: true,
      }),
    );
  });

  it("should return 404 when category does not exist", async () => {
    // Arrange
    const { accessToken } = await createAdmin();

    // Act
    const response = await request(app)
      .get("/api/v1/categories/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Category not found");
  });

  it("should reject invalid category id", async () => {
    // Arrange
    const { accessToken } = await createAdmin();

    // Act
    const response = await request(app)
      .get("/api/v1/categories/invalid-id")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject missing access token", async () => {
    // Act
    const response = await request(app).get(
      "/api/v1/categories/00000000-0000-0000-0000-000000000000",
    );

    // Assert
    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Unauthorized");
  });
});
