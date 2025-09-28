/**
 * Checkout Flow Component
 * -----------------------
 * Multi-step checkout wizard with HTMX endpoints and design token styling.
 */

import { boolean, defineComponent, object, string } from "../../internal.ts";
import { css } from "../../css-in-ts.ts";
import { componentTokens } from "../../themes/component-tokens.ts";

export type CheckoutCartItem = {
  readonly id: string;
  readonly productId: string;
  readonly productName: string;
  readonly productImage?: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly totalPrice?: number;
};

export type CheckoutCart = {
  readonly items: readonly CheckoutCartItem[];
  readonly subtotal: number;
  readonly tax: number;
  readonly shipping: number;
  readonly total: number;
};

export type CheckoutAddress = {
  readonly firstName: string;
  readonly lastName: string;
  readonly company?: string;
  readonly address1: string;
  readonly address2?: string;
  readonly city: string;
  readonly state: string;
  readonly zipCode: string;
  readonly country: string;
  readonly phone?: string;
};

export type CheckoutPaymentMethod = {
  readonly type: "credit_card" | "paypal" | "apple_pay" | "google_pay";
  readonly last4?: string;
  readonly brand?: string;
};

export type CheckoutFlowApiConfig = {
  readonly shipping?: string;
  readonly payment?: string;
  readonly review?: string;
  readonly step?: string; // Base URL for step navigation (will append /:stepNumber)
};

export type CheckoutFlowProps = {
  readonly cart: CheckoutCart;
  readonly sessionId: string;
  readonly currentStep?: number;
  readonly shippingAddress?: CheckoutAddress;
  readonly billingAddress?: CheckoutAddress;
  readonly paymentMethod?: CheckoutPaymentMethod;
  readonly sameAsBilling?: boolean;
  readonly api?: CheckoutFlowApiConfig;
};

const styles = css({
  container: {
    backgroundColor: componentTokens.colors.surface.background,
    borderRadius: componentTokens.radius.xl,
    border: "1px solid " + componentTokens.colors.surface.border,
    padding: componentTokens.spacing[6],
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[6],
    boxShadow: componentTokens.shadows.md,
  },

  stepNav: {
    display: "flex",
    gap: componentTokens.spacing[3],
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },

  stepButton: {
    flex: "1 1 0",
    minWidth: "120px",
    display: "flex",
    alignItems: "center",
    gap: componentTokens.spacing[2],
    padding: `${componentTokens.spacing[2]} ${componentTokens.spacing[3]}`,
    borderRadius: componentTokens.radius.lg,
    border: "1px solid transparent",
    backgroundColor: componentTokens.colors.gray[100],
    color: componentTokens.colors.gray[700],
    cursor: "pointer",
    textDecoration: "none",
    fontSize: componentTokens.typography.sizes.sm,
    fontWeight: componentTokens.typography.weights.medium,
  },

  stepActive: {
    backgroundColor: componentTokens.colors.primary[500],
    color: "#FFFFFF",
  },

  stepCompleted: {
    backgroundColor: componentTokens.colors.success[100],
    color: componentTokens.colors.success[700],
    borderColor: componentTokens.colors.success[200],
  },

  stepNumber: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: componentTokens.spacing[6],
    height: componentTokens.spacing[6],
    borderRadius: "9999px",
    backgroundColor: componentTokens.colors.gray[200],
    fontWeight: componentTokens.typography.weights.semibold,
  },

  stepNumberActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#FFFFFF",
  },

  stepNumberCompleted: {
    backgroundColor: componentTokens.colors.success[500],
    color: "#FFFFFF",
  },

  content: {
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[5],
  },

  sectionTitle: {
    margin: 0,
    fontSize: componentTokens.typography.sizes["xl"],
    fontWeight: componentTokens.typography.weights.semibold,
  },

  form: {
    display: "grid",
    gap: componentTokens.spacing[4],
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[2],
  },

  label: {
    fontSize: componentTokens.typography.sizes.sm,
    fontWeight: componentTokens.typography.weights.medium,
    color: componentTokens.colors.gray[700],
  },

  input: {
    width: "100%",
    padding: `${componentTokens.spacing[2]} ${componentTokens.spacing[3]}`,
    borderRadius: componentTokens.radius.md,
    border: "1px solid " + componentTokens.colors.gray[300],
    fontSize: componentTokens.typography.sizes.sm,

    "&:focus": {
      borderColor: componentTokens.colors.primary[300],
      boxShadow: `0 0 0 3px ${componentTokens.colors.primary[100]}`,
      outline: "none",
    },
  },

  checkboxRow: {
    display: "flex",
    gap: componentTokens.spacing[2],
    alignItems: "center",
  },

  gridTwo: {
    display: "grid",
    gap: componentTokens.spacing[3],
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  },

  summaryCard: {
    border: "1px solid " + componentTokens.colors.surface.border,
    borderRadius: componentTokens.radius.lg,
    padding: componentTokens.spacing[4],
    backgroundColor: componentTokens.colors.surface.muted,
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[3],
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: componentTokens.typography.sizes.sm,
    color: componentTokens.colors.gray[600],
  },

  summaryTotal: {
    fontSize: componentTokens.typography.sizes["xl"],
    fontWeight: componentTokens.typography.weights.semibold,
    color: componentTokens.colors.surface.foreground,
  },

  actionBar: {
    display: "flex",
    justifyContent: "flex-end",
    gap: componentTokens.spacing[3],
  },

  actionButton: {
    padding: `${componentTokens.spacing[3]} ${componentTokens.spacing[4]}`,
    borderRadius: componentTokens.radius.md,
    border: "1px solid transparent",
    cursor: "pointer",
    fontSize: componentTokens.typography.sizes.sm,
    fontWeight: componentTokens.typography.weights.medium,
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

  reviewList: {
    display: "grid",
    gap: componentTokens.spacing[3],
  },

  reviewItem: {
    display: "grid",
    gridTemplateColumns: "64px 1fr auto",
    gap: componentTokens.spacing[3],
    alignItems: "center",
    border: "1px solid " + componentTokens.colors.surface.border,
    borderRadius: componentTokens.radius.lg,
    padding: componentTokens.spacing[3],
    backgroundColor: componentTokens.colors.surface.background,
  },

  reviewImage: {
    width: "64px",
    height: "64px",
    borderRadius: componentTokens.radius.md,
    overflow: "hidden",
    backgroundColor: componentTokens.colors.gray[100],
  },

  reviewImageTag: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  reviewTitle: {
    margin: 0,
    fontSize: componentTokens.typography.sizes.base,
    fontWeight: componentTokens.typography.weights.medium,
  },

  reviewMeta: {
    fontSize: componentTokens.typography.sizes.sm,
    color: componentTokens.colors.gray[600],
  },
});

function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function renderStepButton(
  stepNumber: number,
  label: string,
  currentStep: number,
  stepEndpoint: string,
) {
  const isActive = currentStep === stepNumber;
  const isCompleted = currentStep > stepNumber;
  const classes = [styles.classMap.stepButton];
  const numberClasses = [styles.classMap.stepNumber];

  if (isActive) {
    classes.push(styles.classMap.stepActive);
    numberClasses.push(styles.classMap.stepNumberActive);
  } else if (isCompleted) {
    classes.push(styles.classMap.stepCompleted);
    numberClasses.push(styles.classMap.stepNumberCompleted);
  }

  const numberContent = isCompleted ? "✓" : stepNumber.toString();

  return `
    <button
      type="button"
      class="${classes.join(" ")}"
      hx-get="${stepEndpoint}/${stepNumber}"
      hx-target=".checkout-flow-content"
      hx-swap="innerHTML"
      aria-current="${isActive ? "step" : "false"}"
    >
      <span class="${
    numberClasses.join(" ")
  }" aria-hidden="true">${numberContent}</span>
      <span>${label}</span>
    </button>
  `;
}

function renderShippingStep(
  props: CheckoutFlowProps,
  stylesMap: typeof styles.classMap,
  api: CheckoutFlowApiConfig,
): string {
  const shipping = props.shippingAddress;
  const sameAsBilling = props.sameAsBilling ?? true;

  return `
    <section class="${stylesMap.content} checkout-flow-content">
      <h2 class="${stylesMap.sectionTitle}">Shipping Information</h2>
      <form
        class="${stylesMap.form}"
        hx-post="${api.shipping ?? "/api/checkout/shipping"}"
        hx-target=".checkout-flow-content"
        hx-swap="innerHTML"
        hx-ext="json-enc"
      >
        <input type="hidden" name="sessionId" value="${props.sessionId}" />
        <div class="${stylesMap.gridTwo}">
          <div class="${stylesMap.fieldGroup}">
            <label class="${stylesMap.label}" for="shipping-first-name">First Name *</label>
            <input id="shipping-first-name" class="${stylesMap.input}" type="text" name="shipping.firstName" value="${
    shipping?.firstName ?? ""
  }" required />
          </div>
          <div class="${stylesMap.fieldGroup}">
            <label class="${stylesMap.label}" for="shipping-last-name">Last Name *</label>
            <input id="shipping-last-name" class="${stylesMap.input}" type="text" name="shipping.lastName" value="${
    shipping?.lastName ?? ""
  }" required />
          </div>
        </div>

        <div class="${stylesMap.fieldGroup}">
          <label class="${stylesMap.label}" for="shipping-company">Company</label>
          <input id="shipping-company" class="${stylesMap.input}" type="text" name="shipping.company" value="${
    shipping?.company ?? ""
  }" />
        </div>

        <div class="${stylesMap.fieldGroup}">
          <label class="${stylesMap.label}" for="shipping-address1">Address *</label>
          <input id="shipping-address1" class="${stylesMap.input}" type="text" name="shipping.address1" value="${
    shipping?.address1 ?? ""
  }" required />
        </div>

        <div class="${stylesMap.fieldGroup}">
          <label class="${stylesMap.label}" for="shipping-address2">Apartment, suite, etc.</label>
          <input id="shipping-address2" class="${stylesMap.input}" type="text" name="shipping.address2" value="${
    shipping?.address2 ?? ""
  }" />
        </div>

        <div class="${stylesMap.gridTwo}">
          <div class="${stylesMap.fieldGroup}">
            <label class="${stylesMap.label}" for="shipping-city">City *</label>
            <input id="shipping-city" class="${stylesMap.input}" type="text" name="shipping.city" value="${
    shipping?.city ?? ""
  }" required />
          </div>
          <div class="${stylesMap.fieldGroup}">
            <label class="${stylesMap.label}" for="shipping-state">State *</label>
            <input id="shipping-state" class="${stylesMap.input}" type="text" name="shipping.state" value="${
    shipping?.state ?? ""
  }" required />
          </div>
        </div>

        <div class="${stylesMap.gridTwo}">
          <div class="${stylesMap.fieldGroup}">
            <label class="${stylesMap.label}" for="shipping-zip">ZIP *</label>
            <input id="shipping-zip" class="${stylesMap.input}" type="text" name="shipping.zipCode" value="${
    shipping?.zipCode ?? ""
  }" required />
          </div>
          <div class="${stylesMap.fieldGroup}">
            <label class="${stylesMap.label}" for="shipping-country">Country *</label>
            <input id="shipping-country" class="${stylesMap.input}" type="text" name="shipping.country" value="${
    shipping?.country ?? "United States"
  }" required />
          </div>
        </div>

        <label class="${stylesMap.checkboxRow}">
          <input type="checkbox" name="sameAsBilling" ${
    sameAsBilling ? "checked" : ""
  } />
          Billing address is same as shipping
        </label>

        <div class="${stylesMap.actionBar}">
          <button type="submit" class="${stylesMap.actionButton} ${stylesMap.actionPrimary}">
            Continue to payment
          </button>
        </div>
      </form>
    </section>
  `;
}

function renderPaymentStep(
  props: CheckoutFlowProps,
  stylesMap: typeof styles.classMap,
  api: CheckoutFlowApiConfig,
): string {
  const payment = props.paymentMethod;

  return `
    <section class="${stylesMap.content} checkout-flow-content">
      <h2 class="${stylesMap.sectionTitle}">Payment Method</h2>
      <form
        class="${stylesMap.form}"
        hx-post="${api.payment ?? "/api/checkout/payment"}"
        hx-target=".checkout-flow-content"
        hx-swap="innerHTML"
        hx-ext="json-enc"
      >
        <input type="hidden" name="sessionId" value="${props.sessionId}" />

        <div class="${stylesMap.fieldGroup}">
          <label class="${stylesMap.label}" for="card-number">Card Number *</label>
          <input id="card-number" class="${stylesMap.input}" type="text" name="payment.cardNumber" placeholder="4242 4242 4242 4242" value="" required />
        </div>

        <div class="${stylesMap.gridTwo}">
          <div class="${stylesMap.fieldGroup}">
            <label class="${stylesMap.label}" for="card-expiry">Expiry *</label>
            <input id="card-expiry" class="${stylesMap.input}" type="text" name="payment.expiry" placeholder="MM/YY" required />
          </div>
          <div class="${stylesMap.fieldGroup}">
            <label class="${stylesMap.label}" for="card-cvc">CVC *</label>
            <input id="card-cvc" class="${stylesMap.input}" type="text" name="payment.cvc" placeholder="123" required />
          </div>
        </div>

        <div class="${stylesMap.actionBar}">
          <button type="button" class="${stylesMap.actionButton} ${stylesMap.actionSecondary}" hx-get="${
    api.step ?? "/api/checkout/step"
  }/1" hx-target=".checkout-flow-content" hx-swap="innerHTML">
            Back to shipping
          </button>
          <button type="submit" class="${stylesMap.actionButton} ${stylesMap.actionPrimary}">
            Review order
          </button>
        </div>
      </form>
    </section>
  `;
}

function renderReviewStep(
  props: CheckoutFlowProps,
  stylesMap: typeof styles.classMap,
  api: CheckoutFlowApiConfig,
): string {
  const cart = props.cart;

  const itemsHtml = cart.items.map((item) => {
    const total = item.totalPrice ?? (item.quantity * item.unitPrice);
    return `
      <article class="${stylesMap.reviewItem}" data-item-id="${item.id}">
        <div class="${stylesMap.reviewImage}">
          ${
      item.productImage
        ? `<img src="${item.productImage}" alt="${item.productName}" class="${stylesMap.reviewImageTag}" loading="lazy" />`
        : ""
    }
        </div>
        <div>
          <h3 class="${stylesMap.reviewTitle}">${item.productName}</h3>
          <p class="${stylesMap.reviewMeta}">Quantity: ${item.quantity}</p>
        </div>
        <div class="${stylesMap.reviewMeta}">
          ${formatCurrency(total)}
        </div>
      </article>
    `;
  }).join("");

  return `
    <section class="${stylesMap.content} checkout-flow-content">
      <h2 class="${stylesMap.sectionTitle}">Review & Submit</h2>
      <div class="${stylesMap.reviewList}">
        ${itemsHtml}
      </div>

      <div class="${stylesMap.summaryCard}">
        <div class="${stylesMap.summaryRow}">
          <span>Subtotal</span>
          <span>${formatCurrency(cart.subtotal)}</span>
        </div>
        <div class="${stylesMap.summaryRow}">
          <span>Tax</span>
          <span>${formatCurrency(cart.tax)}</span>
        </div>
        <div class="${stylesMap.summaryRow}">
          <span>Shipping</span>
          <span>${
    cart.shipping > 0 ? formatCurrency(cart.shipping) : "Free"
  }</span>
        </div>
        <div class="${stylesMap.summaryRow} ${stylesMap.summaryTotal}">
          <span>Total</span>
          <span>${formatCurrency(cart.total)}</span>
        </div>
      </div>

      <div class="${stylesMap.actionBar}">
        <button type="button" class="${stylesMap.actionButton} ${stylesMap.actionSecondary}" hx-get="${
    api.step ?? "/api/checkout/step"
  }/2" hx-target=".checkout-flow-content" hx-swap="innerHTML">
          Back to payment
        </button>
        <button type="button" class="${stylesMap.actionButton} ${stylesMap.actionPrimary}" hx-post="${
    api.review ?? "/api/checkout/complete"
  }" hx-target="#checkout-confirmation" hx-swap="innerHTML">
          Place order
        </button>
      </div>
    </section>
  `;
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

defineComponent<CheckoutFlowProps>("checkout-flow", {
  props: (attrs) => {
    const source = attrs as Record<string, unknown>;

    const rawCart = source.cart ?? source["cart"];
    const cart = typeof rawCart === "string"
      ? object<CheckoutCart>().parse(attrs, "cart")
      : rawCart as CheckoutCart;

    const rawShipping = source.shippingAddress ?? source["shipping-address"];
    const shippingAddress = typeof rawShipping === "string"
      ? object<CheckoutAddress>().parse(attrs, "shippingAddress")
      : rawShipping as CheckoutAddress | undefined;

    const rawBilling = source.billingAddress ?? source["billing-address"];
    const billingAddress = typeof rawBilling === "string"
      ? object<CheckoutAddress>().parse(attrs, "billingAddress")
      : rawBilling as CheckoutAddress | undefined;

    const rawPayment = source.paymentMethod ?? source["payment-method"];
    const paymentMethod = typeof rawPayment === "string"
      ? object<CheckoutPaymentMethod>().parse(attrs, "paymentMethod")
      : rawPayment as CheckoutPaymentMethod | undefined;

    const rawApi = source.api ?? source["api"];
    const api = typeof rawApi === "string"
      ? object<CheckoutFlowApiConfig>().parse(attrs, "api")
      : rawApi as CheckoutFlowApiConfig | undefined;

    const sessionId = typeof source.sessionId === "string"
      ? source.sessionId as string
      : string("").parse(attrs, "sessionId");

    const currentStep = source.currentStep ?? source["current-step"];

    return {
      cart,
      sessionId,
      currentStep: typeof currentStep === "number"
        ? currentStep
        : Number(currentStep ?? 1) || 1,
      shippingAddress,
      billingAddress,
      paymentMethod,
      sameAsBilling: readBoolean(attrs, source, "sameAsBilling", true),
      api,
    } satisfies CheckoutFlowProps;
  },

  render: (props) => {
    const stepEndpoint = props.api?.step ?? "/api/checkout/step";
    const currentStep = Math.min(Math.max(props.currentStep ?? 1, 1), 3);

    const stepNav = [`
      ${renderStepButton(1, "Shipping", currentStep, stepEndpoint)}
      ${renderStepButton(2, "Payment", currentStep, stepEndpoint)}
      ${renderStepButton(3, "Review", currentStep, stepEndpoint)}
    `].join("");

    let stepContent: string;
    switch (currentStep) {
      case 1:
      default:
        stepContent = renderShippingStep(
          props,
          styles.classMap,
          props.api ?? {},
        );
        break;
      case 2:
        stepContent = renderPaymentStep(
          props,
          styles.classMap,
          props.api ?? {},
        );
        break;
      case 3:
        stepContent = renderReviewStep(props, styles.classMap, props.api ?? {});
        break;
    }

    return `
      <section class="${styles.classMap.container}" data-component="checkout-flow">
        <nav class="${styles.classMap.stepNav}" aria-label="Checkout steps">
          ${stepNav}
        </nav>
        ${stepContent}
      </section>
    `;
  },
});

export const CheckoutFlow = "checkout-flow";
