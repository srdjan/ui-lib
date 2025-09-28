// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * Multi-Step Checkout Flow Component
 *
 * Demonstrates:
 * - Library component composition for multi-step forms
 * - Progressive enhancement with HTMX
 * - Client-side validation with server fallback
 * - Accessible form navigation
 * - Grid and Stack layout components
 * - Form state management in DOM
 */

import { h } from "jsx";
import { defineComponent } from "../../../mod.ts";
import type { Cart, ShippingAddress, PaymentMethod } from "../api/types.ts";

export interface CheckoutFlowProps {
  cart: Cart;
  currentStep?: number;
  sessionId: string;
  shippingAddress?: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod?: PaymentMethod;
  sameAsBilling?: boolean;
}

// ============================================================
// Component Implementation
// ============================================================

defineComponent<CheckoutFlowProps>("checkout-flow", {
  render: (props) => {
    const currentStep = props.currentStep || 1;
    const steps = [
      { number: 1, title: "Shipping", id: "shipping" },
      { number: 2, title: "Payment", id: "payment" },
      { number: 3, title: "Review", id: "review" },
    ];

    return (
      <card
        variant="elevated"
        size="lg"
        data-step={currentStep}
        data-session={props.sessionId}
        style={{ maxWidth: "800px", margin: "0 auto" }}
      >
        <stack direction="vertical" gap="xl">
          {/* Step Navigation */}
          <stack
            direction="horizontal"
            gap="sm"
            style={{
              padding: "1rem 0",
              borderBottom: "1px solid #E5E7EB"
            }}
          >
            {steps.map((step) => {
              const getVariant = () => {
                if (currentStep === step.number) return "primary";
                if (currentStep > step.number) return "success";
                return "secondary";
              };

              return (
                <button
                  key={step.id}
                  variant={getVariant()}
                  size="sm"
                  role="tab"
                  aria-selected={currentStep === step.number}
                  aria-controls={`checkout-${step.id}`}
                  hx-get={`/api/checkout/step/${step.number}`}
                  hx-target=".checkout-content"
                  hx-swap="innerHTML"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <span style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: currentStep > step.number ? "#10B981" : "currentColor",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.875rem",
                    fontWeight: "600"
                  }}>
                    {currentStep > step.number ? "✓" : step.number}
                  </span>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </stack>

          {/* Step Content */}
          <div
            class="checkout-content"
            style={{ minHeight: "400px" }}
            dangerouslySetInnerHTML={{ __html: renderStepContent(props, currentStep) }}
          />
        </stack>
      </card>
    );
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

  return `
    <stack direction="vertical" gap="lg">
      <h2 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #1F2937;">Shipping Information</h2>

      <form
        method="post"
        action="/api/checkout/shipping"
        hx-post="/api/checkout/shipping"
        hx-target=".checkout-content"
        hx-swap="innerHTML"
      >
        <input type="hidden" name="sessionId" value="${props.sessionId}" />

        <stack direction="vertical" gap="lg">
          <grid columns="2" gap="md">
            <input
              type="text"
              name="shipping.firstName"
              label="First Name *"
              value="${shipping?.firstName || ""}"
              required
            />
            <input
              type="text"
              name="shipping.lastName"
              label="Last Name *"
              value="${shipping?.lastName || ""}"
              required
            />
          </grid>

          <input
            type="text"
            name="shipping.company"
            label="Company (Optional)"
            value="${shipping?.company || ""}"
          />

          <input
            type="text"
            name="shipping.address1"
            label="Street Address *"
            value="${shipping?.address1 || ""}"
            required
          />

          <input
            type="text"
            name="shipping.address2"
            label="Apartment, suite, etc. (Optional)"
            value="${shipping?.address2 || ""}"
          />

          <grid columns="3" gap="md">
            <input
              type="text"
              name="shipping.city"
              label="City *"
              value="${shipping?.city || ""}"
              required
            />
            <input
              type="select"
              name="shipping.state"
              label="State *"
              value="${shipping?.state || ""}"
              required
            />
            <input
              type="text"
              name="shipping.zipCode"
              label="ZIP Code *"
              value="${shipping?.zipCode || ""}"
              required
            />
          </grid>

          <input
            type="text"
            name="shipping.country"
            label="Country *"
            value="${shipping?.country || "United States"}"
            required
          />

          <input
            type="tel"
            name="shipping.phone"
            label="Phone Number (Optional)"
            value="${shipping?.phone || ""}"
          />

          <!-- Billing Address Section -->
          <div style="margin-top: 2rem;">
            <h3 style="margin: 0 0 1rem 0; font-size: 1.125rem; font-weight: 600; color: #1F2937;">Billing Address</h3>

            <div style="margin-bottom: 1rem;">
              <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #374151;">
                <input
                  type="checkbox"
                  name="sameAsBilling"
                  ${props.sameAsBilling !== false ? "checked" : ""}
                  onchange="toggleBillingAddress(this)"
                  style="width: 18px; height: 18px; accent-color: #6366F1;"
                />
                Use same address for billing
              </label>
            </div>

            <div id="billing-fields" style="${props.sameAsBilling !== false ? "display: none;" : ""}">
              <stack direction="vertical" gap="md">
                <grid columns="2" gap="md">
                  <input
                    type="text"
                    name="billing.firstName"
                    label="First Name *"
                    value="${billing?.firstName || ""}"
                  />
                  <input
                    type="text"
                    name="billing.lastName"
                    label="Last Name *"
                    value="${billing?.lastName || ""}"
                  />
                </grid>

                <input
                  type="text"
                  name="billing.address1"
                  label="Street Address *"
                  value="${billing?.address1 || ""}"
                />

                <grid columns="3" gap="md">
                  <input
                    type="text"
                    name="billing.city"
                    label="City *"
                    value="${billing?.city || ""}"
                  />
                  <input
                    type="select"
                    name="billing.state"
                    label="State *"
                    value="${billing?.state || ""}"
                  />
                  <input
                    type="text"
                    name="billing.zipCode"
                    label="ZIP Code *"
                    value="${billing?.zipCode || ""}"
                  />
                </grid>
              </stack>
            </div>
          </div>

          <!-- Actions -->
          <stack direction="horizontal" gap="md" style="justify-content: flex-end; padding-top: 1.5rem; border-top: 1px solid #E5E7EB;">
            <button type="submit" variant="primary" size="lg">
              Continue to Payment
            </button>
          </stack>
        </stack>
      </form>
    </stack>

    <script>
      function toggleBillingAddress(checkbox) {
        const billingFields = document.getElementById('billing-fields');
        const billingInputs = billingFields.querySelectorAll('input');

        if (checkbox.checked) {
          billingFields.style.display = 'none';
          billingInputs.forEach(input => input.removeAttribute('required'));
        } else {
          billingFields.style.display = 'block';
          billingInputs.forEach(input => {
            if (input.name.includes('firstName') || input.name.includes('lastName') ||
                input.name.includes('address1') || input.name.includes('city') ||
                input.name.includes('state') || input.name.includes('zipCode')) {
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
    <stack direction="vertical" gap="lg">
      <h2 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #1F2937;">Payment Information</h2>

      <form
        method="post"
        action="/api/checkout/payment"
        hx-post="/api/checkout/payment"
        hx-target=".checkout-content"
        hx-swap="innerHTML"
      >
        <input type="hidden" name="sessionId" value="${props.sessionId}" />

        <stack direction="vertical" gap="lg">
          <!-- Payment Method Selection -->
          <div>
            <h3 style="margin: 0 0 1rem 0; font-size: 1.125rem; font-weight: 600; color: #1F2937;">Payment Method</h3>

            <stack direction="vertical" gap="sm">
              <label style="display: flex; align-items: center; gap: 0.5rem;">
                <input
                  type="radio"
                  name="paymentType"
                  value="credit_card"
                  ${payment?.type === "credit_card" || !payment ? "checked" : ""}
                  onchange="togglePaymentMethod(this)"
                />
                <span style="font-size: 0.875rem; font-weight: 600; color: #374151;">Credit/Debit Card</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.5rem;">
                <input
                  type="radio"
                  name="paymentType"
                  value="paypal"
                  ${payment?.type === "paypal" ? "checked" : ""}
                  onchange="togglePaymentMethod(this)"
                />
                <span style="font-size: 0.875rem; font-weight: 600; color: #374151;">PayPal</span>
              </label>
            </stack>
          </div>

          <!-- Credit Card Fields -->
          <div id="card-fields" style="${payment?.type === "credit_card" || !payment ? "" : "display: none;"}">
            <stack direction="vertical" gap="md">
              <input
                type="text"
                name="card.number"
                label="Card Number *"
                placeholder="1234 5678 9012 3456"
                pattern="[0-9\\s]{13,19}"
                maxlength="19"
                required
              />

              <grid columns="2" gap="md">
                <input
                  type="text"
                  name="card.expiry"
                  label="Expiry Date *"
                  placeholder="MM/YY"
                  pattern="[0-9]{2}/[0-9]{2}"
                  maxlength="5"
                  required
                />
                <input
                  type="text"
                  name="card.cvc"
                  label="CVC *"
                  placeholder="123"
                  pattern="[0-9]{3,4}"
                  maxlength="4"
                  required
                />
              </grid>

              <input
                type="text"
                name="card.name"
                label="Name on Card *"
                placeholder="John Doe"
                required
              />
            </stack>
          </div>

          <!-- Actions -->
          <stack direction="horizontal" gap="md" style="justify-content: space-between; padding-top: 1.5rem; border-top: 1px solid #E5E7EB;">
            <button
              type="button"
              variant="secondary"
              hx-get="/api/checkout/step/1"
              hx-target=".checkout-content"
              hx-swap="innerHTML"
            >
              Back to Shipping
            </button>

            <button type="submit" variant="primary" size="lg">
              Review Order
            </button>
          </stack>
        </stack>
      </form>
    </stack>

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
    <stack direction="vertical" gap="lg">
      <h2 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #1F2937;">Review Your Order</h2>

      <!-- Order Summary -->
      <card variant="outlined" padding="lg">
        <stack direction="vertical" gap="md">
          <h3 style="margin: 0; font-size: 1.125rem; font-weight: 600; color: #1F2937;">Order Summary</h3>
          ${renderOrderSummary(props.cart)}
        </stack>
      </card>

      <!-- Shipping Address -->
      <card variant="outlined" padding="lg">
        <stack direction="vertical" gap="sm">
          <h3 style="margin: 0; font-size: 1.125rem; font-weight: 600; color: #1F2937;">Shipping Address</h3>
          ${
    props.shippingAddress
      ? `
            <div>
              <p style="margin: 0;">${props.shippingAddress.firstName} ${props.shippingAddress.lastName}</p>
              <p style="margin: 0;">${props.shippingAddress.address1}</p>
              ${props.shippingAddress.address2 ? `<p style="margin: 0;">${props.shippingAddress.address2}</p>` : ""}
              <p style="margin: 0;">${props.shippingAddress.city}, ${props.shippingAddress.state} ${props.shippingAddress.zipCode}</p>
              <p style="margin: 0;">${props.shippingAddress.country}</p>
            </div>
          `
      : "<p>No shipping address provided</p>"
  }
          <button
            variant="secondary"
            size="sm"
            hx-get="/api/checkout/step/1"
            hx-target=".checkout-content"
            hx-swap="innerHTML"
            style="align-self: flex-start; margin-top: 1rem;"
          >
            Edit
          </button>
        </stack>
      </card>

      <!-- Payment Method -->
      <card variant="outlined" padding="lg">
        <stack direction="vertical" gap="sm">
          <h3 style="margin: 0; font-size: 1.125rem; font-weight: 600; color: #1F2937;">Payment Method</h3>
          ${
    props.paymentMethod
      ? `
            <div>
              <p style="margin: 0;">${
        props.paymentMethod.type === "credit_card" ? "Credit Card" : "PayPal"
      }</p>
              ${
        props.paymentMethod.type === "credit_card" && props.paymentMethod.last4
          ? `<p style="margin: 0;">**** **** **** ${props.paymentMethod.last4}</p>`
          : ""
      }
            </div>
          `
      : "<p>No payment method selected</p>"
  }
          <button
            variant="secondary"
            size="sm"
            hx-get="/api/checkout/step/2"
            hx-target=".checkout-content"
            hx-swap="innerHTML"
            style="align-self: flex-start; margin-top: 1rem;"
          >
            Edit
          </button>
        </stack>
      </card>

      <!-- Place Order -->
      <form
        method="post"
        action="/api/checkout/complete"
        hx-post="/api/checkout/complete"
        hx-target="#main-content"
        hx-swap="innerHTML"
      >
        <input type="hidden" name="sessionId" value="${props.sessionId}" />

        <stack direction="horizontal" gap="md" style="justify-content: space-between; padding-top: 1.5rem; border-top: 1px solid #E5E7EB;">
          <button
            type="button"
            variant="secondary"
            hx-get="/api/checkout/step/2"
            hx-target=".checkout-content"
            hx-swap="innerHTML"
          >
            Back to Payment
          </button>

          <button type="submit" variant="primary" size="lg">
            Place Order
          </button>
        </stack>
      </form>
    </stack>
  `;
}

function renderOrderSummary(cart: Cart): string {
  return `
    <stack direction="vertical" gap="sm">
      ${cart.items.map((item) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #F3F4F6;">
          <div>
            <span style="font-weight: 600;">${item.product.name}</span>
            <span style="color: #6B7280; margin-left: 0.5rem;">x${item.quantity}</span>
          </div>
          <span style="font-weight: 600;">$${(item.unitPrice * item.quantity).toFixed(2)}</span>
        </div>
      `).join("")}

      <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; color: #6B7280;">
        <span>Subtotal:</span>
        <span>$${cart.subtotal.toFixed(2)}</span>
      </div>

      <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; color: #6B7280;">
        <span>Tax:</span>
        <span>$${cart.tax.toFixed(2)}</span>
      </div>

      <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; color: #6B7280;">
        <span>Shipping:</span>
        <span>${cart.shipping > 0 ? `$${cart.shipping.toFixed(2)}` : "FREE"}</span>
      </div>

      <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; font-size: 1.125rem; font-weight: 600; border-top: 2px solid #D1D5DB; margin-top: 0.5rem;">
        <span>Total:</span>
        <span>$${cart.total.toFixed(2)}</span>
      </div>
    </stack>
  `;
}

// Export the component string for use in templates
export const CheckoutFlow = "checkout-flow";