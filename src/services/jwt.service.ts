import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload } from "../types/auth.types";
import env from "../config/env";

class JwtService {
  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  }

  //   async generateRefreshToken(){}
  //   async verifyRefreshToken(){}
}

export default new JwtService();
