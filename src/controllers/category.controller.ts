import { Request, Response } from "express";
import categoryService from "../services/category.service";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../dto/category/category.dto";

class CategoryController {
  create = async (req: Request, res: Response) => {
    const category = await categoryService.create(
      req.validated.body as CreateCategoryDto,
    );
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

  getById = async (req: Request, res: Response) => {
    const { id } = req.validated.params as { id: string };
    const category = await categoryService.getById(id);
    return res.status(200).json({
      success: true,
      data: category,
    });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.validated.params as { id: string };
    const body = req.validated.body as UpdateCategoryDto;
    const category = await categoryService.update(id, body);
    return res.status(200).json({
      success: true,
      data: category,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.validated.params as { id: string };
    await categoryService.delete(id);
    return res.sendStatus(204);
  };
}

export default new CategoryController();
