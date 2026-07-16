export interface CreateProductDto {
  categoryId: string;
  sku: string;
  name: string;
  description?: string;
  price: string;
  stock: number;
}
