import { Request, Response } from "express";
import categoryService from "../services/category.service";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../dto/category/category.dto";

class CategoryController {
  create = async (req: Request<{}, {}, CreateCategoryDto>, res: Response) => {
    const category = await categoryService.create(req.body);
    return res.status(201).json({
      success: true,
      data: category,
    });
  };

  getAll = async (_req: Request, res: Response) => {
    const categories = await categoryService.getAll();
    return res.status(200).json({
      success: true,
      data: categories,
    });
  };

  getById = async (req: Request<{ id: string }>, res: Response) => {
    const category = await categoryService.getById(req.params.id);
    return res.status(200).json({
      success: true,
      data: category,
    });
  };

  update = async (
    req: Request<{ id: string }, {}, UpdateCategoryDto>,
    res: Response,
  ) => {
    const category = await categoryService.update(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      data: category,
    });
  };

  delete = async (req: Request<{ id: string }>, res: Response) => {
    await categoryService.delete(req.params.id);
    return res.sendStatus(204);
  };
}

export default new CategoryController();
