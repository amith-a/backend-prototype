import { Router } from "express";

import cartController from "../controllers/cart.controller";

import authenticate from "../middlewares/auth.middleware";
import validate from "../middlewares/validate.middleware";

import {
  addCartItemSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from "../validators/cart.validator";

const router = Router();

router.get("/", authenticate, cartController.getCart);

router.post(
  "/items",
  authenticate,
  validate(addCartItemSchema),
  cartController.addItem,
);

router.patch(
  "/items/:productId",
  authenticate,
  validate(updateCartItemSchema),
  cartController.updateItem,
);

router.delete(
  "/items/:productId",
  authenticate,
  validate(removeCartItemSchema),
  cartController.removeItem,
);

router.delete("/", authenticate, cartController.clearCart);

export default router;
