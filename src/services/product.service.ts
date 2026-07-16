import { CreateProductDto } from "../dto/product/create-product.dto";
import { ListProductsDto } from "../dto/product/list-products.dto";
import { UpdateProductDto } from "../dto/product/update-product.dto";
import AppError from "../errors/app-error";
import categoryRepository from "../repositories/category.repository";
import productRepository from "../repositories/product.repository";
import { PaginatedResponse } from "../types/pagination.types";
import { Product } from "../types/product.types";

class ProductService {
  async create(dto: CreateProductDto): Promise<Product> {
    const category = await categoryRepository.findById(dto.categoryId);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const existingProduct = await productRepository.findBySku(dto.sku);

    if (existingProduct) {
      throw new AppError("SKU already exists", 409);
    }

    return await productRepository.create(dto);
  }

  async getById(productId: string): Promise<Product> {
    const product = await productRepository.findById(productId);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  async getAll(query: ListProductsDto): Promise<PaginatedResponse<Product>> {
    const result = await productRepository.findAll(query);

    return {
      data: result.data,
      page: query.page,
      limit: query.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / query.limit),
    };
  }

  async update(productId: string, dto: UpdateProductDto): Promise<Product> {
    const existingProduct = await productRepository.findById(productId);

    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }

    if (dto.categoryId) {
      const category = await categoryRepository.findById(dto.categoryId);

      if (!category) {
        throw new AppError("Category not found", 404);
      }
    }

    if (dto.sku && dto.sku !== existingProduct.sku) {
      const skuExists = await productRepository.findBySku(dto.sku);

      if (skuExists) {
        throw new AppError("SKU already exists", 409);
      }
    }

    const updatedProduct = await productRepository.update(productId, dto);

    if (!updatedProduct) {
      throw new AppError("Product not found", 404);
    }

    return updatedProduct;
  }

  async delete(productId: string): Promise<void> {
    const product = await productRepository.findById(productId);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    await productRepository.delete(productId);
  }
}

export default new ProductService();
