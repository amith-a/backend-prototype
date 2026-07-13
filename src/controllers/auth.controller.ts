import { Request, Response, NextFunction } from "express";
import { RegisterUserDto } from "../dto/user/register-user.dto";
import authService from "../services/auth.service";
import { LoginUserDto } from "../dto/user/login-user.dto";
import AppError from "../errors/app-error";
import { refreshCookieOptions } from "../config/cookie";

class AuthController {
  async login(
    req: Request<{}, {}, LoginUserDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { refreshToken, ...response } = await authService.login(req.body);

      res.cookie("refreshToken", refreshToken, refreshCookieOptions);

      return res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new AppError("Refresh token missing", 401);
      }

      const { refreshToken: newRefreshToken, accessToken } =
        await authService.refreshAccessToken(refreshToken);

      res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

      return res.json({
        success: true,
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      res.clearCookie("refreshToken", refreshCookieOptions);

      return res.sendStatus(204);
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

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  
}

export default new AuthController();
