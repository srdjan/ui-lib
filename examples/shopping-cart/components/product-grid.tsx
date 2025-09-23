/** @jsx h */
/**
 * ProductGrid Component - Token-Based Product Catalog
 *
 * Features:
 * - Responsive grid layout with CSS Grid
 * - Filtering and search functionality
 * - Sort options
 * - Pagination
 * - Loading states
 * - Empty states
 * - Token-based customization
 */

import { h } from "jsx";
import { createTokenComponent } from "../../../lib/tokens/component-factory.ts";
import type { ComponentTokens } from "../../../lib/tokens/component-tokens.ts";
import type { Product, ProductCategory, ProductFilter } from "../api/types.ts";

// ============================================================
// Token Contract Definition
// ============================================================

export type ProductGridTokens = ComponentTokens<{
  // Container
  container: {
    padding: string;
    gap: string;
    background: string;
    borderRadius: string;
    minHeight: string;
  };

  // Filter sidebar
  filters: {
    width: string;
    padding: string;
    background: string;
    borderRadius: string;
    border: string;
    marginBottom: string;
  };

  // Filter groups
  filterGroup: {
    marginBottom: string;
    paddingBottom: string;
    borderBottom: string;
  };

  // Filter labels
  filterLabel: {
    fontSize: string;
    fontWeight: string;
    color: string;
    marginBottom: string;
  };

  // Filter inputs
  filterInput: {
    padding: string;
    border: string;
    borderRadius: string;
    fontSize: string;
    background: string;
    color: string;
    width: string;
  };

  // Search bar
  searchBar: {
    padding: string;
    border: string;
    borderRadius: string;
    fontSize: string;
    background: string;
    width: string;
    marginBottom: string;
  };

  // Sort controls
  sortControls: {
    padding: string;
    background: string;
    borderRadius: string;
    marginBottom: string;
    gap: string;
  };

  // Sort select
  sortSelect: {
    padding: string;
    border: string;
    borderRadius: string;
    background: string;
    fontSize: string;
    cursor: string;
  };

  // Grid area
  gridArea: {
    flex: string;
    minWidth: string;
  };

  // Products grid
  grid: {
    display: string;
    gridTemplateColumns: string;
    gap: string;
    padding: string;
  };

  // Grid responsive breakpoints
  gridMobile: {
    gridTemplateColumns: string;
    gap: string;
  };

  gridTablet: {
    gridTemplateColumns: string;
    gap: string;
  };

  gridDesktop: {
    gridTemplateColumns: string;
    gap: string;
  };

  // Loading state
  loading: {
    padding: string;
    textAlign: string;
    color: string;
    fontSize: string;
  };

  // Empty state
  empty: {
    padding: string;
    textAlign: string;
    color: string;
    background: string;
    borderRadius: string;
    border: string;
  };

  // Pagination
  pagination: {
    display: string;
    justifyContent: string;
    alignItems: string;
    gap: string;
    padding: string;
    marginTop: string;
  };

  // Pagination buttons
  paginationButton: {
    padding: string;
    border: string;
    borderRadius: string;
    background: string;
    backgroundHover: string;
    color: string;
    fontSize: string;
    cursor: string;
    transitionDuration: string;
  };

  // Active pagination button
  paginationActive: {
    background: string;
    color: string;
    fontWeight: string;
  };

  // Results count
  resultsCount: {
    fontSize: string;
    color: string;
    marginBottom: string;
  };
}>;

// ============================================================
// Default Token Values
// ============================================================

const defaultProductGridTokens: ProductGridTokens = {
  container: {
    padding: "1rem",
    gap: "1.5rem",
    background: "#F9FAFB",
    borderRadius: "0.5rem",
    minHeight: "400px",
  },

  filters: {
    width: "250px",
    padding: "1rem",
    background: "#FFFFFF",
    borderRadius: "0.5rem",
    border: "1px solid #E5E7EB",
    marginBottom: "1rem",
  },

  filterGroup: {
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #E5E7EB",
  },

  filterLabel: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.5rem",
  },

  filterInput: {
    padding: "0.5rem",
    border: "1px solid #D1D5DB",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    background: "#FFFFFF",
    color: "#374151",
    width: "100%",
  },

  searchBar: {
    padding: "0.75rem 1rem",
    border: "1px solid #D1D5DB",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    background: "#FFFFFF",
    width: "100%",
    marginBottom: "1rem",
  },

  sortControls: {
    padding: "1rem",
    background: "#FFFFFF",
    borderRadius: "0.5rem",
    marginBottom: "1rem",
    gap: "1rem",
  },

  sortSelect: {
    padding: "0.5rem 0.75rem",
    border: "1px solid #D1D5DB",
    borderRadius: "0.375rem",
    background: "#FFFFFF",
    fontSize: "0.875rem",
    cursor: "pointer",
  },

  gridArea: {
    flex: "1",
    minWidth: "0",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
    padding: "0",
  },

  gridMobile: {
    gridTemplateColumns: "1fr",
    gap: "1rem",
  },

  gridTablet: {
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "1.25rem",
  },

  gridDesktop: {
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },

  loading: {
    padding: "3rem",
    textAlign: "center",
    color: "#6B7280",
    fontSize: "1rem",
  },

  empty: {
    padding: "3rem",
    textAlign: "center",
    color: "#6B7280",
    background: "#FFFFFF",
    borderRadius: "0.5rem",
    border: "1px solid #E5E7EB",
  },

  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem",
    marginTop: "2rem",
  },

  paginationButton: {
    padding: "0.5rem 0.75rem",
    border: "1px solid #D1D5DB",
    borderRadius: "0.375rem",
    background: "#FFFFFF",
    backgroundHover: "#F3F4F6",
    color: "#374151",
    fontSize: "0.875rem",
    cursor: "pointer",
    transitionDuration: "150ms",
  },

  paginationActive: {
    background: "#3B82F6",
    color: "#FFFFFF",
    fontWeight: "600",
  },

  resultsCount: {
    fontSize: "0.875rem",
    color: "#6B7280",
    marginBottom: "1rem",
  },
};

// ============================================================
// Component Props Interface
// ============================================================

export type ProductGridProps = {
  readonly products?: readonly Product[];
  readonly filter?: ProductFilter;
  readonly loading?: boolean;
  readonly error?: string;
  readonly showFilters?: boolean;
  readonly showSearch?: boolean;
  readonly showSort?: boolean;
  readonly showPagination?: boolean;
  readonly layout?: "grid" | "list";
  readonly pageSize?: number;
  readonly onFilterChange?: (filter: ProductFilter) => void;
  readonly onProductClick?: (product: Product) => void;
  readonly className?: string;
};

// ============================================================
// Helper Functions
// ============================================================

const categories: { value: ProductCategory; label: string }[] = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "books", label: "Books" },
  { value: "home", label: "Home & Garden" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "beauty", label: "Beauty & Personal Care" },
  { value: "toys", label: "Toys & Games" },
];

const sortOptions = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
  { value: "rating-desc", label: "Rating (High to Low)" },
  { value: "newest", label: "Newest First" },
];

function generatePagination(
  current: number,
  total: number,
  pageSize: number,
): number[] {
  const totalPages = Math.ceil(total / pageSize);
  const pages: number[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (current > 4) {
      pages.push(-1); // Ellipsis
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < totalPages - 3) {
      pages.push(-1); // Ellipsis
    }

    pages.push(totalPages);
  }

  return pages;
}

// ============================================================
// Sealed ProductGrid Component
// ============================================================

export const ProductGrid = createTokenComponent<
  ProductGridTokens,
  ProductGridProps
>({
  name: "product-grid",
  tokens: defaultProductGridTokens,

  styles: (cssVars) => `
    .ui-product-grid {
      padding: ${cssVars.container.padding};
      background: ${cssVars.container.background};
      border-radius: ${cssVars.container.borderRadius};
      min-height: ${cssVars.container.minHeight};
    }

    .ui-product-grid__layout {
      display: flex;
      gap: ${cssVars.container.gap};
    }

    .ui-product-grid__filters {
      width: ${cssVars.filters.width};
      padding: ${cssVars.filters.padding};
      background: ${cssVars.filters.background};
      border-radius: ${cssVars.filters.borderRadius};
      border: ${cssVars.filters.border};
      height: fit-content;
      position: sticky;
      top: 1rem;
    }

    .ui-product-grid__filter-group {
      margin-bottom: ${cssVars.filterGroup.marginBottom};
      padding-bottom: ${cssVars.filterGroup.paddingBottom};
      border-bottom: ${cssVars.filterGroup.borderBottom};
    }

    .ui-product-grid__filter-group:last-child {
      border-bottom: none;
    }

    .ui-product-grid__filter-label {
      display: block;
      font-size: ${cssVars.filterLabel.fontSize};
      font-weight: ${cssVars.filterLabel.fontWeight};
      color: ${cssVars.filterLabel.color};
      margin-bottom: ${cssVars.filterLabel.marginBottom};
    }

    .ui-product-grid__filter-input {
      padding: ${cssVars.filterInput.padding};
      border: ${cssVars.filterInput.border};
      border-radius: ${cssVars.filterInput.borderRadius};
      font-size: ${cssVars.filterInput.fontSize};
      background: ${cssVars.filterInput.background};
      color: ${cssVars.filterInput.color};
      width: ${cssVars.filterInput.width};
      box-sizing: border-box;
    }

    .ui-product-grid__filter-input:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .ui-product-grid__main {
      flex: ${cssVars.gridArea.flex};
      min-width: ${cssVars.gridArea.minWidth};
    }

    .ui-product-grid__search {
      padding: ${cssVars.searchBar.padding};
      border: ${cssVars.searchBar.border};
      border-radius: ${cssVars.searchBar.borderRadius};
      font-size: ${cssVars.searchBar.fontSize};
      background: ${cssVars.searchBar.background};
      width: ${cssVars.searchBar.width};
      margin-bottom: ${cssVars.searchBar.marginBottom};
      box-sizing: border-box;
    }

    .ui-product-grid__search:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .ui-product-grid__sort {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: ${cssVars.sortControls.padding};
      background: ${cssVars.sortControls.background};
      border-radius: ${cssVars.sortControls.borderRadius};
      margin-bottom: ${cssVars.sortControls.marginBottom};
      gap: ${cssVars.sortControls.gap};
    }

    .ui-product-grid__sort-select {
      padding: ${cssVars.sortSelect.padding};
      border: ${cssVars.sortSelect.border};
      border-radius: ${cssVars.sortSelect.borderRadius};
      background: ${cssVars.sortSelect.background};
      font-size: ${cssVars.sortSelect.fontSize};
      cursor: ${cssVars.sortSelect.cursor};
    }

    .ui-product-grid__results-count {
      font-size: ${cssVars.resultsCount.fontSize};
      color: ${cssVars.resultsCount.color};
      margin-bottom: ${cssVars.resultsCount.marginBottom};
    }

    .ui-product-grid__grid {
      display: ${cssVars.grid.display};
      grid-template-columns: ${cssVars.grid.gridTemplateColumns};
      gap: ${cssVars.grid.gap};
      padding: ${cssVars.grid.padding};
    }

    .ui-product-grid__loading {
      padding: ${cssVars.loading.padding};
      text-align: ${cssVars.loading.textAlign};
      color: ${cssVars.loading.color};
      font-size: ${cssVars.loading.fontSize};
    }

    .ui-product-grid__empty {
      padding: ${cssVars.empty.padding};
      text-align: ${cssVars.empty.textAlign};
      color: ${cssVars.empty.color};
      background: ${cssVars.empty.background};
      border-radius: ${cssVars.empty.borderRadius};
      border: ${cssVars.empty.border};
    }

    .ui-product-grid__pagination {
      display: ${cssVars.pagination.display};
      justify-content: ${cssVars.pagination.justifyContent};
      align-items: ${cssVars.pagination.alignItems};
      gap: ${cssVars.pagination.gap};
      padding: ${cssVars.pagination.padding};
      margin-top: ${cssVars.pagination.marginTop};
    }

    .ui-product-grid__page-btn {
      padding: ${cssVars.paginationButton.padding};
      border: ${cssVars.paginationButton.border};
      border-radius: ${cssVars.paginationButton.borderRadius};
      background: ${cssVars.paginationButton.background};
      color: ${cssVars.paginationButton.color};
      font-size: ${cssVars.paginationButton.fontSize};
      cursor: ${cssVars.paginationButton.cursor};
      transition: all ${cssVars.paginationButton.transitionDuration} ease;
      text-decoration: none;
    }

    .ui-product-grid__page-btn:hover:not(:disabled) {
      background: ${cssVars.paginationButton.backgroundHover};
    }

    .ui-product-grid__page-btn--active {
      background: ${cssVars.paginationActive.background};
      color: ${cssVars.paginationActive.color};
      font-weight: ${cssVars.paginationActive.fontWeight};
    }

    .ui-product-grid__page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Responsive grid */
    @media (max-width: 640px) {
      .ui-product-grid__layout {
        flex-direction: column;
      }

      .ui-product-grid__filters {
        width: 100%;
        position: static;
      }

      .ui-product-grid__grid {
        grid-template-columns: ${cssVars.gridMobile.gridTemplateColumns};
        gap: ${cssVars.gridMobile.gap};
      }
    }

    @media (min-width: 641px) and (max-width: 1024px) {
      .ui-product-grid__grid {
        grid-template-columns: ${cssVars.gridTablet.gridTemplateColumns};
        gap: ${cssVars.gridTablet.gap};
      }
    }

    @media (min-width: 1025px) {
      .ui-product-grid__grid {
        grid-template-columns: ${cssVars.gridDesktop.gridTemplateColumns};
        gap: ${cssVars.gridDesktop.gap};
      }
    }
  `,

  render: (props) => {
    const {
      products = [],
      filter = {},
      loading = false,
      error,
      showFilters = true,
      showSearch = true,
      showSort = true,
      showPagination = true,
      layout = "grid",
      pageSize = 12,
      onFilterChange,
      onProductClick,
      className = "",
    } = props;

    const currentPage = Math.floor((filter.offset || 0) / pageSize) + 1;
    const totalProducts = products.length;
    const pages = generatePagination(currentPage, totalProducts, pageSize);

    const classes = [
      "ui-product-grid",
      className,
    ].filter(Boolean).join(" ");

    // Generate filter handlers (for demo purposes, using inline JS)
    const filterChangeScript = onFilterChange
      ? `function updateFilter(key, value) {
          const event = new CustomEvent('filterChange', {
            detail: { key, value }
          });
          document.dispatchEvent(event);
        }`
      : "";

    return `
      <div class="${classes}">
        ${filterChangeScript ? `<script>${filterChangeScript}</script>` : ""}

        <div class="ui-product-grid__layout">
          ${
      showFilters
        ? `
            <aside class="ui-product-grid__filters">
              <div class="ui-product-grid__filter-group">
                <label class="ui-product-grid__filter-label">Category</label>
                <select
                  class="ui-product-grid__filter-input"
                  onchange="updateFilter('category', this.value)"
                >
                  <option value="">All Categories</option>
                  ${
          categories.map((cat) => `
                    <option value="${cat.value}" ${
            filter.category === cat.value ? "selected" : ""
          }>
                      ${cat.label}
                    </option>
                  `).join("")
        }
                </select>
              </div>

              <div class="ui-product-grid__filter-group">
                <label class="ui-product-grid__filter-label">Price Range</label>
                <div style="display: flex; gap: 0.5rem;">
                  <input
                    type="number"
                    class="ui-product-grid__filter-input"
                    placeholder="Min"
                    value="${filter.minPrice || ""}"
                    onchange="updateFilter('minPrice', this.value)"
                    style="width: 45%;"
                  >
                  <input
                    type="number"
                    class="ui-product-grid__filter-input"
                    placeholder="Max"
                    value="${filter.maxPrice || ""}"
                    onchange="updateFilter('maxPrice', this.value)"
                    style="width: 45%;"
                  >
                </div>
              </div>

              <div class="ui-product-grid__filter-group">
                <label class="ui-product-grid__filter-label">Availability</label>
                <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: normal;">
                  <input
                    type="checkbox"
                    ${filter.inStock ? "checked" : ""}
                    onchange="updateFilter('inStock', this.checked)"
                  >
                  In Stock Only
                </label>
              </div>

              <div class="ui-product-grid__filter-group">
                <label class="ui-product-grid__filter-label">Features</label>
                <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: normal;">
                  <input
                    type="checkbox"
                    ${filter.featured ? "checked" : ""}
                    onchange="updateFilter('featured', this.checked)"
                  >
                  Featured Products
                </label>
              </div>

              <div class="ui-product-grid__filter-group">
                <label class="ui-product-grid__filter-label">Minimum Rating</label>
                <select
                  class="ui-product-grid__filter-input"
                  onchange="updateFilter('rating', this.value)"
                >
                  <option value="">Any Rating</option>
                  <option value="4" ${
          filter.rating === 4 ? "selected" : ""
        }>4+ Stars</option>
                  <option value="3" ${
          filter.rating === 3 ? "selected" : ""
        }>3+ Stars</option>
                  <option value="2" ${
          filter.rating === 2 ? "selected" : ""
        }>2+ Stars</option>
                </select>
              </div>
            </aside>
          `
        : ""
    }

          <main class="ui-product-grid__main">
            ${
      showSearch
        ? `
              <input
                type="text"
                class="ui-product-grid__search"
                placeholder="Search products..."
                value="${filter.search || ""}"
                oninput="updateFilter('search', this.value)"
              >
            `
        : ""
    }

            ${
      showSort
        ? `
              <div class="ui-product-grid__sort">
                <div class="ui-product-grid__results-count">
                  ${totalProducts} products found
                </div>

                <select
                  class="ui-product-grid__sort-select"
                  onchange="updateFilter('sort', this.value)"
                >
                  ${
          sortOptions.map((option) => {
            const [sortBy, sortOrder] = option.value.split("-");
            const isSelected = filter.sortBy === sortBy &&
              (filter.sortOrder || "asc") === sortOrder;
            return `<option value="${option.value}" ${
              isSelected ? "selected" : ""
            }>${option.label}</option>`;
          }).join("")
        }
                </select>
              </div>
            `
        : ""
    }

            ${
      loading
        ? `
              <div class="ui-product-grid__loading">
                <div>Loading products...</div>
              </div>
            `
        : error
        ? `
              <div class="ui-product-grid__empty">
                <h3>Error loading products</h3>
                <p>${error}</p>
                <button onclick="location.reload()">Try Again</button>
              </div>
            `
        : products.length === 0
        ? `
              <div class="ui-product-grid__empty">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button onclick="updateFilter('clear', true)">Clear Filters</button>
              </div>
            `
        : `
              <div class="ui-product-grid__grid">
                ${
          products.map((product) => `
                  <div
                    class="product-grid-item"
                    data-product-id="${product.id}"
                    ${
            onProductClick
              ? `onclick="(${onProductClick.toString()})(${
                JSON.stringify(product)
              })"`
              : ""
          }
                  >
                    <!-- ProductCard component will be injected here -->
                    <product-card
                      data-product='${JSON.stringify(product)}'
                      data-show-quick-add="true"
                      data-show-wishlist="false"
                      data-show-description="true">
                    </product-card>
                  </div>
                `).join("")
        }
              </div>

              ${
          showPagination && totalProducts > pageSize
            ? `
                <nav class="ui-product-grid__pagination">
                  <button
                    class="ui-product-grid__page-btn"
                    ${currentPage <= 1 ? "disabled" : ""}
                    onclick="updateFilter('page', ${currentPage - 1})"
                  >
                    Previous
                  </button>

                  ${
              pages.map((page) =>
                page === -1 ? `<span>...</span>` : `
                        <button
                          class="ui-product-grid__page-btn ${
                  page === currentPage
                    ? "ui-product-grid__page-btn--active"
                    : ""
                }"
                          onclick="updateFilter('page', ${page})"
                        >
                          ${page}
                        </button>
                      `
              ).join("")
            }

                  <button
                    class="ui-product-grid__page-btn"
                    ${
              currentPage >= Math.ceil(totalProducts / pageSize)
                ? "disabled"
                : ""
            }
                    onclick="updateFilter('page', ${currentPage + 1})"
                  >
                    Next
                  </button>
                </nav>
              `
            : ""
        }
            `
    }
          </main>
        </div>
      </div>
    `.trim();
  },
});

// Export the token type for customization
export type { ProductGridTokens };
