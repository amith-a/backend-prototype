import pool from "../config/postgres";
import { CreateUserDto } from "../dto/user/create-user.dto";
import { AuthUser, User, UserProfile } from "../types/user.types";

class UserRepository {
  async findById(userId: string): Promise<UserProfile | null> {
    const query = `SELECT
    u.id,
    u.name,
    u.email,
    r.name AS role
FROM users u
JOIN roles r
    ON r.id = u.role_id
WHERE u.id = $1;`;

    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
    };
  }

  async findAuthUserByEmail(email: string): Promise<AuthUser | null> {
    const query = `SELECT id,email,password_hash,role_id,name FROM USERS where email=$1`;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      roleId: row.role_id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, role_id, name, email, phone, password_hash, created_at, updated_at
      FROM users
      WHERE email = $1;
    `;

    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      roleId: row.role_id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      passwordHash: row.password_hash,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async create(user: CreateUserDto): Promise<User> {
    const query = `
      INSERT INTO users (role_id, name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id, role_id, name, email, phone, password_hash, created_at, updated_at;
    `;

    const result = await pool.query(query, [
      user.roleId,
      user.name,
      user.email,
      user.passwordHash,
    ]);

    const row = result.rows[0];
    return {
      id: row.id,
      roleId: row.role_id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      passwordHash: row.password_hash,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export default new UserRepository();
