import { OrderItem } from "../types/order.types";

export interface OrderEmailData {
  id: string;
  totalAmount: number;
  createdAt: Date;

  customer: {
    id: string;
    name: string;
    email: string;
  };

  items: OrderItem[];
}
