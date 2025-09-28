/**
 * Cart Sidebar Component
 * ----------------------
 * Full-featured commerce drawer for cart review and checkout handoff.
 */

import { array, boolean, defineComponent, object } from "../../internal.ts";
import { css } from "../../css-in-ts.ts";
import { componentTokens } from "../../themes/component-tokens.ts";

export type CartSidebarQuantityControls = {
  readonly decrement?: Readonly<Record<string, string | number | boolean>>;
  readonly increment?: Readonly<Record<string, string | number | boolean>>;
};

export type CartSidebarAction = {
  readonly label: string;
  readonly attributes?: Readonly<Record<string, string | number | boolean>>;
  readonly variant?: "primary" | "secondary" | "link";
  readonly fullWidth?: boolean;
};

export type CartSidebarItem = {
  readonly id: string;
  readonly productId: string;
  readonly name: string;
  readonly description?: string;
  readonly imageUrl?: string;
  readonly price: number;
  readonly quantity: number;
  readonly lineTotal?: number;
  readonly note?: string;
  readonly availability?: "in_stock" | "backorder" | "preorder";
  readonly controls?: CartSidebarQuantityControls;
  readonly removeAction?: Readonly<Record<string, string | number | boolean>>;
};

export type CartSidebarSummary = {
  readonly subtotal: number;
  readonly tax?: number;
  readonly shipping?: number | "free";
  readonly discount?: number;
  readonly total: number;
};

export type CartSidebarProps = {
  readonly id?: string;
  readonly title?: string;
  readonly isOpen?: boolean;
  readonly loading?: boolean;
  readonly currency?: string;
  readonly items?: readonly CartSidebarItem[];
  readonly summary?: CartSidebarSummary;
  readonly emptyState?: {
    readonly title: string;
    readonly description?: string;
    readonly action?: CartSidebarAction;
  };
  readonly primaryAction?: CartSidebarAction;
  readonly secondaryAction?: CartSidebarAction;
  readonly continueAction?: CartSidebarAction;
  readonly closeAttributes?: Readonly<
    Record<string, string | number | boolean>
  >;
  readonly overlayAttributes?: Readonly<
    Record<string, string | number | boolean>
  >;
};

const styles = css({
  root: {
    position: "fixed",
    inset: 0,
    display: "flex",
    justifyContent: "flex-end",
    pointerEvents: "none",
    zIndex: 60,
  },

  open: {
    pointerEvents: "auto",
  },

  overlay: {
    flex: 1,
    backgroundColor: "var(--cart-sidebar-overlay, " +
      componentTokens.colors.surface.overlay + ")",
    opacity: 0,
    transition:
      `opacity ${componentTokens.animation.duration.normal} ${componentTokens.animation.easing.out}`,
  },

  overlayVisible: {
    opacity: 1,
  },

  panel: {
    width: "min(420px, 100vw)",
    backgroundColor: componentTokens.colors.surface.background,
    borderLeft: "1px solid " + componentTokens.colors.surface.border,
    boxShadow: componentTokens.shadows.lg,
    transform: "translateX(100%)",
    transition:
      `transform ${componentTokens.animation.duration.normal} ${componentTokens.animation.easing.out}`,
    display: "flex",
    flexDirection: "column",
  },

  panelVisible: {
    transform: "translateX(0)",
  },

  header: {
    padding: `${componentTokens.spacing[5]} ${componentTokens.spacing[5]} ${
      componentTokens.spacing[4]
    }`,
    borderBottom: "1px solid " + componentTokens.colors.surface.border,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    margin: 0,
    fontSize: componentTokens.typography.sizes["2xl"],
    fontWeight: componentTokens.typography.weights.semibold,
  },

  closeButton: {
    background: "transparent",
    border: "none",
    borderRadius: componentTokens.radius.md,
    width: componentTokens.spacing[8],
    height: componentTokens.spacing[8],
    cursor: "pointer",
    fontSize: componentTokens.typography.sizes.lg,
    color: componentTokens.colors.gray[500],
    transition:
      `background ${componentTokens.animation.duration.fast} ${componentTokens.animation.easing.out}`,

    "&:hover": {
      backgroundColor: componentTokens.colors.gray[100],
      color: componentTokens.colors.gray[700],
    },
  },

  content: {
    flex: 1,
    overflowY: "auto",
    padding: `${componentTokens.spacing[4]} ${componentTokens.spacing[5]}`,
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[3],
  },

  item: {
    display: "grid",
    gridTemplateColumns: "72px 1fr auto",
    gap: componentTokens.spacing[3],
    alignItems: "flex-start",
    border: "1px solid " + componentTokens.colors.surface.border,
    borderRadius: componentTokens.radius.lg,
    padding: componentTokens.spacing[3],
    backgroundColor: "var(--cart-item-bg, " +
      componentTokens.colors.surface.background + ")",
  },

  itemImage: {
    width: "72px",
    height: "72px",
    borderRadius: componentTokens.radius.md,
    overflow: "hidden",
    backgroundColor: componentTokens.colors.gray[100],
  },

  itemImageTag: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  itemContent: {
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[1],
  },

  itemTitle: {
    margin: 0,
    fontSize: componentTokens.typography.sizes.base,
    fontWeight: componentTokens.typography.weights.medium,
  },

  itemMeta: {
    fontSize: componentTokens.typography.sizes.sm,
    color: componentTokens.colors.gray[600],
  },

  quantityControls: {
    display: "inline-flex",
    alignItems: "center",
    gap: componentTokens.spacing[1],
    border: "1px solid " + componentTokens.colors.gray[300],
    borderRadius: componentTokens.radius.md,
    padding: `${componentTokens.spacing[1]} ${componentTokens.spacing[1]}`,
    backgroundColor: componentTokens.colors.surface.background,
  },

  quantityButton: {
    width: componentTokens.spacing[6],
    height: componentTokens.spacing[6],
    border: "none",
    background: "transparent",
    color: componentTokens.colors.gray[600],
    fontSize: componentTokens.typography.sizes.base,
    cursor: "pointer",
  },

  quantityValue: {
    minWidth: componentTokens.spacing[6],
    textAlign: "center",
    fontSize: componentTokens.typography.sizes.sm,
    fontWeight: componentTokens.typography.weights.semibold,
  },

  itemPrice: {
    fontWeight: componentTokens.typography.weights.semibold,
    textAlign: "right",
  },

  removeButton: {
    background: "transparent",
    border: "none",
    color: componentTokens.colors.gray[400],
    fontSize: componentTokens.typography.sizes.base,
    cursor: "pointer",
  },

  emptyState: {
    marginTop: componentTokens.spacing[8],
    padding: componentTokens.spacing[6],
    textAlign: "center",
    border: "1px dashed " + componentTokens.colors.surface.border,
    borderRadius: componentTokens.radius.xl,
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[3],
    alignItems: "center",
  },

  emptyTitle: {
    margin: 0,
    fontSize: componentTokens.typography.sizes["xl"],
    fontWeight: componentTokens.typography.weights.semibold,
  },

  emptyDescription: {
    margin: 0,
    fontSize: componentTokens.typography.sizes.sm,
    color: componentTokens.colors.gray[600],
  },

  summary: {
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[2],
    padding: `${componentTokens.spacing[4]} ${componentTokens.spacing[5]}`,
    borderTop: "1px solid " + componentTokens.colors.surface.border,
    backgroundColor: "var(--cart-summary-bg, " +
      componentTokens.colors.surface.muted + ")",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: componentTokens.typography.sizes.sm,
    color: componentTokens.colors.gray[600],
  },

  summaryTotal: {
    fontSize: componentTokens.typography.sizes["xl"],
    fontWeight: componentTokens.typography.weights.bold,
    color: componentTokens.colors.surface.foreground,
    paddingTop: componentTokens.spacing[2],
  },

  actions: {
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[2],
    padding: `${componentTokens.spacing[4]} ${componentTokens.spacing[5]} ${
      componentTokens.spacing[5]
    }`,
    borderTop: "1px solid " + componentTokens.colors.surface.border,
    backgroundColor: componentTokens.colors.surface.background,
  },

  actionButton: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    gap: componentTokens.spacing[2],
    padding: `${componentTokens.spacing[3]} ${componentTokens.spacing[4]}`,
    borderRadius: componentTokens.radius.md,
    fontSize: componentTokens.typography.sizes.sm,
    fontWeight: componentTokens.typography.weights.medium,
    textDecoration: "none",
    cursor: "pointer",
    border: "1px solid transparent",
  },

  actionPrimary: {
    backgroundColor: componentTokens.colors.primary[500],
    color: "#FFFFFF",

    "&:hover": {
      backgroundColor: componentTokens.colors.primary[600],
    },
  },

  actionSecondary: {
    backgroundColor: componentTokens.colors.gray[100],
    color: componentTokens.colors.gray[800],
    borderColor: componentTokens.colors.gray[300],

    "&:hover": {
      backgroundColor: componentTokens.colors.gray[200],
    },
  },

  actionLink: {
    background: "transparent",
    color: componentTokens.colors.gray[600],
    borderColor: "transparent",
    textDecoration: "underline",
  },

  actionFullWidth: {
    width: "100%",
  },

  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: componentTokens.spacing[3],
    padding: componentTokens.spacing[6],
    color: componentTokens.colors.gray[500],
  },

  spinner: {
    width: componentTokens.spacing[8],
    height: componentTokens.spacing[8],
    borderRadius: "9999px",
    border: `4px solid ${componentTokens.colors.primary[100]}`,
    borderTopColor: componentTokens.colors.primary[500],
    animation: "cart-sidebar-spin 1s linear infinite",
  },
});

const keyframes = `
@keyframes cart-sidebar-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;

function attrString(
  attrs?: Readonly<Record<string, string | number | boolean>>,
): string {
  if (!attrs) return "";
  return Object.entries(attrs)
    .flatMap(([key, value]) => {
      if (value === undefined || value === null || value === false) return [];
      if (value === true) return [key];
      return [`${key}="${String(value)}"`];
    })
    .join(" ");
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function readBoolean(
  attrs: Record<string, string>,
  source: Record<string, unknown>,
  key: string,
  defaultValue: boolean,
): boolean {
  const direct = source[key];
  const kebab = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  const candidate = direct ?? source[kebab];

  if (typeof candidate === "boolean") return candidate;
  if (typeof candidate === "string") {
    const normalized = candidate.toLowerCase();
    if (["false", "0", "off", "no"].includes(normalized)) return false;
    if (["true", "1", "on", "yes"].includes(normalized)) return true;
  }

  return boolean(defaultValue).parse(attrs, key);
}

defineComponent<CartSidebarProps>("cart-sidebar", {
  props: (attrs) => {
    const source = attrs as Record<string, unknown>;
    const rawItems = source.items ?? source["items"];
    const items = Array.isArray(rawItems)
      ? rawItems as readonly CartSidebarItem[]
      : typeof rawItems === "string"
      ? array<CartSidebarItem>().parse(attrs, "items")
      : [];

    const rawSummary = source.summary ?? source["summary"];
    const summary = typeof rawSummary === "string"
      ? object<CartSidebarSummary>().parse(attrs, "summary")
      : rawSummary as CartSidebarSummary | undefined;

    const rawEmpty = source.emptyState ?? source["empty-state"];
    const emptyState = typeof rawEmpty === "string"
      ? object<CartSidebarProps["emptyState"]>().parse(attrs, "emptyState")
      : rawEmpty as CartSidebarProps["emptyState"] | undefined;

    const rawPrimary = source.primaryAction ?? source["primary-action"];
    const primaryAction = typeof rawPrimary === "string"
      ? object<CartSidebarAction>().parse(attrs, "primaryAction")
      : rawPrimary as CartSidebarAction | undefined;

    const rawSecondary = source.secondaryAction ?? source["secondary-action"];
    const secondaryAction = typeof rawSecondary === "string"
      ? object<CartSidebarAction>().parse(attrs, "secondaryAction")
      : rawSecondary as CartSidebarAction | undefined;

    const rawContinue = source.continueAction ?? source["continue-action"];
    const continueAction = typeof rawContinue === "string"
      ? object<CartSidebarAction>().parse(attrs, "continueAction")
      : rawContinue as CartSidebarAction | undefined;

    const rawClose = source.closeAttributes ?? source["close-attributes"];
    const closeAttributes = typeof rawClose === "string"
      ? object<Readonly<Record<string, string | number | boolean>>>().parse(
        attrs,
        "closeAttributes",
      )
      : rawClose as
        | Readonly<Record<string, string | number | boolean>>
        | undefined;

    const rawOverlay = source.overlayAttributes ?? source["overlay-attributes"];
    const overlayAttributes = typeof rawOverlay === "string"
      ? object<Readonly<Record<string, string | number | boolean>>>().parse(
        attrs,
        "overlayAttributes",
      )
      : rawOverlay as
        | Readonly<Record<string, string | number | boolean>>
        | undefined;

    return {
      id: typeof source.id === "string" ? source.id as string : undefined,
      title: typeof source.title === "string"
        ? source.title as string
        : undefined,
      isOpen: readBoolean(attrs, source, "isOpen", false),
      loading: readBoolean(attrs, source, "loading", false),
      currency: typeof source.currency === "string"
        ? source.currency as string
        : undefined,
      items,
      summary,
      emptyState,
      primaryAction,
      secondaryAction,
      continueAction,
      closeAttributes,
      overlayAttributes,
    } satisfies CartSidebarProps;
  },

  styles: keyframes,

  render: (props) => {
    const currency = props.currency ?? "USD";
    const isOpen = props.isOpen ?? false;

    const rootClasses = [styles.classMap.root];
    if (isOpen) rootClasses.push(styles.classMap.open);

    const overlayClasses = [styles.classMap.overlay];
    if (isOpen) overlayClasses.push(styles.classMap.overlayVisible);

    const panelClasses = [styles.classMap.panel];
    if (isOpen) panelClasses.push(styles.classMap.panelVisible);

    const itemsHtml = props.items?.length
      ? props.items.map((item) => {
        const quantity = item.quantity ?? 1;
        const lineTotal = item.lineTotal ?? (item.price * quantity);
        const controls = item.controls;
        const decrementAttr = attrString(controls?.decrement);
        const incrementAttr = attrString(controls?.increment);
        const removeAttr = attrString(item.removeAction);

        return `
          <article class="${styles.classMap.item}" data-item-id="${item.id}" data-product-id="${item.productId}">
            <div class="${styles.classMap.itemImage}">
              ${
          item.imageUrl
            ? `<img src="${item.imageUrl}" alt="${item.name}" class="${styles.classMap.itemImageTag}" loading="lazy" />`
            : ""
        }
            </div>
            <div class="${styles.classMap.itemContent}">
              <h4 class="${styles.classMap.itemTitle}">${item.name}</h4>
              ${
          item.description
            ? `<p class="${styles.classMap.itemMeta}">${item.description}</p>`
            : ""
        }
              ${
          item.note
            ? `<p class="${styles.classMap.itemMeta}">${item.note}</p>`
            : ""
        }
              ${
          controls
            ? `
                <div class="${styles.classMap.quantityControls}">
                  <button type="button" class="${styles.classMap.quantityButton}" ${decrementAttr}>−</button>
                  <span class="${styles.classMap.quantityValue}">${quantity}</span>
                  <button type="button" class="${styles.classMap.quantityButton}" ${incrementAttr}>+</button>
                </div>
              `
            : `<span class="${styles.classMap.quantityValue}" aria-label="Quantity">${quantity}</span>`
        }
            </div>
            <div class="${styles.classMap.itemPrice}">
              <div>${formatCurrency(item.price, currency)}</div>
              <div>${formatCurrency(lineTotal, currency)}</div>
              ${
          item.removeAction
            ? `<button type="button" class="${styles.classMap.removeButton}" ${removeAttr} aria-label="Remove ${item.name}">×</button>`
            : ""
        }
            </div>
          </article>
        `;
      }).join("")
      : "";

    const emptyHtml = `
      <div class="${styles.classMap.emptyState}">
        <h3 class="${styles.classMap.emptyTitle}">${
      props.emptyState?.title ?? "Your cart is empty"
    }</h3>
        ${
      props.emptyState?.description
        ? `<p class="${styles.classMap.emptyDescription}">${props.emptyState.description}</p>`
        : ""
    }
        ${
      props.emptyState?.action
        ? `<button type="button" class="${styles.classMap.actionButton} ${styles.classMap.actionSecondary}" ${
          attrString(props.emptyState.action.attributes)
        }>${props.emptyState.action.label}</button>`
        : ""
    }
      </div>
    `;

    const summary = props.summary;
    const summaryHtml = summary
      ? `
        <section class="${styles.classMap.summary}" aria-label="Order summary">
          <div class="${styles.classMap.summaryRow}">
            <span>Subtotal</span>
            <span>${formatCurrency(summary.subtotal, currency)}</span>
          </div>
          ${
        typeof summary.tax === "number"
          ? `<div class="${styles.classMap.summaryRow}"><span>Tax</span><span>${
            formatCurrency(summary.tax, currency)
          }</span></div>`
          : ""
      }
          ${
        summary.shipping !== undefined
          ? `<div class="${styles.classMap.summaryRow}"><span>Shipping</span><span>${
            summary.shipping === "free"
              ? "Free"
              : formatCurrency(summary.shipping, currency)
          }</span></div>`
          : ""
      }
          ${
        typeof summary.discount === "number" && summary.discount > 0
          ? `<div class="${styles.classMap.summaryRow}"><span>Discount</span><span>−${
            formatCurrency(summary.discount, currency)
          }</span></div>`
          : ""
      }
          <div class="${styles.classMap.summaryRow} ${styles.classMap.summaryTotal}">
            <span>Total</span>
            <span>${formatCurrency(summary.total, currency)}</span>
          </div>
        </section>
      `
      : "";

    const actionButton = (action?: CartSidebarAction) => {
      if (!action) return "";
      const classes = [styles.classMap.actionButton];
      switch (action.variant ?? "primary") {
        case "secondary":
          classes.push(styles.classMap.actionSecondary);
          break;
        case "link":
          classes.push(styles.classMap.actionLink);
          break;
        default:
          classes.push(styles.classMap.actionPrimary);
          break;
      }
      if (action.fullWidth ?? true) {
        classes.push(styles.classMap.actionFullWidth);
      }
      return `<button type="button" class="${classes.join(" ")}" ${
        attrString(action.attributes)
      }>${action.label}</button>`;
    };

    const actionsHtml =
      props.primaryAction || props.secondaryAction || props.continueAction
        ? `
        <footer class="${styles.classMap.actions}">
          ${actionButton(props.primaryAction)}
          ${actionButton(props.secondaryAction)}
          ${actionButton(props.continueAction)}
        </footer>
      `
        : "";

    const loadingHtml = `
      <div class="${styles.classMap.loading}" role="status" aria-live="polite">
        <div class="${styles.classMap.spinner}"></div>
        <p>Updating cart…</p>
      </div>
    `;

    return `
      <aside id="${props.id ?? "cart-sidebar"}" class="${
      rootClasses.join(" ")
    }" data-component="cart-sidebar" data-state="${isOpen ? "open" : "closed"}">
        <div class="${overlayClasses.join(" ")}" ${
      attrString(props.overlayAttributes)
    }></div>
        <section class="${
      panelClasses.join(" ")
    }" role="dialog" aria-modal="true" aria-label="${
      props.title ?? "Shopping cart"
    }">
          <header class="${styles.classMap.header}">
            <h2 class="${styles.classMap.title}">${
      props.title ?? "Shopping Cart"
    }</h2>
            <button type="button" class="${styles.classMap.closeButton}" aria-label="Close cart" ${
      attrString(props.closeAttributes)
    }>×</button>
          </header>
          <div class="${styles.classMap.content}">
            ${
      props.loading ? loadingHtml : props.items?.length ? itemsHtml : emptyHtml
    }
          </div>
          ${summaryHtml}
          ${actionsHtml}
        </section>
      </aside>
    `;
  },
});

export const CartSidebar = "cart-sidebar";
