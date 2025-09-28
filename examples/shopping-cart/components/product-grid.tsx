// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * ProductGrid Component - Library Component Composition
 *
 * Features:
 * - Responsive grid layout with Grid component
 * - Filtering and search functionality
 * - Sort options
 * - Pagination
 * - Loading states
 * - Empty states
 * - Library component variants for styling
 */

import { h, Fragment } from "jsx";
import { defineComponent } from "../../../mod.ts";
import type { Product, ProductCategory, ProductFilter } from "../api/types.ts";

export type ProductGridProps = {
  readonly products: readonly Product[];
  readonly filter?: ProductFilter;
  readonly loading?: boolean;
  readonly total?: number;
  readonly sessionId?: string;
  readonly className?: string;
};

// ============================================================
// Component Implementation
// ============================================================

defineComponent<ProductGridProps>("product-grid", {
  render: (props) => {
    const {
      products = [],
      filter = {},
      loading = false,
      total = 0,
      sessionId = "",
      className = "",
    } = props;

    const hasProducts = products.length > 0;
    const categories: ProductCategory[] = [
      "electronics",
      "clothing",
      "books",
      "home",
      "sports",
      "beauty",
      "toys",
    ];

    const renderFilterSidebar = () => (
      <stack direction="vertical" gap="lg">
        <h2 style={{
          margin: "0",
          fontSize: "1.125rem",
          fontWeight: "600",
          color: "#1F2937"
        }}>
          Filters
        </h2>

        {/* Search */}
        <div>
          <label style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "0.5rem"
          }}>
            Search Products
          </label>
          <form
            method="get"
            action="/api/products"
            hx-get="/api/products"
            hx-target="#product-grid"
            hx-swap="innerHTML"
            hx-trigger="input changed delay:300ms from:input[name='search'], change from:select"
          >
            <input
              type="text"
              name="search"
              placeholder="Search..."
              value={filter.search || ""}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
                fontSize: "1rem"
              }}
            />
            {filter.category && <input type="hidden" name="category" value={filter.category} />}
            {filter.minPrice && <input type="hidden" name="minPrice" value={filter.minPrice} />}
            {filter.maxPrice && <input type="hidden" name="maxPrice" value={filter.maxPrice} />}
            {filter.inStock && <input type="hidden" name="inStock" value="true" />}
            {filter.sortBy && <input type="hidden" name="sortBy" value={filter.sortBy} />}
          </form>
        </div>

        {/* Category Filter */}
        <div>
          <label style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "0.5rem"
          }}>
            Category
          </label>
          <select
            name="category"
            hx-get="/api/products"
            hx-target="#product-grid"
            hx-swap="innerHTML"
            hx-include="[name='search'], [name='sortBy'], [name='minPrice'], [name='maxPrice']"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #D1D5DB",
              borderRadius: "6px",
              fontSize: "1rem",
              background: "white"
            }}
          >
            <option value="">All Categories</option>
            <>
              {categories.map((cat) => (
                <option value={cat} selected={filter.category === cat}>
                  {capitalize(cat)}
                </option>
              ))}
            </>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "0.5rem"
          }}>
            Price Range
          </label>
          <grid columns="2" gap="sm">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={filter.minPrice || ""}
              min="0"
              step="0.01"
              hx-get="/api/products"
              hx-target="#product-grid"
              hx-swap="innerHTML"
              hx-trigger="input changed delay:500ms"
              hx-include="[name='search'], [name='category'], [name='sortBy'], [name='maxPrice']"
              style={{
                padding: "0.75rem",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
                fontSize: "1rem"
              }}
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={filter.maxPrice || ""}
              min="0"
              step="0.01"
              hx-get="/api/products"
              hx-target="#product-grid"
              hx-swap="innerHTML"
              hx-trigger="input changed delay:500ms"
              hx-include="[name='search'], [name='category'], [name='sortBy'], [name='minPrice']"
              style={{
                padding: "0.75rem",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
                fontSize: "1rem"
              }}
            />
          </grid>
        </div>

        {/* In Stock Filter */}
        <div>
          <label style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#374151"
          }}>
            <input
              type="checkbox"
              name="inStock"
              checked={filter.inStock}
              hx-get="/api/products"
              hx-target="#product-grid"
              hx-swap="innerHTML"
              hx-include="[name='search'], [name='category'], [name='sortBy'], [name='minPrice'], [name='maxPrice']"
              style={{
                width: "18px",
                height: "18px",
                accentColor: "#6366F1"
              }}
            />
            In Stock Only
          </label>
        </div>

        {/* Clear Filters */}
        <button
          variant="secondary"
          hx-get="/api/products"
          hx-target="#product-grid"
          hx-swap="innerHTML"
          style={{ width: "100%" }}
        >
          Clear All Filters
        </button>
      </stack>
    );

    const renderProductGridContent = () => {
      if (loading) {
        return (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
            color: "#6B7280"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ marginBottom: "1rem", fontSize: "2rem" }}>⏳</div>
              <p style={{ margin: "0" }}>Loading products...</p>
            </div>
          </div>
        );
      }

      if (!hasProducts) {
        return (
          <card
            variant="outlined"
            padding="xl"
            style={{
              textAlign: "center",
              minHeight: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <stack direction="vertical" gap="md">
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
              <h3 style={{
                margin: "0",
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#1F2937"
              }}>
                No products found
              </h3>
              <p style={{ margin: "0", color: "#6B7280" }}>
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <button
                variant="primary"
                hx-get="/api/products"
                hx-target="#product-grid"
                hx-swap="innerHTML"
                style={{ marginTop: "1rem" }}
              >
                View All Products
              </button>
            </stack>
          </card>
        );
      }

      return (
        <>
          <grid
            columns="responsive"
            gap="lg"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
          >
            <>
              {products.map((product) => (
                <product-card
                  product={JSON.stringify(product)}
                  show-quick-add="true"
                  show-description="true"
                />
              ))}
            </>
          </grid>

          {/* Pagination placeholder */}
          <div style={{
            marginTop: "2rem",
            paddingTop: "2rem",
            borderTop: "1px solid #E5E7EB",
            textAlign: "center"
          }}>
            <stack direction="horizontal" gap="md" style={{ justifyContent: "center" }}>
              <button variant="secondary" disabled>
                Previous
              </button>
              <span style={{ padding: "0.5rem 1rem", color: "#6B7280" }}>
                Page 1 of 1
              </span>
              <button variant="secondary" disabled>
                Next
              </button>
            </stack>
          </div>
        </>
      );
    };

    return (
      <div class={className} data-session={sessionId}>
        <grid
          columns="4"
          gap="lg"
          responsive
          style={{ gridTemplateColumns: "300px 1fr" }}
        >
          {/* Filter Sidebar */}
          <section style={{ gridColumn: "1" }}>
            <card variant="outlined" padding="lg">
              {renderFilterSidebar()}
            </card>
          </section>

          {/* Product Grid */}
          <section style={{ gridColumn: "2" }}>
            <stack direction="vertical" gap="lg">
              {/* Header with Sort */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <h1 style={{
                  margin: "0",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#1F2937"
                }}>
                  Products{total > 0 ? ` (${total})` : ""}
                </h1>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <label style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#374151"
                  }}>
                    Sort by:
                  </label>
                  <select
                    name="sortBy"
                    hx-get="/api/products"
                    hx-target="#product-grid"
                    hx-swap="innerHTML"
                    hx-include="[name='search'], [name='category'], [name='minPrice'], [name='maxPrice'], [name='inStock']"
                    style={{
                      padding: "0.5rem",
                      border: "1px solid #D1D5DB",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      background: "white"
                    }}
                  >
                    <option value="name" selected={filter.sortBy === "name"}>Name</option>
                    <option value="price" selected={filter.sortBy === "price"}>Price</option>
                    <option value="rating" selected={filter.sortBy === "rating"}>Rating</option>
                    <option value="newest" selected={filter.sortBy === "newest"}>Newest</option>
                  </select>
                </div>
              </div>

              {/* Product Grid Content */}
              <div id="product-grid">
                {renderProductGridContent()}
              </div>
            </stack>
          </section>
        </grid>
      </div>
    );
  },
});

// ============================================================
// Helper Functions
// ============================================================


function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export the component string for use in templates
export const ProductGrid = "product-grid";