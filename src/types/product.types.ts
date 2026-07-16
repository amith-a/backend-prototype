export interface Product {
  id: string;
  categoryId: string;
  sku: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
