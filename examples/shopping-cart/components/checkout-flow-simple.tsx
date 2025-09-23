/**
 * Multi-Step Checkout Flow Component
 *
 * Demonstrates:
 * - Progressive enhancement with HTMX
 * - Client-side validation with server fallback
 * - Accessible form navigation
 * - CSS Grid and flexbox layouts
 * - Form state management in DOM
 */

import { defineComponent } from "../../../lib/define-component.ts";
import type { Cart, OrderAddress, PaymentMethod } from "../api/types.ts";

// ============================================================
// Component Props
// ============================================================

export interface CheckoutFlowProps {
  cart: Cart;
  currentStep?: number;
  sessionId: string;
  shippingAddress?: OrderAddress;
  billingAddress?: OrderAddress;
  paymentMethod?: PaymentMethod;
  sameAsBilling?: boolean;
}

// ============================================================
// Component Implementation
// ============================================================

export function CheckoutFlow({
  cart,
  currentStep = 1,
  sessionId,
  shippingAddress,
  billingAddress,
  paymentMethod,
  sameAsBilling = false,
}: CheckoutFlowProps): string {
  const steps = [
    { number: 1, title: "Shipping", id: "shipping" },
    { number: 2, title: "Payment", id: "payment" },
    { number: 3, title: "Review", id: "review" },
  ];

  return `
    <div class="checkout-flow" data-step="${currentStep}" data-session="${sessionId}">
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
        ${
    renderStepContent({
      cart,
      currentStep,
      sessionId,
      shippingAddress,
      billingAddress,
      paymentMethod,
      sameAsBilling,
    })
  }
      </div>
    </div>

    <style>
      .checkout-flow {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .checkout-stepper {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 2rem;
        padding: 1rem 0;
        border-bottom: 1px solid #E5E7EB;
      }

      .checkout-step {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-weight: 500;
        color: #6B7280;
        background-color: transparent;
        border: 1px solid transparent;
        cursor: pointer;
        transition: all 200ms ease;
      }

      .checkout-step--active {
        color: #1F2937;
        background-color: #EEF2FF;
        border-color: #6366F1;
        font-weight: 600;
      }

      .checkout-step--completed {
        color: #059669;
        background-color: #ECFDF5;
        border-color: #10B981;
      }

      .checkout-step__number {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #D1D5DB;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 600;
      }

      .checkout-step--active .checkout-step__number {
        background-color: #6366F1;
      }

      .checkout-step--completed .checkout-step__number {
        background-color: #10B981;
      }

      .checkout-content {
        padding: 1rem 0;
        min-height: 400px;
      }

      .checkout-form-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr 1fr;
      }

      .checkout-form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .checkout-form-group--full {
        grid-column: 1 / -1;
      }

      .checkout-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #374151;
      }

      .checkout-input {
        padding: 0.75rem;
        border: 1px solid #D1D5DB;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 200ms ease, box-shadow 200ms ease;
        background-color: white;
        color: #1F2937;
      }

      .checkout-input:focus {
        outline: none;
        border-color: #6366F1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }

      .checkout-select {
        padding: 0.75rem;
        border: 1px solid #D1D5DB;
        border-radius: 6px;
        font-size: 1rem;
        background-color: white;
        color: #1F2937;
        cursor: pointer;
      }

      .checkout-button {
        padding: 0.75rem 1.5rem;
        border: 1px solid;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 200ms ease;
        min-width: 120px;
      }

      .checkout-button--primary {
        background-color: #6366F1;
        color: white;
        border-color: #6366F1;
      }

      .checkout-button--primary:hover:not(:disabled) {
        background-color: #5B21B6;
      }

      .checkout-button--secondary {
        background-color: white;
        color: #374151;
        border-color: #D1D5DB;
      }

      .checkout-button--secondary:hover:not(:disabled) {
        background-color: #F3F4F6;
      }

      .checkout-actions {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 2rem;
        padding: 1.5rem 0;
        border-top: 1px solid #E5E7EB;
      }

      .checkout-summary {
        padding: 1.5rem;
        background-color: #F9FAFB;
        border-radius: 8px;
        border: 1px solid #E5E7EB;
      }

      .checkout-summary__item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #E5E7EB;
      }

      .checkout-summary__item:last-child {
        border-bottom: none;
      }

      .checkout-summary__total {
        font-size: 1.125rem;
        font-weight: 600;
        border-top: 2px solid #E5E7EB;
        padding-top: 1rem;
        margin-top: 1rem;
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

        .checkout-form-grid {
          grid-template-columns: 1fr;
        }

        .checkout-actions {
          flex-direction: column-reverse;
        }
      }
    </style>
  `;
}

// ============================================================
// Step Content Renderers
// ============================================================

function renderStepContent(props: CheckoutFlowProps): string {
  switch (props.currentStep) {
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

        <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1F2937;">Shipping Address</h2>
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
            >
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
            >
          </div>

          <div class="checkout-form-group checkout-form-group--full">
            <label for="shipping-street" class="checkout-label">Street Address *</label>
            <input
              type="text"
              id="shipping-street"
              name="shipping.street"
              class="checkout-input"
              value="${shipping?.street || ""}"
              required
            >
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
            >
          </div>

          <div class="checkout-form-group">
            <label for="shipping-state" class="checkout-label">State *</label>
            <select
              id="shipping-state"
              name="shipping.state"
              class="checkout-select"
              required
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
            </select>
          </div>

          <div class="checkout-form-group">
            <label for="shipping-zipCode" class="checkout-label">ZIP Code *</label>
            <input
              type="text"
              id="shipping-zipCode"
              name="shipping.zipCode"
              class="checkout-input"
              value="${shipping?.zipCode || ""}"
              required
            >
          </div>
        </div>

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
  `;
}

function renderPaymentStep(props: CheckoutFlowProps): string {
  return `
    <div id="checkout-payment" role="tabpanel" aria-labelledby="step-2">
      <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1F2937;">Payment Method</h2>

      <form
        hx-post="/api/checkout/payment"
        hx-target=".checkout-content"
        hx-swap="innerHTML"
        hx-include="[data-session='${props.sessionId}']"
        hx-ext="json-enc"
      >
        <input type="hidden" name="sessionId" value="${props.sessionId}">

        <div class="checkout-form-grid">
          <div class="checkout-form-group checkout-form-group--full">
            <label for="card-number" class="checkout-label">Card Number *</label>
            <input
              type="text"
              id="card-number"
              name="card.number"
              class="checkout-input"
              placeholder="1234 5678 9012 3456"
              required
            >
          </div>

          <div class="checkout-form-group">
            <label for="card-expiry" class="checkout-label">Expiry Date *</label>
            <input
              type="text"
              id="card-expiry"
              name="card.expiry"
              class="checkout-input"
              placeholder="MM/YY"
              required
            >
          </div>

          <div class="checkout-form-group">
            <label for="card-cvc" class="checkout-label">CVC *</label>
            <input
              type="text"
              id="card-cvc"
              name="card.cvc"
              class="checkout-input"
              placeholder="123"
              required
            >
          </div>
        </div>

        ${renderOrderSummary(props.cart)}

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
  `;
}

function renderReviewStep(props: CheckoutFlowProps): string {
  return `
    <div id="checkout-review" role="tabpanel" aria-labelledby="step-3">
      <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1F2937;">Order Review</h2>

      ${renderOrderSummary(props.cart)}

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
    <div class="checkout-summary" style="margin: 2rem 0;">
      <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Order Summary</h3>

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
