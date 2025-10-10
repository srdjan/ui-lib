// Shopping Cart Repository
// Functional data access layer using Deno KV for persistence
// Implements all CRUD operations for products, cart, users, and orders

// deno-lint-ignore-file no-explicit-any
import type { Result } from "../../../lib/result.ts";
import { err, ok } from "../../../lib/result.ts";
import { sampleProducts, sampleUsers } from "../data/seed.ts";
import type {
  AddToCartRequest,
  ApiError,
  Cart,
  CartItem,
  CartSummary,
  CreateOrderRequest,
  CreateUserRequest,
  Order,
  OrderSummary,
  PaginatedResponse,
  Product,
  ProductFilter,
  ProductSummary,
  UpdateCartItemRequest,
  User,
} from "./types.ts";

// Safe error message extraction
const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

// We use any for KV to avoid complex Deno.Kv type issues
// deno-lint-ignore no-explicit-any
type KvLike = any;

// ============================================================
// Repository Interface (Port)
// ============================================================

export interface ShoppingRepository {
  // Product operations
  readonly getProducts: (
    filter?: ProductFilter,
  ) => Promise<Result<PaginatedResponse<Product>, ApiError>>;
  readonly getProduct: (id: string) => Promise<Result<Product, ApiError>>;
  readonly getProductSummary: () => Promise<Result<ProductSummary, ApiError>>;
  readonly getFeaturedProducts: (
    limit?: number,
  ) => Promise<Result<readonly Product[], ApiError>>;

  // Cart operations
  readonly getCart: (sessionId: string) => Promise<Result<Cart, ApiError>>;
  readonly addToCart: (
    sessionId: string,
    request: AddToCartRequest,
  ) => Promise<Result<Cart, ApiError>>;
  readonly updateCartItem: (
    sessionId: string,
    itemId: string,
    request: UpdateCartItemRequest,
  ) => Promise<Result<Cart, ApiError>>;
  readonly removeFromCart: (
    sessionId: string,
    itemId: string,
  ) => Promise<Result<Cart, ApiError>>;
  readonly clearCart: (sessionId: string) => Promise<Result<void, ApiError>>;
  readonly getCartSummary: (
    sessionId: string,
  ) => Promise<Result<CartSummary, ApiError>>;

  // User operations
  readonly createUser: (
    request: CreateUserRequest,
  ) => Promise<Result<User, ApiError>>;
  readonly getUser: (id: string) => Promise<Result<User, ApiError>>;
  readonly getUserByEmail: (email: string) => Promise<Result<User, ApiError>>;
  readonly updateUser: (
    id: string,
    updates: Partial<User>,
  ) => Promise<Result<User, ApiError>>;

  // Order operations
  readonly createOrder: (
    request: CreateOrderRequest,
  ) => Promise<Result<Order, ApiError>>;
  readonly getOrder: (id: string) => Promise<Result<Order, ApiError>>;
  readonly getUserOrders: (
    userId: string,
  ) => Promise<Result<readonly Order[], ApiError>>;
  readonly getOrderSummary: (
    userId: string,
  ) => Promise<Result<OrderSummary, ApiError>>;

  // Search operations
  readonly searchProducts: (
    query: string,
    limit?: number,
  ) => Promise<Result<readonly Product[], ApiError>>;
  readonly getRecommendedProducts: (
    userId?: string,
    limit?: number,
  ) => Promise<Result<readonly Product[], ApiError>>;
}

// ============================================================
// Pure Helper Functions
// ============================================================

// Calculate cart totals from items
const calculateCartTotals = (
  cart: Omit<Cart, "subtotal" | "tax" | "total" | "itemCount">,
): Cart => {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + (item.unitPrice * item.quantity),
    0,
  );
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax rate
  const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  const total = subtotal + tax + shipping - cart.discount;

  return {
    ...cart,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100,
    itemCount,
  };
};

// Filter products by criteria
const applyProductFilters = (
  products: readonly Product[],
  filter: ProductFilter,
): readonly Product[] => {
  const {
    minPrice,
    maxPrice,
    inStock,
    featured,
    rating,
    tags,
    search,
  } = filter;

  return products.filter((product) => {
    if (minPrice !== undefined && product.price < minPrice) return false;
    if (maxPrice !== undefined && product.price > maxPrice) return false;
    if (inStock !== undefined && product.inStock !== inStock) return false;
    if (featured !== undefined && product.featured !== featured) return false;
    if (rating !== undefined && product.rating < rating) return false;
    if (tags?.length && !tags.some((tag) => product.tags.includes(tag))) {
      return false;
    }
    if (search) {
      const query = search.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesDescription = product.description.toLowerCase().includes(
        query,
      );
      const matchesTags = product.tags.some((tag) =>
        tag.toLowerCase().includes(query)
      );
      if (!matchesName && !matchesDescription && !matchesTags) return false;
    }
    return true;
  });
};

// Sort products by specified criteria
const sortProducts = (
  products: readonly Product[],
  sortBy: ProductFilter["sortBy"] = "name",
  sortOrder: ProductFilter["sortOrder"] = "asc",
): readonly Product[] => {
  const sorted = [...products].sort((a, b) => {
    let aValue: number | string, bValue: number | string;

    switch (sortBy) {
      case "price":
        aValue = a.price;
        bValue = b.price;
        break;
      case "rating":
        aValue = a.rating;
        bValue = b.rating;
        break;
      case "newest":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
};

// ============================================================
// KV Repository Factory (Functional)
// ============================================================

export const createKvShoppingRepository = async (
  kv: KvLike,
): Promise<Result<ShoppingRepository, ApiError>> => {
  // Initialize (seed data if needed)
  try {
    const productsResult = await kv.list({
      prefix: ["products"],
    });
    const products = [];
    for await (const entry of productsResult) {
      products.push(entry.value as Product);
    }

    if (products.length === 0) {
      console.log("Seeding initial product data...");
      for (const product of sampleProducts) {
        await kv.set(["products", product.id], product);
        await kv.set([
          "productsByCategory",
          product.category,
          product.id,
        ], product);
      }
    }

    const usersResult = await kv.list({ prefix: ["users"] });
    const users = [];
    for await (const entry of usersResult) {
      users.push(entry.value as User);
    }

    if (users.length === 0) {
      console.log("Seeding initial user data...");
      for (const user of sampleUsers) {
        await kv.set(["users", user.id], user);
        await kv.set(["usersByEmail", user.email], user);
      }
    }
  } catch (error) {
    return err({
      type: "kv_connection_error",
      message: `Failed to initialize repository: ${toMessage(error)}`,
    });
  }

  // Return repository interface with kv in closure
  return ok({
    // ============================================================
    // Product Operations
    // ============================================================

    getProducts: async (filter: ProductFilter = {}) => {
      try {
        const {
          category,
          sortBy = "name",
          sortOrder = "asc",
          limit = 20,
          offset = 0,
        } = filter;

        let products: Product[] = [];

        if (category) {
          const categoryResults = await kv.list({
            prefix: ["productsByCategory", category],
          });
          for await (const entry of categoryResults) {
            products.push(entry.value as Product);
          }
        } else {
          const allResults = await kv.list({
            prefix: ["products"],
          });
          for await (const entry of allResults) {
            products.push(entry.value as Product);
          }
        }

        // Apply filters and sorting
        const filtered = applyProductFilters(products, filter);
        const sorted = sortProducts(filtered, sortBy, sortOrder);

        const total = sorted.length;
        const paginated = sorted.slice(offset, offset + limit);

        return ok({
          items: paginated,
          total,
          page: Math.floor(offset / limit) + 1,
          limit,
          hasNext: offset + limit < total,
          hasPrev: offset > 0,
        });
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "getProducts",
          message: toMessage(error),
        });
      }
    },

    getProduct: async (id: string) => {
      try {
        const result = await kv.get(["products", id]);
        if (!result.value) {
          return err({
            type: "not_found",
            entity: "product",
            id,
          });
        }
        return ok(result.value as Product);
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "getProduct",
          message: toMessage(error),
        });
      }
    },

    getProductSummary: async () => {
      try {
        const products: Product[] = [];
        const results = await kv.list({ prefix: ["products"] });
        for await (const entry of results) {
          products.push(entry.value as Product);
        }

        const categories = products.reduce((acc, product) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const prices = products.map((p) => p.price);
        const ratings = products.map((p) => p.rating);

        return ok({
          total: products.length,
          categories: categories as any,
          priceRange: {
            min: Math.min(...prices),
            max: Math.max(...prices),
          },
          averageRating: ratings.reduce((a, b) => a + b, 0) / ratings.length,
        });
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "getProductSummary",
          message: toMessage(error),
        });
      }
    },

    getFeaturedProducts: async (limit = 6) => {
      try {
        const products: Product[] = [];
        const results = await kv.list({ prefix: ["products"] });
        for await (const entry of results) {
          const product = entry.value as Product;
          if (product.featured) {
            products.push(product);
          }
        }

        return ok(products.slice(0, limit));
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "getFeaturedProducts",
          message: toMessage(error),
        });
      }
    },

    // ============================================================
    // Cart Operations
    // ============================================================

    getCart: async (sessionId: string) => {
      try {
        const result = await kv.get(["carts", sessionId]);

        if (!result.value) {
          // Create new cart
          const newCart: Cart = {
            id: `cart_${sessionId}`,
            sessionId,
            items: [],
            subtotal: 0,
            tax: 0,
            shipping: 0,
            discount: 0,
            total: 0,
            itemCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          await kv.set(["carts", sessionId], newCart);
          return ok(newCart);
        }

        return ok(result.value as Cart);
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "getCart",
          message: toMessage(error),
        });
      }
    },

    addToCart: async (sessionId: string, request: AddToCartRequest) => {
      try {
        // Get cart (using the repository method via recursion)
        const result = await kv.get(["carts", sessionId]);
        if (!result.value) {
          return err({
            type: "not_found",
            entity: "cart",
            id: sessionId,
          });
        }
        const cart = result.value as Cart;

        // Get product
        const productResult = await kv.get([
          "products",
          request.productId,
        ]);
        if (!productResult.value) {
          return err({
            type: "not_found",
            entity: "product",
            id: request.productId,
          });
        }

        const product = productResult.value as Product;
        if (!product.inStock) {
          return err({
            type: "out_of_stock",
            productId: request.productId,
            message: "Product is out of stock",
          });
        }

        const existingItemIndex = cart.items.findIndex((item: CartItem) =>
          item.productId === request.productId
        );

        let updatedItems: CartItem[];

        if (existingItemIndex >= 0) {
          // Update existing item
          updatedItems = cart.items.map((item: CartItem, index: number) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + request.quantity }
              : item
          );
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            productId: request.productId,
            product,
            quantity: request.quantity,
            addedAt: new Date().toISOString(),
            unitPrice: product.price,
          };
          updatedItems = [...cart.items, newItem];
        }

        const updatedCart = calculateCartTotals({
          ...cart,
          items: updatedItems,
          updatedAt: new Date().toISOString(),
        });

        await kv.set(["carts", sessionId], updatedCart);
        return ok(updatedCart);
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "addToCart",
          message: toMessage(error),
        });
      }
    },

    updateCartItem: async (
      sessionId: string,
      itemId: string,
      request: UpdateCartItemRequest,
    ) => {
      try {
        const result = await kv.get(["carts", sessionId]);
        if (!result.value) {
          return err({
            type: "not_found",
            entity: "cart",
            id: sessionId,
          });
        }

        const cart = result.value as Cart;
        const itemIndex = cart.items.findIndex((item: CartItem) => item.id === itemId);

        if (itemIndex === -1) {
          return err({
            type: "not_found",
            entity: "cart_item",
            id: itemId,
          });
        }

        const updatedItems = request.quantity > 0
          ? cart.items.map((item: CartItem, index: number) =>
            index === itemIndex
              ? { ...item, quantity: request.quantity }
              : item
          )
          : cart.items.filter((_: CartItem, index: number) => index !== itemIndex);

        const updatedCart = calculateCartTotals({
          ...cart,
          items: updatedItems,
          updatedAt: new Date().toISOString(),
        });

        await kv.set(["carts", sessionId], updatedCart);
        return ok(updatedCart);
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "updateCartItem",
          message: toMessage(error),
        });
      }
    },

    removeFromCart: async (sessionId: string, itemId: string) => {
      // Reuse updateCartItem with quantity 0
      try {
        const result = await kv.get(["carts", sessionId]);
        if (!result.value) {
          return err({
            type: "not_found",
            entity: "cart",
            id: sessionId,
          });
        }

        const cart = result.value as Cart;
        const updatedItems = cart.items.filter((item: CartItem) => item.id !== itemId);

        const updatedCart = calculateCartTotals({
          ...cart,
          items: updatedItems,
          updatedAt: new Date().toISOString(),
        });

        await kv.set(["carts", sessionId], updatedCart);
        return ok(updatedCart);
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "removeFromCart",
          message: toMessage(error),
        });
      }
    },

    clearCart: async (sessionId: string) => {
      try {
        const result = await kv.get(["carts", sessionId]);
        if (!result.value) {
          return err({
            type: "not_found",
            entity: "cart",
            id: sessionId,
          });
        }

        const clearedCart = calculateCartTotals({
          ...(result.value as Cart),
          items: [],
          updatedAt: new Date().toISOString(),
        });

        await kv.set(["carts", sessionId], clearedCart);
        return ok(undefined);
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "clearCart",
          message: toMessage(error),
        });
      }
    },

    getCartSummary: async (sessionId: string) => {
      try {
        const result = await kv.get(["carts", sessionId]);
        if (!result.value) {
          return err({
            type: "not_found",
            entity: "cart",
            id: sessionId,
          });
        }

        const cart = result.value as Cart;
        return ok({
          itemCount: cart.itemCount,
          subtotal: cart.subtotal,
          total: cart.total,
        });
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "getCartSummary",
          message: toMessage(error),
        });
      }
    },

    // ============================================================
    // User Operations (Simplified for demo)
    // ============================================================

    createUser: async (request: CreateUserRequest) => {
      try {
        const existingResult = await kv.get([
          "usersByEmail",
          request.email,
        ]);
        if (existingResult.value) {
          return err({
            type: "validation_error",
            field: "email",
            message: "User with this email already exists",
          });
        }

        const user: User = {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email: request.email,
          firstName: request.firstName,
          lastName: request.lastName,
          preferences: {
            theme: "light",
            currency: "USD",
            language: "en",
            notifications: {
              email: true,
              orderUpdates: true,
              promotions: false,
            },
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await kv.set(["users", user.id], user);
        await kv.set(["usersByEmail", user.email], user);

        return ok(user);
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "createUser",
          message: toMessage(error),
        });
      }
    },

    getUser: async (id: string) => {
      try {
        const result = await kv.get(["users", id]);
        if (!result.value) {
          return err({
            type: "not_found",
            entity: "user",
            id,
          });
        }
        return ok(result.value as User);
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "getUser",
          message: toMessage(error),
        });
      }
    },

    getUserByEmail: async (email: string) => {
      try {
        const result = await kv.get(["usersByEmail", email]);
        if (!result.value) {
          return err({
            type: "not_found",
            entity: "user",
            id: email,
          });
        }
        return ok(result.value as User);
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "getUserByEmail",
          message: toMessage(error),
        });
      }
    },

    updateUser: async (id: string, updates: Partial<User>) => {
      try {
        const userResult = await kv.get(["users", id]);
        if (!userResult.value) {
          return err({
            type: "not_found",
            entity: "user",
            id,
          });
        }

        const updatedUser = {
          ...userResult.value,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        await kv.set(["users", id], updatedUser);
        if (updates.email && updates.email !== userResult.value.email) {
          await kv.delete(["usersByEmail", userResult.value.email]);
          await kv.set(["usersByEmail", updates.email], updatedUser);
        }

        return ok(updatedUser);
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "updateUser",
          message: toMessage(error),
        });
      }
    },

    // ============================================================
    // Order Operations (Simplified for demo)
    // ============================================================

    createOrder: async (request: CreateOrderRequest) => {
      try {
        const cartResult = await kv.get(["carts", request.cartId]);
        if (!cartResult.value) {
          return err({
            type: "not_found",
            entity: "cart",
            id: request.cartId,
          });
        }

        const cart = cartResult.value as Cart;
        if (cart.items.length === 0) {
          return err({
            type: "empty_cart",
            message: "Cannot create order from empty cart",
          });
        }

        const order: Order = {
          id: `order_${Date.now()}_${
            Math.random().toString(36).substr(2, 9)
          }`,
          orderNumber: `ORD-${Date.now()}`,
          userId: cart.userId || "guest",
          status: "pending",
          items: cart.items.map((item: CartItem) => ({
            id: item.id,
            productId: item.productId,
            productName: item.product.name,
            productImage: item.product.imageUrl,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
          })),
          subtotal: cart.subtotal,
          tax: cart.tax,
          shipping: cart.shipping,
          discount: cart.discount,
          total: cart.total,
          paymentMethod: request.paymentMethod,
          shippingAddress: request.shippingAddress,
          billingAddress: request.billingAddress,
          notes: request.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await kv.set(["orders", order.id], order);
        if (order.userId !== "guest") {
          await kv.set(["ordersByUser", order.userId, order.id], order);
        }

        // Clear the cart after successful order
        const clearedCart = calculateCartTotals({
          ...cart,
          items: [],
          updatedAt: new Date().toISOString(),
        });
        await kv.set(["carts", request.cartId], clearedCart);

        return ok(order);
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "createOrder",
          message: toMessage(error),
        });
      }
    },

    getOrder: async (id: string) => {
      try {
        const result = await kv.get(["orders", id]);
        if (!result.value) {
          return err({
            type: "not_found",
            entity: "order",
            id,
          });
        }
        return ok(result.value as Order);
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "getOrder",
          message: toMessage(error),
        });
      }
    },

    getUserOrders: async (userId: string) => {
      try {
        const orders: Order[] = [];
        const results = await kv.list({
          prefix: ["ordersByUser", userId],
        });
        for await (const entry of results) {
          orders.push(entry.value as Order);
        }

        // Sort by creation date (newest first)
        const sorted = [...orders].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return ok(sorted);
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "getUserOrders",
          message: toMessage(error),
        });
      }
    },

    getOrderSummary: async (userId: string) => {
      try {
        const ordersResult = await kv.list({
          prefix: ["ordersByUser", userId],
        });
        const orders: Order[] = [];
        for await (const entry of ordersResult) {
          orders.push(entry.value as Order);
        }

        const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
        const statusBreakdown = orders.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        return ok({
          totalOrders: orders.length,
          totalSpent,
          averageOrderValue: orders.length > 0
            ? totalSpent / orders.length
            : 0,
          statusBreakdown: statusBreakdown as any,
        });
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "getOrderSummary",
          message: toMessage(error),
        });
      }
    },

    // ============================================================
    // Search Operations
    // ============================================================

    searchProducts: async (query: string, limit = 10) => {
      const filter: ProductFilter = { search: query, limit };
      const result = await kv.list({ prefix: ["products"] });
      const products: Product[] = [];
      for await (const entry of result) {
        products.push(entry.value as Product);
      }

      const filtered = applyProductFilters(products, filter);
      return ok(filtered.slice(0, limit));
    },

    getRecommendedProducts: async (userId?: string, limit = 4) => {
      try {
        // Simple recommendation: return random featured products
        const products: Product[] = [];
        const results = await kv.list({ prefix: ["products"] });
        for await (const entry of results) {
          const product = entry.value as Product;
          if (product.featured) {
            products.push(product);
          }
        }

        // Shuffle and take limit
        const shuffled = [...products];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return ok(shuffled.slice(0, limit));
      } catch (error) {
        return err({
          type: "kv_operation_error",
          operation: "getRecommendedProducts",
          message: toMessage(error),
        });
      }
    },
  });
};
