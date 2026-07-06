import { Request, Response, NextFunction } from "express";
import { RegisterUserDto } from "../dto/user/register-user.dto";
import authService from "../services/auth.service";
import { LoginUserDto } from "../dto/user/login-user.dto";

class AuthController {
  async login(
    req: Request<{}, {}, LoginUserDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const authData= await authService.login(req.body);
      return res.status(200).json({
        success: true,
        data: authData,
      });
    } catch (error) {
      next(error);
    }
  }

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
