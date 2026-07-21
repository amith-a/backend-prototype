import logger from "../config/logger";
import orderRepository from "../repositories/order.repository";
import userRepository from "../repositories/user.repository";
import { emailProvider } from "./email.provider";
import { buildOrderConfirmationEmail } from "./templates/order-confirmation.template";

class EmailService {
  // async sendOrderConfirmation(orderId: string): Promise<void> {
  //   const order = await orderRepository.(orderId);

  //   if (!order) {
  //     throw new Error("Order not found");
  //   }

  //   logger.info(
  //     {
  //       to: order.user.email,
  //       subject: "Order Confirmation",
  //       body,
  //     },
  //     "Sending order confirmation",
  //   );
  //   // Later:
  //   // Fetch order
  //   // Fetch customer
  //   // Generate email
  //   // Send email
  // }

  async sendOrderConfirmation(orderId: string): Promise<void> {
    const order = await orderRepository.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    const items = await orderRepository.findItemsByOrderId(orderId);

    const customer = await userRepository.findById(order.userId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    // const itemList = items
    //   .map(
    //     (item) => `${item.productName} x${item.quantity} - ₹${item.subtotal}`,
    //   )
    //   .join("\n");

    // const body = `
    //   Hello ${customer.name},

    //   Thank you for your order.

    //   Order ID:
    //   ${order.id}

    //   Items:
    //   ${itemList}

    //   Total:
    //   ₹${order.totalAmount}

    //   Thank you for shopping with us!
    //   `;

    const email = buildOrderConfirmationEmail(order, customer, items);

    await emailProvider.send({
      to: customer.email,
      subject: email.subject,
      body: email.body,
    });

    logger.info(
      {
        to: customer.email,
        subject: "Order Confirmation",
        body: email.body,
      },
      "Sending order confirmation email",
    );
  }
}

export const emailService = new EmailService();
