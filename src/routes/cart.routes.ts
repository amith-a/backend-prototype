import { Router } from "express";

import cartController from "../controllers/cart.controller";

import authenticate from "../middlewares/auth.middleware";
import validate from "../middlewares/validate.middleware";
import { asyncHandler } from "../middlewares/async-handler.middleware";

import {
  addCartItemSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from "../validators/cart.validator";

const router = Router();

router.get("/", authenticate, asyncHandler(cartController.getCart));

router.post(
  "/items",
  authenticate,
  validate(addCartItemSchema),
  asyncHandler(cartController.addItem),
);

router.patch(
  "/items/:productId",
  authenticate,
  validate(updateCartItemSchema),
  asyncHandler(cartController.updateItem),
);

router.delete(
  "/items/:productId",
  authenticate,
  validate(removeCartItemSchema),
  asyncHandler(cartController.removeItem),
);

router.delete("/", authenticate, asyncHandler(cartController.clearCart));

export default router;
