import request from "supertest";
import app from "../src/app";

describe("Health API", () => {
  describe("GET /api/v1/health", () => {
    it("should return application health status", async () => {
      // Arrange

      // Act
      const response = await request(app).get("/api/v1/health");

      // Assert
      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        status: "UP",
        timestamp: expect.any(String),
      });

      expect(response.headers["content-type"]).toContain("application/json");
    });
  });
});