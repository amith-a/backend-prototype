import { Pool, PoolClient } from "pg";
import pool from "../config/postgres";
import { AddCartItemDto } from "../dto/cart/cart.dto";
import { Cart, CartItem, CartProduct } from "../types/cart.type";

class CartRepository {
  async findCartByUserId(userId: string): Promise<Cart | null> {
    const query = `
    SELECT
      id,
      user_id,
      created_at,
      updated_at
    FROM carts
    WHERE user_id = $1;
  `;

    const result = await pool.query(query, [userId]);

    if (result.rowCount === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async createCart(userId: string): Promise<Cart> {
    const query = `
    INSERT INTO carts (user_id)
    VALUES ($1)
    RETURNING
      id,
      user_id,
      created_at,
      updated_at;
  `;

    const result = await pool.query(query, [userId]);

    const row = result.rows[0];

    return {
      id: row.id,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findItem(cartId: string, productId: string): Promise<CartItem | null> {
    const query = `
    SELECT
      id,
      cart_id,
      product_id,
      quantity,
      created_at
    FROM cart_items
    WHERE cart_id = $1
      AND product_id = $2;
  `;

    const result = await pool.query(query, [cartId, productId]);

    if (result.rowCount === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      cartId: row.cart_id,
      productId: row.product_id,
      quantity: row.quantity,
      createdAt: row.created_at,
    };
  }

  async createItem(cartId: string, dto: AddCartItemDto): Promise<CartItem> {
    const query = `
    INSERT INTO cart_items (
      cart_id,
      product_id,
      quantity
    )
    VALUES ($1, $2, $3)
    RETURNING
      id,
      cart_id,
      product_id,
      quantity,
      created_at;
  `;

    const result = await pool.query(query, [
      cartId,
      dto.productId,
      dto.quantity,
    ]);

    const row = result.rows[0];

    return {
      id: row.id,
      cartId: row.cart_id,
      productId: row.product_id,
      quantity: row.quantity,
      createdAt: row.created_at,
    };
  }

  async updateItemQuantity(
    itemId: string,
    cartId: string,
    quantity: number,
  ): Promise<CartItem> {
    const query = `
    UPDATE cart_items
    SET quantity = $1
    WHERE id = $2
    and cart_id = $3
    RETURNING
      id,
      cart_id,
      product_id,
      quantity,
      created_at;
  `;

    const result = await pool.query(query, [quantity, itemId, cartId]);

    const row = result.rows[0];

    return {
      id: row.id,
      cartId: row.cart_id,
      productId: row.product_id,
      quantity: row.quantity,
      createdAt: row.created_at,
    };
  }

  async deleteItem(itemId: string, cartId: string): Promise<void> {
    const query = `
    DELETE
    FROM cart_items
    WHERE id = $1
    AND cart_id = $2;
  `;

    await pool.query(query, [itemId, cartId]);
  }

  async clearCart(
    cartId: string,
    client: Pool | PoolClient = pool,
  ): Promise<void> {
    const query = `
    DELETE
    FROM cart_items
    WHERE cart_id = $1;
  `;

    await client.query(query, [cartId]);
  }

  async getItems(cartId: string): Promise<CartProduct[]> {
    const query = `
    SELECT
      p.id as product_id,
      p.sku,
      p.name,
      p.price,
      ci.quantity
    FROM cart_items ci
    INNER JOIN products p
      ON p.id = ci.product_id
    WHERE ci.cart_id = $1
    ORDER BY ci.created_at;
  `;

    const result = await pool.query(query, [cartId]);

    return result.rows.map((row) => ({
      productId: row.product_id,
      sku: row.sku,
      name: row.name,
      price: row.price,
      quantity: row.quantity,
      subtotal: "0",
    }));
  }
}

export default new CartRepository();
