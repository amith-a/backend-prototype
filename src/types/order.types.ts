export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderSummary {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderHistoryFilters {
  page: number;
  limit: number;

  status?: OrderStatus;

  from?: string;
  to?: string;

  sort: "createdAt" | "totalAmount";
  order: "asc" | "desc";
}

export interface OrderHistoryResponse {
  orders: OrderSummary[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt?: Date;
}

export interface CreateOrderInput {
  userId: string;
  totalAmount: number;
}

export interface CreateOrderItemInput {
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDetails extends Order {
  items: OrderItem[];
}
