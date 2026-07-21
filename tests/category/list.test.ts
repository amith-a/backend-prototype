import request from "supertest";

import app from "../../src/app";

import { createAdmin } from "../helpers/auth";

describe("POST /api/v1/categories", () => {
  it("should return all categories", async () => {
    // Arrange
    const { accessToken } = await createAdmin();

    await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: "Electronics" });

    await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: "Furniture" });

    // Act
    const response = await request(app)
      .get("/api/v1/categories")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toHaveLength(2);

    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Electronics",
        }),
        expect.objectContaining({
          name: "Furniture",
        }),
      ]),
    );
  });

  it("should return empty array when no categories exist", async () => {
    // Arrange
    const { accessToken } = await createAdmin();

    // Act
    const response = await request(app)
      .get("/api/v1/categories")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toEqual([]);
  });

  it("should reject missing access token", async () => {
    // Act
    const response = await request(app).get("/api/v1/categories");

    // Assert
    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Unauthorized");
  });
});
