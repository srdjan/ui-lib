// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * ProductFilters Component
 * Filter buttons for product categories - HTMX hidden via API helpers
 */

import { h } from "jsx";
import { defineComponent, get, hx } from "../../../mod.ts";

defineComponent("product-filters", {
  api: {
    featured: get("/api/products?featured=true", () => new Response("")),
    electronics: get("/api/products?category=electronics", () => new Response("")),
    clothing: get("/api/products?category=clothing", () => new Response("")),
  },
  render: (_props, api) => (
    <div style="display: flex; gap: var(--spacing-md); margin-bottom: var(--spacing-xl);">
      <button
        style="padding: var(--spacing-md) var(--spacing-lg); background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: var(--layout-border-radius); font-weight: var(--typography-weight-medium); cursor: pointer;"
        {...api!.featured(hx({ target: "#product-grid", swap: "innerHTML" }))}
      >
        🌟 Featured Products
      </button>
      <button
        style="padding: var(--spacing-md) var(--spacing-lg); background: var(--color-secondary); color: var(--color-on-secondary); border: none; border-radius: var(--layout-border-radius); font-weight: var(--typography-weight-medium); cursor: pointer;"
        {...api!.electronics(hx({ target: "#product-grid", swap: "innerHTML" }))}
      >
        📱 Electronics
      </button>
      <button
        style="padding: var(--spacing-md) var(--spacing-lg); background: var(--color-secondary); color: var(--color-on-secondary); border: none; border-radius: var(--layout-border-radius); font-weight: var(--typography-weight-medium); cursor: pointer;"
        {...api!.clothing(hx({ target: "#product-grid", swap: "innerHTML" }))}
      >
        👕 Clothing
      </button>
    </div>
  ) as unknown as string,
});

export const ProductFilters = "product-filters";
