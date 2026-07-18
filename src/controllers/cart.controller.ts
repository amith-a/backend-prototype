import { Request, Response } from "express";

import cartService from "../services/cart.service";
import { AddCartItemDto, UpdateCartItemDto } from "../dto/cart/cart.dto";

class CartController {
  getCart = async (req: Request, res: Response) => {
    const cart = await cartService.getCart(req.user.id);

    return res.status(200).json({
      success: true,
      data: cart,
    });
  };

  addItem = async (req: Request, res: Response) => {
    const body = req.validated.body as AddCartItemDto;

    await cartService.addItem(req.user.id, body);

    return res.status(201).json({
      success: true,
      message: "Item added to cart",
    });
  };

  updateItem = async (req: Request, res: Response) => {
    const { productId } = req.validated.params as { productId: string };
    const body = req.validated.body as UpdateCartItemDto;

    await cartService.updateItem(req.user.id, productId, body);

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
    });
  };

  removeItem = async (req: Request, res: Response) => {
    const { productId } = req.validated.params as { productId: string };

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
