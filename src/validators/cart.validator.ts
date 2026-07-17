import { z } from "zod";

export const getCartSchema = z.object({});

export const addCartItemSchema = z.object({
  body: z.object({
    productId: z.uuid("Invalid product ID"),

    quantity: z
      .number()
      .int("Quantity must be an integer")
      .positive("Quantity must be greater than 0"),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    productId: z.uuid("Invalid category id"),
  }),

  body: z.object({
    quantity: z
      .number()
      .int("Quantity must be an integer")
      .positive("Quantity must be greater than 0"),
  }),
});

export const removeCartItemSchema = z.object({
  params: z.object({
    productId: z.uuid("Invalid category id"),
  }),
});
