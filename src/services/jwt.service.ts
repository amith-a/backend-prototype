import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload } from "../types/auth.types";
import env from "../config/env";

class JwtService {
  private signToken(payload: JwtPayload, secret: string, expiresIn: string) {
    return jwt.sign(payload, secret, {
      expiresIn: expiresIn as SignOptions["expiresIn"],
    });
  }

  private verifyToken(token: string, secret: string): JwtPayload {
    return jwt.verify(token, secret) as JwtPayload;
  }

  getRefreshTokenExpiryDate(): Date {
    return new Date(Date.now() + env.REFRESH_SESSION_DAYS * 24 * 60 * 60 * 1000);
  }

  generateAccessToken(payload: JwtPayload): string {
    return this.signToken(
      payload,
      env.JWT_ACCESS_SECRET,
      env.JWT_ACCESS_EXPIRES_IN,
    );
  }

  verifyAccessToken(token: string): JwtPayload {
    return this.verifyToken(token, env.JWT_ACCESS_SECRET);
  }

  generateRefreshToken(payload: JwtPayload): string {
    return this.signToken(
      payload,
      env.JWT_REFRESH_SECRET,
      env.JWT_REFRESH_EXPIRES_IN,
    );
  }
  
  verifyRefreshToken(token: string): JwtPayload {
    return this.verifyToken(token, env.JWT_REFRESH_SECRET);
  }
}

export default new JwtService();
