import { Router } from "express";
import categoryController from "../controllers/category.controller";
import authenticate from "../middlewares/auth.middleware";
import authorize from "../middlewares/authorize.middleware";
import { Role } from "../constants/roles";
import validate from "../middlewares/validate.middleware";
import {
  createCategorySchema,
  getCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator";

const router = Router();

router.use(authenticate);

router.get("/", categoryController.getAll);

router.get("/:id", validate(getCategorySchema), categoryController.getById);

router.post(
  "/",
  authorize([Role.ADMIN]),
  validate(createCategorySchema),
  categoryController.create,
);

router.patch(
  "/:id",
  authorize([Role.ADMIN]),
  validate(getCategorySchema),
  validate(updateCategorySchema),
  categoryController.update,
);

router.delete(
  "/:id",
  authorize([Role.ADMIN]),
  validate(getCategorySchema),
  categoryController.delete,
);

export default router;
