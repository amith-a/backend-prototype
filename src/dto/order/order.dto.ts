import type { OrderStatus } from "../../types/order.types";

export interface OrderDto {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
}

export interface OrderItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDetailsDto extends OrderDto {
  items: OrderItemDto[];
}
