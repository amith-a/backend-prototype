import { Router } from "express";

import authController from "../controllers/auth.controller";
import validate from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import authenticate from "../middlewares/auth.middleware";
import { asyncHandler } from "../middlewares/async-handler.middleware";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(authController.register),
);
router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(authController.login),
);
router.post("/refresh", asyncHandler(authController.refreshToken));
router.post("/logout", asyncHandler(authController.logout));
router.get("/me", authenticate, asyncHandler(authController.me));
export default router;
