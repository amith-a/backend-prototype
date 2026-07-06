import bcrypt from "bcrypt";
import env from "../config/env";
import { RegisterUserDto } from "../dto/user/register-user.dto";
import { CreateUserDto } from "../dto/user/create-user.dto";
import userRepository from "../repositories/user.repository";
import AppError from "../errors/app-error";
import { LoginUserDto } from "../dto/user/login-user.dto";
import { AuthUser } from "../types/user.types";
import { is } from "zod/v4/locales";
import { jwt } from "zod";
import jwtService from "./jwt.service";

const CUSTOMER_ROLE_ID = 1;

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

  async login(dto: LoginUserDto) {
    const user: AuthUser | null = await userRepository.findAuthUserByEmail(
      dto.email,
    );
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isValidPassword = await this.verifyPassword(
      dto.password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      throw new AppError("Invalid email or password", 401);
    }

    const accessToken = jwtService.generateAccessToken({
      sub: user.id,
      roleId: user.roleId,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
      },
    };
  }

  async register(dto: RegisterUserDto) {
    const existingUser = await userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }

    const passwordHash = await this.hashPassword(dto.password);

    const createUserDto: CreateUserDto = {
      roleId: CUSTOMER_ROLE_ID,
      name: dto.name,
      email: dto.email,
      passwordHash,
    };

    const createdUser = await userRepository.create(createUserDto);

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
    };
  }
}

export default new AuthService();
