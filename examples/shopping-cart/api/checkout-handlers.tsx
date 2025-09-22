/**
 * Checkout API Handlers
 *
 * HTMX-compatible endpoints for the multi-step checkout flow
 * Demonstrates progressive enhancement and server-side validation
 */

import type { Handler } from "../../../lib/router.ts";
import type { OrderAddress, PaymentMethod, CreateOrder } from "./types.ts";
import { CheckoutFlow } from "../components/checkout-flow-simple.tsx";
import { KvShoppingRepository } from "./repository.ts";
import { err, ok, type Result } from "../../../lib/result.ts";

// ============================================================
// Validation Helpers
// ============================================================

interface ValidationError {
  field: string;
  message: string;
}

function validateAddress(address: Partial<OrderAddress>, prefix = ""): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!address.firstName?.trim()) {
    errors.push({ field: `${prefix}firstName`, message: "First name is required" });
  }

  if (!address.lastName?.trim()) {
    errors.push({ field: `${prefix}lastName`, message: "Last name is required" });
  }

  if (!address.street?.trim()) {
    errors.push({ field: `${prefix}street`, message: "Street address is required" });
  }

  if (!address.city?.trim()) {
    errors.push({ field: `${prefix}city`, message: "City is required" });
  }

  if (!address.state?.trim()) {
    errors.push({ field: `${prefix}state`, message: "State is required" });
  }

  if (!address.zipCode?.trim()) {
    errors.push({ field: `${prefix}zipCode`, message: "ZIP code is required" });
  } else if (!/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
    errors.push({ field: `${prefix}zipCode`, message: "Invalid ZIP code format" });
  }

  if (!address.country?.trim()) {
    errors.push({ field: `${prefix}country`, message: "Country is required" });
  }

  return errors;
}

function validatePayment(payment: Partial<PaymentMethod>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (payment.type === 'card') {
    if (!payment.cardNumber?.replace(/\s/g, '')) {
      errors.push({ field: "card.number", message: "Card number is required" });
    } else if (!/^\d{13,19}$/.test(payment.cardNumber.replace(/\s/g, ''))) {
      errors.push({ field: "card.number", message: "Invalid card number" });
    }

    if (!payment.expiryDate) {
      errors.push({ field: "card.expiry", message: "Expiry date is required" });
    } else if (!/^\d{2}\/\d{2}$/.test(payment.expiryDate)) {
      errors.push({ field: "card.expiry", message: "Invalid expiry date format (MM/YY)" });
    }

    if (!payment.cvc) {
      errors.push({ field: "card.cvc", message: "CVC is required" });
    } else if (!/^\d{3,4}$/.test(payment.cvc)) {
      errors.push({ field: "card.cvc", message: "Invalid CVC" });
    }

    if (!payment.cardHolderName?.trim()) {
      errors.push({ field: "card.name", message: "Cardholder name is required" });
    }
  }

  return errors;
}

// ============================================================
// Session Management
// ============================================================

const checkoutSessions = new Map<string, {
  cartId: string;
  shippingAddress?: OrderAddress;
  billingAddress?: OrderAddress;
  paymentMethod?: PaymentMethod;
  sameAsBilling?: boolean;
  currentStep: number;
  createdAt: Date;
}>();

function getCheckoutSession(sessionId: string) {
  return checkoutSessions.get(sessionId);
}

function updateCheckoutSession(sessionId: string, updates: Partial<{
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  paymentMethod: PaymentMethod;
  sameAsBilling: boolean;
  currentStep: number;
}>) {
  const session = checkoutSessions.get(sessionId);
  if (session) {
    checkoutSessions.set(sessionId, { ...session, ...updates });
  }
}

function createCheckoutSession(sessionId: string, cartId: string) {
  checkoutSessions.set(sessionId, {
    cartId,
    currentStep: 1,
    createdAt: new Date(),
  });
}

// ============================================================
// Step Navigation Handlers
// ============================================================

export const getCheckoutStep: Handler = async (req) => {
  const url = new URL(req.url);
  const step = parseInt(url.pathname.split('/').pop() || '1');
  const sessionId = url.searchParams.get('session') ||
                   req.headers.get('X-Session-ID') ||
                   'default';

  if (step < 1 || step > 3) {
    return new Response('Invalid step', { status: 400 });
  }

  try {
    const repository = new KvShoppingRepository();
    const cartResult = await repository.getCart(sessionId);

    if (!cartResult.ok) {
      return new Response('Cart not found', { status: 404 });
    }

    const cart = cartResult.value;
    if (cart.items.length === 0) {
      return new Response('Cart is empty', { status: 400 });
    }

    // Get or create checkout session
    let session = getCheckoutSession(sessionId);
    if (!session) {
      createCheckoutSession(sessionId, cart.id);
      session = getCheckoutSession(sessionId)!;
    }

    // Update current step
    updateCheckoutSession(sessionId, { currentStep: step });

    const checkoutHtml = CheckoutFlow({
      cart,
      currentStep: step,
      sessionId,
      shippingAddress: session.shippingAddress,
      billingAddress: session.billingAddress,
      paymentMethod: session.paymentMethod,
      sameAsBilling: session.sameAsBilling,
    });

    return new Response(checkoutHtml, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Checkout step error:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

// ============================================================
// Form Submission Handlers
// ============================================================

export const submitShipping: Handler = async (req) => {
  try {
    const formData = await req.formData();
    const sessionId = formData.get('sessionId') as string;

    if (!sessionId) {
      return new Response('Session ID required', { status: 400 });
    }

    // Parse form data
    const shippingAddress: Partial<OrderAddress> = {
      firstName: formData.get('shipping.firstName') as string,
      lastName: formData.get('shipping.lastName') as string,
      street: formData.get('shipping.street') as string,
      city: formData.get('shipping.city') as string,
      state: formData.get('shipping.state') as string,
      zipCode: formData.get('shipping.zipCode') as string,
      country: formData.get('shipping.country') as string,
    };

    const sameAsBilling = formData.has('sameAsBilling');
    let billingAddress: Partial<OrderAddress> | undefined;

    if (!sameAsBilling) {
      billingAddress = {
        firstName: formData.get('billing.firstName') as string,
        lastName: formData.get('billing.lastName') as string,
        street: formData.get('billing.street') as string,
        city: formData.get('billing.city') as string,
        state: formData.get('billing.state') as string,
        zipCode: formData.get('billing.zipCode') as string,
        country: formData.get('billing.country') as string,
      };
    }

    // Validate addresses
    const shippingErrors = validateAddress(shippingAddress, 'shipping.');
    const billingErrors = sameAsBilling ? [] : validateAddress(billingAddress!, 'billing.');
    const allErrors = [...shippingErrors, ...billingErrors];

    if (allErrors.length > 0) {
      // Return form with validation errors
      const repository = new KvShoppingRepository();
      const cartResult = await repository.getCart(sessionId);

      if (!cartResult.ok) {
        return new Response('Cart not found', { status: 404 });
      }

      const session = getCheckoutSession(sessionId);
      const checkoutHtml = CheckoutFlow({
        cart: cartResult.value,
        currentStep: 1,
        sessionId,
        shippingAddress: session?.shippingAddress,
        billingAddress: session?.billingAddress,
        sameAsBilling: session?.sameAsBilling,
      });

      // TODO: Inject validation errors into the response
      return new Response(checkoutHtml, {
        headers: { 'Content-Type': 'text/html' },
        status: 400
      });
    }

    // Save to session
    updateCheckoutSession(sessionId, {
      shippingAddress: shippingAddress as OrderAddress,
      billingAddress: sameAsBilling ? shippingAddress as OrderAddress : billingAddress as OrderAddress,
      sameAsBilling,
      currentStep: 2,
    });

    // Redirect to payment step
    return getCheckoutStep(new Request(new URL(`/api/checkout/step/2?session=${sessionId}`, req.url)));

  } catch (error) {
    console.error('Shipping submission error:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

export const submitPayment: Handler = async (req) => {
  try {
    const formData = await req.formData();
    const sessionId = formData.get('sessionId') as string;

    if (!sessionId) {
      return new Response('Session ID required', { status: 400 });
    }

    const paymentType = formData.get('paymentType') as string;

    let paymentMethod: Partial<PaymentMethod>;

    if (paymentType === 'card') {
      paymentMethod = {
        type: 'card',
        cardNumber: formData.get('card.number') as string,
        expiryDate: formData.get('card.expiry') as string,
        cvc: formData.get('card.cvc') as string,
        cardHolderName: formData.get('card.name') as string,
      };
    } else if (paymentType === 'paypal') {
      paymentMethod = {
        type: 'paypal',
      };
    } else {
      return new Response('Invalid payment type', { status: 400 });
    }

    // Validate payment method
    const paymentErrors = validatePayment(paymentMethod);

    if (paymentErrors.length > 0) {
      // Return form with validation errors
      const repository = new KvShoppingRepository();
      const cartResult = await repository.getCart(sessionId);

      if (!cartResult.ok) {
        return new Response('Cart not found', { status: 404 });
      }

      const session = getCheckoutSession(sessionId);
      const checkoutHtml = CheckoutFlow({
        cart: cartResult.value,
        currentStep: 2,
        sessionId,
        shippingAddress: session?.shippingAddress,
        billingAddress: session?.billingAddress,
        paymentMethod: session?.paymentMethod,
        sameAsBilling: session?.sameAsBilling,
      });

      return new Response(checkoutHtml, {
        headers: { 'Content-Type': 'text/html' },
        status: 400
      });
    }

    // Process payment method (mask card number for storage)
    if (paymentMethod.type === 'card' && paymentMethod.cardNumber) {
      const cleanCardNumber = paymentMethod.cardNumber.replace(/\s/g, '');
      paymentMethod.last4 = cleanCardNumber.slice(-4);
      // In production, you would tokenize this with a payment processor
      delete paymentMethod.cardNumber;
      delete paymentMethod.cvc;
    }

    // Save to session
    updateCheckoutSession(sessionId, {
      paymentMethod: paymentMethod as PaymentMethod,
      currentStep: 3,
    });

    // Redirect to review step
    return getCheckoutStep(new Request(new URL(`/api/checkout/step/3?session=${sessionId}`, req.url)));

  } catch (error) {
    console.error('Payment submission error:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

export const completeCheckout: Handler = async (req) => {
  try {
    const formData = await req.formData();
    const sessionId = formData.get('sessionId') as string;

    if (!sessionId) {
      return new Response('Session ID required', { status: 400 });
    }

    const session = getCheckoutSession(sessionId);
    if (!session) {
      return new Response('Checkout session not found', { status: 404 });
    }

    const repository = new KvShoppingRepository();
    const cartResult = await repository.getCart(sessionId);

    if (!cartResult.ok) {
      return new Response('Cart not found', { status: 404 });
    }

    const cart = cartResult.value;

    // Validate all required data is present
    if (!session.shippingAddress || !session.billingAddress || !session.paymentMethod) {
      return new Response('Incomplete checkout data', { status: 400 });
    }

    // Create order
    const orderData: CreateOrder = {
      userId: 'guest', // In a real app, this would come from authentication
      items: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      shippingAddress: session.shippingAddress,
      billingAddress: session.billingAddress,
      paymentMethod: session.paymentMethod,
      subtotal: cart.subtotal,
      shipping: cart.shipping || 0,
      tax: cart.tax || 0,
      total: cart.total,
    };

    const orderResult = await repository.createOrder(orderData);

    if (!orderResult.ok) {
      console.error('Order creation failed:', orderResult.error);
      return new Response('Order creation failed', { status: 500 });
    }

    const order = orderResult.value;

    // Clear cart and checkout session
    await repository.clearCart(sessionId);
    checkoutSessions.delete(sessionId);

    // Return order confirmation page
    const confirmationHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            max-width: 600px;
            margin: 2rem auto;
            padding: 1rem;
            background-color: #f9fafb;
          }
          .confirmation {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            text-align: center;
          }
          .success-icon {
            font-size: 4rem;
            color: #10b981;
            margin-bottom: 1rem;
          }
          .order-number {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1f2937;
            margin: 1rem 0;
          }
          .order-total {
            font-size: 2rem;
            font-weight: 700;
            color: #059669;
            margin: 1rem 0;
          }
          .order-details {
            text-align: left;
            margin: 2rem 0;
            padding: 1rem;
            background: #f3f4f6;
            border-radius: 8px;
          }
          .continue-shopping {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background: #6366f1;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin-top: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="confirmation">
          <div class="success-icon">✓</div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. We've received your order and will process it shortly.</p>

          <div class="order-number">Order #${order.id}</div>
          <div class="order-total">$${order.total.toFixed(2)}</div>

          <div class="order-details">
            <h3>Order Details</h3>
            ${order.items.map(item => `
              <div style="display: flex; justify-content: space-between; margin: 0.5rem 0;">
                <span>${item.productId} × ${item.quantity}</span>
                <span>$${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}

            <hr style="margin: 1rem 0;">

            <div style="display: flex; justify-content: space-between; font-weight: 600;">
              <span>Total</span>
              <span>$${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div class="order-details">
            <h3>Shipping Address</h3>
            <p>
              ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
              ${order.shippingAddress.country}
            </p>
          </div>

          <p>You will receive an email confirmation shortly with tracking information.</p>

          <a href="/" class="continue-shopping">Continue Shopping</a>
        </div>
      </body>
      </html>
    `;

    return new Response(confirmationHtml, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Checkout completion error:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

// ============================================================
// Helper: Initialize Checkout
// ============================================================

export const initializeCheckout: Handler = async (req) => {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session') ||
                   req.headers.get('X-Session-ID') ||
                   'default';

  try {
    const repository = new KvShoppingRepository();
    const cartResult = await repository.getCart(sessionId);

    if (!cartResult.ok) {
      return new Response('Cart not found', { status: 404 });
    }

    const cart = cartResult.value;
    if (cart.items.length === 0) {
      return new Response('Cart is empty', { status: 400 });
    }

    // Create checkout session
    createCheckoutSession(sessionId, cart.id);

    // Redirect to step 1
    return getCheckoutStep(new Request(new URL(`/api/checkout/step/1?session=${sessionId}`, req.url)));

  } catch (error) {
    console.error('Checkout initialization error:', error);
    return new Response('Internal server error', { status: 500 });
  }
};