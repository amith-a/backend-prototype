import categoryRepository from "../repositories/category.repository";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../dto/category/category.dto";
import { Category } from "../types/category.types";
import AppError from "../errors/app-error";
import cacheService from "./cache.service";

const CATEGORY_CACHE_KEY = "categories";
const CATEGORY_CACHE_TTL = 60 * 5; // 5 minutes

class CategoryService {
  async create(dto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await categoryRepository.findByName(dto.name);

    if (existingCategory) {
      throw new AppError("Category already exists", 409);
    }

    const category = categoryRepository.create(dto);

    await cacheService.del(CATEGORY_CACHE_KEY);

    return category;
  }

  async getById(categoryId: string): Promise<Category> {
    const category = await categoryRepository.findById(categoryId);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return category;
  }

  async getAll(): Promise<Category[]> {
    const cached = await cacheService.get<Category[]>(CATEGORY_CACHE_KEY);

    if (cached) {
      return cached;
    }

    const categories = await categoryRepository.findAll();

    await cacheService.set(CATEGORY_CACHE_KEY, categories, CATEGORY_CACHE_TTL);

    return categories;
  }

  async update(categoryId: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await categoryRepository.findById(categoryId);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    if (dto.name && dto.name !== category.name) {
      const existingCategory = await categoryRepository.findByName(dto.name);

      if (existingCategory && existingCategory.id !== categoryId) {
        throw new AppError("Category already exists", 409);
      }
    }

    const updatedCategory = await categoryRepository.update(categoryId, dto);

    await cacheService.del(CATEGORY_CACHE_KEY);

    return updatedCategory;
  }

  async delete(categoryId: string): Promise<void> {
    const category = await categoryRepository.findById(categoryId);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    await categoryRepository.delete(categoryId);

    await cacheService.del(CATEGORY_CACHE_KEY);
  }
}
export default new CategoryService();
