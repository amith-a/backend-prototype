import { Router } from "express";

import authController from "../controllers/auth.controller";
import validate from "../middleware/validate.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import authenticate from "../middleware/auth.middleware";
import authorize from "../middleware/authorize.middleware";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);
export default router;
