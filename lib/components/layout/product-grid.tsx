/**
 * Product Grid Component
 * ----------------------
 * Library-provided merchandising grid with optional filter sidebar.
 * Designed for SSR usage with ui-lib design tokens and product-card integration.
 */

import { css } from "../../css-in-ts.ts";
import { buildAttrs } from "../../dom-helpers.ts";
import {
  array,
  boolean,
  defineComponent,
  object,
  oneOf,
  renderComponent,
  string,
} from "../../internal.ts";

import { componentTokens } from "../../themes/component-tokens.ts";
import type {
  ProductAction,
  ProductCardProps,
  ProductMeta,
} from "../data-display/product-card.tsx";

export type ProductGridFilterState = {
  readonly search?: string;
  readonly category?: string;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly inStock?: boolean;
  readonly sortBy?: string;
};

export type ProductGridOption = {
  readonly value: string;
  readonly label: string;
};

export type ProductGridActionConfig = {
  readonly primaryAction?: ProductAction;
  readonly secondaryAction?: ProductAction;
  readonly quickActions?: readonly ProductAction[];
};

export type ProductGridProps = {
  readonly id?: string;
  readonly heading?: string;
  readonly description?: string;
  readonly products: readonly ProductMeta[];
  readonly filters?: ProductGridFilterState;
  readonly categories?: readonly ProductGridOption[];
  readonly sortOptions?: readonly ProductGridOption[];
  readonly showFilters?: boolean;
  readonly showSearch?: boolean;
  readonly showSort?: boolean;
  readonly loading?: boolean;
  readonly total?: number;
  readonly layout?: "with-sidebar" | "full";
  readonly sessionId?: string;
  readonly hxConfig?: {
    readonly endpoint?: string;
    readonly target?: string;
    readonly swap?: string;
    readonly trigger?: string;
    readonly headers?: Readonly<Record<string, string>>;
  };
  readonly emptyState?: {
    readonly title?: string;
    readonly description?: string;
    readonly action?: {
      readonly label: string;
      readonly attributes?: Readonly<Record<string, string | number | boolean>>;
    };
  };
  readonly productCardDefaults?: Partial<ProductCardProps>;
  readonly actionBuilder?: (product: ProductMeta) => ProductGridActionConfig;
};

const DEFAULT_SORT_OPTIONS: readonly ProductGridOption[] = [
  { value: "name", label: "Name" },
  { value: "price", label: "Price" },
  { value: "rating", label: "Rating" },
  { value: "newest", label: "Newest" },
];

const styles = css({
  root: {
    display: "grid",
    gap: componentTokens.spacing[6],
    alignItems: "flex-start",
    width: "100%",
    containerType: "inline-size",
  },

  sidebarLayout: {
    gridTemplateColumns: "minmax(0, 320px) minmax(0, 1fr)",
  },

  fullLayout: {
    gridTemplateColumns: "1fr",
  },

  sidebar: {
    backgroundColor: "var(--product-grid-filter-bg, " +
      componentTokens.colors.surface.background +
      ")",
    borderRadius: componentTokens.radius.xl,
    border: "1px solid var(--product-grid-filter-border, " +
      componentTokens.colors.surface.border +
      ")",
    boxShadow: componentTokens.shadows.sm,
    padding: componentTokens.spacing[5],
    position: "sticky",
    top: componentTokens.spacing[6],
  },

  filterPanel: {
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[4],
  },

  filterSection: {
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[2],
  },

  priceRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: componentTokens.spacing[2],
  },

  filterLabel: {
    fontSize: componentTokens.typography.sizes.sm,
    fontWeight: componentTokens.typography.weights.semibold,
    color: componentTokens.colors.gray[700],
    margin: 0,
  },

  filterInput: {
    width: "100%",
    padding: `${componentTokens.spacing[2]} ${componentTokens.spacing[3]}`,
    borderRadius: componentTokens.radius.md,
    border: "1px solid " + componentTokens.colors.gray[300],
    fontSize: componentTokens.typography.sizes.sm,
    color: componentTokens.colors.surface.foreground,
    backgroundColor: componentTokens.colors.surface.background,

    "&:focus": {
      outline: "none",
      borderColor: componentTokens.colors.primary[300],
      boxShadow: `0 0 0 3px ${componentTokens.colors.primary[100]}`,
    },
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: componentTokens.spacing[2],
    fontSize: componentTokens.typography.sizes.sm,
    color: componentTokens.colors.gray[700],
  },

  filterFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: componentTokens.spacing[3],
    paddingTop: componentTokens.spacing[3],
    borderTop: "1px solid " + componentTokens.colors.surface.border,
  },

  clearButton: {
    background: "transparent",
    border: "1px solid " + componentTokens.colors.gray[300],
    color: componentTokens.colors.gray[700],
    borderRadius: componentTokens.radius.md,
    padding: `${componentTokens.spacing[2]} ${componentTokens.spacing[4]}`,
    fontSize: componentTokens.typography.sizes.sm,
    cursor: "pointer",
    transition:
      `all ${componentTokens.animation.duration.normal} ${componentTokens.animation.easing.out}`,

    "&:hover": {
      backgroundColor: componentTokens.colors.gray[100],
    },
  },

  submitButton: {
    backgroundColor: componentTokens.colors.primary[500],
    color: "#FFFFFF",
    border: "none",
    borderRadius: componentTokens.radius.md,
    padding: `${componentTokens.spacing[2]} ${componentTokens.spacing[4]}`,
    fontSize: componentTokens.typography.sizes.sm,
    fontWeight: componentTokens.typography.weights.medium,
    cursor: "pointer",
    transition:
      `background ${componentTokens.animation.duration.normal} ${componentTokens.animation.easing.out}`,

    "&:hover": {
      backgroundColor: componentTokens.colors.primary[600],
    },
  },

  main: {
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[4],
  },

  header: {
    display: "flex",
    flexWrap: "wrap",
    gap: componentTokens.spacing[3],
    justifyContent: "space-between",
    alignItems: "center",
  },

  headingGroup: {
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[1],
  },

  heading: {
    margin: 0,
    fontSize: componentTokens.typography.sizes["2xl"],
    fontWeight: componentTokens.typography.weights.bold,
    color: componentTokens.colors.surface.foreground,
  },

  subtitle: {
    margin: 0,
    fontSize: componentTokens.typography.sizes.sm,
    color: componentTokens.colors.gray[600],
  },

  sortControl: {
    display: "flex",
    alignItems: "center",
    gap: componentTokens.spacing[2],
  },

  sortLabel: {
    fontSize: componentTokens.typography.sizes.sm,
    color: componentTokens.colors.gray[600],
  },

  grid: {
    display: "grid",
    gap: componentTokens.spacing[4],
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  },

  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: componentTokens.spacing[3],
    padding: componentTokens.spacing[6],
    color: componentTokens.colors.gray[500],
    textAlign: "center",
  },

  spinner: {
    width: "3rem",
    height: "3rem",
    borderRadius: "9999px",
    border: `4px solid ${componentTokens.colors.primary[100]}`,
    borderTopColor: componentTokens.colors.primary[500],
    animation: "product-grid-spin 1s linear infinite",
  },

  emptyState: {
    backgroundColor: componentTokens.colors.surface.background,
    border: "1px dashed " + componentTokens.colors.surface.border,
    borderRadius: componentTokens.radius.xl,
    padding: componentTokens.spacing[6],
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[3],
    alignItems: "center",
    justifyContent: "center",
  },

  emptyHeading: {
    margin: 0,
    fontSize: componentTokens.typography.sizes["2xl"],
    fontWeight: componentTokens.typography.weights.semibold,
  },

  emptyBody: {
    margin: 0,
    fontSize: componentTokens.typography.sizes.sm,
    color: componentTokens.colors.gray[600],
    maxWidth: "32ch",
  },

  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: componentTokens.spacing[3],
    paddingTop: componentTokens.spacing[4],
  },

  passiveButton: {
    background: "transparent",
    border: "1px solid " + componentTokens.colors.gray[300],
    color: componentTokens.colors.gray[700],
    borderRadius: componentTokens.radius.md,
    padding: `${componentTokens.spacing[2]} ${componentTokens.spacing[4]}`,
    fontSize: componentTokens.typography.sizes.sm,
    cursor: "not-allowed",
    opacity: 0.6,
  },
});

const keyframes = `
@keyframes product-grid-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;

function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function readBoolean(
  attrs: Record<string, string>,
  source: Record<string, unknown>,
  key: string,
  defaultValue: boolean,
): boolean {
  const direct = source[key];
  const kebabKey = key.replace(
    /[A-Z]/g,
    (letter) => `-${letter.toLowerCase()}`,
  );
  const kebabValue = source[kebabKey];
  const candidate = direct ?? kebabValue;

  if (typeof candidate === "boolean") return candidate;
  if (typeof candidate === "string") {
    const normalized = candidate.toLowerCase();
    if (["false", "0", "off", "no"].includes(normalized)) return false;
    if (["true", "1", "on", "yes"].includes(normalized)) return true;
  }

  return boolean(defaultValue).parse(attrs, key);
}

defineComponent<ProductGridProps>("product-grid", {
  props: (attrs) => {
    const source = attrs as Record<string, unknown>;
    const rawProducts = source.products ?? source["products"];
    const products = Array.isArray(rawProducts)
      ? rawProducts as readonly ProductMeta[]
      : typeof rawProducts === "string"
      ? array<ProductMeta>().parse(attrs, "products")
      : [];

    const rawFilters = source.filters ?? source["filters"];
    const filters = typeof rawFilters === "string"
      ? object<ProductGridFilterState>().parse(attrs, "filters")
      : (rawFilters as ProductGridFilterState | undefined);

    const rawCategories = source.categories ?? source["categories"];
    const categories = Array.isArray(rawCategories)
      ? rawCategories as readonly ProductGridOption[]
      : typeof rawCategories === "string"
      ? array<ProductGridOption>().parse(attrs, "categories")
      : undefined;

    const rawSortOptions = source.sortOptions ?? source["sort-options"];
    const sortOptions = Array.isArray(rawSortOptions)
      ? rawSortOptions as readonly ProductGridOption[]
      : typeof rawSortOptions === "string"
      ? array<ProductGridOption>().parse(attrs, "sortOptions")
      : undefined;

    const rawHx = source.hxConfig ?? source["hx-config"];
    const hxConfig = typeof rawHx === "string"
      ? object<ProductGridProps["hxConfig"]>().parse(attrs, "hxConfig")
      : rawHx as ProductGridProps["hxConfig"] | undefined;

    const rawEmpty = source.emptyState ?? source["empty-state"];
    const emptyState = typeof rawEmpty === "string"
      ? object<ProductGridProps["emptyState"]>().parse(attrs, "emptyState")
      : rawEmpty as ProductGridProps["emptyState"] | undefined;

    const rawDefaults = source.productCardDefaults ??
      source["product-card-defaults"];
    const productCardDefaults = typeof rawDefaults === "string"
      ? object<Partial<ProductCardProps>>().parse(attrs, "productCardDefaults")
      : rawDefaults as Partial<ProductCardProps> | undefined;

    const heading = typeof source.heading === "string"
      ? source.heading as string
      : string("Products").parse(attrs, "heading");

    const description = typeof source.description === "string"
      ? source.description as string
      : undefined;

    return {
      id: typeof source.id === "string" ? source.id as string : undefined,
      heading,
      description,
      products,
      filters,
      categories,
      sortOptions,
      showFilters: readBoolean(attrs, source, "showFilters", true),
      showSearch: readBoolean(attrs, source, "showSearch", true),
      showSort: readBoolean(attrs, source, "showSort", true),
      loading: readBoolean(attrs, source, "loading", false),
      total: toNumber(source.total),
      layout: oneOf(["with-sidebar", "full"] as const, "with-sidebar").parse(
        attrs,
        "layout",
      ) as "with-sidebar" | "full",
      sessionId: typeof source.sessionId === "string"
        ? source.sessionId as string
        : undefined,
      hxConfig,
      emptyState,
      productCardDefaults,
      actionBuilder: typeof source.actionBuilder === "function"
        ? source.actionBuilder as ProductGridProps["actionBuilder"]
        : undefined,
    } satisfies ProductGridProps;
  },

  styles: keyframes,

  render: (props) => {
    const layout = props.layout ?? "with-sidebar";
    const filters = props.filters ?? {};
    const categories = props.categories ?? [];
    const sortOptions = props.sortOptions ?? DEFAULT_SORT_OPTIONS;

    const hxEndpoint = props.hxConfig?.endpoint ?? "/api/products";
    const hxTarget = props.hxConfig?.target ?? "#product-grid";
    const hxSwap = props.hxConfig?.swap ?? "innerHTML";
    const hxTrigger = props.hxConfig?.trigger ??
      "change, keyup changed delay:400ms from:input[name='search']";
    const hxHeaders = props.hxConfig?.headers ?? { Accept: "text/html" };

    const formAttrs =
      `hx-get="${hxEndpoint}" hx-target="${hxTarget}" hx-swap="${hxSwap}" hx-trigger="${hxTrigger}" hx-headers='${
        JSON.stringify(hxHeaders)
      }'`;

    const rootClasses = [styles.classMap.root];
    if (layout === "with-sidebar" && props.showFilters !== false) {
      rootClasses.push(styles.classMap.sidebarLayout);
    } else {
      rootClasses.push(styles.classMap.fullLayout);
    }

    const filterForm = props.showFilters !== false
      ? `
        <aside class="${styles.classMap.sidebar}">
          <form class="${styles.classMap.filterPanel} ui-product-grid-filters" ${formAttrs}>
            ${
        props.sessionId
          ? `<input type="hidden" name="sessionId" value="${props.sessionId}" />`
          : ""
      }
            ${
        props.showSearch !== false
          ? `
              <section class="${styles.classMap.filterSection}">
                <label class="${styles.classMap.filterLabel}" for="product-grid-search">Search Products</label>
                <input
                  id="product-grid-search"
                  name="search"
                  type="search"
                  value="${filters.search ?? ""}"
                  placeholder="Search products"
                  class="${styles.classMap.filterInput}"
                />
              </section>
            `
          : ""
      }

            ${
        categories.length > 0
          ? `
              <section class="${styles.classMap.filterSection}">
                <label class="${styles.classMap.filterLabel}" for="product-grid-category">Category</label>
                <select
                  id="product-grid-category"
                  name="category"
                  class="${styles.classMap.filterInput}"
                >
                  <option value="">All categories</option>
                  ${
            categories.map((option) => {
              const selected = option.value === filters.category
                ? " selected"
                : "";
              return `<option value="${option.value}"${selected}>${option.label}</option>`;
            }).join("")
          }
                </select>
              </section>
            `
          : ""
      }

            <section class="${styles.classMap.filterSection}">
              <label class="${styles.classMap.filterLabel}">Price Range</label>
              <div class="${styles.classMap.priceRow}">
                <input
                  name="minPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value="${filters.minPrice ?? ""}"
                  placeholder="Min"
                  class="${styles.classMap.filterInput}"
                />
                <input
                  name="maxPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value="${filters.maxPrice ?? ""}"
                  placeholder="Max"
                  class="${styles.classMap.filterInput}"
                />
              </div>
            </section>

            <label class="${styles.classMap.checkboxRow}">
              <input type="checkbox" name="inStock" ${
        filters.inStock ? "checked" : ""
      } />
              In stock only
            </label>

            <div class="${styles.classMap.filterFooter}">
              <button type="reset" class="${styles.classMap.clearButton}" hx-get="${hxEndpoint}" hx-target="${hxTarget}" hx-swap="${hxSwap}">
                Clear filters
              </button>
              <button type="submit" class="${styles.classMap.submitButton}">
                Apply
              </button>
            </div>
          </form>
        </aside>
      `
      : "";

    const headingHtml = `
      <div class="${styles.classMap.headingGroup}">
        <h2 class="${styles.classMap.heading}">${props.heading ?? "Products"}${
      props.total ? ` <span aria-hidden="true">(${props.total})</span>` : ""
    }</h2>
        ${
      props.description
        ? `<p class="${styles.classMap.subtitle}">${props.description}</p>`
        : ""
    }
      </div>
    `;

    const sortHtml = props.showSort !== false
      ? `
        <div class="${styles.classMap.sortControl}">
          <span class="${styles.classMap.sortLabel}">Sort by</span>
          <select
            name="sortBy"
            class="${styles.classMap.filterInput}"
            hx-get="${hxEndpoint}"
            hx-target="${hxTarget}"
            hx-swap="${hxSwap}"
            hx-include=".ui-product-grid-filters *"
          >
            ${
        sortOptions.map((option) => {
          const selected =
            option.value === (filters.sortBy ?? sortOptions[0]?.value)
              ? " selected"
              : "";
          return `<option value="${option.value}"${selected}>${option.label}</option>`;
        }).join("")
      }
          </select>
        </div>
      `
      : "";

    const loadingHtml = `
      <div class="${styles.classMap.loadingState}">
        <div class="${styles.classMap.spinner}" role="status" aria-label="Loading products"></div>
        <p>Loading products…</p>
      </div>
    `;

    const productCards = props.products.map((product) => {
      const overrides = props.productCardDefaults ?? {};
      const actionConfig = props.actionBuilder?.(product) ?? {};
      const cardProps: ProductCardProps = {
        product,
        size: overrides.size ?? "md",
        appearance: overrides.appearance ??
          (product.featured ? "elevated" : "default"),
        highlightSale: overrides.highlightSale ?? true,
        showDescription: overrides.showDescription ?? true,
        showRating: overrides.showRating ?? true,
        layout: overrides.layout ?? "vertical",
        primaryAction: actionConfig.primaryAction ?? overrides.primaryAction,
        secondaryAction: actionConfig.secondaryAction ??
          overrides.secondaryAction,
        quickActions: actionConfig.quickActions ?? overrides.quickActions,
      };
      return renderComponent("product-card", cardProps);
    }).join("");

    const emptyState = props.emptyState ?? {};
    const emptyHtml = `
      <div class="${styles.classMap.emptyState}">
        <h3 class="${styles.classMap.emptyHeading}">${
      emptyState.title ?? "No products matched"
    }</h3>
        ${
      emptyState.description
        ? `<p class="${styles.classMap.emptyBody}">${emptyState.description}</p>`
        : ""
    }
        ${
      emptyState.action
        ? `<button type=\"button\" class=\"${styles.classMap.submitButton}\" ${
          buildAttrs(emptyState.action.attributes as Record<string, unknown>)
        }
        >${emptyState.action.label}</button>`
        : ""
    }
      </div>
    `;

    const gridContent = props.loading
      ? loadingHtml
      : props.products.length === 0
      ? emptyHtml
      : `<div class="${styles.classMap.grid}">${productCards}</div>`;

    return `
      <section id="${props.id ?? ""}" class="${
      rootClasses.join(" ")
    }" data-component="product-grid" data-session="${props.sessionId ?? ""}">
        ${filterForm}
        <div class="${styles.classMap.main}">
          <header class="${styles.classMap.header}">
            ${headingHtml}
            ${sortHtml}
          </header>
          ${gridContent}
          <div class="${styles.classMap.pagination}">
            <button class="${styles.classMap.passiveButton}" disabled>Previous</button>
            <span>${props.total ?? props.products.length} items</span>
            <button class="${styles.classMap.passiveButton}" disabled>Next</button>
          </div>
        </div>
      </section>
    `;
  },
});

export const ProductGrid = "product-grid";
