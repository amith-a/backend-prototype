import { NextFunction, Request, Response } from "express";

import cartService from "../services/cart.service";

class CartController {
  async getCart(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const cart = await cartService.getCart(req.user.id);

      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async addItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await cartService.addItem(req.user.id, req.body);

      res.status(201).json({
        success: true,
        message: "Item added to cart",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateItem(
    req: Request<{ productId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { productId } = req.params;

      await cartService.updateItem(req.user.id, productId, req.body);

      res.status(200).json({
        success: true,
        message: "Cart item updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(
    req: Request<{ productId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { productId } = req.params;

      await cartService.removeItem(req.user.id, productId);

      res.status(200).json({
        success: true,
        message: "Cart item removed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async clearCart(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await cartService.clearCart(req.user.id);

      res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CartController();
