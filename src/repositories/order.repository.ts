import { Pool, PoolClient } from "pg";
import pool from "../config/postgres";
import {
  CreateOrderInput,
  CreateOrderItemInput,
  Order,
  OrderHistoryResponse,
  OrderHistoryFilters,
  OrderItem,
  OrderStatus,
} from "../types/order.types";

class OrderRepository {
  async create(
    input: CreateOrderInput,
    client: Pool | PoolClient = pool,
  ): Promise<Order> {
    const query = `
      INSERT INTO orders (
        user_id,
        total_amount
      )
      VALUES ($1, $2)
      RETURNING
        id,
        user_id,
        status,
        total_amount,
        created_at,
        updated_at;
    `;

    const result = await client.query(query, [input.userId, input.totalAmount]);

    const row = result.rows[0];

    return {
      id: row.id,
      userId: row.user_id,
      status: row.status,
      totalAmount: Number(row.total_amount),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async createItems(
    items: CreateOrderItemInput[],
    client: Pool | PoolClient = pool,
  ): Promise<void> {
    const params: string[] = [];
    const values: unknown[] = [];

    let index = 1;

    for (const item of items) {
      params.push(
        `($${index++}, $${index++}, $${index++}, $${index++}, $${index++})`,
      );

      values.push(
        item.orderId,
        item.productId,
        item.quantity,
        item.unitPrice,
        item.subtotal,
      );
    }

    const query = `
      INSERT INTO order_items (
        order_id,
        product_id,
        quantity,
        unit_price,
        subtotal
      )
      VALUES ${params.join(", ")};
    `;

    await client.query(query, values);
  }

  async findOrderById(orderId: string, userId: string): Promise<Order | null> {
    const query = `
      SELECT
        id,
        user_id,
        status,
        total_amount,
        created_at,
        updated_at
      FROM orders
      WHERE id = $1
      AND user_id = $2;
    `;

    const result = await pool.query(query, [orderId, userId]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      userId: row.user_id,
      status: row.status,
      totalAmount: Number(row.total_amount),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findById(orderId: string): Promise<Order | null> {
    const query = `
      SELECT
        id,
        user_id,
        status,
        total_amount,
        created_at,
        updated_at
      FROM orders
      WHERE id = $1
    `;

    const result = await pool.query(query, [orderId]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      userId: row.user_id,
      status: row.status,
      totalAmount: Number(row.total_amount),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async updateStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<Order | null> {
    const query = `
      UPDATE orders
      SET
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING
        id,
        user_id,
        status,
        total_amount,
        created_at,
        updated_at;
    `;

    const result = await pool.query(query, [status, orderId]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      userId: row.user_id,
      status: row.status,
      totalAmount: Number(row.total_amount),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    const query = `
      SELECT
        oi.id,
        oi.order_id,
        oi.product_id,
        p.name AS product_name,
        oi.quantity,
        oi.unit_price,
        oi.subtotal
      FROM order_items oi
      INNER JOIN products p
        ON p.id = oi.product_id
      WHERE oi.order_id = $1
      ORDER BY oi.created_at ASC;
    `;

    const result = await pool.query(query, [orderId]);

    return result.rows.map((row) => ({
      id: row.id,
      orderId: row.order_id,
      productId: row.product_id,
      productName: row.product_name,
      quantity: row.quantity,
      unitPrice: Number(row.unit_price),
      subtotal: Number(row.subtotal),
    }));
  }

  async findOrderHistory(
    userId: string,
    filters: OrderHistoryFilters,
  ): Promise<OrderHistoryResponse> {
    const { page, limit, status, from, to, sort, order } = filters;

    const values: unknown[] = [userId];
    const conditions = ["o.user_id = $1"];

    let index = 2;

    if (status) {
      conditions.push(`o.status = $${index++}`);
      values.push(status);
    }

    if (from) {
      conditions.push(`o.created_at >= $${index++}`);
      values.push(from);
    }

    if (to) {
      conditions.push(`o.created_at < ($${index++}::date + INTERVAL '1 day')`);
      values.push(to);
    }

    const whereClause = conditions.join(" AND ");

    const countQuery = `
      SELECT COUNT(*)
      FROM orders o
      WHERE ${whereClause};
    `;

    const countResult = await pool.query(countQuery, values);

    const total = Number(countResult.rows[0].count);

    const sortColumns = {
      createdAt: "o.created_at",
      totalAmount: "o.total_amount",
    } as const;

    const sortColumn = sortColumns[sort];
    const sortDirection = order === "asc" ? "ASC" : "DESC";

    values.push(limit);
    values.push((page - 1) * limit);

    const query = `
      SELECT
        o.id,
        o.user_id,
        o.status,
        o.total_amount,
        COUNT(oi.id)::INTEGER AS item_count,
        o.created_at,
        o.updated_at
      FROM orders o
      LEFT JOIN order_items oi
        ON oi.order_id = o.id
      WHERE ${whereClause}
      GROUP BY
        o.id,
        o.user_id,
        o.status,
        o.total_amount,
        o.created_at,
        o.updated_at
      ORDER BY ${sortColumn} ${sortDirection}
      LIMIT $${index++}
      OFFSET $${index};
    `;

    const result = await pool.query(query, values);

    return {
      orders: result.rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        status: row.status,
        totalAmount: Number(row.total_amount),
        itemCount: Number(row.item_count),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default new OrderRepository();
