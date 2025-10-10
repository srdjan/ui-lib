/** @jsx h */
/**
 * API Handlers for Shopping Cart
 * HTMX-compatible endpoints that return HTML fragments
 * Demonstrates integration between ui-lib components and server APIs
 */

import { renderComponent } from "../../../mod.ts";
import { hxVals } from "../../../lib/dom-helpers.ts";
import "../components/product-card.tsx";
import "../components/cart-item.tsx";
import { getRepository } from "./repository-factory.ts";
import {
  apiErrorResponse,
  errorResponse,
  handleDatabaseError,
  htmlResponse,
  jsonResponse,
} from "./response.tsx";
import type {
  AddToCartRequest,
  CreateOrderRequest,
  CreateUserRequest,
  ProductFilter,
  UpdateCartItemRequest,
} from "./types.ts";

// ============================================================
// Utility Functions
// ============================================================

function renderProductCard(
  product: any,
  sessionId: string = "default",
): string {
  return renderComponent("shopping-product-card", {
    product,
    sessionId,
  });
}

function getSessionId(req: Request): string {
  const url = new URL(req.url);
  return url.searchParams.get("session") ||
    req.headers.get("x-session-id") ||
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function parseJsonBody<T>(req: Request): Promise<T> {
  try {
    return await req.json();
  } catch {
    throw new Error("Invalid JSON body");
  }
}

function extractProductFilter(url: URL): ProductFilter {
  const filter: ProductFilter = {
    ...(url.searchParams.has("category")
      ? { category: url.searchParams.get("category") as any }
      : {}),
    ...(url.searchParams.has("minPrice")
      ? { minPrice: parseFloat(url.searchParams.get("minPrice")!) }
      : {}),
    ...(url.searchParams.has("maxPrice")
      ? { maxPrice: parseFloat(url.searchParams.get("maxPrice")!) }
      : {}),
    ...(url.searchParams.has("inStock")
      ? { inStock: url.searchParams.get("inStock") === "true" }
      : {}),
    ...(url.searchParams.has("featured")
      ? { featured: url.searchParams.get("featured") === "true" }
      : {}),
    ...(url.searchParams.has("rating")
      ? { rating: parseFloat(url.searchParams.get("rating")!) }
      : {}),
    ...(url.searchParams.has("tags")
      ? { tags: url.searchParams.get("tags")!.split(",") }
      : {}),
    ...(url.searchParams.has("search")
      ? { search: url.searchParams.get("search")! }
      : {}),
    ...(url.searchParams.has("sortBy")
      ? { sortBy: url.searchParams.get("sortBy") as any }
      : {}),
    ...(url.searchParams.has("sortOrder")
      ? { sortOrder: url.searchParams.get("sortOrder") as any }
      : {}),
    ...(url.searchParams.has("limit")
      ? { limit: parseInt(url.searchParams.get("limit")!) }
      : {}),
    ...(url.searchParams.has("offset")
      ? { offset: parseInt(url.searchParams.get("offset")!) }
      : {}),
  };

  return filter;
}

// ============================================================
// Product Handlers
// ============================================================

export async function getProducts(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const filter = extractProductFilter(url);
    const repository = getRepository();

    const result = await repository.getProducts(filter);

    if (!result.ok) {
      return handleDatabaseError(result.error);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      // Return HTML fragment for HTMX
      const sessionId = getSessionId(req);
      const productsHtml = result.value.items.map((product) =>
        renderProductCard(product, sessionId)
      ).join("");

      // Return just the products HTML for HTMX to swap into #product-grid
      return htmlResponse(
        productsHtml ||
          '<div class="no-products"><p>No products found</p></div>',
      );
    } else {
      return jsonResponse(result.value);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResponse(`Failed to fetch products: ${msg}`, 500);
  }
}

export async function getProduct(
  req: Request,
  params: { id: string },
): Promise<Response> {
  try {
    const repository = getRepository();
    const result = await repository.getProduct(params.id);

    if (!result.ok) {
      return handleDatabaseError(result.error);
    }

    return jsonResponse(result.value);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResponse(`Failed to fetch product: ${msg}`, 500);
  }
}

export async function getFeaturedProducts(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "6");
    const repository = getRepository();

    const result = await repository.getFeaturedProducts(limit);

    if (!result.ok) {
      return handleDatabaseError(result.error);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      const sessionId = getSessionId(req);
      const productsHtml = result.value.map((product) =>
        renderProductCard(product, sessionId)
      ).join("");

      // Return just the products HTML for HTMX to swap
      return htmlResponse(
        productsHtml ||
          '<div class="no-products"><p>No featured products available</p></div>',
      );
    } else {
      return jsonResponse(result.value);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResponse(`Failed to fetch featured products: ${msg}`);
  }
}

export async function searchProducts(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || "";
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const repository = getRepository();

    const result = await repository.searchProducts(query, limit);

    if (!result.ok) {
      return handleDatabaseError(result.error);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      if (result.value.length === 0) {
        return htmlResponse(`
          <div class="search-results-empty">
            <p>No products found for "${query}"</p>
          </div>
        `);
      }

      const sessionId = getSessionId(req);
      const productsHtml = result.value.map((product) =>
        renderProductCard(product, sessionId)
      ).join("");

      return htmlResponse(`
        <div class="search-results" data-query="${query}" data-count="${result.value.length}">
          <h3>Search Results for "${query}" (${result.value.length} found)</h3>
          <div class="products-grid">
            ${productsHtml}
          </div>
        </div>
      `);
    } else {
      return jsonResponse(result.value);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResponse(`Failed to search products: ${msg}`);
  }
}

// ============================================================
// Cart Handlers
// ============================================================

export async function getCart(req: Request): Promise<Response> {
  try {
    const sessionId = getSessionId(req);
    const repository = getRepository();

    const result = await repository.getCart(sessionId);

    if (!result.ok) {
      return handleDatabaseError(result.error);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      const cart = result.value;

      if (cart.items.length === 0) {
        return htmlResponse(`
          <div class="cart-empty">
            <h3>Your cart is empty</h3>
            <p>Add some products to get started!</p>
          </div>
        `);
      }

      const itemsHtml = cart.items.map((item) =>
        renderComponent("cart-item", { item })
      ).join("");

      return htmlResponse(`
        <div class="cart-content" data-item-count="${cart.itemCount}" data-total="${cart.total}">
          <div class="cart-header">
            <h3>Shopping Cart (${cart.itemCount} items)</h3>
          </div>

          <div class="cart-items">
            ${itemsHtml}
          </div>

          <div class="cart-summary">
            <div class="cart-totals">
              <div class="subtotal">
                <span>Subtotal:</span>
                <span>$${cart.subtotal.toFixed(2)}</span>
              </div>
              <div class="tax">
                <span>Tax:</span>
                <span>$${cart.tax.toFixed(2)}</span>
              </div>
              <div class="shipping">
                <span>Shipping:</span>
                <span>${
        cart.shipping > 0 ? `$${cart.shipping.toFixed(2)}` : "FREE"
      }</span>
              </div>
              <div class="total">
                <span>Total:</span>
                <span>$${cart.total.toFixed(2)}</span>
              </div>
            </div>

            <button class="checkout-btn" hx-get="/checkout" hx-target="#main-content">
              Proceed to Checkout
            </button>
          </div>
        </div>
      `);
    } else {
      return jsonResponse(result.value);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResponse(`Failed to fetch cart: ${msg}`);
  }
}

export async function addToCart(req: Request): Promise<Response> {
  try {
    let body: AddToCartRequest;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      body = await parseJsonBody<AddToCartRequest>(req);
    } else {
      // Handle form-encoded data from HTMX
      const formData = await req.formData();
      body = {
        productId: formData.get("productId") as string,
        quantity: parseInt(formData.get("quantity") as string || "1"),
        sessionId: formData.get("sessionId") as string,
      };
    }

    const sessionId = body.sessionId || getSessionId(req);
    const repository = getRepository();

    const result = await repository.addToCart(sessionId, body);

    if (!result.ok) {
      return handleDatabaseError(result.error);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      // Return updated cart count badge for header
      return htmlResponse(`
        <span id="cart-count" class="cart-badge" data-count="${result.value.itemCount}">
          ${result.value.itemCount}
        </span>
      `);
    } else {
      return jsonResponse(result.value);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResponse(`Failed to add to cart: ${msg}`);
  }
}

export async function updateCartItem(
  req: Request,
  params: { id: string },
): Promise<Response> {
  try {
    const sessionId = getSessionId(req);
    const body = await parseJsonBody<UpdateCartItemRequest>(req);
    const repository = getRepository();

    const result = await repository.updateCartItem(sessionId, params.id, body);

    if (!result.ok) {
      return handleDatabaseError(result.error);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      // Return updated cart content
      return getCart(req);
    } else {
      return jsonResponse(result.value);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResponse(`Failed to update cart item: ${msg}`);
  }
}

export async function removeFromCart(
  req: Request,
  params: { id: string },
): Promise<Response> {
  try {
    const sessionId = getSessionId(req);
    const repository = getRepository();

    const result = await repository.removeFromCart(sessionId, params.id);

    if (!result.ok) {
      return handleDatabaseError(result.error);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      // Return updated cart content
      return getCart(req);
    } else {
      return jsonResponse(result.value);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResponse(`Failed to remove from cart: ${msg}`);
  }
}

export async function getCartSummary(req: Request): Promise<Response> {
  try {
    const sessionId = getSessionId(req);
    const repository = getRepository();

    const result = await repository.getCartSummary(sessionId);

    if (!result.ok) {
      return handleDatabaseError(result.error);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      const summary = result.value;
      return htmlResponse(`
        <div class="cart-summary-widget">
          <span class="item-count">${summary.itemCount}</span>
          <span class="total">$${summary.total.toFixed(2)}</span>
        </div>
      `);
    } else {
      return jsonResponse(result.value);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResponse(`Failed to get cart summary: ${msg}`);
  }
}

// ============================================================
// User Handlers
// ============================================================

export async function createUser(req: Request): Promise<Response> {
  try {
    const body = await parseJsonBody<CreateUserRequest>(req);
    const repository = getRepository();

    const result = await repository.createUser(body);

    if (!result.ok) {
      return handleDatabaseError(result.error);
    }

    return jsonResponse(result.value, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResponse(`Failed to create user: ${msg}`);
  }
}

export async function getUser(
  req: Request,
  params: { id: string },
): Promise<Response> {
  try {
    const repository = getRepository();
    const result = await repository.getUser(params.id);

    if (!result.ok) {
      return handleDatabaseError(result.error);
    }

    return jsonResponse(result.value);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResponse(`Failed to fetch user: ${msg}`);
  }
}

// ============================================================
// Order Handlers
// ============================================================

export async function createOrder(req: Request): Promise<Response> {
  try {
    const body = await parseJsonBody<CreateOrderRequest>(req);
    const repository = getRepository();

    const result = await repository.createOrder(body);

    if (!result.ok) {
      return handleDatabaseError(result.error);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      const order = result.value;
      return htmlResponse(`
        <div class="order-confirmation">
          <h2>Order Confirmed!</h2>
          <p>Order Number: <strong>${order.orderNumber}</strong></p>
          <p>Total: <strong>$${order.total.toFixed(2)}</strong></p>
          <p>We'll send you an email confirmation shortly.</p>

          <div class="order-actions">
            <button hx-get="/orders/${order.id}" hx-target="#main-content">
              View Order Details
            </button>
            <button hx-get="/products" hx-target="#main-content">
              Continue Shopping
            </button>
          </div>
        </div>
      `);
    } else {
      return jsonResponse(result.value, { status: 201 });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResponse(`Failed to create order: ${msg}`);
  }
}

export async function getOrder(
  req: Request,
  params: { id: string },
): Promise<Response> {
  try {
    const repository = getRepository();
    const result = await repository.getOrder(params.id);

    if (!result.ok) {
      return handleDatabaseError(result.error);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      const order = result.value;
      const itemsHtml = order.items.map((item) => `
        <div class="order-item">
          <img src="${item.productImage}" alt="${item.productName}" class="item-image">
          <div class="item-details">
            <h4>${item.productName}</h4>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: $${item.unitPrice.toFixed(2)}</p>
          </div>
          <div class="item-total">$${item.totalPrice.toFixed(2)}</div>
        </div>
      `).join("");

      return htmlResponse(`
        <div class="order-details">
          <h2>Order ${order.orderNumber}</h2>
          <div class="order-status">Status: <span class="status-${order.status}">${order.status}</span></div>

          <div class="order-items">
            <h3>Items</h3>
            ${itemsHtml}
          </div>

          <div class="order-summary">
            <div class="totals">
              <div>Subtotal: $${order.subtotal.toFixed(2)}</div>
              <div>Tax: $${order.tax.toFixed(2)}</div>
              <div>Shipping: $${order.shipping.toFixed(2)}</div>
              <div class="total">Total: $${order.total.toFixed(2)}</div>
            </div>
          </div>

          <div class="shipping-address">
            <h3>Shipping Address</h3>
            <address>
              ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
              ${order.shippingAddress.address1}<br>
              ${
        order.shippingAddress.address2
          ? `${order.shippingAddress.address2}<br>`
          : ""
      }
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
              ${order.shippingAddress.country}
            </address>
          </div>
        </div>
      `);
    } else {
      return jsonResponse(result.value);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResponse(`Failed to fetch order: ${msg}`);
  }
}

export async function getUserOrders(
  req: Request,
  params: { userId: string },
): Promise<Response> {
  try {
    const repository = getRepository();
    const result = await repository.getUserOrders(params.userId);

    if (!result.ok) {
      return handleDatabaseError(result.error);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      if (result.value.length === 0) {
        return htmlResponse(`
          <div class="orders-empty">
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here!</p>
            <button hx-get="/products" hx-target="#main-content">Browse Products</button>
          </div>
        `);
      }

      const ordersHtml = result.value.map((order) => `
        <div class="order-card" hx-get="/orders/${order.id}" hx-target="#main-content">
          <div class="order-header">
            <span class="order-number">${order.orderNumber}</span>
            <span class="order-date">${
        new Date(order.createdAt).toLocaleDateString()
      }</span>
          </div>
          <div class="order-status">Status: ${order.status}</div>
          <div class="order-total">Total: $${order.total.toFixed(2)}</div>
          <div class="order-items-count">${order.items.length} items</div>
        </div>
      `).join("");

      return htmlResponse(`
        <div class="orders-list">
          <h2>Order History</h2>
          ${ordersHtml}
        </div>
      `);
    } else {
      return jsonResponse(result.value);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResponse(`Failed to fetch user orders: ${msg}`);
  }
}

// ============================================================
// Recommendation Handlers
// ============================================================

export async function getRecommendations(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || undefined;
    const limit = parseInt(url.searchParams.get("limit") || "4");
    const repository = getRepository();

    const result = await repository.getRecommendedProducts(userId, limit);

    if (!result.ok) {
      return handleDatabaseError(result.error);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      const sessionId = getSessionId(req);
      const productsHtml = result.value.map((product) =>
        renderProductCard(product, sessionId)
      ).join("");

      return htmlResponse(`
        <div class="recommendations">
          <h3>Recommended for You</h3>
          <div class="products-grid">
            ${productsHtml}
          </div>
        </div>
      `);
    } else {
      return jsonResponse(result.value);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResponse(`Failed to get recommendations: ${msg}`);
  }
}
