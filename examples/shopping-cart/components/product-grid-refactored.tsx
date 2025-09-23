/** @jsx h */
/**
 * Product Grid Component
 *
 * Following ui-lib principles:
 * - JSX only
 * - CSS-in-TS for styles
 * - Component variants via props
 * - Collocated API for product filtering
 * - DOM-based state for filters
 */

import { h } from "../../../lib/jsx-runtime.ts";
import { defineComponent } from "../../../lib/define-component.ts";
import { composeStyles, css } from "../../../lib/css-in-ts.ts";
import { html } from "../../../lib/response.ts";
import type { Product } from "../api/types.ts";
import { getRepository } from "../api/repository.ts";

// Component styles
const styles = {
  container: css({
    width: "100%",
  }),

  filters: css({
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    padding: "1.5rem",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "2rem",
    alignItems: "end",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      alignItems: "stretch",
    },
  }),

  filterGroup: css({
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    minWidth: "200px",
    flex: 1,
  }),

  filterLabel: css({
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
  }),

  filterInput: css({
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "border-color 200ms ease, box-shadow 200ms ease",
    background: "white",
    "&:focus": {
      outline: "none",
      borderColor: "#6366f1",
      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
    },
  }),

  filterSelect: css({
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "1rem",
    background: "white",
    cursor: "pointer",
    "&:focus": {
      outline: "none",
      borderColor: "#6366f1",
      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
    },
  }),

  results: css({
    display: "flex",
    alignItems: "center",
    paddingTop: "1.5rem",
    marginLeft: "auto",
  }),

  resultsCount: css({
    fontSize: "0.875rem",
    color: "#6b7280",
    fontWeight: "500",
  }),

  grid: css({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
    padding: 0,
    "@media (max-width: 480px)": {
      gridTemplateColumns: "1fr",
    },
  }),

  noProducts: css({
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem 2rem",
    textAlign: "center",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  }),

  noProductsIcon: css({
    fontSize: "4rem",
    marginBottom: "1rem",
    opacity: 0.5,
  }),

  noProductsTitle: css({
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1f2937",
    margin: "0 0 0.5rem 0",
  }),

  noProductsMessage: css({
    fontSize: "1rem",
    color: "#6b7280",
    margin: 0,
  }),

  loading: css({
    gridColumn: "1 / -1",
    display: "flex",
    justifyContent: "center",
    padding: "2rem",
    opacity: 0.7,
  }),
};

// Define the component
defineComponent("product-grid", {
  props: (attrs) => ({
    products: JSON.parse(attrs["data-products"] || "[]") as Product[],
    sessionId: attrs["data-session"] || "default",
    showFilters: attrs["data-show-filters"] !== "false",
    showSearch: attrs["data-show-search"] !== "false",
    showSort: attrs["data-show-sort"] !== "false",
    currentCategory: attrs["data-category"] || "",
    currentSearch: attrs["data-search"] || "",
    currentSort: attrs["data-sort"] || "name",
  }),

  styles: styles,

  api: {
    filterProducts: ["GET", "/api/products/filter", async (req) => {
      try {
        const url = new URL(req.url);
        const repository = getRepository();

        const filter = {
          category: url.searchParams.get("category") || undefined,
          search: url.searchParams.get("search") || undefined,
          sortBy: url.searchParams.get("sort") || "name",
          inStock: url.searchParams.get("inStock") === "true" || undefined,
          featured: url.searchParams.get("featured") === "true" || undefined,
        };

        const result = await repository.getProducts(filter, {
          page: 1,
          limit: 20,
        });

        if (!result.ok) {
          return html(`
            <div class="${styles.noProducts}">
              <p>Error loading products</p>
            </div>
          `);
        }

        const products = result.value.items;
        const sessionId = url.searchParams.get("session") || "default";

        if (products.length === 0) {
          return html(`
            <div class="${styles.noProducts}">
              <div class="${styles.noProductsIcon}">📦</div>
              <h3 class="${styles.noProductsTitle}">No products found</h3>
              <p class="${styles.noProductsMessage}">Try adjusting your filters.</p>
            </div>
          `);
        }

        // Render products using product-card components
        const productsHtml = products.map((product) => `
          <product-card
            data-product='${JSON.stringify(product)}'
            data-variant="default"
            data-session="${sessionId}"
            data-show-description="true"
            data-show-rating="true"
          ></product-card>
        `).join("");

        return html(productsHtml);
      } catch (err) {
        return html(
          `<div class="${styles.noProducts}">Error loading products</div>`,
        );
      }
    }],
  },

  render: (props, api, classes) => {
    const {
      products,
      sessionId,
      showFilters,
      showSearch,
      showSort,
      currentCategory,
      currentSearch,
      currentSort,
    } = props;

    // Get unique categories from products
    const categories = Array.from(new Set(products.map((p) => p.category)));

    return (
      <div class={styles.container}>
        {/* Filters */}
        {(showFilters || showSearch || showSort) && (
          <div class={styles.filters}>
            {/* Search */}
            {showSearch && (
              <div class={styles.filterGroup}>
                <label for="product-search" class={styles.filterLabel}>
                  Search Products
                </label>
                <input
                  type="text"
                  id="product-search"
                  class={styles.filterInput}
                  placeholder="Search products..."
                  value={currentSearch}
                  name="search"
                  {...api.filterProducts()}
                  hx-get="/api/products/filter"
                  hx-trigger="input changed delay:300ms"
                  hx-target="#product-grid"
                  hx-swap="innerHTML"
                  hx-include=".product-filters input, .product-filters select"
                  hx-params={`session=${sessionId}`}
                />
              </div>
            )}

            {/* Category Filter */}
            {showFilters && (
              <div class={styles.filterGroup}>
                <label for="category-filter" class={styles.filterLabel}>
                  Category
                </label>
                <select
                  id="category-filter"
                  class={styles.filterSelect}
                  name="category"
                  {...api.filterProducts()}
                  hx-get="/api/products/filter"
                  hx-trigger="change"
                  hx-target="#product-grid"
                  hx-swap="innerHTML"
                  hx-include=".product-filters input, .product-filters select"
                  hx-params={`session=${sessionId}`}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option
                      value={category}
                      selected={currentCategory === category}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort */}
            {showSort && (
              <div class={styles.filterGroup}>
                <label for="sort-filter" class={styles.filterLabel}>
                  Sort By
                </label>
                <select
                  id="sort-filter"
                  class={styles.filterSelect}
                  name="sort"
                  {...api.filterProducts()}
                  hx-get="/api/products/filter"
                  hx-trigger="change"
                  hx-target="#product-grid"
                  hx-swap="innerHTML"
                  hx-include=".product-filters input, .product-filters select"
                  hx-params={`session=${sessionId}`}
                >
                  <option value="name" selected={currentSort === "name"}>
                    Name
                  </option>
                  <option
                    value="price-low"
                    selected={currentSort === "price-low"}
                  >
                    Price: Low to High
                  </option>
                  <option
                    value="price-high"
                    selected={currentSort === "price-high"}
                  >
                    Price: High to Low
                  </option>
                  <option value="rating" selected={currentSort === "rating"}>
                    Rating
                  </option>
                </select>
              </div>
            )}

            {/* Results count */}
            <div class={styles.results}>
              <span class={styles.resultsCount}>
                {products.length} product{products.length !== 1 ? "s" : ""}{" "}
                found
              </span>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div
          id="product-grid"
          class={`product-grid ${styles.grid}`}
          data-product-count={products.length}
        >
          {products.length > 0
            ? (
              products.map((product) => (
                <product-card
                  data-product={JSON.stringify(product)}
                  data-variant="default"
                  data-session={sessionId}
                  data-show-description="true"
                  data-show-rating="true"
                />
              ))
            )
            : (
              <div class={styles.noProducts}>
                <div class={styles.noProductsIcon}>📦</div>
                <h3 class={styles.noProductsTitle}>No products found</h3>
                <p class={styles.noProductsMessage}>
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
        </div>

        {/* Cart feedback area */}
        <div
          id="cart-feedback"
          class="cart-feedback"
          role="status"
          aria-live="polite"
        />
      </div>
    );
  },
});

// Export styles
export { styles as productGridStyles };
