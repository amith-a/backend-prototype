import pool from "../config/postgres";
import orderRepository from "../repositories/order.repository";
import cartRepository from "../repositories/cart.repository";
import productRepository from "../repositories/product.repository";
import {
  CreateOrderItemInput,
  Order,
  OrderDetails,
  OrderHistoryFilters,
  OrderHistoryResponse,
} from "../types/order.types";
import AppError from "../errors/app-error";

class OrderService {
  async create(userId: string): Promise<Order> {
    const cart = await cartRepository.findCartByUserId(userId);

    if (!cart) {
      throw new AppError("Cart is empty", 400);
    }

    const items = await cartRepository.getItems(cart.id);

    if (items.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    const totalAmount = items.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0,
    );

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // create order

      const order = await orderRepository.create(
        {
          userId,
          totalAmount,
        },
        client,
      );

      // create order items
      const orderItems: CreateOrderItemInput[] = items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(item.price),
        subtotal: Number(item.price) * item.quantity,
      }));
      await orderRepository.createItems(orderItems, client);

      // decrease stock
      for (const item of items) {
        await productRepository.decreaseStock(
          item.productId,
          item.quantity,
          client,
        );
      }

      // clear cart
      await cartRepository.clearCart(cart.id, client);

      await client.query("COMMIT");

      return order;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async findById(orderId: string, userId: string): Promise<OrderDetails> {
    const order = await orderRepository.findOrderById(orderId, userId);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const items = await orderRepository.findItemsByOrderId(order.id);

    return {
      ...order,
      items,
    };
  }

  async findOrderHistory(
    userId: string,
    filters: OrderHistoryFilters,
  ): Promise<OrderHistoryResponse> {
    return orderRepository.findOrderHistory(userId, filters);
  }
}

export default new OrderService();
