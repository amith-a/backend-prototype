import { ListProductsDto } from "../dto/product/list-products.dto";

export const CacheKeys = {
  CATEGORIES: "categories",

  PRODUCT: (id: string) => `product:${id}`,

  PRODUCTS: (query: ListProductsDto) => {
    const { page, limit, search, categoryId, sort, order } = query;

    return [
      "products",
      `page:${page}`,
      `limit:${limit}`,
      `search:${search ?? ""}`,
      `category:${categoryId ?? ""}`,
      `sort:${sort ?? "createdAt"}`,
      `order:${order ?? "desc"}`,
    ].join(":");
  },
} as const;
