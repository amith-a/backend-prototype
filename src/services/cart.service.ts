import { AddCartItemDto, UpdateCartItemDto } from "../dto/cart/cart.dto";
import AppError from "../errors/app-error";
import cartRepository from "../repositories/cart.repository";
import productRepository from "../repositories/product.repository";
import { CartResponse } from "../types/cart.type";

class CartService {
  async getCart(userId: string): Promise<CartResponse> {
    const cart = await cartRepository.findCartByUserId(userId);

    if (!cart) {
      return {
        items: [],
        total: "0.00",
      };
    }

    const items = await cartRepository.getItems(cart.id);

    let total = 0;

    const data = items.map((item) => {
      const subtotal = Number(item.price) * item.quantity;

      total += subtotal;

      return {
        ...item,
        subtotal: subtotal.toFixed(2),
      };
    });

    return {
      id: cart.id,
      userId: cart.userId,
      items: data,
      total: total.toFixed(2),
    };
  }

  async addItem(userId: string, dto: AddCartItemDto): Promise<void> {
    let cart = await cartRepository.findCartByUserId(userId);

    if (!cart) {
      cart = await cartRepository.createCart(userId);
    }

    const product = await productRepository.findById(dto.productId);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const item = await cartRepository.findItem(cart.id, dto.productId);

    if (item) {
      await cartRepository.updateItemQuantity(
        item.id,
        cart.id,
        item.quantity + dto.quantity,
      );

      return;
    }

    await cartRepository.createItem(cart.id, dto);
  }

  async updateItem(
    userId: string,
    productId: string,
    dto: UpdateCartItemDto,
  ): Promise<void> {
    const cart = await cartRepository.findCartByUserId(userId);

    if (!cart) {
      throw new AppError("Cart item not found", 404);
    }

    const item = await cartRepository.findItem(cart.id, productId);

    if (!item) {
      throw new AppError("Cart item not found", 404);
    }

    await cartRepository.updateItemQuantity(item.id, cart.id, dto.quantity);
  }

  async removeItem(userId: string, productId: string): Promise<void> {
    const cart = await cartRepository.findCartByUserId(userId);

    if (!cart) {
      throw new AppError("Cart item not found", 404);
    }

    const item = await cartRepository.findItem(cart.id, productId);

    if (!item) {
      throw new AppError("Cart item not found", 404);
    }

    await cartRepository.deleteItem(item.id, cart.id);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await cartRepository.findCartByUserId(userId);

    if (!cart) {
      return;
    }

    await cartRepository.clearCart(cart.id);
  }
}

export default new CartService();
