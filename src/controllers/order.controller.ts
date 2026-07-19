import { Request, Response } from "express";
import orderService from "../services/order.service";
import { OrderHistoryFilters } from "../types/order.types";

class OrderController {
  async create(req: Request, res: Response) {
    const order = await orderService.create(req.user.id);

    return res.status(201).json({
      success: true,
      data: order,
    });
  }

  async findById(req: Request, res: Response) {
    const { id } = req.validated.params as { id: string };
    const order = await orderService.findById(id, req.user.id);

    return res.status(200).json({
      success: true,
      data: order,
    });
  }

  async findOrderHistory(req: Request, res: Response) {
    const filters = req.validated.query as OrderHistoryFilters;

    const orders = await orderService.findOrderHistory(req.user.id, filters);

    return res.status(200).json({
      success: true,
      data: orders,
    });
  }
}

export default new OrderController();
