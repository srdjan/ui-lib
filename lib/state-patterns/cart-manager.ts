// Cart Manager - Type-safe e-commerce cart state management
// Extracted from showcase inline JavaScript for broader reuse

import type { StateManager } from "../state-manager.ts";

/**
 * Cart item interface
 */
export interface CartItem {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
  readonly image?: string;
  readonly description?: string;
  readonly category?: string;
}

/**
 * Cart state interface
 */
export interface CartState {
  readonly items: readonly CartItem[];
  readonly count: number;
  readonly total: number;
  readonly isEmpty: boolean;
}

/**
 * Cart actions
 */
export type CartAction = "add" | "remove" | "update" | "clear";

/**
 * Cart manager configuration
 */
export interface CartManagerConfig {
  readonly topic?: string;
  readonly persistToLocalStorage?: boolean;
  readonly maxItems?: number;
  readonly currencyFormatter?: (amount: number) => string;
}

/**
 * Type-safe cart manager for e-commerce functionality
 */
export class CartManager {
  private readonly topic: string;
  private readonly maxItems: number;
  private readonly persistToLocalStorage: boolean;
  private readonly formatCurrency: (amount: number) => string;

  constructor(
    private readonly stateManager: StateManager,
    config: CartManagerConfig = {},
  ) {
    this.topic = config.topic ?? "cart";
    this.maxItems = config.maxItems ?? 100;
    this.persistToLocalStorage = config.persistToLocalStorage ?? true;
    this.formatCurrency = config.currencyFormatter ?? this.defaultFormatter;

    // Load initial state from localStorage if enabled
    if (this.persistToLocalStorage) {
      this.loadFromStorage();
    }
  }

  /**
   * Add item to cart
   */
  addItem(item: Omit<CartItem, "quantity"> & { quantity?: number }): CartState {
    const currentState = this.getCurrentState();
    const quantity = item.quantity ?? 1;
    let newItems = [...currentState.items];

    // Check if item already exists
    const existingIndex = newItems.findIndex((existing) =>
      existing.id === item.id
    );

    if (existingIndex >= 0) {
      // Update existing item quantity
      const existingItem = newItems[existingIndex];
      newItems[existingIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + quantity,
      };
    } else {
      // Add new item
      if (newItems.length >= this.maxItems) {
        throw new Error(
          `Cannot add item: cart is full (max ${this.maxItems} items)`,
        );
      }
      newItems.push({ ...item, quantity });
    }

    const newState = this.calculateState(newItems);
    this.publishState(newState);
    return newState;
  }

  /**
   * Remove item from cart
   */
  removeItem(itemId: string): CartState {
    const currentState = this.getCurrentState();
    const newItems = currentState.items.filter((item) => item.id !== itemId);
    const newState = this.calculateState(newItems);
    this.publishState(newState);
    return newState;
  }

  /**
   * Update item in cart
   */
  updateItem(itemId: string, updates: Partial<CartItem>): CartState {
    const currentState = this.getCurrentState();
    const newItems = currentState.items.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    const newState = this.calculateState(newItems);
    this.publishState(newState);
    return newState;
  }

  /**
   * Clear all items from cart
   */
  clear(): CartState {
    const newState = this.calculateState([]);
    this.publishState(newState);
    return newState;
  }

  /**
   * Get current cart state
   */
  getCurrentState(): CartState {
    const state = this.stateManager.getState(this.topic) as CartState;
    return state ?? this.getEmptyState();
  }

  /**
   * Subscribe to cart state changes
   */
  subscribe(callback: (state: CartState) => void, element: Element): void {
    this.stateManager.subscribe(
      this.topic,
      callback as (data: unknown) => void,
      element,
    );
  }

  /**
   * Get formatted cart total
   */
  getFormattedTotal(): string {
    const state = this.getCurrentState();
    return this.formatCurrency(state.total);
  }

  /**
   * Get cart summary for display
   */
  getSummary(): {
    itemCount: number;
    total: string;
    isEmpty: boolean;
    items: readonly CartItem[];
  } {
    const state = this.getCurrentState();
    return {
      itemCount: state.count,
      total: this.formatCurrency(state.total),
      isEmpty: state.isEmpty,
      items: state.items,
    };
  }

  private calculateState(items: readonly CartItem[]): CartState {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0,
    );

    return {
      items,
      count,
      total,
      isEmpty: items.length === 0,
    };
  }

  private publishState(state: CartState): void {
    this.stateManager.publish(this.topic, state);

    if (this.persistToLocalStorage) {
      this.saveToStorage(state);
    }
  }

  private getEmptyState(): CartState {
    return {
      items: [],
      count: 0,
      total: 0,
      isEmpty: true,
    };
  }

  private saveToStorage(state: CartState): void {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(`ui-lib-cart-${this.topic}`, serialized);
    } catch (error) {
      console.warn("Failed to save cart state to localStorage:", error);
    }
  }

  private loadFromStorage(): void {
    try {
      const serialized = localStorage.getItem(`ui-lib-cart-${this.topic}`);
      if (serialized) {
        const state = JSON.parse(serialized) as CartState;
        this.stateManager.publish(this.topic, state);
      }
    } catch (error) {
      console.warn("Failed to load cart state from localStorage:", error);
    }
  }

  private defaultFormatter(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }
}

/**
 * Create a cart action function for use in reactive helpers
 * This matches the global function from the showcase
 */
export const createCartAction = (cartManager: CartManager) => {
  return (action: CartAction, itemData: unknown): void => {
    try {
      const item = itemData as CartItem;

      switch (action) {
        case "add":
          cartManager.addItem(item);
          break;
        case "remove":
          cartManager.removeItem(item.id);
          break;
        case "update":
          cartManager.updateItem(item.id, item);
          break;
        case "clear":
          cartManager.clear();
          break;
        default:
          console.warn(`Unknown cart action: ${action}`);
      }
    } catch (error) {
      console.error("Cart action failed:", error);
    }
  };
};

/**
 * JavaScript implementation string for injection into host pages
 * This creates window.uiLibCartAction with the cart functionality
 */
export const createCartManagerScript = (
  config: CartManagerConfig = {},
): string => {
  const topic = config.topic ?? "cart";
  const maxItems = config.maxItems ?? 100;

  return `
// ui-lib Cart Manager - Client-side cart functionality
window.uiLibCartAction = function(action, itemData) {
  console.log("🛒 Cart " + action + ":", itemData);
  
  const currentCart = window.funcwcState?.getState("${topic}") || {
    items: [], count: 0, total: 0, isEmpty: true
  };
  
  let newItems = [...currentCart.items];
  
  if (action === "add") {
    const existing = newItems.findIndex(item => item.id === itemData.id);
    if (existing >= 0) {
      newItems[existing].quantity += itemData.quantity || 1;
    } else {
      if (newItems.length >= ${maxItems}) {
        console.warn("Cannot add item: cart is full");
        return;
      }
      newItems.push({ ...itemData, quantity: itemData.quantity || 1 });
    }
  } else if (action === "remove") {
    newItems = newItems.filter(item => item.id !== itemData.id);
  } else if (action === "update") {
    const existing = newItems.findIndex(item => item.id === itemData.id);
    if (existing >= 0) {
      newItems[existing] = { ...newItems[existing], ...itemData };
    }
  } else if (action === "clear") {
    newItems = [];
  }
  
  const cartState = {
    items: newItems,
    count: newItems.reduce((sum, item) => sum + item.quantity, 0),
    total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    isEmpty: newItems.length === 0
  };
  
  window.funcwcState?.publish("${topic}", cartState);
  
  // Update UI elements
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = cartState.count;
  });
  
  document.querySelectorAll(".cart-total").forEach(el => {
    el.textContent = "$" + cartState.total.toFixed(2);
  });
  
  // Persist to localStorage
  try {
    localStorage.setItem("ui-lib-cart-${topic}", JSON.stringify(cartState));
  } catch (e) {
    console.warn("Failed to persist cart state:", e);
  }
};

// Load cart state from localStorage on page load
try {
  const saved = localStorage.getItem("ui-lib-cart-${topic}");
  if (saved && window.funcwcState) {
    const cartState = JSON.parse(saved);
    window.funcwcState.publish("${topic}", cartState);
  }
} catch (e) {
  console.warn("Failed to load cart state:", e);
}
`.trim();
};
