import { Request, Response } from "express";
import { RegisterUserDto } from "../dto/user/register-user.dto";
import authService from "../services/auth.service";
import { LoginUserDto } from "../dto/user/login-user.dto";
import AppError from "../errors/app-error";
import { refreshCookieOptions } from "../config/cookie";

class AuthController {
  login = async (req: Request<{}, {}, LoginUserDto>, res: Response) => {
    const { refreshToken, ...response } = await authService.login(req.body);

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.status(200).json({
      success: true,
      data: response,
    });
  };

  refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token missing", 401);
    }

    const { refreshToken: newRefreshToken, accessToken } =
      await authService.refreshAccessToken(refreshToken);

    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    return res.status(200).json({
      success: true,
      data: {
        accessToken,
      },
    });
  };

  logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie("refreshToken", refreshCookieOptions);

    return res.sendStatus(204);
  };

  register = async (req: Request<{}, {}, RegisterUserDto>, res: Response) => {
    const user = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      data: user,
    });
  };

  me = async (req: Request, res: Response) => {
    const user = await authService.getCurrentUser(req.user.id);
    return res.status(200).json({
      success: true,
      data: user,
    });
  };
}

export default new AuthController();
