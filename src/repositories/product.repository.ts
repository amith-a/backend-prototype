import { Pool, PoolClient } from "pg";
import pool from "../config/postgres";
import { CreateProductDto } from "../dto/product/create-product.dto";
import { ListProductsDto } from "../dto/product/list-products.dto";
import { UpdateProductDto } from "../dto/product/update-product.dto";
import { PaginatedResult } from "../types/pagination.types";
import { Product } from "../types/product.types";
import AppError from "../errors/app-error";

class ProductRepository {
  async create(dto: CreateProductDto): Promise<Product> {
    const query = `
    INSERT INTO products (
      category_id,
      sku,
      name,
      description,
      price,
      stock
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      category_id,
      sku,
      name,
      description,
      price,
      stock,
      is_active,
      created_at,
      updated_at;
  `;

    const values = [
      dto.categoryId,
      dto.sku,
      dto.name,
      dto.description ?? null,
      dto.price,
      dto.stock,
    ];

    const result = await pool.query(query, values);
    const row = result.rows[0];
    return {
      id: row.id,
      categoryId: row.category_id,
      sku: row.sku,
      name: row.name,
      description: row.description,
      price: row.price,
      stock: row.stock,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findById(productId: string): Promise<Product | null> {
    const query = `
    SELECT
      id,
      category_id,
      sku,
      name,
      description,
      price,
      stock,
      is_active,
      created_at,
      updated_at
    FROM products
    WHERE id = $1;
  `;

    const result = await pool.query(query, [productId]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      categoryId: row.category_id,
      sku: row.sku,
      name: row.name,
      description: row.description,
      price: row.price,
      stock: row.stock,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findBySku(sku: string): Promise<Product | null> {
    const query = `
    SELECT
      id,
      category_id,
      sku,
      name,
      description,
      price,
      stock,
      is_active,
      created_at,
      updated_at
    FROM products
    WHERE sku = $1;
  `;

    const result = await pool.query(query, [sku]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      categoryId: row.category_id,
      sku: row.sku,
      name: row.name,
      description: row.description,
      price: row.price,
      stock: row.stock,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findAll(query: ListProductsDto): Promise<PaginatedResult<Product>> {
    const conditions: string[] = [];
    const values: unknown[] = [];

    let index = 1;

    if (query.search) {
      conditions.push(`LOWER(name) LIKE LOWER($${index++})`);
      values.push(`%${query.search}%`);
    }

    if (query.categoryId) {
      conditions.push(`category_id = $${index++}`);
      values.push(query.categoryId);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const sortColumn =
      query.sort === "price"
        ? "price"
        : query.sort === "name"
          ? "name"
          : "created_at";

    const sortOrder = query.order === "asc" ? "ASC" : "DESC";

    const countQuery = `
    SELECT COUNT(*) AS total
    FROM products
    ${whereClause};
  `;

    const offset = (query.page - 1) * query.limit;

    values.push(query.limit);
    values.push(offset);

    const dataQuery = `
    SELECT
      id,
      category_id,
      sku,
      name,
      description,
      price,
      stock,
      is_active,
      created_at,
      updated_at
    FROM products
    ${whereClause}
    ORDER BY ${sortColumn} ${sortOrder}
    LIMIT $${index++}
    OFFSET $${index};
  `;

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, values.slice(0, values.length - 2)),
      pool.query(dataQuery, values),
    ]);

    return {
      total: Number(countResult.rows[0].total),

      data: dataResult.rows.map((row) => ({
        id: row.id,
        categoryId: row.category_id,
        sku: row.sku,
        name: row.name,
        description: row.description,
        price: row.price,
        stock: row.stock,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    };
  }

  async update(
    productId: string,
    dto: UpdateProductDto,
  ): Promise<Product | null> {
    const updates: string[] = [];
    const values: unknown[] = [];

    let index = 1;

    if (dto.categoryId !== undefined) {
      updates.push(`category_id = $${index++}`);
      values.push(dto.categoryId);
    }

    if (dto.sku !== undefined) {
      updates.push(`sku = $${index++}`);
      values.push(dto.sku);
    }

    if (dto.name !== undefined) {
      updates.push(`name = $${index++}`);
      values.push(dto.name);
    }

    if (dto.description !== undefined) {
      updates.push(`description = $${index++}`);
      values.push(dto.description);
    }

    if (dto.price !== undefined) {
      updates.push(`price = $${index++}`);
      values.push(dto.price);
    }

    if (dto.stock !== undefined) {
      updates.push(`stock = $${index++}`);
      values.push(dto.stock);
    }

    if (dto.isActive !== undefined) {
      updates.push(`is_active = $${index++}`);
      values.push(dto.isActive);
    }

    if (updates.length === 0) {
      return this.findById(productId);
    }

    values.push(productId);

    const query = `
    UPDATE products
    SET
      ${updates.join(", ")},
      updated_at = NOW()
    WHERE id = $${index}
    RETURNING
      id,
      category_id,
      sku,
      name,
      description,
      price,
      stock,
      is_active,
      created_at,
      updated_at;
  `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      categoryId: row.category_id,
      sku: row.sku,
      name: row.name,
      description: row.description,
      price: row.price,
      stock: row.stock,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async decreaseStock(
    productId: string,
    quantity: number,
    client: Pool | PoolClient = pool,
  ): Promise<void> {
    const query = `
    UPDATE products
    SET
      stock = stock - $1,
      updated_at = NOW()
    WHERE
      id = $2
      AND stock >= $1
    RETURNING id;
  `;

    const result = await client.query(query, [quantity, productId]);

    if (result.rowCount === 0) {
      throw new AppError("Insufficient stock", 400);
    }
  }

  async delete(productId: string): Promise<void> {
    const query = `
    DELETE FROM products
    WHERE id = $1;
  `;

    await pool.query(query, [productId]);
  }
}

export default new ProductRepository();
