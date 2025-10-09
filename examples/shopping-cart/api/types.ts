// Shopping Cart Application Types
// Comprehensive type definitions for the e-commerce demo

import type { Result } from "../../../lib/result.ts";

// ============================================================
// Product Types
// ============================================================

export type ProductCategory =
  | "electronics"
  | "clothing"
  | "books"
  | "home"
  | "sports"
  | "beauty"
  | "toys";

export type Product = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly originalPrice?: number; // For sale items
  readonly category: ProductCategory;
  readonly tags: readonly string[];
  readonly imageUrl: string;
  readonly images: readonly string[]; // Multiple product images
  readonly rating: number; // 0-5
  readonly reviewCount: number;
  readonly inStock: boolean;
  readonly stockCount: number;
  readonly featured: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type ProductFilter = {
  readonly category?: ProductCategory;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly inStock?: boolean;
  readonly featured?: boolean;
  readonly rating?: number; // Minimum rating
  readonly tags?: readonly string[];
  readonly search?: string;
  readonly sortBy?: "name" | "price" | "rating" | "newest";
  readonly sortOrder?: "asc" | "desc";
  readonly limit?: number;
  readonly offset?: number;
};

export type ProductSummary = {
  readonly total: number;
  readonly categories: Record<ProductCategory, number>;
  readonly priceRange: { min: number; max: number };
  readonly averageRating: number;
};

// ============================================================
// Cart Types
// ============================================================

export type CartItem = {
  readonly id: string;
  readonly productId: string;
  readonly product: Product; // Populated product data
  readonly quantity: number;
  readonly addedAt: string;
  readonly unitPrice: number; // Price when added (for sale tracking)
};

export type Cart = {
  readonly id: string;
  readonly sessionId: string;
  readonly userId?: string; // For authenticated users
  readonly items: readonly CartItem[];
  readonly subtotal: number;
  readonly tax: number;
  readonly shipping: number;
  readonly discount: number;
  readonly total: number;
  readonly itemCount: number;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type AddToCartRequest = {
  readonly productId: string;
  readonly quantity: number;
  readonly sessionId?: string;
};

export type UpdateCartItemRequest = {
  readonly quantity: number;
};

export type CartSummary = {
  readonly itemCount: number;
  readonly subtotal: number;
  readonly total: number;
};

// ============================================================
// User Types
// ============================================================

export type User = {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly avatar?: string;
  readonly preferences: UserPreferences;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type UserPreferences = {
  readonly theme: "light" | "dark" | "auto";
  readonly currency: "USD" | "EUR" | "GBP";
  readonly language: "en" | "es" | "fr" | "de";
  readonly notifications: {
    readonly email: boolean;
    readonly orderUpdates: boolean;
    readonly promotions: boolean;
  };
};

export type CreateUserRequest = {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
};

export type LoginRequest = {
  readonly email: string;
  readonly password: string;
};

export type AuthResponse = {
  readonly user: User;
  readonly token: string;
  readonly expiresAt: string;
};

// ============================================================
// Order Types
// ============================================================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentMethod = {
  readonly type: "credit_card" | "paypal" | "apple_pay" | "google_pay";
  readonly last4?: string; // For credit cards
  readonly brand?: string; // Visa, Mastercard, etc.
};

export type ShippingAddress = {
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

export type OrderItem = {
  readonly id: string;
  readonly productId: string;
  readonly productName: string;
  readonly productImage: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly totalPrice: number;
};

export type Order = {
  readonly id: string;
  readonly orderNumber: string;
  readonly userId: string;
  readonly status: OrderStatus;
  readonly items: readonly OrderItem[];
  readonly subtotal: number;
  readonly tax: number;
  readonly shipping: number;
  readonly discount: number;
  readonly total: number;
  readonly paymentMethod: PaymentMethod;
  readonly shippingAddress: ShippingAddress;
  readonly billingAddress: ShippingAddress;
  readonly notes?: string;
  readonly trackingNumber?: string;
  readonly estimatedDelivery?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type CreateOrderRequest = {
  readonly cartId: string;
  readonly paymentMethod: PaymentMethod;
  readonly shippingAddress: ShippingAddress;
  readonly billingAddress: ShippingAddress;
  readonly notes?: string;
};

export type OrderSummary = {
  readonly totalOrders: number;
  readonly totalSpent: number;
  readonly averageOrderValue: number;
  readonly statusBreakdown: Record<OrderStatus, number>;
};

// ============================================================
// API Response Types
// ============================================================

export type ApiResponse<T> = Result<T, ApiError>;

// Discriminated union for type-safe error handling (matching todo app pattern)
export type ApiError =
  | { readonly type: "not_found"; readonly entity: string; readonly id: string }
  | {
    readonly type: "validation_error";
    readonly field: string;
    readonly message: string;
  }
  | {
    readonly type: "out_of_stock";
    readonly productId: string;
    readonly message: string;
  }
  | {
    readonly type: "empty_cart";
    readonly message: string;
  }
  | {
    readonly type: "kv_connection_error";
    readonly message: string;
  }
  | {
    readonly type: "kv_operation_error";
    readonly operation: string;
    readonly message: string;
  }
  | {
    readonly type: "generic_error";
    readonly code: string;
    readonly message: string;
  };

export type PaginatedResponse<T> = {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly hasNext: boolean;
  readonly hasPrev: boolean;
};

// ============================================================
// Session Types
// ============================================================

export type Session = {
  readonly id: string;
  readonly userId?: string;
  readonly cartId: string;
  readonly preferences: UserPreferences;
  readonly createdAt: string;
  readonly expiresAt: string;
};

// ============================================================
// Search and Filter Types
// ============================================================

export type SearchSuggestion = {
  readonly query: string;
  readonly type: "product" | "category" | "brand";
  readonly count: number;
};

export type FilterOption = {
  readonly value: string;
  readonly label: string;
  readonly count: number;
  readonly selected: boolean;
};

export type FilterGroup = {
  readonly name: string;
  readonly type: "checkbox" | "radio" | "range" | "select";
  readonly options: readonly FilterOption[];
  readonly min?: number;
  readonly max?: number;
  readonly sessionId?: string;
};

// ============================================================
// Component Props Types
// ============================================================

export type ProductCardProps = {
  readonly product: Product;
  readonly size?: "sm" | "md" | "lg";
  readonly variant?: "default" | "compact" | "featured";
  readonly showQuickAdd?: boolean;
  readonly showWishlist?: boolean;
};

export type CartItemProps = {
  readonly item: CartItem;
  readonly variant?: "sidebar" | "page" | "summary";
  readonly showImage?: boolean;
  readonly allowEdit?: boolean;
};

export type FilterProps = {
  readonly groups: readonly FilterGroup[];
  readonly onFilterChange: (filters: Record<string, unknown>) => void;
  readonly onClearFilters: () => void;
};

// ============================================================
// Theme and Customization Types
// ============================================================

export type ThemeMode = "light" | "dark" | "auto";

export type CustomTheme = {
  readonly name: string;
  readonly mode: ThemeMode;
  readonly tokens: Record<string, Record<string, string>>;
};

// ============================================================
// Analytics and Tracking Types
// ============================================================

export type AnalyticsEvent = {
  readonly type:
    | "page_view"
    | "product_view"
    | "add_to_cart"
    | "purchase"
    | "search";
  readonly productId?: string;
  readonly category?: string;
  readonly value?: number;
  readonly searchQuery?: string;
  readonly timestamp: string;
};

// ============================================================
// Error Types
// ============================================================

export type ValidationError = {
  readonly field: string;
  readonly message: string;
  readonly code: string;
};

export type FormErrors = Record<string, readonly ValidationError[]>;

// ============================================================
// Utility Types
// ============================================================

export type ID = string;
export type Timestamp = string;
export type Currency = number;
export type Percentage = number;
