import { z } from "zod";

import { uuidParamSchema } from "./common.validator";
import { ORDER_STATUSES } from "../types/order.types";

export const getOrderSchema = z.object({
  params: uuidParamSchema,
});

export const listOrdersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),

    status: z.enum(ORDER_STATUSES).optional(),

    from: z.string().date().optional(),

    to: z.string().date().optional(),

    sort: z.enum(["createdAt", "totalAmount"]).default("createdAt"),

    order: z.enum(["asc", "desc"]).default("desc"),
  }),
});
