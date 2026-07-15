import request from "supertest";

import app from "../../src/app";
import pool from "../../src/config/postgres";
import { Role } from "../../src/constants/roles";

interface TestUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface AuthResult {
  user: TestUser;
  accessToken: string;
}

export async function registerUser(
  overrides: Partial<TestUser> = {},
): Promise<TestUser> {
  const user: TestUser = {
    id: "",
    name: "Test User",
    email: `user-${Date.now()}@example.com`,
    password: "Password@123",
    ...overrides,
  };

  const response = await request(app).post("/api/v1/auth/register").send({
    name: user.name,
    email: user.email,
    password: user.password,
  });

  user.id = response.body.data.id;

  return user;
}

export async function loginUser(user: TestUser): Promise<AuthResult> {
  const response = await request(app).post("/api/v1/auth/login").send({
    email: user.email,
    password: user.password,
  });

  return {
    user,
    accessToken: response.body.data.accessToken,
  };
}

export async function createCustomer(): Promise<AuthResult> {
  const user = await registerUser();

  return loginUser(user);
}

export async function createAdmin(): Promise<AuthResult> {
  const user = await registerUser();

  await pool.query(
    `
      UPDATE users
      SET role_id = $1
      WHERE id = $2;
    `,
    [Role.ADMIN, user.id],
  );

  return loginUser(user);
}
