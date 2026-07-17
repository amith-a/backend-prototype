export interface Cart {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
}

export interface CartProduct {
  productId: string;
  sku: string;
  name: string;
  price: string;
  quantity: number;
  subtotal: string;
}

export interface CartResponse {
  id?: string;
  userId?: string;
  items: CartProduct[];
  total: string;
}
