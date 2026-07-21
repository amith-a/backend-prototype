import { CacheKeys } from "../constants/cache-keys";
import { CreateProductDto } from "../dto/product/create-product.dto";
import { ListProductsDto } from "../dto/product/list-products.dto";
import { UpdateProductDto } from "../dto/product/update-product.dto";
import AppError from "../errors/app-error";
import categoryRepository from "../repositories/category.repository";
import productRepository from "../repositories/product.repository";
import { PaginatedResponse } from "../types/pagination.types";
import { Product } from "../types/product.types";
import cacheService from "./cache.service";

const PRODUCT_CACHE_TTL = 60 * 5;

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

    const product = await productRepository.create(dto);

    await cacheService.delByPrefix("products:");

    return product;
  }

  async getById(productId: string): Promise<Product> {
    const cacheKey = CacheKeys.PRODUCT(productId);

    const cached = await cacheService.get<Product>(cacheKey);

    if (cached) {
      return cached;
    }

    const product = await productRepository.findById(productId);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    await cacheService.set(cacheKey, product, PRODUCT_CACHE_TTL);

    return product;
  }

  async getAll(query: ListProductsDto): Promise<PaginatedResponse<Product>> {
    const cacheKey = CacheKeys.PRODUCTS(query);

    const cached = await cacheService.get<PaginatedResponse<Product>>(cacheKey);

    if (cached) {
      return cached;
    }

    const result = await productRepository.findAll(query);

    const response: PaginatedResponse<Product> = {
      data: result.data,
      page: query.page,
      limit: query.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / query.limit),
    };

    await cacheService.set(cacheKey, response, PRODUCT_CACHE_TTL);

    return response;
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

    await cacheService.del(CacheKeys.PRODUCT(productId));
    await cacheService.delByPrefix("products:");

    return updatedProduct;
  }

  async delete(productId: string): Promise<void> {
    const product = await productRepository.findById(productId);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    await productRepository.delete(productId);

    await cacheService.del(CacheKeys.PRODUCT(productId));
    await cacheService.delByPrefix("products:");
  }
}

export default new ProductService();
