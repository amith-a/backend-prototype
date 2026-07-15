import categoryRepository from "../repositories/category.repository";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../dto/category/category.dto";
import { Category } from "../types/category.types";
import AppError from "../errors/app-error";

class CategoryService {
  async create(dto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await categoryRepository.findByName(dto.name);

    if (existingCategory) {
      throw new AppError("Category already exists", 409);
    }

    return categoryRepository.create(dto);
  }

  async getById(categoryId: string): Promise<Category> {
    const category = await categoryRepository.findById(categoryId);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return category;
  }

  async getAll(): Promise<Category[]> {
    return categoryRepository.findAll();
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

    return categoryRepository.update(categoryId, dto);
  }

  async delete(categoryId: string): Promise<void> {
    const category = await categoryRepository.findById(categoryId);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    await categoryRepository.delete(categoryId);
  }
}
export default new CategoryService();
