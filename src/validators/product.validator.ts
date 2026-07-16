import { z } from "zod";

import { uuidParamSchema } from "./common.validator";

export const createProductSchema = z.object({
  body: z.object({
    categoryId: z.uuid("Invalid category ID"),

    sku: z
      .string()
      .trim()
      .min(1, "SKU is required")
      .max(100, "SKU must not exceed 100 characters"),

    name: z
      .string()
      .trim()
      .min(1, "Product name is required")
      .max(255, "Product name must not exceed 255 characters"),

    description: z
      .string()
      .trim()
      .max(1000, "Description must not exceed 1000 characters")
      .optional(),

    price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price"),

    stock: z.number().int().min(0, "Stock cannot be negative"),
  }),
});

export const updateProductSchema = z.object({
  params: uuidParamSchema,

  body: z
    .object({
      categoryId: z.uuid("Invalid category ID").optional(),

      sku: z
        .string()
        .trim()
        .min(1, "SKU is required")
        .max(100, "SKU must not exceed 100 characters")
        .optional(),

      name: z
        .string()
        .trim()
        .min(1, "Product name is required")
        .max(255, "Product name must not exceed 255 characters")
        .optional(),

      description: z
        .string()
        .trim()
        .max(1000, "Description must not exceed 1000 characters")
        .optional(),

      price: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "Invalid price")
        .optional(),

      stock: z.number().int().min(0, "Stock cannot be negative").optional(),

      isActive: z.boolean().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "At least one field must be provided",
    ),
});

export const getProductSchema = z.object({
  params: uuidParamSchema,
});

export const deleteProductSchema = z.object({
  params: uuidParamSchema,
});

export const listProductsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),

    search: z.string().trim().min(1, "Search cannot be empty").optional(),

    categoryId: z.uuid("Invalid category ID").optional(),

    sort: z.enum(["name", "price", "createdAt"]).default("createdAt"),

    order: z.enum(["asc", "desc"]).default("desc"),
  }),
});
