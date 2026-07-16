export interface UpdateProductDto {
  categoryId?: string;
  sku?: string;
  name?: string;
  description?: string;
  price?: string;
  stock?: number;
  isActive?: boolean;
}
