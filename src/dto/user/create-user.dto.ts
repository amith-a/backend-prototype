export interface CreateUserDto {
  roleId: number;
  name: string;
  email: string;
  passwordHash: string;
}
