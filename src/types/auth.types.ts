export interface JwtPayload {
  sub: string;
  roleId: number;
  jti?: string;
}

export interface AuthRequestUser {
  id: string;
  roleId: number;
}
