// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * ProductCard Component for Shopping Cart
 * Wraps the library ProductCard component with shopping-specific actions
 */

import { h } from "jsx";
import { defineComponent, post } from "../../../mod.ts";
import "../../../lib/components/data-display/product-card.tsx";
import { addToCart } from "../api/handlers.tsx";

import type { Product } from "../api/types.ts";

export type ProductCardProps = {
  readonly product: Product;
  readonly sessionId: string;
};

defineComponent<ProductCardProps>("shopping-product-card", {
  api: {
    addToCart: post("/api/cart/add", addToCart),
  },
  render: ({ product, sessionId }, api) => {
    return (
      <div class="product-card">
        <div class="product-image">
          <img src={product.imageUrl} alt={product.name} />
          {product.featured && <span class="badge">Featured</span>}
        </div>
        <div class="product-content">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <div class="product-rating">
            ⭐ {product.rating} ({product.reviewCount} reviews)
          </div>
          <div class="product-price">
            <span class="price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span class="original-price">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            type="button"
            class="add-to-cart-btn"
            disabled={!product.inStock}
            {...api!.addToCart()}
            hx-vals={JSON.stringify({
              productId: product.id,
              quantity: 1,
              sessionId,
            })}
            hx-target="#cart-count"
            hx-ext="json-enc"
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    ) as unknown as string;
  },
});

export const ShoppingProductCard = "shopping-product-card";
