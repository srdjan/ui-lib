// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * CartItem Component
 * Individual cart item with quantity controls and remove button
 * HTMX hidden via API helpers
 */

import { h } from "jsx";
import { del, defineComponent, hx, patch } from "../../../mod.ts";
import { removeFromCart, updateCartItem } from "../api/handlers.tsx";

import type { CartItem as CartItemType } from "../api/types.ts";

export type CartItemProps = {
  readonly item: CartItemType;
};

defineComponent<CartItemProps>("cart-item", {
  api: {
    decreaseQuantity: patch("/api/cart/items/:id", updateCartItem),
    increaseQuantity: patch("/api/cart/items/:id", updateCartItem),
    remove: del("/api/cart/items/:id", removeFromCart),
  },
  render: ({ item }, api) => {
    const targetOptions = hx({
      target: "#cart-sidebar .cart-items",
      swap: "innerHTML",
      ext: "json-enc",
    });

    return (
      <div class="cart-item">
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          class="cart-item__image"
        />
        <div class="cart-item__details">
          <h4 class="cart-item__name">{item.product.name}</h4>
          <div class="cart-item__price">${item.unitPrice.toFixed(2)}</div>
          <div class="cart-item__quantity">
            <button
              class="quantity-btn"
              disabled={item.quantity <= 1}
              {...api!.decreaseQuantity(
                item.id,
                hx({
                  ...targetOptions,
                  vals: { quantity: Math.max(1, item.quantity - 1) },
                }),
              )}
            >
              -
            </button>
            <span class="quantity-value">{item.quantity}</span>
            <button
              class="quantity-btn"
              {...api!.increaseQuantity(
                item.id,
                hx({
                  ...targetOptions,
                  vals: { quantity: item.quantity + 1 },
                }),
              )}
            >
              +
            </button>
          </div>
        </div>
        <button
          class="cart-item__remove"
          title="Remove item"
          {...api!.remove(item.id, targetOptions)}
        >
          ×
        </button>
      </div>
    ) as unknown as string;
  },
});

export const CartItem = "cart-item";
