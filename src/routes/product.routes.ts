import { Router } from "express";

import productController from "../controllers/product.controller";

import authenticate from "../middlewares/auth.middleware";
import authorize from "../middlewares/authorize.middleware";
import validate from "../middlewares/validate.middleware";

import { Role } from "../constants/roles";

import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  listProductsSchema,
  updateProductSchema,
} from "../validators/product.validator";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize([Role.ADMIN]),
  validate(createProductSchema),
  productController.create,
);

router.get("/", validate(listProductsSchema), productController.getAll);

router.get("/:id", validate(getProductSchema), productController.getById);

router.patch(
  "/:id",
  authorize([Role.ADMIN]),
  validate(updateProductSchema),
  productController.update,
);

router.delete(
  "/:id",
  authorize([Role.ADMIN]),
  validate(deleteProductSchema),
  productController.delete,
);

export default router;
