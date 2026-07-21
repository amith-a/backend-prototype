import { Order, OrderItem } from "../../types/order.types";
import { UserProfile } from "../../types/user.types";

export function buildOrderConfirmationEmail(
  order: Order,
  customer: UserProfile,
  items: OrderItem[],
) {
  const subject = `Order #${order.id} Confirmation`;

  const body = `
        Hello ${customer.name},

        Thank you for your order.

        Items:

        ${items
          .map(
            (item: OrderItem) =>
              `${item.productName} x${item.quantity} - ₹${item.subtotal}`,
          )
          .join("\n")}

        Total: ₹${order.totalAmount}
        `;

  return {
    subject,
    body,
  };
}
