import request from "supertest";

import app from "../../src/app";
import pool from "../../src/config/postgres";

import { createCustomer } from "../helpers/auth";

describe("GET /api/v1/orders", () => {
  it("should return order history", async () => {
    // Arrange
    const { accessToken, user } = await createCustomer();

    const order1Result = await pool.query(
      `
      INSERT INTO orders (
        user_id,
        status,
        total_amount
      )
      VALUES ($1, $2, $3)
      RETURNING id;
    `,
      [user.id, "PENDING", 1000],
    );

    const order2Result = await pool.query(
      `
      INSERT INTO orders (
        user_id,
        status,
        total_amount
      )
      VALUES ($1, $2, $3)
      RETURNING id;
    `,
      [user.id, "DELIVERED", 2500],
    );

    // Act
    const response = await request(app)
      .get("/api/v1/orders")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.orders).toHaveLength(2);

    expect(response.body.data.pagination).toEqual({
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    expect(response.body.data.orders).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: order1Result.rows[0].id,
          userId: user.id,
          status: "PENDING",
          totalAmount: 1000,
        }),
        expect.objectContaining({
          id: order2Result.rows[0].id,
          userId: user.id,
          status: "DELIVERED",
          totalAmount: 2500,
        }),
      ]),
    );
  });

  it("should return empty order history", async () => {
    // Arrange
    const { accessToken } = await createCustomer();

    // Act
    const response = await request(app)
      .get("/api/v1/orders")
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.orders).toEqual([]);

    expect(response.body.data.pagination).toEqual({
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });
  });

  it("should filter order history by status", async () => {
    // Arrange
    const { accessToken, user } = await createCustomer();

    const pendingOrderResult = await pool.query(
      `
      INSERT INTO orders (
        user_id,
        status,
        total_amount
      )
      VALUES ($1, $2, $3)
      RETURNING id;
    `,
      [user.id, "PENDING", 1000],
    );

    await pool.query(
      `
      INSERT INTO orders (
        user_id,
        status,
        total_amount
      )
      VALUES ($1, $2, $3);
    `,
      [user.id, "DELIVERED", 2000],
    );

    // Act
    const response = await request(app)
      .get("/api/v1/orders")
      .query({
        status: "PENDING",
      })
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.orders).toHaveLength(1);

    expect(response.body.data.orders[0]).toMatchObject({
      id: pendingOrderResult.rows[0].id,
      userId: user.id,
      status: "PENDING",
      totalAmount: 1000,
    });

    expect(response.body.data.pagination).toEqual({
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  it("should filter order history by date range", async () => {
    // Arrange
    const { accessToken, user } = await createCustomer();

    const oldOrderResult = await pool.query(
      `
      INSERT INTO orders (
        user_id,
        status,
        total_amount,
        created_at
      )
      VALUES ($1, $2, $3, NOW() - INTERVAL '10 days')
      RETURNING id;
    `,
      [user.id, "PENDING", 1000],
    );

    const recentOrderResult = await pool.query(
      `
      INSERT INTO orders (
        user_id,
        status,
        total_amount,
        created_at
      )
      VALUES ($1, $2, $3, NOW())
      RETURNING id;
    `,
      [user.id, "DELIVERED", 2000],
    );

    // Act
    const response = await request(app)
      .get("/api/v1/orders")
      .query({
        from: new Date(Date.now() - 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      })
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.orders).toHaveLength(1);

    expect(response.body.data.orders[0]).toMatchObject({
      id: recentOrderResult.rows[0].id,
      userId: user.id,
      status: "DELIVERED",
      totalAmount: 2000,
    });

    expect(
      response.body.data.orders.find(
        (order: { id: string }) => order.id === oldOrderResult.rows[0].id,
      ),
    ).toBeUndefined();
  });

  it("should paginate order history", async () => {
    // Arrange
    const { accessToken, user } = await createCustomer();

    for (let i = 1; i <= 15; i++) {
      await pool.query(
        `
        INSERT INTO orders (
          user_id,
          status,
          total_amount
        )
        VALUES ($1, $2, $3);
      `,
        [user.id, "PENDING", i * 100],
      );
    }

    // Act
    const response = await request(app)
      .get("/api/v1/orders")
      .query({
        page: 2,
        limit: 5,
      })
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.orders).toHaveLength(5);

    expect(response.body.data.pagination).toEqual({
      total: 15,
      page: 2,
      limit: 5,
      totalPages: 3,
    });
  });

  it("should sort order history by total amount", async () => {
    // Arrange
    const { accessToken, user } = await createCustomer();

    await pool.query(
      `
      INSERT INTO orders (
        user_id,
        status,
        total_amount
      )
      VALUES
        ($1, 'PENDING', 3000),
        ($1, 'PENDING', 1000),
        ($1, 'PENDING', 2000);
    `,
      [user.id],
    );

    // Act
    const response = await request(app)
      .get("/api/v1/orders")
      .query({
        sort: "totalAmount",
        order: "asc",
      })
      .set("Authorization", `Bearer ${accessToken}`);

    // Assert
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.orders).toHaveLength(3);

    expect(response.body.data.orders[0].totalAmount).toBe(1000);
    expect(response.body.data.orders[1].totalAmount).toBe(2000);
    expect(response.body.data.orders[2].totalAmount).toBe(3000);

    expect(response.body.data.pagination).toEqual({
      total: 3,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  it("should reject unauthenticated request", async () => {
    // Act
    const response = await request(app).get("/api/v1/orders");

    // Assert
    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      success: false,
      message: "Unauthorized",
    });
  });

  it("should return 400 for invalid query parameters", async () => {
    const { accessToken } = await createCustomer();

    const response = await request(app)
      .get("/api/v1/orders")
      .query({
        page: 0,
        limit: 101,
        status: "INVALID_STATUS",
        from: "invalid-date",
        to: "invalid-date",
        sort: "invalid",
        order: "invalid",
      })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toContain(
      "Too small: expected number to be >=1",
    );
    expect(response.body.message).toContain(
      "Too big: expected number to be <=100",
    );
    expect(response.body.message).toContain("Invalid ISO date");
    expect(response.body.message).toContain(
      'expected one of "createdAt"|"totalAmount"',
    );
    expect(response.body.message).toContain('expected one of "asc"|"desc"');
    expect(response.body.message).toContain(
      'expected one of "PENDING"|"CONFIRMED"|"PROCESSING"|"SHIPPED"|"DELIVERED"|"CANCELLED"',
    );
  });
});
