import { Router } from "express";
import orderController from "../controllers/order.controller";
import authenticate from "../middlewares/auth.middleware";

import { asyncHandler } from "../middlewares/async-handler.middleware";
import {
  getOrderSchema,
  listOrdersSchema,
} from "../validators/order.validator";
import validate from "../middlewares/validate.middleware";

const router = Router();

router.use(authenticate);

router.post("/", asyncHandler(orderController.create));

router.get(
  "/",
  validate(listOrdersSchema),
  asyncHandler(orderController.findOrderHistory),
);

router.get(
  "/:id",
  validate(getOrderSchema),
  asyncHandler(orderController.findById),
);

export default router;
