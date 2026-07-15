import { NextFunction, Request, Response } from "express";
import categoryService from "../services/category.service";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../dto/category/category.dto";

class CategoryController {
  async create(
    req: Request<{}, {}, CreateCategoryDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const category = await categoryService.create(req.body);
      return res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAll();
      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const category = await categoryService.getById(req.params.id);
      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request<{ id: string }, {}, UpdateCategoryDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const category = await categoryService.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await categoryService.delete(req.params.id);
      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
