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
    <div class="filter-buttons">
      <button
        class="filter-btn filter-btn--primary"
        {...api!.featured(hx({ target: "#product-grid", swap: "innerHTML" }))}
      >
        🌟 Featured Products
      </button>
      <button
        class="filter-btn filter-btn--secondary"
        {...api!.electronics(hx({ target: "#product-grid", swap: "innerHTML" }))}
      >
        📱 Electronics
      </button>
      <button
        class="filter-btn filter-btn--secondary"
        {...api!.clothing(hx({ target: "#product-grid", swap: "innerHTML" }))}
      >
        👕 Clothing
      </button>
    </div>
  ) as unknown as string,
});

export const ProductFilters = "product-filters";
