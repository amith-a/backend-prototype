export interface JwtPayload {
  sub: string;
  roleId: number;
}

export interface AuthRequestUser {
  id: string;
  roleId: number;
}
