import request from "supertest";
import app from "../src/app";

describe("GET /api/v1/health", () => {
  it("should return application health status", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: "UP",
      timestamp: expect.any(String),
    });
  });
});
