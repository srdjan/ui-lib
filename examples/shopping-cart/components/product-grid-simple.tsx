/**
 * Product Grid Component - Simplified Version
 *
 * Demonstrates:
 * - Responsive CSS Grid layout
 * - Search and filtering functionality
 * - HTMX for dynamic updates
 * - Accessibility features
 */

import type { Product } from "../api/types.ts";
import { ProductCard } from "./product-card-simple.tsx";

export interface ProductGridProps {
  products: Product[];
  sessionId: string;
  showFilters?: boolean;
  showSearch?: boolean;
  showSort?: boolean;
  currentCategory?: string;
  currentSearch?: string;
  currentSort?: string;
}

export function ProductGrid({
  products,
  sessionId,
  showFilters = true,
  showSearch = true,
  showSort = true,
  currentCategory = "",
  currentSearch = "",
  currentSort = "name",
}: ProductGridProps): string {
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return `
    <div class="product-grid-container">
      ${
    showFilters || showSearch || showSort
      ? `
        <div class="product-filters">
          ${
        showSearch
          ? `
            <div class="filter-group">
              <label for="product-search" class="filter-label">Search Products</label>
              <input
                type="text"
                id="product-search"
                class="filter-input"
                placeholder="Search products..."
                value="${currentSearch}"
                hx-get="/api/products"
                hx-trigger="input changed delay:300ms"
                hx-target="#product-grid"
                hx-swap="innerHTML"
                hx-include=".product-filters input, .product-filters select"
                name="search"
              >
            </div>
          `
          : ""
      }

          ${
        showFilters
          ? `
            <div class="filter-group">
              <label for="category-filter" class="filter-label">Category</label>
              <select
                id="category-filter"
                class="filter-select"
                name="category"
                hx-get="/api/products"
                hx-trigger="change"
                hx-target="#product-grid"
                hx-swap="innerHTML"
                hx-include=".product-filters input, .product-filters select"
              >
                <option value="">All Categories</option>
                ${
            categories.map((category) => `
                  <option value="${category}" ${
              currentCategory === category ? "selected" : ""
            }>
                    ${category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                `).join("")
          }
              </select>
            </div>
          `
          : ""
      }

          ${
        showSort
          ? `
            <div class="filter-group">
              <label for="sort-filter" class="filter-label">Sort By</label>
              <select
                id="sort-filter"
                class="filter-select"
                name="sort"
                hx-get="/api/products"
                hx-trigger="change"
                hx-target="#product-grid"
                hx-swap="innerHTML"
                hx-include=".product-filters input, .product-filters select"
              >
                <option value="name" ${
            currentSort === "name" ? "selected" : ""
          }>Name</option>
                <option value="price-low" ${
            currentSort === "price-low" ? "selected" : ""
          }>Price: Low to High</option>
                <option value="price-high" ${
            currentSort === "price-high" ? "selected" : ""
          }>Price: High to Low</option>
                <option value="rating" ${
            currentSort === "rating" ? "selected" : ""
          }>Rating</option>
              </select>
            </div>
          `
          : ""
      }

          <div class="filter-results">
            <span class="results-count">${products.length} product${
        products.length !== 1 ? "s" : ""
      } found</span>
          </div>
        </div>
      `
      : ""
  }

      <div id="product-grid" class="product-grid">
        ${
    products.length > 0
      ? products.map((product) => ProductCard({ product, sessionId })).join("")
      : `
          <div class="no-products">
            <div class="no-products__icon">📦</div>
            <h3 class="no-products__title">No products found</h3>
            <p class="no-products__message">Try adjusting your search or filters.</p>
          </div>
        `
  }
      </div>

      <!-- Cart feedback area -->
      <div id="cart-feedback" class="cart-feedback" role="status" aria-live="polite"></div>
    </div>

    <style>
      .product-grid-container {
        width: 100%;
      }

      .product-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        padding: 1.5rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
        align-items: end;
      }

      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 200px;
        flex: 1;
      }

      .filter-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #374151;
      }

      .filter-input,
      .filter-select {
        padding: 0.75rem;
        border: 1px solid #D1D5DB;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 200ms ease, box-shadow 200ms ease;
        background: white;
      }

      .filter-input:focus,
      .filter-select:focus {
        outline: none;
        border-color: #6366F1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }

      .filter-results {
        display: flex;
        align-items: center;
        padding-top: 1.5rem;
        margin-left: auto;
      }

      .results-count {
        font-size: 0.875rem;
        color: #6B7280;
        font-weight: 500;
      }

      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
        padding: 0;
      }

      .no-products {
        grid-column: 1 / -1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        text-align: center;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .no-products__icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
      }

      .no-products__title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1F2937;
        margin: 0 0 0.5rem 0;
      }

      .no-products__message {
        font-size: 1rem;
        color: #6B7280;
        margin: 0;
      }

      .cart-feedback {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 1000;
        pointer-events: none;
      }

      .cart-feedback .success-message {
        background: #ECFDF5;
        color: #059669;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border: 1px solid #10B981;
        font-weight: 500;
        animation: slideIn 300ms ease-out;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      /* Loading states */
      .product-grid.htmx-request {
        opacity: 0.7;
        pointer-events: none;
      }

      .filter-input.htmx-request,
      .filter-select.htmx-request {
        background: #F3F4F6;
      }

      /* Mobile responsiveness */
      @media (max-width: 768px) {
        .product-filters {
          flex-direction: column;
          align-items: stretch;
        }

        .filter-group {
          min-width: auto;
        }

        .filter-results {
          margin-left: 0;
          padding-top: 0;
          border-top: 1px solid #E5E7EB;
          padding-top: 1rem;
          margin-top: 1rem;
        }

        .product-grid {
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }

        .cart-feedback {
          top: auto;
          bottom: 1rem;
          left: 1rem;
          right: 1rem;
        }
      }

      @media (max-width: 480px) {
        .product-filters {
          padding: 1rem;
        }

        .product-grid {
          grid-template-columns: 1fr;
        }
      }

      /* High contrast mode */
      @media (prefers-contrast: high) {
        .product-filters,
        .no-products {
          border: 2px solid #000;
        }

        .filter-input,
        .filter-select {
          border-width: 2px;
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .cart-feedback .success-message {
          animation: none;
        }
      }
    </style>
  `;
}
