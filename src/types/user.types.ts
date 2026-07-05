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
