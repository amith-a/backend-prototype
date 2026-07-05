import { Request, Response, NextFunction } from "express";
import { RegisterUserDto } from "../dto/user/register-user.dto";
import authService from "../services/auth.service";

class AuthController {
  async register(
    req: Request<{}, {}, RegisterUserDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = await authService.register(req.body);

      return res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
