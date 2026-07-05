import bcrypt from "bcrypt";
import env from "../config/env";
import { RegisterUserDto } from "../dto/user/register-user.dto";
import { CreateUserDto } from "../dto/user/create-user.dto";
import userRepository from "../repositories/user.repository";
import AppError from "../errors/app-error";

const CUSTOMER_ROLE_ID = 1;

class AuthService {
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
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
