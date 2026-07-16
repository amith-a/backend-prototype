export interface ListProductsDto {
  page: number;
  limit: number;

  search?: string;
  categoryId?: string;

  sort?: "name" | "price" | "createdAt";
  order?: "asc" | "desc";
}
