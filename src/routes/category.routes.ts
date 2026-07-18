import { Router } from "express";
import categoryController from "../controllers/category.controller";
import authenticate from "../middlewares/auth.middleware";
import authorize from "../middlewares/authorize.middleware";
import { Role } from "../constants/roles";
import validate from "../middlewares/validate.middleware";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import {
  createCategorySchema,
  getCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(categoryController.getAll));

router.get(
  "/:id",
  validate(getCategorySchema),
  asyncHandler(categoryController.getById),
);

router.post(
  "/",
  authorize([Role.ADMIN]),
  validate(createCategorySchema),
  asyncHandler(categoryController.create),
);

router.patch(
  "/:id",
  authorize([Role.ADMIN]),
  validate(updateCategorySchema),
  asyncHandler(categoryController.update),
);

router.delete(
  "/:id",
  authorize([Role.ADMIN]),
  validate(getCategorySchema),
  asyncHandler(categoryController.delete),
);

export default router;
