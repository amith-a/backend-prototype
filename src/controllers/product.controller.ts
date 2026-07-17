import { Request, Response } from "express";

import productService from "../services/product.service";
import { ListProductsDto } from "../dto/product/list-products.dto";

class ProductController {
  create = async (req: Request, res: Response) => {
    const product = await productService.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  };

  getById = async (req: Request<{ id: string }>, res: Response) => {
    const product = await productService.getById(req.params.id);

    return res.status(200).json({
      success: true,
      data: product,
    });
  };

  getAll = async (req: Request, res: Response) => {
    const result = await productService.getAll(
      req.query as unknown as ListProductsDto,
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  };

  update = async (req: Request<{ id: string }>, res: Response) => {
    const product = await productService.update(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  };

  delete = async (req: Request<{ id: string }>, res: Response) => {
    await productService.delete(req.params.id);

    return res.sendStatus(204);
  };
}

export default new ProductController();
