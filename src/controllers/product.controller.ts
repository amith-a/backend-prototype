import { NextFunction, Request, Response } from "express";

import productService from "../services/product.service";
import { ListProductsDto } from "../dto/product/list-products.dto";

class ProductController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
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
      const product = await productService.getById(req.params.id);

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.getAll(
        req.query as unknown as ListProductsDto,
      );

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const product = await productService.update(req.params.id, req.body);

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
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
      await productService.delete(req.params.id);

      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
