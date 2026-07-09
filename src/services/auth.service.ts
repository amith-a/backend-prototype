import bcrypt from "bcrypt";
import env from "../config/env";
import { RegisterUserDto } from "../dto/user/register-user.dto";
import { CreateUserDto } from "../dto/user/create-user.dto";
import userRepository from "../repositories/user.repository";
import AppError from "../errors/app-error";
import { LoginResponseDto, LoginUserDto } from "../dto/user/login-user.dto";
import { AuthUser } from "../types/user.types";
import jwtService from "./jwt.service";
import { Role } from "../constants/roles";
import { CurrentUserDto } from "../dto/user/current-user.dto";
import { hashToken } from "../utils/hash";
import refreshSessionRepository from "../repositories/refresh-session.repository";
import logger from "../config/logger";

class AuthService {
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
  }

  private async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async login(dto: LoginUserDto): Promise<LoginResponseDto> {
    const user: AuthUser | null = await userRepository.findAuthUserByEmail(
      dto.email,
    );
    if (!user) {
      logger.warn(
        {
          email: dto.email,
        },
        "Login failed: invalid credentials",
      );
      throw new AppError("Invalid email or password", 401);
    }

    const isValidPassword = await this.verifyPassword(
      dto.password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      logger.warn(
        {
          email: dto.email,
        },
        "Login failed: invalid credentials",
      );
      throw new AppError("Invalid email or password", 401);
    }

    const accessToken = jwtService.generateAccessToken({
      sub: user.id,
      roleId: user.roleId,
    });

    const refreshToken = jwtService.generateRefreshToken({
      sub: user.id,
      roleId: user.roleId,
    });

    await refreshSessionRepository.create({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: jwtService.getRefreshTokenExpiryDate(),
    });

    logger.info(
      {
        userId: user.id,
      },
      "User logged in",
    );
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
      },
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const tokenHash = hashToken(refreshToken);

    const session = await refreshSessionRepository.findByTokenHash(tokenHash);

    if (!session) {
      throw new AppError("Invalid refresh token", 401);
    }

    if (session.revokedAt) {
      throw new AppError("Refresh token revoked", 401);
    }

    if (session.expiresAt < new Date()) {
      throw new AppError("Refresh token expired", 401);
    }

    const payload = jwtService.verifyRefreshToken(refreshToken);

    if (session.userId !== payload.sub) {
      throw new AppError("Invalid refresh token", 401);
    }

    const accessToken = jwtService.generateAccessToken({
      sub: payload.sub,
      roleId: payload.roleId,
    });

    const newRefreshToken = jwtService.generateRefreshToken({
      sub: payload.sub,
      roleId: payload.roleId,
    });

    await refreshSessionRepository.rotateSession(session.id, {
      userId: payload.sub,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: jwtService.getRefreshTokenExpiryDate(),
    });

    logger.info(
      {
        userId: payload.sub,
      },
      "Refresh token rotated",
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(token: string): Promise<void> {
    const tokenHash = hashToken(token);

    const session = await refreshSessionRepository.findByTokenHash(tokenHash);

    if (!session) {
      return;
    }
    logger.info(
      {
        userId: session.userId,
      },
      "User logged out",
    );
    await refreshSessionRepository.revoke(session.id);
  }

  async register(dto: RegisterUserDto) {
    const existingUser = await userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }

    const passwordHash = await this.hashPassword(dto.password);

    const createUserDto: CreateUserDto = {
      roleId: Role.CUSTOMER,
      name: dto.name,
      email: dto.email,
      passwordHash,
    };

    const createdUser = await userRepository.create(createUserDto);

    logger.info(
      {
        userId: createdUser.id,
        email: createdUser.email,
      },
      "User registered",
    );

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    } satisfies CurrentUserDto;
  }
}

export default new AuthService();
