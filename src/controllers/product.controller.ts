import { Request, Response } from "express";

import productService from "../services/product.service";
import { ListProductsDto } from "../dto/product/list-products.dto";
import { CreateProductDto } from "../dto/product/create-product.dto";
import { UpdateProductDto } from "../dto/product/update-product.dto";

class ProductController {
  create = async (req: Request, res: Response) => {
    const body = req.validated.body as CreateProductDto;
    const product = await productService.create(body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.validated.params as { id: string };

    const product = await productService.getById(id);

    return res.status(200).json({
      success: true,
      data: product,
    });
  };

  getAll = async (req: Request, res: Response) => {
    const query = req.validated.query as ListProductsDto;

    const result = await productService.getAll(query);

    return res.status(200).json({
      success: true,
      ...result,
    });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.validated.params as { id: string };
    const body = req.validated.body as UpdateProductDto;

    const product = await productService.update(id, body);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.validated.params as { id: string };

    await productService.delete(id);

    return res.sendStatus(204);
  };
}

export default new ProductController();
