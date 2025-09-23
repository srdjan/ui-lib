/** @jsx h */
/**
 * API Handlers for Shopping Cart
 * HTMX-compatible endpoints that return HTML fragments
 * Demonstrates integration between ui-lib components and server APIs
 */

import { h } from "jsx";
import { error, html, json } from "../../../lib/response.ts";
import { getRepository } from "./repository.ts";
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
  const isOnSale = product.originalPrice &&
    product.originalPrice > product.price;
  const displayPrice = product.price;
  const originalPrice = product.originalPrice;

  return `
    <div class="product-card" data-product-id="${product.id}" style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden; transition: all 200ms ease; display: flex; flex-direction: column; height: 100%;">
      <div class="product-card__image" style="position: relative; width: 100%; padding-bottom: 100%; overflow: hidden; background: #f5f5f5;">
        <img src="${product.imageUrl}" alt="${product.name}" loading="lazy" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" />
        ${
    isOnSale
      ? '<span class="product-card__badge" style="position: absolute; top: 12px; right: 12px; background: #ef4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Sale</span>'
      : ""
  }
      </div>

      <div class="product-card__content" style="padding: 1rem; flex: 1; display: flex; flex-direction: column;">
        <h3 class="product-card__title" style="font-size: 1rem; font-weight: 600; color: #1f2937; margin: 0 0 0.5rem 0; line-height: 1.3;">${product.name}</h3>
        <p class="product-card__description" style="font-size: 0.875rem; color: #6b7280; margin: 0 0 0.75rem 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${product.description}</p>

        <div class="product-card__rating" style="display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem;">
          <span class="product-card__stars" style="color: #fbbf24;">★★★★☆</span>
          <span class="product-card__review-count" style="color: #6b7280; font-size: 0.75rem;">(${product.reviewCount})</span>
        </div>

        <div class="product-card__pricing" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; margin-top: auto;">
          <span class="product-card__price" style="font-size: 1.25rem; font-weight: 700; color: #059669;">$${
    displayPrice.toFixed(2)
  }</span>
          ${
    isOnSale
      ? `<span class="product-card__original-price" style="font-size: 1rem; color: #9ca3af; text-decoration: line-through;">$${
        originalPrice.toFixed(2)
      }</span>`
      : ""
  }
        </div>

        <div class="product-card__actions" style="margin-top: auto;">
          <button
            class="product-card__add-btn"
            style="width: 100%; padding: 0.75rem; background: ${
    product.inStock ? "#6366f1" : "#d1d5db"
  }; color: ${
    product.inStock ? "white" : "#6b7280"
  }; border: none; border-radius: 8px; font-weight: 600; cursor: ${
    product.inStock ? "pointer" : "not-allowed"
  }; transition: all 200ms ease;"
            onmouseover="if(!this.disabled) this.style.background='#4f46e5'"
            onmouseout="if(!this.disabled) this.style.background='#6366f1'"
            hx-post="/api/cart/add"
            hx-vals='{"productId": "${product.id}", "quantity": 1, "sessionId": "${sessionId}"}'
            hx-target="#cart-feedback"
            hx-swap="innerHTML"
            hx-ext="json-enc"
            ${!product.inStock ? "disabled" : ""}
          >
            ${product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  `;
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
  const filter: ProductFilter = {};

  if (url.searchParams.has("category")) {
    filter.category = url.searchParams.get("category") as any;
  }
  if (url.searchParams.has("minPrice")) {
    filter.minPrice = parseFloat(url.searchParams.get("minPrice")!);
  }
  if (url.searchParams.has("maxPrice")) {
    filter.maxPrice = parseFloat(url.searchParams.get("maxPrice")!);
  }
  if (url.searchParams.has("inStock")) {
    filter.inStock = url.searchParams.get("inStock") === "true";
  }
  if (url.searchParams.has("featured")) {
    filter.featured = url.searchParams.get("featured") === "true";
  }
  if (url.searchParams.has("rating")) {
    filter.rating = parseFloat(url.searchParams.get("rating")!);
  }
  if (url.searchParams.has("tags")) {
    filter.tags = url.searchParams.get("tags")!.split(",");
  }
  if (url.searchParams.has("search")) {
    filter.search = url.searchParams.get("search")!;
  }
  if (url.searchParams.has("sortBy")) {
    filter.sortBy = url.searchParams.get("sortBy") as any;
  }
  if (url.searchParams.has("sortOrder")) {
    filter.sortOrder = url.searchParams.get("sortOrder") as any;
  }
  if (url.searchParams.has("limit")) {
    filter.limit = parseInt(url.searchParams.get("limit")!);
  }
  if (url.searchParams.has("offset")) {
    filter.offset = parseInt(url.searchParams.get("offset")!);
  }

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
      return error(400, result.error.message);
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
      return html(
        productsHtml ||
          '<div class="no-products"><p>No products found</p></div>',
      );
    } else {
      return json(result.value);
    }
  } catch (err) {
    return error(500, `Failed to fetch products: ${err.message}`);
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
      return error(
        result.error.code === "PRODUCT_NOT_FOUND" ? 404 : 400,
        result.error.message,
      );
    }

    return json(result.value);
  } catch (err) {
    return error(500, `Failed to fetch product: ${err.message}`);
  }
}

export async function getFeaturedProducts(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "6");
    const repository = getRepository();

    const result = await repository.getFeaturedProducts(limit);

    if (!result.ok) {
      return error(400, result.error.message);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      const sessionId = getSessionId(req);
      const productsHtml = result.value.map((product) =>
        renderProductCard(product, sessionId)
      ).join("");

      // Return just the products HTML for HTMX to swap
      return html(
        productsHtml ||
          '<div class="no-products"><p>No featured products available</p></div>',
      );
    } else {
      return json(result.value);
    }
  } catch (err) {
    return error(500, `Failed to fetch featured products: ${err.message}`);
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
      return error(400, result.error.message);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      if (result.value.length === 0) {
        return html(`
          <div class="search-results-empty">
            <p>No products found for "${query}"</p>
          </div>
        `);
      }

      const sessionId = getSessionId(req);
      const productsHtml = result.value.map((product) =>
        renderProductCard(product, sessionId)
      ).join("");

      return html(`
        <div class="search-results" data-query="${query}" data-count="${result.value.length}">
          <h3>Search Results for "${query}" (${result.value.length} found)</h3>
          <div class="products-grid">
            ${productsHtml}
          </div>
        </div>
      `);
    } else {
      return json(result.value);
    }
  } catch (err) {
    return error(500, `Failed to search products: ${err.message}`);
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
      return error(400, result.error.message);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      const cart = result.value;

      if (cart.items.length === 0) {
        return html(`
          <div class="cart-empty">
            <h3>Your cart is empty</h3>
            <p>Add some products to get started!</p>
          </div>
        `);
      }

      const itemsHtml = cart.items.map((item) => `
        <div class="cart-item" data-item-id="${item.id}">
          <div class="cart-item__image">
            <img src="${item.product.imageUrl}" alt="${item.product.name}" />
          </div>
          <div class="cart-item__details">
            <h4 class="cart-item__name">${item.product.name}</h4>
            <div class="cart-item__price">$${item.unitPrice.toFixed(2)}</div>
            <div class="cart-item__quantity">
              <button class="quantity-btn"
                      hx-patch="/api/cart/items/${item.id}"
                      hx-headers='{"Content-Type": "application/json"}'
                      hx-vals='{"quantity": ${Math.max(1, item.quantity - 1)}}'
                      hx-target="#cart-sidebar .cart-items"
                      hx-swap="innerHTML"
                      ${item.quantity <= 1 ? "disabled" : ""}>-</button>
              <span class="quantity-value">${item.quantity}</span>
              <button class="quantity-btn"
                      hx-patch="/api/cart/items/${item.id}"
                      hx-headers='{"Content-Type": "application/json"}'
                      hx-vals='{"quantity": ${item.quantity + 1}}'
                      hx-target="#cart-sidebar .cart-items"
                      hx-swap="innerHTML">+</button>
            </div>
          </div>
          <button class="cart-item__remove"
                  hx-delete="/api/cart/items/${item.id}"
                  hx-target="#cart-sidebar .cart-items"
                  hx-swap="innerHTML"
                  title="Remove item">×</button>
        </div>
      `).join("");

      return html(`
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
      return json(result.value);
    }
  } catch (err) {
    return error(500, `Failed to fetch cart: ${err.message}`);
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
      return error(400, result.error.message);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      // Return updated cart count for header
      return html(`
        <span class="cart-count" data-count="${result.value.itemCount}">
          ${result.value.itemCount}
        </span>
      `);
    } else {
      return json(result.value);
    }
  } catch (err) {
    return error(500, `Failed to add to cart: ${err.message}`);
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
      return error(400, result.error.message);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      // Return updated cart content
      return getCart(req);
    } else {
      return json(result.value);
    }
  } catch (err) {
    return error(500, `Failed to update cart item: ${err.message}`);
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
      return error(400, result.error.message);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      // Return updated cart content
      return getCart(req);
    } else {
      return json(result.value);
    }
  } catch (err) {
    return error(500, `Failed to remove from cart: ${err.message}`);
  }
}

export async function getCartSummary(req: Request): Promise<Response> {
  try {
    const sessionId = getSessionId(req);
    const repository = getRepository();

    const result = await repository.getCartSummary(sessionId);

    if (!result.ok) {
      return error(400, result.error.message);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      const summary = result.value;
      return html(`
        <div class="cart-summary-widget">
          <span class="item-count">${summary.itemCount}</span>
          <span class="total">$${summary.total.toFixed(2)}</span>
        </div>
      `);
    } else {
      return json(result.value);
    }
  } catch (err) {
    return error(500, `Failed to get cart summary: ${err.message}`);
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
      return error(400, result.error.message);
    }

    return json(result.value, 201);
  } catch (err) {
    return error(500, `Failed to create user: ${err.message}`);
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
      return error(
        result.error.code === "USER_NOT_FOUND" ? 404 : 400,
        result.error.message,
      );
    }

    return json(result.value);
  } catch (err) {
    return error(500, `Failed to fetch user: ${err.message}`);
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
      return error(400, result.error.message);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      const order = result.value;
      return html(`
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
      return json(result.value, 201);
    }
  } catch (err) {
    return error(500, `Failed to create order: ${err.message}`);
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
      return error(
        result.error.code === "ORDER_NOT_FOUND" ? 404 : 400,
        result.error.message,
      );
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

      return html(`
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
      return json(result.value);
    }
  } catch (err) {
    return error(500, `Failed to fetch order: ${err.message}`);
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
      return error(400, result.error.message);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      if (result.value.length === 0) {
        return html(`
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

      return html(`
        <div class="orders-list">
          <h2>Order History</h2>
          ${ordersHtml}
        </div>
      `);
    } else {
      return json(result.value);
    }
  } catch (err) {
    return error(500, `Failed to fetch user orders: ${err.message}`);
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
      return error(400, result.error.message);
    }

    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
      req.headers.get("hx-request") === "true";

    if (acceptsHtml) {
      const sessionId = getSessionId(req);
      const productsHtml = result.value.map((product) =>
        renderProductCard(product, sessionId)
      ).join("");

      return html(`
        <div class="recommendations">
          <h3>Recommended for You</h3>
          <div class="products-grid">
            ${productsHtml}
          </div>
        </div>
      `);
    } else {
      return json(result.value);
    }
  } catch (err) {
    return error(500, `Failed to get recommendations: ${err.message}`);
  }
}
