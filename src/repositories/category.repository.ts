import pool from "../config/postgres";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../dto/category/category.dto";
import { Category } from "../types/category.types";

class CategoryRepository {
  async create(dto: CreateCategoryDto): Promise<Category> {
    const query = `INSERT INTO categories (
            name
        )
        VALUES ($1)
        RETURNING
            id,
            name,
            is_active,
            created_at",
            updated_at";
        `;

    const result = await pool.query(query, [dto.name]);

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findById(id: string): Promise<Category | null> {
    const query = `
    SELECT
      id,
      name,
      is_active,
      created_at,
      updated_at
    FROM categories
    WHERE id = $1;
  `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      name: row.name,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findByName(name: string): Promise<Category | null> {
    const query = `
    SELECT
      id,
      name,
      is_active,
      created_at,
      updated_at
    FROM categories
    WHERE LOWER(name) = LOWER($1);
  `;

    const result = await pool.query(query, [name]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      name: row.name,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findAll(): Promise<Category[]> {
    const query = `
    SELECT
      id,
      name,
      is_active,
      created_at,
      updated_at
    FROM categories
    ORDER BY name ASC;
  `;

    const result = await pool.query(query);

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async update(categoryId: string, dto: UpdateCategoryDto): Promise<Category> {
    const updates: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    if (dto.name !== undefined) {
      updates.push(`name = $${index++}`);
      values.push(dto.name);
    }

    if (dto.isActive !== undefined) {
      updates.push(`is_active = $${index++}`);
      values.push(dto.isActive);
    }

    updates.push(`updated_at = NOW()`);

    values.push(categoryId);

    const query = `
    UPDATE categories
    SET ${updates.join(", ")}
    WHERE id = $${index}
    RETURNING
      id,
      name,
      is_active,
      created_at,
      updated_at;
  `;

    const result = await pool.query(query, values);

    const row = result.rows[0];

    return {
      id: row.id,
      name: row.name,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async delete(categoryId: string): Promise<void> {
    const query = `
    DELETE FROM categories
    WHERE id = $1;
  `;

    await pool.query(query, [categoryId]);
  }
}

export default new CategoryRepository();
