export interface User {
  id: string;
  roleId: number;
  name: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roleId: number;
  passwordHash: string;
}