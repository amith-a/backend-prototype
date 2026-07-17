import { Request, Response } from "express";

import cartService from "../services/cart.service";

class CartController {
  getCart = async (req: Request, res: Response) => {
    const cart = await cartService.getCart(req.user.id);

    return res.status(200).json({
      success: true,
      data: cart,
    });
  };

  addItem = async (req: Request, res: Response) => {
    await cartService.addItem(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      message: "Item added to cart",
    });
  };

  updateItem = async (req: Request<{ productId: string }>, res: Response) => {
    const { productId } = req.params;

    await cartService.updateItem(req.user.id, productId, req.body);

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
    });
  };

  removeItem = async (req: Request<{ productId: string }>, res: Response) => {
    const { productId } = req.params;

    await cartService.removeItem(req.user.id, productId);

    return res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
    });
  };

  clearCart = async (req: Request, res: Response) => {
    await cartService.clearCart(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  };
}

export default new CartController();
