/**
 * DOM-Native Cart State Management
 *
 * Demonstrates ui-lib's philosophy: state lives in the DOM, not JavaScript memory
 * Features:
 * - Cart count in data attributes with CSS counter display
 * - Cart total stored in DOM for instant updates
 * - Three-tier reactivity system
 * - No hydration required - state is already in HTML
 * - Pub/Sub for cross-component communication
 */

import type { Cart, CartItem, CartSummary } from "../api/types.ts";

// ============================================================
// DOM State Locations
// ============================================================

// Cart state is stored in these DOM locations:
// 1. Data attributes: cart-count, cart-total, cart-items
// 2. CSS custom properties: --cart-count for visual badges
// 3. Element content: Cart sidebar HTML content
// 4. Local storage: Cart session persistence

const CART_SELECTORS = {
  counter: '[data-cart-count]',
  badge: '.cart-badge',
  sidebar: '#cart-sidebar',
  toggle: '[data-cart-toggle]',
  overlay: '.cart-overlay',
  summary: '.cart-summary',
  items: '.cart-items',
  total: '[data-cart-total]',
} as const;

const STORAGE_KEYS = {
  sessionId: 'shopping-cart-session',
  cart: 'shopping-cart-data',
} as const;

// ============================================================
// Cart State Manager
// ============================================================

export class CartStateManager {
  private sessionId: string;
  private eventTarget: EventTarget;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.eventTarget = new EventTarget();
    this.initializeEventListeners();
  }

  // ============================================================
  // Session Management
  // ============================================================

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem(STORAGE_KEYS.sessionId);
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(STORAGE_KEYS.sessionId, sessionId);
    }
    return sessionId;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  // ============================================================
  // DOM State Updates
  // ============================================================

  updateCartCount(count: number): void {
    // Update data attributes
    const counters = document.querySelectorAll(CART_SELECTORS.counter);
    counters.forEach(counter => {
      counter.setAttribute('data-cart-count', count.toString());
      // Update text content if element has no children
      if (counter.children.length === 0) {
        counter.textContent = count.toString();
      }
    });

    // Update CSS custom property for badges
    document.documentElement.style.setProperty('--cart-count', count.toString());

    // Show/hide cart badge based on count
    const badges = document.querySelectorAll(CART_SELECTORS.badge);
    badges.forEach(badge => {
      if (count > 0) {
        badge.classList.remove('hidden');
        badge.setAttribute('data-count', count.toString());
      } else {
        badge.classList.add('hidden');
      }
    });

    // Tier 2: Pub/Sub state update
    this.publishState('cart-count', count);
  }

  updateCartTotal(total: number): void {
    const totalElements = document.querySelectorAll(CART_SELECTORS.total);
    totalElements.forEach(element => {
      element.setAttribute('data-cart-total', total.toFixed(2));
      element.textContent = `$${total.toFixed(2)}`;
    });

    // Update CSS custom property
    document.documentElement.style.setProperty('--cart-total', total.toString());

    // Pub/Sub update
    this.publishState('cart-total', total);
  }

  updateCartSummary(summary: CartSummary): void {
    this.updateCartCount(summary.itemCount);
    this.updateCartTotal(summary.total);

    const summaryElements = document.querySelectorAll(CART_SELECTORS.summary);
    summaryElements.forEach(element => {
      element.innerHTML = `
        <div class="cart-summary-content">
          <div class="cart-summary-line">
            <span>Items:</span>
            <span>${summary.itemCount}</span>
          </div>
          <div class="cart-summary-line">
            <span>Subtotal:</span>
            <span>$${summary.subtotal.toFixed(2)}</span>
          </div>
          <div class="cart-summary-line cart-summary-total">
            <span>Total:</span>
            <span>$${summary.total.toFixed(2)}</span>
          </div>
        </div>
      `;
    });
  }

  updateCartItems(items: readonly CartItem[]): void {
    const itemsContainers = document.querySelectorAll(CART_SELECTORS.items);
    itemsContainers.forEach(container => {
      if (items.length === 0) {
        container.innerHTML = `
          <div class="cart-empty-state">
            <p>Your cart is empty</p>
            <button onclick="cartState.closeCart()">Continue Shopping</button>
          </div>
        `;
      } else {
        container.innerHTML = items.map(item => this.renderCartItem(item)).join('');
      }
    });

    // Store in local storage for persistence
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
  }

  private renderCartItem(item: CartItem): string {
    return `
      <div class="cart-item" data-item-id="${item.id}" data-product-id="${item.productId}">
        <div class="cart-item-image">
          <img src="${item.product.imageUrl}" alt="${item.product.name}" loading="lazy">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.product.name}</h4>
          <p class="cart-item-price">$${item.unitPrice.toFixed(2)}</p>
        </div>
        <div class="cart-item-quantity">
          <button
            class="quantity-btn"
            onclick="cartState.updateQuantity('${item.id}', ${item.quantity - 1})"
            ${item.quantity <= 1 ? 'disabled' : ''}
          >-</button>
          <span class="quantity-value" data-quantity="${item.quantity}">${item.quantity}</span>
          <button
            class="quantity-btn"
            onclick="cartState.updateQuantity('${item.id}', ${item.quantity + 1})"
          >+</button>
        </div>
        <div class="cart-item-total">
          $${(item.unitPrice * item.quantity).toFixed(2)}
        </div>
        <button
          class="cart-item-remove"
          onclick="cartState.removeItem('${item.id}')"
          title="Remove item"
        >×</button>
      </div>
    `;
  }

  // ============================================================
  // Cart Operations
  // ============================================================

  async addToCart(productId: string, quantity = 1): Promise<void> {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      const cart: Cart = await response.json();
      this.updateCartFromServer(cart);

      // Tier 3: DOM Event communication
      this.dispatchCartEvent('item-added', { productId, quantity, cart });

      // Show success feedback
      this.showToast(`Added ${quantity} item(s) to cart`, 'success');
    } catch (error) {
      console.error('Add to cart failed:', error);
      this.showToast('Failed to add item to cart', 'error');
    }
  }

  async updateQuantity(itemId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      return this.removeItem(itemId);
    }

    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      const cart: Cart = await response.json();
      this.updateCartFromServer(cart);

      this.dispatchCartEvent('quantity-updated', { itemId, quantity, cart });
    } catch (error) {
      console.error('Update quantity failed:', error);
      this.showToast('Failed to update quantity', 'error');
    }
  }

  async removeItem(itemId: string): Promise<void> {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'X-Session-ID': this.sessionId,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      const cart: Cart = await response.json();
      this.updateCartFromServer(cart);

      this.dispatchCartEvent('item-removed', { itemId, cart });
      this.showToast('Item removed from cart', 'info');
    } catch (error) {
      console.error('Remove item failed:', error);
      this.showToast('Failed to remove item', 'error');
    }
  }

  async loadCart(): Promise<void> {
    try {
      const response = await fetch(`/api/cart?session=${this.sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to load cart');
      }

      const cart: Cart = await response.json();
      this.updateCartFromServer(cart);
    } catch (error) {
      console.error('Load cart failed:', error);
      // Initialize empty cart state
      this.updateCartSummary({ itemCount: 0, subtotal: 0, total: 0 });
      this.updateCartItems([]);
    }
  }

  private updateCartFromServer(cart: Cart): void {
    this.updateCartSummary({
      itemCount: cart.itemCount,
      subtotal: cart.subtotal,
      total: cart.total,
    });
    this.updateCartItems(cart.items);
  }

  // ============================================================
  // Cart UI Controls
  // ============================================================

  openCart(): void {
    const sidebar = document.querySelector(CART_SELECTORS.sidebar);
    const overlay = document.querySelector(CART_SELECTORS.overlay);

    if (sidebar) {
      sidebar.classList.add('cart-sidebar--open');
      document.body.classList.add('cart-open');
    }

    if (overlay) {
      overlay.classList.add('cart-overlay--visible');
    }

    // Focus management for accessibility
    const firstFocusable = sidebar?.querySelector('button, input, [tabindex]') as HTMLElement;
    firstFocusable?.focus();

    this.dispatchCartEvent('cart-opened', {});
  }

  closeCart(): void {
    const sidebar = document.querySelector(CART_SELECTORS.sidebar);
    const overlay = document.querySelector(CART_SELECTORS.overlay);

    if (sidebar) {
      sidebar.classList.remove('cart-sidebar--open');
      document.body.classList.remove('cart-open');
    }

    if (overlay) {
      overlay.classList.remove('cart-overlay--visible');
    }

    this.dispatchCartEvent('cart-closed', {});
  }

  toggleCart(): void {
    const sidebar = document.querySelector(CART_SELECTORS.sidebar);
    const isOpen = sidebar?.classList.contains('cart-sidebar--open');

    if (isOpen) {
      this.closeCart();
    } else {
      this.openCart();
    }
  }

  // ============================================================
  // Three-Tier Reactivity Implementation
  // ============================================================

  // Tier 1: CSS Property Reactivity (already implemented via CSS custom properties)

  // Tier 2: Pub/Sub State Manager
  private publishState(topic: string, data: any): void {
    window.dispatchEvent(new CustomEvent('state-change', {
      detail: { topic, data }
    }));
  }

  subscribeToState(topic: string, callback: (data: any) => void): () => void {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.topic === topic) {
        callback(customEvent.detail.data);
      }
    };

    window.addEventListener('state-change', handler);
    return () => window.removeEventListener('state-change', handler);
  }

  // Tier 3: DOM Event Communication
  private dispatchCartEvent(type: string, detail: any): void {
    this.eventTarget.dispatchEvent(new CustomEvent(type, { detail }));
    // Also dispatch on window for global listeners
    window.dispatchEvent(new CustomEvent(`cart-${type}`, { detail }));
  }

  addEventListener(type: string, listener: EventListener): void {
    this.eventTarget.addEventListener(type, listener);
  }

  removeEventListener(type: string, listener: EventListener): void {
    this.eventTarget.removeEventListener(type, listener);
  }

  // ============================================================
  // UI Feedback
  // ============================================================

  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    // Create toast element if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    toastContainer.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // ============================================================
  // Event Listeners Setup
  // ============================================================

  private initializeEventListeners(): void {
    // Cart toggle buttons
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      if (target.matches('[data-cart-toggle]') || target.closest('[data-cart-toggle]')) {
        event.preventDefault();
        this.toggleCart();
      }

      // Close cart when clicking overlay
      if (target.matches('.cart-overlay')) {
        this.closeCart();
      }

      // Add to cart buttons
      if (target.matches('[data-add-to-cart]') || target.closest('[data-add-to-cart]')) {
        event.preventDefault();
        const button = target.closest('[data-add-to-cart]') as HTMLElement;
        const productId = button.dataset.productId;
        const quantity = parseInt(button.dataset.quantity || '1');

        if (productId) {
          this.addToCart(productId, quantity);
        }
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (event) => {
      // Escape key closes cart
      if (event.key === 'Escape') {
        const sidebar = document.querySelector(CART_SELECTORS.sidebar);
        if (sidebar?.classList.contains('cart-sidebar--open')) {
          this.closeCart();
        }
      }
    });

    // Listen for state changes from other components
    this.subscribeToState('product-added', (data) => {
      console.log('Product added to cart:', data);
    });

    this.subscribeToState('cart-updated', (data) => {
      console.log('Cart updated:', data);
    });

    // Handle browser back/forward navigation
    window.addEventListener('popstate', () => {
      this.closeCart();
    });
  }
}

// ============================================================
// Global Cart State Instance
// ============================================================

export const cartState = new CartStateManager();

// Initialize cart on page load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    cartState.loadCart();
  });

  // Expose global methods for component integration
  (window as any).cartState = cartState;
}

// ============================================================
// CSS for Cart State Management
// ============================================================

export const cartStateCSS = `
  /* CSS Counter for cart badge */
  .cart-badge::after {
    content: var(--cart-count, '0');
    position: absolute;
    top: -8px;
    right: -8px;
    background: #EF4444;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }

  .cart-badge.hidden::after {
    display: none;
  }

  /* Cart sidebar animations */
  .cart-sidebar {
    transform: translateX(100%);
    transition: transform 300ms ease-out;
  }

  .cart-sidebar--open {
    transform: translateX(0);
  }

  /* Cart overlay */
  .cart-overlay {
    opacity: 0;
    visibility: hidden;
    transition: opacity 300ms ease-out, visibility 300ms ease-out;
  }

  .cart-overlay--visible {
    opacity: 1;
    visibility: visible;
  }

  /* Toast notifications */
  .toast-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .toast {
    padding: 1rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 300px;
    animation: slideIn 300ms ease-out;
  }

  .toast--success {
    border-left: 4px solid #10B981;
  }

  .toast--error {
    border-left: 4px solid #EF4444;
  }

  .toast--info {
    border-left: 4px solid #3B82F6;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  /* Prevent body scroll when cart is open */
  body.cart-open {
    overflow: hidden;
  }
`;