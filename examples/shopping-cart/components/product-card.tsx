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
    const availability = product.inStock ? "in_stock" : "out_of_stock";

    // Generate HTMX attributes for add to cart action
    const addToCartAttrs = product.inStock
      ? {
        ...api!.addToCart(),
        "hx-vals": JSON.stringify({
          productId: product.id,
          quantity: 1,
          sessionId,
        }),
        "hx-target": "#cart-count",
        "hx-ext": "json-enc",
      }
      : {};

    // Convert attributes object to string for library component
    const attributesString = Object.entries(addToCartAttrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");

    return (
      <product-card
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          price: product.price,
          currency: "USD",
          originalPrice: product.originalPrice,
          rating: product.rating,
          reviewCount: product.reviewCount,
          badges: product.featured
            ? [{ label: "Featured", tone: "info" }]
            : [],
          featured: Boolean(product.featured),
          availability,
        }}
        size="md"
        appearance="default"
        layout="vertical"
        showDescription={true}
        showRating={true}
        highlightSale={true}
        primaryAction={{
          label: product.inStock ? "Add to Cart" : "Out of Stock",
          variant: "primary",
          fullWidth: true,
          disabled: !product.inStock,
          attributes: attributesString,
        }}
      />
    ) as unknown as string;
  },
});

export const ShoppingProductCard = "shopping-product-card";
