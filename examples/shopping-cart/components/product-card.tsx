// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * ProductCard Component for Shopping Cart
 * Uses library Card component with custom children
 * Zero custom CSS - all styling from ui-lib
 * API spread operators preserved: {...api!.action()}
 */

import { h } from "jsx";
import { defineComponent, post } from "../../../mod.ts";
import "../../../lib/components/layout/card.ts";
import "../../../lib/components/layout/stack.ts";
import "../../../lib/components/feedback/badge.ts";
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
      <card variant="elevated" padding="md">
        <stack direction="vertical" gap="md">
          <div>
            <img src={product.imageUrl} alt={product.name} />
            {product.featured && <badge variant="primary">Featured</badge>}
          </div>
          <stack direction="vertical" gap="sm">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div>
              ⭐ {product.rating} ({product.reviewCount} reviews)
            </div>
            <div>
              <strong>${product.price.toFixed(2)}</strong>
              {product.originalPrice && (
                <span>
                  {" "}(was ${product.originalPrice.toFixed(2)})
                </span>
              )}
            </div>
            <button
              type="button"
              variant="primary"
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
          </stack>
        </stack>
      </card>
    ) as unknown as string;
  },
});

export const ShoppingProductCard = "shopping-product-card";
