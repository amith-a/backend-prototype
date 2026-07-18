import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Category name is required")
      .max(100, "Category name must not exceed 100 characters"),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.uuid("Invalid category id"),
  }),
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Category name is required")
        .max(100, "Category name must not exceed 100 characters")
        .optional(),

      isActive: z.boolean().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "At least one field must be provided",
    ),
});

export const getCategorySchema = z.object({
  params: z.object({
    id: z.uuid("Invalid category id"),
  }),
});
