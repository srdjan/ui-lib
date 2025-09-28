/**
 * Multi-Step Checkout Flow Component
 *
 * Demonstrates:
 * - Token-based multi-step form design
 * - Progressive enhancement with HTMX
 * - Client-side validation with server fallback
 * - Accessible form navigation
 * - CSS Grid and flexbox layouts
 * - Form state management in DOM
 */

import { createTokenComponent } from "../../../lib/tokens/component-factory.ts";
import type { Cart, ShippingAddress, PaymentMethod } from "../api/types.ts";

// ============================================================
// Component Props
// ============================================================

export interface CheckoutFlowTokens {
  container: {
    width: string;
    maxWidth: string;
    margin: string;
    padding: string;
    backgroundColor: string;
    borderRadius: string;
    boxShadow: string;
  };
  stepper: {
    display: string;
    gap: string;
    marginBottom: string;
    padding: string;
    borderBottom: string;
  };
  step: {
    display: string;
    alignItems: string;
    gap: string;
    padding: string;
    borderRadius: string;
    fontWeight: string;
    color: string;
    backgroundColor: string;
    border: string;
    cursor: string;
    transition: string;
  };
  stepActive: {
    color: string;
    backgroundColor: string;
    borderColor: string;
    fontWeight: string;
  };
  stepCompleted: {
    color: string;
    backgroundColor: string;
    borderColor: string;
  };
  stepNumber: {
    width: string;
    height: string;
    borderRadius: string;
    backgroundColor: string;
    color: string;
    display: string;
    alignItems: string;
    justifyContent: string;
    fontSize: string;
    fontWeight: string;
  };
  content: {
    padding: string;
    minHeight: string;
  };
  section: {
    marginBottom: string;
  };
  sectionTitle: {
    fontSize: string;
    fontWeight: string;
    marginBottom: string;
    color: string;
  };
  formGrid: {
    display: string;
    gap: string;
    gridTemplateColumns: string;
  };
  formGroup: {
    display: string;
    flexDirection: string;
    gap: string;
  };
  label: {
    fontSize: string;
    fontWeight: string;
    color: string;
  };
  input: {
    padding: string;
    border: string;
    borderRadius: string;
    fontSize: string;
    transition: string;
    backgroundColor: string;
    color: string;
  };
  inputFocus: {
    outline: string;
    borderColor: string;
    boxShadow: string;
  };
  inputError: {
    borderColor: string;
    backgroundColor: string;
  };
  select: {
    padding: string;
    border: string;
    borderRadius: string;
    fontSize: string;
    backgroundColor: string;
    color: string;
    cursor: string;
  };
  checkbox: {
    width: string;
    height: string;
    accentColor: string;
  };
  errorMessage: {
    fontSize: string;
    color: string;
    marginTop: string;
  };
  summary: {
    padding: string;
    backgroundColor: string;
    borderRadius: string;
    border: string;
  };
  summaryItem: {
    display: string;
    justifyContent: string;
    padding: string;
    borderBottom: string;
  };
  summaryTotal: {
    fontSize: string;
    fontWeight: string;
    borderTop: string;
    paddingTop: string;
    marginTop: string;
  };
  actions: {
    display: string;
    justifyContent: string;
    gap: string;
    marginTop: string;
    padding: string;
    borderTop: string;
  };
  button: {
    padding: string;
    border: string;
    borderRadius: string;
    fontSize: string;
    fontWeight: string;
    cursor: string;
    transition: string;
    minWidth: string;
  };
  buttonPrimary: {
    backgroundColor: string;
    color: string;
    borderColor: string;
  };
  buttonSecondary: {
    backgroundColor: string;
    color: string;
    borderColor: string;
  };
  buttonDisabled: {
    opacity: string;
    cursor: string;
  };
}

// ============================================================
// Component Props
// ============================================================

export interface CheckoutFlowProps {
  cart: Cart;
  currentStep?: number;
  sessionId: string;
  shippingAddress?: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod?: PaymentMethod;
  sameAsBilling?: boolean;
  tokens?: Partial<CheckoutFlowTokens>;
}

// ============================================================
// Component Implementation
// ============================================================

export const CheckoutFlow = createTokenComponent<
  CheckoutFlowTokens,
  CheckoutFlowProps
>({
  name: "checkout-flow",
  tokens: {
    container: {
      width: "100%",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "2rem",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    stepper: {
      display: "flex",
      gap: "0.5rem",
      marginBottom: "2rem",
      padding: "1rem 0",
      borderBottom: "1px solid #E5E7EB",
    },
    step: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "0.75rem 1rem",
      borderRadius: "8px",
      fontWeight: "500",
      color: "#6B7280",
      backgroundColor: "transparent",
      border: "1px solid transparent",
      cursor: "pointer",
      transition: "all 200ms ease",
    },
    stepActive: {
      color: "#1F2937",
      backgroundColor: "#EEF2FF",
      borderColor: "#6366F1",
      fontWeight: "600",
    },
    stepCompleted: {
      color: "#059669",
      backgroundColor: "#ECFDF5",
      borderColor: "#10B981",
    },
    stepNumber: {
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      backgroundColor: "#D1D5DB",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      fontWeight: "600",
    },
    content: {
      padding: "1rem 0",
      minHeight: "400px",
    },
    section: {
      marginBottom: "2rem",
    },
    sectionTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: "#1F2937",
    },
    formGrid: {
      display: "grid",
      gap: "1rem",
      gridTemplateColumns: "1fr 1fr",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#374151",
    },
    input: {
      padding: "0.75rem",
      border: "1px solid #D1D5DB",
      borderRadius: "6px",
      fontSize: "1rem",
      transition: "border-color 200ms ease, box-shadow 200ms ease",
      backgroundColor: "white",
      color: "#1F2937",
    },
    inputFocus: {
      outline: "none",
      borderColor: "#6366F1",
      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
    },
    inputError: {
      borderColor: "#EF4444",
      backgroundColor: "#FEF2F2",
    },
    select: {
      padding: "0.75rem",
      border: "1px solid #D1D5DB",
      borderRadius: "6px",
      fontSize: "1rem",
      backgroundColor: "white",
      color: "#1F2937",
      cursor: "pointer",
    },
    checkbox: {
      width: "18px",
      height: "18px",
      accentColor: "#6366F1",
    },
    errorMessage: {
      fontSize: "0.875rem",
      color: "#EF4444",
      marginTop: "0.25rem",
    },
    summary: {
      padding: "1.5rem",
      backgroundColor: "#F9FAFB",
      borderRadius: "8px",
      border: "1px solid #E5E7EB",
    },
    summaryItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0.5rem 0",
      borderBottom: "1px solid #E5E7EB",
    },
    summaryTotal: {
      fontSize: "1.125rem",
      fontWeight: "600",
      borderTop: "2px solid #E5E7EB",
      paddingTop: "1rem",
      marginTop: "1rem",
    },
    actions: {
      display: "flex",
      justifyContent: "space-between",
      gap: "1rem",
      marginTop: "2rem",
      padding: "1.5rem 0",
      borderTop: "1px solid #E5E7EB",
    },
    button: {
      padding: "0.75rem 1.5rem",
      border: "1px solid",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 200ms ease",
      minWidth: "120px",
    },
    buttonPrimary: {
      backgroundColor: "#6366F1",
      color: "white",
      borderColor: "#6366F1",
    },
    buttonSecondary: {
      backgroundColor: "white",
      color: "#374151",
      borderColor: "#D1D5DB",
    },
    buttonDisabled: {
      opacity: "0.5",
      cursor: "not-allowed",
    },
  },

  styles: (cssVars) => `
    .checkout-flow {
      width: ${cssVars.container.width};
      max-width: ${cssVars.container.maxWidth};
      margin: ${cssVars.container.margin};
      padding: ${cssVars.container.padding};
      background-color: ${cssVars.container.backgroundColor};
      border-radius: ${cssVars.container.borderRadius};
      box-shadow: ${cssVars.container.boxShadow};
    }

    .checkout-stepper {
      display: ${cssVars.stepper.display};
      gap: ${cssVars.stepper.gap};
      margin-bottom: ${cssVars.stepper.marginBottom};
      padding: ${cssVars.stepper.padding};
      border-bottom: ${cssVars.stepper.borderBottom};
    }

    .checkout-step {
      display: ${cssVars.step.display};
      align-items: ${cssVars.step.alignItems};
      gap: ${cssVars.step.gap};
      padding: ${cssVars.step.padding};
      border-radius: ${cssVars.step.borderRadius};
      font-weight: ${cssVars.step.fontWeight};
      color: ${cssVars.step.color};
      background-color: ${cssVars.step.backgroundColor};
      border: ${cssVars.step.border};
      cursor: ${cssVars.step.cursor};
      transition: ${cssVars.step.transition};
    }

    .checkout-step--active {
      color: ${cssVars.stepActive.color};
      background-color: ${cssVars.stepActive.backgroundColor};
      border-color: ${cssVars.stepActive.borderColor};
      font-weight: ${cssVars.stepActive.fontWeight};
    }

    .checkout-step--completed {
      color: ${cssVars.stepCompleted.color};
      background-color: ${cssVars.stepCompleted.backgroundColor};
      border-color: ${cssVars.stepCompleted.borderColor};
    }

    .checkout-step__number {
      width: ${cssVars.stepNumber.width};
      height: ${cssVars.stepNumber.height};
      border-radius: ${cssVars.stepNumber.borderRadius};
      background-color: ${cssVars.stepNumber.backgroundColor};
      color: ${cssVars.stepNumber.color};
      display: ${cssVars.stepNumber.display};
      align-items: ${cssVars.stepNumber.alignItems};
      justify-content: ${cssVars.stepNumber.justifyContent};
      font-size: ${cssVars.stepNumber.fontSize};
      font-weight: ${cssVars.stepNumber.fontWeight};
    }

    .checkout-step--active .checkout-step__number {
      background-color: ${cssVars.stepActive.borderColor};
    }

    .checkout-step--completed .checkout-step__number {
      background-color: ${cssVars.stepCompleted.borderColor};
    }

    .checkout-content {
      padding: ${cssVars.content.padding};
      min-height: ${cssVars.content.minHeight};
    }

    .checkout-section {
      margin-bottom: ${cssVars.section.marginBottom};
    }

    .checkout-section__title {
      font-size: ${cssVars.sectionTitle.fontSize};
      font-weight: ${cssVars.sectionTitle.fontWeight};
      margin-bottom: ${cssVars.sectionTitle.marginBottom};
      color: ${cssVars.sectionTitle.color};
    }

    .checkout-form-grid {
      display: ${cssVars.formGrid.display};
      gap: ${cssVars.formGrid.gap};
      grid-template-columns: ${cssVars.formGrid.gridTemplateColumns};
    }

    .checkout-form-group {
      display: ${cssVars.formGroup.display};
      flex-direction: ${cssVars.formGroup.flexDirection};
      gap: ${cssVars.formGroup.gap};
    }

    .checkout-form-group--full {
      grid-column: 1 / -1;
    }

    .checkout-label {
      font-size: ${cssVars.label.fontSize};
      font-weight: ${cssVars.label.fontWeight};
      color: ${cssVars.label.color};
    }

    .checkout-input {
      padding: ${cssVars.input.padding};
      border: ${cssVars.input.border};
      border-radius: ${cssVars.input.borderRadius};
      font-size: ${cssVars.input.fontSize};
      transition: ${cssVars.input.transition};
      background-color: ${cssVars.input.backgroundColor};
      color: ${cssVars.input.color};
    }

    .checkout-input:focus {
      outline: ${cssVars.inputFocus.outline};
      border-color: ${cssVars.inputFocus.borderColor};
      box-shadow: ${cssVars.inputFocus.boxShadow};
    }

    .checkout-input--error {
      border-color: ${cssVars.inputError.borderColor};
      background-color: ${cssVars.inputError.backgroundColor};
    }

    .checkout-select {
      padding: ${cssVars.select.padding};
      border: ${cssVars.select.border};
      border-radius: ${cssVars.select.borderRadius};
      font-size: ${cssVars.select.fontSize};
      background-color: ${cssVars.select.backgroundColor};
      color: ${cssVars.select.color};
      cursor: ${cssVars.select.cursor};
    }

    .checkout-checkbox {
      width: ${cssVars.checkbox.width};
      height: ${cssVars.checkbox.height};
      accent-color: ${cssVars.checkbox.accentColor};
    }

    .checkout-error-message {
      font-size: ${cssVars.errorMessage.fontSize};
      color: ${cssVars.errorMessage.color};
      margin-top: ${cssVars.errorMessage.marginTop};
    }

    .checkout-summary {
      padding: ${cssVars.summary.padding};
      background-color: ${cssVars.summary.backgroundColor};
      border-radius: ${cssVars.summary.borderRadius};
      border: ${cssVars.summary.border};
    }

    .checkout-summary__item {
      display: ${cssVars.summaryItem.display};
      justify-content: ${cssVars.summaryItem.justifyContent};
      padding: ${cssVars.summaryItem.padding};
      border-bottom: ${cssVars.summaryItem.borderBottom};
    }

    .checkout-summary__item:last-child {
      border-bottom: none;
    }

    .checkout-summary__total {
      font-size: ${cssVars.summaryTotal.fontSize};
      font-weight: ${cssVars.summaryTotal.fontWeight};
      border-top: ${cssVars.summaryTotal.borderTop};
      padding-top: ${cssVars.summaryTotal.paddingTop};
      margin-top: ${cssVars.summaryTotal.marginTop};
    }

    .checkout-actions {
      display: ${cssVars.actions.display};
      justify-content: ${cssVars.actions.justifyContent};
      gap: ${cssVars.actions.gap};
      margin-top: ${cssVars.actions.marginTop};
      padding: ${cssVars.actions.padding};
      border-top: ${cssVars.actions.borderTop};
    }

    .checkout-button {
      padding: ${cssVars.button.padding};
      border: ${cssVars.button.border};
      border-radius: ${cssVars.button.borderRadius};
      font-size: ${cssVars.button.fontSize};
      font-weight: ${cssVars.button.fontWeight};
      cursor: ${cssVars.button.cursor};
      transition: ${cssVars.button.transition};
      min-width: ${cssVars.button.minWidth};
    }

    .checkout-button--primary {
      background-color: ${cssVars.buttonPrimary.backgroundColor};
      color: ${cssVars.buttonPrimary.color};
      border-color: ${cssVars.buttonPrimary.borderColor};
    }

    .checkout-button--primary:hover:not(:disabled) {
      background-color: color-mix(in srgb, ${cssVars.buttonPrimary.backgroundColor} 90%, black);
    }

    .checkout-button--secondary {
      background-color: ${cssVars.buttonSecondary.backgroundColor};
      color: ${cssVars.buttonSecondary.color};
      border-color: ${cssVars.buttonSecondary.borderColor};
    }

    .checkout-button--secondary:hover:not(:disabled) {
      background-color: #F3F4F6;
    }

    .checkout-button:disabled {
      opacity: ${cssVars.buttonDisabled.opacity};
      cursor: ${cssVars.buttonDisabled.cursor};
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .checkout-flow {
        padding: 1rem;
      }

      .checkout-stepper {
        flex-direction: column;
        gap: 0.25rem;
      }

      .checkout-step {
        padding: 0.5rem;
      }

      .checkout-form-grid {
        grid-template-columns: 1fr;
      }

      .checkout-actions {
        flex-direction: column-reverse;
      }
    }

    /* Focus ring for accessibility */
    .checkout-step:focus-visible {
      outline: 2px solid ${cssVars.stepActive.borderColor};
      outline-offset: 2px;
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .checkout-input {
        border-width: 2px;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .checkout-step, .checkout-input, .checkout-button {
        transition: none;
      }
    }
  `,

  render: (props) => {
    const currentStep = props.currentStep || 1;
    const steps = [
      { number: 1, title: "Shipping", id: "shipping" },
      { number: 2, title: "Payment", id: "payment" },
      { number: 3, title: "Review", id: "review" },
    ];

    return `
      <div class="checkout-flow" data-step="${currentStep}" data-session="${props.sessionId}">
        <!-- Step Navigation -->
        <div class="checkout-stepper" role="tablist" aria-label="Checkout steps">
          ${
      steps.map((step) => `
            <button
              role="tab"
              aria-selected="${currentStep === step.number}"
              aria-controls="checkout-${step.id}"
              tabindex="${currentStep === step.number ? "0" : "-1"}"
              class="checkout-step ${
        currentStep === step.number ? "checkout-step--active" : ""
      } ${currentStep > step.number ? "checkout-step--completed" : ""}"
              data-step="${step.number}"
              hx-get="/api/checkout/step/${step.number}"
              hx-target=".checkout-content"
              hx-swap="innerHTML"
              hx-push-url="false"
            >
              <span class="checkout-step__number">${
        currentStep > step.number ? "✓" : step.number
      }</span>
              <span>${step.title}</span>
            </button>
          `).join("")
    }
        </div>

        <!-- Step Content -->
        <div class="checkout-content">
          ${renderStepContent(props, currentStep)}
        </div>
      </div>
    `;
  },
});

// ============================================================
// Step Content Renderers
// ============================================================

function renderStepContent(props: CheckoutFlowProps, step: number): string {
  switch (step) {
    case 1:
      return renderShippingStep(props);
    case 2:
      return renderPaymentStep(props);
    case 3:
      return renderReviewStep(props);
    default:
      return renderShippingStep(props);
  }
}

function renderShippingStep(props: CheckoutFlowProps): string {
  const shipping = props.shippingAddress;
  const billing = props.billingAddress;
  const sameAsBilling = props.sameAsBilling ?? false;

  return `
    <div id="checkout-shipping" role="tabpanel" aria-labelledby="step-1">
      <form
        hx-post="/api/checkout/shipping"
        hx-target=".checkout-content"
        hx-swap="innerHTML"
        hx-include="[data-session='${props.sessionId}']"
        hx-ext="json-enc"
      >
        <input type="hidden" name="sessionId" value="${props.sessionId}">

        <!-- Shipping Address -->
        <section class="checkout-section">
          <h2 class="checkout-section__title">Shipping Address</h2>
          <div class="checkout-form-grid">
            <div class="checkout-form-group">
              <label for="shipping-firstName" class="checkout-label">First Name *</label>
              <input
                type="text"
                id="shipping-firstName"
                name="shipping.firstName"
                class="checkout-input"
                value="${shipping?.firstName || ""}"
                required
                aria-describedby="shipping-firstName-error"
              >
              <div id="shipping-firstName-error" class="checkout-error-message" role="alert"></div>
            </div>

            <div class="checkout-form-group">
              <label for="shipping-lastName" class="checkout-label">Last Name *</label>
              <input
                type="text"
                id="shipping-lastName"
                name="shipping.lastName"
                class="checkout-input"
                value="${shipping?.lastName || ""}"
                required
                aria-describedby="shipping-lastName-error"
              >
              <div id="shipping-lastName-error" class="checkout-error-message" role="alert"></div>
            </div>

            <div class="checkout-form-group checkout-form-group--full">
              <label for="shipping-address1" class="checkout-label">Street Address *</label>
              <input
                type="text"
                id="shipping-address1"
                name="shipping.address1"
                class="checkout-input"
                value="${shipping?.address1 || ""}"
                required
                aria-describedby="shipping-address1-error"
              >
              <div id="shipping-address1-error" class="checkout-error-message" role="alert"></div>
            </div>

            <div class="checkout-form-group">
              <label for="shipping-city" class="checkout-label">City *</label>
              <input
                type="text"
                id="shipping-city"
                name="shipping.city"
                class="checkout-input"
                value="${shipping?.city || ""}"
                required
                aria-describedby="shipping-city-error"
              >
              <div id="shipping-city-error" class="checkout-error-message" role="alert"></div>
            </div>

            <div class="checkout-form-group">
              <label for="shipping-state" class="checkout-label">State/Province *</label>
              <select
                id="shipping-state"
                name="shipping.state"
                class="checkout-select"
                required
                aria-describedby="shipping-state-error"
              >
                <option value="">Select State</option>
                <option value="CA" ${
    shipping?.state === "CA" ? "selected" : ""
  }>California</option>
                <option value="NY" ${
    shipping?.state === "NY" ? "selected" : ""
  }>New York</option>
                <option value="TX" ${
    shipping?.state === "TX" ? "selected" : ""
  }>Texas</option>
                <option value="FL" ${
    shipping?.state === "FL" ? "selected" : ""
  }>Florida</option>
                <!-- Add more states as needed -->
              </select>
              <div id="shipping-state-error" class="checkout-error-message" role="alert"></div>
            </div>

            <div class="checkout-form-group">
              <label for="shipping-zipCode" class="checkout-label">ZIP/Postal Code *</label>
              <input
                type="text"
                id="shipping-zipCode"
                name="shipping.zipCode"
                class="checkout-input"
                value="${shipping?.zipCode || ""}"
                required
                pattern="[0-9]{5}(-[0-9]{4})?"
                aria-describedby="shipping-zipCode-error"
              >
              <div id="shipping-zipCode-error" class="checkout-error-message" role="alert"></div>
            </div>

            <div class="checkout-form-group">
              <label for="shipping-country" class="checkout-label">Country *</label>
              <select
                id="shipping-country"
                name="shipping.country"
                class="checkout-select"
                required
                aria-describedby="shipping-country-error"
              >
                <option value="US" ${
    shipping?.country === "US" ? "selected" : ""
  }>United States</option>
                <option value="CA" ${
    shipping?.country === "CA" ? "selected" : ""
  }>Canada</option>
              </select>
              <div id="shipping-country-error" class="checkout-error-message" role="alert"></div>
            </div>
          </div>
        </section>

        <!-- Billing Address -->
        <section class="checkout-section">
          <h2 class="checkout-section__title">Billing Address</h2>

          <div class="checkout-form-group">
            <label style="display: flex; align-items: center; gap: 0.5rem;">
              <input
                type="checkbox"
                name="sameAsBilling"
                class="checkout-checkbox"
                ${sameAsBilling ? "checked" : ""}
                onchange="toggleBillingAddress(this)"
              >
              <span class="checkout-label">Same as shipping address</span>
            </label>
          </div>

          <div id="billing-fields" style="${
    sameAsBilling ? "display: none;" : ""
  }">
            <div class="checkout-form-grid">
              <div class="checkout-form-group">
                <label for="billing-firstName" class="checkout-label">First Name *</label>
                <input
                  type="text"
                  id="billing-firstName"
                  name="billing.firstName"
                  class="checkout-input"
                  value="${billing?.firstName || ""}"
                  ${sameAsBilling ? "" : "required"}
                >
              </div>

              <div class="checkout-form-group">
                <label for="billing-lastName" class="checkout-label">Last Name *</label>
                <input
                  type="text"
                  id="billing-lastName"
                  name="billing.lastName"
                  class="checkout-input"
                  value="${billing?.lastName || ""}"
                  ${sameAsBilling ? "" : "required"}
                >
              </div>

              <div class="checkout-form-group checkout-form-group--full">
                <label for="billing-address1" class="checkout-label">Street Address *</label>
                <input
                  type="text"
                  id="billing-address1"
                  name="billing.address1"
                  class="checkout-input"
                  value="${billing?.address1 || ""}"
                  ${sameAsBilling ? "" : "required"}
                >
              </div>

              <div class="checkout-form-group">
                <label for="billing-city" class="checkout-label">City *</label>
                <input
                  type="text"
                  id="billing-city"
                  name="billing.city"
                  class="checkout-input"
                  value="${billing?.city || ""}"
                  ${sameAsBilling ? "" : "required"}
                >
              </div>

              <div class="checkout-form-group">
                <label for="billing-state" class="checkout-label">State/Province *</label>
                <select
                  id="billing-state"
                  name="billing.state"
                  class="checkout-select"
                  ${sameAsBilling ? "" : "required"}
                >
                  <option value="">Select State</option>
                  <option value="CA" ${
    billing?.state === "CA" ? "selected" : ""
  }>California</option>
                  <option value="NY" ${
    billing?.state === "NY" ? "selected" : ""
  }>New York</option>
                  <option value="TX" ${
    billing?.state === "TX" ? "selected" : ""
  }>Texas</option>
                  <option value="FL" ${
    billing?.state === "FL" ? "selected" : ""
  }>Florida</option>
                </select>
              </div>

              <div class="checkout-form-group">
                <label for="billing-zipCode" class="checkout-label">ZIP/Postal Code *</label>
                <input
                  type="text"
                  id="billing-zipCode"
                  name="billing.zipCode"
                  class="checkout-input"
                  value="${billing?.zipCode || ""}"
                  pattern="[0-9]{5}(-[0-9]{4})?"
                  ${sameAsBilling ? "" : "required"}
                >
              </div>

              <div class="checkout-form-group">
                <label for="billing-country" class="checkout-label">Country *</label>
                <select
                  id="billing-country"
                  name="billing.country"
                  class="checkout-select"
                  ${sameAsBilling ? "" : "required"}
                >
                  <option value="US" ${
    billing?.country === "US" ? "selected" : ""
  }>United States</option>
                  <option value="CA" ${
    billing?.country === "CA" ? "selected" : ""
  }>Canada</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <!-- Actions -->
        <div class="checkout-actions">
          <button type="button" class="checkout-button checkout-button--secondary" onclick="history.back()">
            Back to Cart
          </button>
          <button type="submit" class="checkout-button checkout-button--primary">
            Continue to Payment
          </button>
        </div>
      </form>
    </div>

    <script>
      function toggleBillingAddress(checkbox) {
        const billingFields = document.getElementById('billing-fields');
        const inputs = billingFields.querySelectorAll('input, select');

        if (checkbox.checked) {
          billingFields.style.display = 'none';
          inputs.forEach(input => input.removeAttribute('required'));
        } else {
          billingFields.style.display = 'block';
          inputs.forEach(input => {
            if (input.type !== 'hidden') {
              input.setAttribute('required', '');
            }
          });
        }
      }
    </script>
  `;
}

function renderPaymentStep(props: CheckoutFlowProps): string {
  const payment = props.paymentMethod;

  return `
    <div id="checkout-payment" role="tabpanel" aria-labelledby="step-2">
      <form
        hx-post="/api/checkout/payment"
        hx-target=".checkout-content"
        hx-swap="innerHTML"
        hx-include="[data-session='${props.sessionId}']"
        hx-ext="json-enc"
      >
        <input type="hidden" name="sessionId" value="${props.sessionId}">

        <!-- Payment Method -->
        <section class="checkout-section">
          <h2 class="checkout-section__title">Payment Method</h2>

          <div class="checkout-form-group">
            <label style="display: flex; align-items: center; gap: 0.5rem;">
              <input
                type="radio"
                name="paymentType"
                value="credit_card"
                class="checkout-checkbox"
                ${payment?.type === "credit_card" || !payment ? "checked" : ""}
                onchange="togglePaymentMethod(this)"
              >
              <span class="checkout-label">Credit/Debit Card</span>
            </label>
          </div>

          <div id="card-fields" style="${
    payment?.type === "credit_card" || !payment ? "" : "display: none;"
  }">
            <div class="checkout-form-grid">
              <div class="checkout-form-group checkout-form-group--full">
                <label for="card-number" class="checkout-label">Card Number *</label>
                <input
                  type="text"
                  id="card-number"
                  name="card.number"
                  class="checkout-input"
                  placeholder="1234 5678 9012 3456"
                  pattern="[0-9\\s]{13,19}"
                  maxlength="19"
                  required
                  aria-describedby="card-number-error"
                >
                <div id="card-number-error" class="checkout-error-message" role="alert"></div>
              </div>

              <div class="checkout-form-group">
                <label for="card-expiry" class="checkout-label">Expiry Date *</label>
                <input
                  type="text"
                  id="card-expiry"
                  name="card.expiry"
                  class="checkout-input"
                  placeholder="MM/YY"
                  pattern="[0-9]{2}/[0-9]{2}"
                  maxlength="5"
                  required
                  aria-describedby="card-expiry-error"
                >
                <div id="card-expiry-error" class="checkout-error-message" role="alert"></div>
              </div>

              <div class="checkout-form-group">
                <label for="card-cvc" class="checkout-label">CVC *</label>
                <input
                  type="text"
                  id="card-cvc"
                  name="card.cvc"
                  class="checkout-input"
                  placeholder="123"
                  pattern="[0-9]{3,4}"
                  maxlength="4"
                  required
                  aria-describedby="card-cvc-error"
                >
                <div id="card-cvc-error" class="checkout-error-message" role="alert"></div>
              </div>

              <div class="checkout-form-group checkout-form-group--full">
                <label for="card-name" class="checkout-label">Name on Card *</label>
                <input
                  type="text"
                  id="card-name"
                  name="card.name"
                  class="checkout-input"
                  required
                  aria-describedby="card-name-error"
                >
                <div id="card-name-error" class="checkout-error-message" role="alert"></div>
              </div>
            </div>
          </div>

          <div class="checkout-form-group">
            <label style="display: flex; align-items: center; gap: 0.5rem;">
              <input
                type="radio"
                name="paymentType"
                value="paypal"
                class="checkout-checkbox"
                ${payment?.type === "paypal" ? "checked" : ""}
                onchange="togglePaymentMethod(this)"
              >
              <span class="checkout-label">PayPal</span>
            </label>
          </div>
        </section>

        <!-- Order Summary -->
        ${renderOrderSummary(props.cart)}

        <!-- Actions -->
        <div class="checkout-actions">
          <button
            type="button"
            class="checkout-button checkout-button--secondary"
            hx-get="/api/checkout/step/1"
            hx-target=".checkout-content"
            hx-swap="innerHTML"
          >
            Back to Shipping
          </button>
          <button type="submit" class="checkout-button checkout-button--primary">
            Review Order
          </button>
        </div>
      </form>
    </div>

    <script>
      function togglePaymentMethod(radio) {
        const cardFields = document.getElementById('card-fields');
        const cardInputs = cardFields.querySelectorAll('input');

        if (radio.value === 'credit_card') {
          cardFields.style.display = 'block';
          cardInputs.forEach(input => input.setAttribute('required', ''));
        } else {
          cardFields.style.display = 'none';
          cardInputs.forEach(input => input.removeAttribute('required'));
        }
      }

      // Format card number
      document.getElementById('card-number')?.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        if (formattedValue !== e.target.value) {
          e.target.value = formattedValue;
        }
      });

      // Format expiry date
      document.getElementById('card-expiry')?.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\\D/g, '');
        if (value.length >= 2) {
          value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
      });
    </script>
  `;
}

function renderReviewStep(props: CheckoutFlowProps): string {
  return `
    <div id="checkout-review" role="tabpanel" aria-labelledby="step-3">
      <!-- Order Summary -->
      <section class="checkout-section">
        <h2 class="checkout-section__title">Order Summary</h2>
        ${renderOrderSummary(props.cart)}
      </section>

      <!-- Shipping Address Review -->
      <section class="checkout-section">
        <h2 class="checkout-section__title">Shipping Address</h2>
        <div class="checkout-summary">
          ${
    props.shippingAddress
      ? `
            <p>${props.shippingAddress.firstName} ${props.shippingAddress.lastName}</p>
            <p>${props.shippingAddress.address1}</p>
            <p>${props.shippingAddress.city}, ${props.shippingAddress.state} ${props.shippingAddress.zipCode}</p>
            <p>${props.shippingAddress.country}</p>
          `
      : "<p>No shipping address provided</p>"
  }
          <button
            type="button"
            class="checkout-button checkout-button--secondary"
            style="margin-top: 1rem;"
            hx-get="/api/checkout/step/1"
            hx-target=".checkout-content"
            hx-swap="innerHTML"
          >
            Edit
          </button>
        </div>
      </section>

      <!-- Payment Method Review -->
      <section class="checkout-section">
        <h2 class="checkout-section__title">Payment Method</h2>
        <div class="checkout-summary">
          ${
    props.paymentMethod
      ? `
            <p>${
        props.paymentMethod.type === "credit_card" ? "Credit Card" : "PayPal"
      }</p>
            ${
        props.paymentMethod.type === "credit_card" && props.paymentMethod.last4
          ? `<p>**** **** **** ${props.paymentMethod.last4}</p>`
          : ""
      }
          `
      : "<p>No payment method selected</p>"
  }
          <button
            type="button"
            class="checkout-button checkout-button--secondary"
            style="margin-top: 1rem;"
            hx-get="/api/checkout/step/2"
            hx-target=".checkout-content"
            hx-swap="innerHTML"
          >
            Edit
          </button>
        </div>
      </section>

      <!-- Place Order -->
      <form
        hx-post="/api/checkout/complete"
        hx-target="body"
        hx-swap="innerHTML"
        hx-include="[data-session='${props.sessionId}']"
        hx-ext="json-enc"
      >
        <input type="hidden" name="sessionId" value="${props.sessionId}">

        <div class="checkout-actions">
          <button
            type="button"
            class="checkout-button checkout-button--secondary"
            hx-get="/api/checkout/step/2"
            hx-target=".checkout-content"
            hx-swap="innerHTML"
          >
            Back to Payment
          </button>
          <button type="submit" class="checkout-button checkout-button--primary">
            Place Order ($${props.cart.total.toFixed(2)})
          </button>
        </div>
      </form>
    </div>
  `;
}

function renderOrderSummary(cart: Cart): string {
  return `
    <div class="checkout-summary">
      ${
    cart.items.map((item) => `
        <div class="checkout-summary__item">
          <span>${item.product.name} × ${item.quantity}</span>
          <span>$${(item.unitPrice * item.quantity).toFixed(2)}</span>
        </div>
      `).join("")
  }

      <div class="checkout-summary__item">
        <span>Subtotal</span>
        <span>$${cart.subtotal.toFixed(2)}</span>
      </div>

      <div class="checkout-summary__item">
        <span>Shipping</span>
        <span>$${cart.shipping?.toFixed(2) || "0.00"}</span>
      </div>

      <div class="checkout-summary__item">
        <span>Tax</span>
        <span>$${cart.tax?.toFixed(2) || "0.00"}</span>
      </div>

      <div class="checkout-summary__item checkout-summary__total">
        <span>Total</span>
        <span>$${cart.total.toFixed(2)}</span>
      </div>
    </div>
  `;
}
