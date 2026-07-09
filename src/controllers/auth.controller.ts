import { Request, Response, NextFunction } from "express";
import { RegisterUserDto } from "../dto/user/register-user.dto";
import authService from "../services/auth.service";
import { LoginUserDto } from "../dto/user/login-user.dto";
import env from "../config/env";
import AppError from "../errors/app-error";

class AuthController {
  async login(
    req: Request<{}, {}, LoginUserDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { refreshToken, ...response } = await authService.login(req.body);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        path: "/api/v1/auth/refresh",
        maxAge: env.REFRESH_SESSION_DAYS * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

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

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/v1/auth/refresh",
        maxAge: env.REFRESH_SESSION_DAYS * 24 * 60 * 60 * 1000,
      });

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

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/v1/auth/refresh",
      });

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
