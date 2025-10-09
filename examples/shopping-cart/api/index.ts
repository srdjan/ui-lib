/**
 * Shopping Cart API - Barrel Exports
 * Central export point for all API-related functionality
 */

// Types
export type {
  AddToCartRequest,
  AnalyticsEvent,
  ApiError,
  ApiResponse,
  AuthResponse,
  Cart,
  CartItem,
  CartItemProps,
  CartSummary,
  CreateOrderRequest,
  CreateUserRequest,
  CustomTheme,
  FilterGroup,
  FilterOption,
  FilterProps,
  FormErrors,
  LoginRequest,
  Order,
  OrderItem,
  OrderStatus,
  OrderSummary,
  PaginatedResponse,
  PaymentMethod,
  Product,
  ProductCardProps,
  ProductCategory,
  ProductFilter,
  ProductSummary,
  SearchSuggestion,
  Session,
  ShippingAddress,
  ThemeMode,
  UpdateCartItemRequest,
  User,
  UserPreferences,
  ValidationError,
} from "./types.ts";

// Repository
export type { ShoppingRepository } from "./repository.ts";
export { createKvShoppingRepository } from "./repository.ts";

// Repository Factory
export {
  ensureRepository,
  getRepository,
  initializeRepository,
} from "./repository-factory.ts";

// Response Helpers
export {
  apiErrorResponse,
  errorResponse,
  handleDatabaseError,
  htmlResponse,
  jsonResponse,
} from "./response.tsx";

// Handlers
export {
  addToCart,
  createOrder,
  createUser,
  getCart,
  getCartSummary,
  getFeaturedProducts,
  getOrder,
  getProduct,
  getProducts,
  getRecommendations,
  getUser,
  getUserOrders,
  removeFromCart,
  searchProducts,
  updateCartItem,
} from "./handlers.tsx";

// Checkout Handlers
export {
  completeCheckout,
  getCheckoutStep,
  initializeCheckout,
  submitPayment,
  submitShipping,
} from "./checkout-handlers.tsx";
