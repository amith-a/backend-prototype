import request from "supertest";

import app from "../../src/app";
import pool from "../../src/config/postgres";


import { createAdmin } from "../helpers/auth";

describe("POST /api/v1/categories", () => {
  

  

  it("should delete category successfully", async () => {
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
      .delete(`/api/v1/categories/${createResponse.body.data.id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert - HTTP Response
    expect(response.status).toBe(204);

    // Assert - Database
    const result = await pool.query(
      `
      SELECT id
      FROM categories
      WHERE id = $1;
    `,
      [createResponse.body.data.id],
    );

    expect(result.rowCount).toBe(0);
  });

  it("should return 404 when category does not exist", async () => {
    // Arrange
    const { accessToken } = await createAdmin();

    // Act
    const response = await request(app)
      .delete("/api/v1/categories/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Category not found");
  });

  it("should reject missing access token", async () => {
    // Act
    const response = await request(app).delete(
      "/api/v1/categories/00000000-0000-0000-0000-000000000000",
    );

    // Assert
    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Unauthorized");
  });
  it("should reject missing access token", async () => {
    // Act
    const response = await request(app).delete(
      "/api/v1/categories/00000000-0000-0000-0000-000000000000",
    );

    // Assert
    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Unauthorized");
  });
});
