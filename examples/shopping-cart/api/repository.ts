// Shopping Cart Repository
// Data access layer using Deno KV for persistence
// Implements all CRUD operations for products, cart, users, and orders

import type { Result } from "../../../lib/result.ts";
import { err, ok } from "../../../lib/result.ts";
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
import { sampleProducts, sampleUsers } from "../data/seed.ts";

// ============================================================
// Repository Interface
// ============================================================

export interface ShoppingRepository {
  // Product operations
  getProducts(
    filter?: ProductFilter,
  ): Promise<Result<PaginatedResponse<Product>, ApiError>>;
  getProduct(id: string): Promise<Result<Product, ApiError>>;
  getProductSummary(): Promise<Result<ProductSummary, ApiError>>;
  getFeaturedProducts(
    limit?: number,
  ): Promise<Result<readonly Product[], ApiError>>;

  // Cart operations
  getCart(sessionId: string): Promise<Result<Cart, ApiError>>;
  addToCart(
    sessionId: string,
    request: AddToCartRequest,
  ): Promise<Result<Cart, ApiError>>;
  updateCartItem(
    sessionId: string,
    itemId: string,
    request: UpdateCartItemRequest,
  ): Promise<Result<Cart, ApiError>>;
  removeFromCart(
    sessionId: string,
    itemId: string,
  ): Promise<Result<Cart, ApiError>>;
  clearCart(sessionId: string): Promise<Result<void, ApiError>>;
  getCartSummary(sessionId: string): Promise<Result<CartSummary, ApiError>>;

  // User operations
  createUser(request: CreateUserRequest): Promise<Result<User, ApiError>>;
  getUser(id: string): Promise<Result<User, ApiError>>;
  getUserByEmail(email: string): Promise<Result<User, ApiError>>;
  updateUser(
    id: string,
    updates: Partial<User>,
  ): Promise<Result<User, ApiError>>;

  // Order operations
  createOrder(request: CreateOrderRequest): Promise<Result<Order, ApiError>>;
  getOrder(id: string): Promise<Result<Order, ApiError>>;
  getUserOrders(userId: string): Promise<Result<readonly Order[], ApiError>>;
  getOrderSummary(userId: string): Promise<Result<OrderSummary, ApiError>>;

  // Search operations
  searchProducts(
    query: string,
    limit?: number,
  ): Promise<Result<readonly Product[], ApiError>>;
  getRecommendedProducts(
    userId?: string,
    limit?: number,
  ): Promise<Result<readonly Product[], ApiError>>;
}

// ============================================================
// KV Repository Implementation
// ============================================================

export class KvShoppingRepository implements ShoppingRepository {
  private kv: Deno.Kv;
  private initialized = false;

  constructor(kv: Deno.Kv) {
    this.kv = kv;
  }

  async initialize(): Promise<Result<void, ApiError>> {
    if (this.initialized) return ok(undefined);

    try {
      // Seed initial data if not exists
      const productsResult = await this.kv.list<Product>({
        prefix: ["products"],
      });
      const products = [];
      for await (const entry of productsResult) {
        products.push(entry.value);
      }

      if (products.length === 0) {
        console.log("Seeding initial product data...");
        for (const product of sampleProducts) {
          await this.kv.set(["products", product.id], product);
          await this.kv.set([
            "productsByCategory",
            product.category,
            product.id,
          ], product);
        }
      }

      // Seed initial users
      const usersResult = await this.kv.list<User>({ prefix: ["users"] });
      const users = [];
      for await (const entry of usersResult) {
        users.push(entry.value);
      }

      if (users.length === 0) {
        console.log("Seeding initial user data...");
        for (const user of sampleUsers) {
          await this.kv.set(["users", user.id], user);
          await this.kv.set(["usersByEmail", user.email], user);
        }
      }

      this.initialized = true;
      return ok(undefined);
    } catch (error) {
      return err({
        code: "INITIALIZATION_FAILED",
        message: "Failed to initialize repository",
        details: { error: error.message },
      });
    }
  }

  // ============================================================
  // Product Operations
  // ============================================================

  async getProducts(
    filter: ProductFilter = {},
  ): Promise<Result<PaginatedResponse<Product>, ApiError>> {
    try {
      const {
        category,
        minPrice,
        maxPrice,
        inStock,
        featured,
        rating,
        tags,
        search,
        sortBy = "name",
        sortOrder = "asc",
        limit = 20,
        offset = 0,
      } = filter;

      let products: Product[] = [];

      if (category) {
        const categoryResults = await this.kv.list<Product>({
          prefix: ["productsByCategory", category],
        });
        for await (const entry of categoryResults) {
          products.push(entry.value);
        }
      } else {
        const allResults = await this.kv.list<Product>({
          prefix: ["products"],
        });
        for await (const entry of allResults) {
          products.push(entry.value);
        }
      }

      // Apply filters
      products = products.filter((product) => {
        if (minPrice !== undefined && product.price < minPrice) return false;
        if (maxPrice !== undefined && product.price > maxPrice) return false;
        if (inStock !== undefined && product.inStock !== inStock) return false;
        if (featured !== undefined && product.featured !== featured) {
          return false;
        }
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

      // Apply sorting
      products.sort((a, b) => {
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

      const total = products.length;
      const paginatedProducts = products.slice(offset, offset + limit);

      return ok({
        items: paginatedProducts,
        total,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasNext: offset + limit < total,
        hasPrev: offset > 0,
      });
    } catch (error) {
      return err({
        code: "PRODUCTS_FETCH_FAILED",
        message: "Failed to fetch products",
        details: { error: error.message },
      });
    }
  }

  async getProduct(id: string): Promise<Result<Product, ApiError>> {
    try {
      const result = await this.kv.get<Product>(["products", id]);
      if (!result.value) {
        return err({
          code: "PRODUCT_NOT_FOUND",
          message: `Product with id ${id} not found`,
        });
      }
      return ok(result.value);
    } catch (error) {
      return err({
        code: "PRODUCT_FETCH_FAILED",
        message: "Failed to fetch product",
        details: { error: error.message },
      });
    }
  }

  async getProductSummary(): Promise<Result<ProductSummary, ApiError>> {
    try {
      const products: Product[] = [];
      const results = await this.kv.list<Product>({ prefix: ["products"] });
      for await (const entry of results) {
        products.push(entry.value);
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
        code: "SUMMARY_FETCH_FAILED",
        message: "Failed to fetch product summary",
        details: { error: error.message },
      });
    }
  }

  async getFeaturedProducts(
    limit = 6,
  ): Promise<Result<readonly Product[], ApiError>> {
    try {
      const products: Product[] = [];
      const results = await this.kv.list<Product>({ prefix: ["products"] });
      for await (const entry of results) {
        if (entry.value.featured) {
          products.push(entry.value);
        }
      }

      return ok(products.slice(0, limit));
    } catch (error) {
      return err({
        code: "FEATURED_FETCH_FAILED",
        message: "Failed to fetch featured products",
        details: { error: error.message },
      });
    }
  }

  // ============================================================
  // Cart Operations
  // ============================================================

  async getCart(sessionId: string): Promise<Result<Cart, ApiError>> {
    try {
      const result = await this.kv.get<Cart>(["carts", sessionId]);

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

        await this.kv.set(["carts", sessionId], newCart);
        return ok(newCart);
      }

      return ok(result.value);
    } catch (error) {
      return err({
        code: "CART_FETCH_FAILED",
        message: "Failed to fetch cart",
        details: { error: error.message },
      });
    }
  }

  async addToCart(
    sessionId: string,
    request: AddToCartRequest,
  ): Promise<Result<Cart, ApiError>> {
    try {
      const cartResult = await this.getCart(sessionId);
      if (!cartResult.ok) return cartResult;

      const productResult = await this.getProduct(request.productId);
      if (!productResult.ok) {
        return err({
          code: "PRODUCT_NOT_FOUND",
          message: `Product ${request.productId} not found`,
        });
      }

      const product = productResult.value;
      if (!product.inStock) {
        return err({
          code: "PRODUCT_OUT_OF_STOCK",
          message: "Product is out of stock",
        });
      }

      const cart = cartResult.value;
      const existingItemIndex = cart.items.findIndex((item) =>
        item.productId === request.productId
      );

      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item
        updatedItems = cart.items.map((item, index) =>
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

      const updatedCart = this.calculateCartTotals({
        ...cart,
        items: updatedItems,
        updatedAt: new Date().toISOString(),
      });

      await this.kv.set(["carts", sessionId], updatedCart);
      return ok(updatedCart);
    } catch (error) {
      return err({
        code: "ADD_TO_CART_FAILED",
        message: "Failed to add item to cart",
        details: { error: error.message },
      });
    }
  }

  async updateCartItem(
    sessionId: string,
    itemId: string,
    request: UpdateCartItemRequest,
  ): Promise<Result<Cart, ApiError>> {
    try {
      const cartResult = await this.getCart(sessionId);
      if (!cartResult.ok) return cartResult;

      const cart = cartResult.value;
      const itemIndex = cart.items.findIndex((item) => item.id === itemId);

      if (itemIndex === -1) {
        return err({
          code: "CART_ITEM_NOT_FOUND",
          message: `Cart item ${itemId} not found`,
        });
      }

      const updatedItems = request.quantity > 0
        ? cart.items.map((item, index) =>
          index === itemIndex ? { ...item, quantity: request.quantity } : item
        )
        : cart.items.filter((_, index) => index !== itemIndex);

      const updatedCart = this.calculateCartTotals({
        ...cart,
        items: updatedItems,
        updatedAt: new Date().toISOString(),
      });

      await this.kv.set(["carts", sessionId], updatedCart);
      return ok(updatedCart);
    } catch (error) {
      return err({
        code: "UPDATE_CART_FAILED",
        message: "Failed to update cart item",
        details: { error: error.message },
      });
    }
  }

  async removeFromCart(
    sessionId: string,
    itemId: string,
  ): Promise<Result<Cart, ApiError>> {
    return this.updateCartItem(sessionId, itemId, { quantity: 0 });
  }

  async clearCart(sessionId: string): Promise<Result<void, ApiError>> {
    try {
      const cartResult = await this.getCart(sessionId);
      if (!cartResult.ok) return err(cartResult.error);

      const clearedCart = this.calculateCartTotals({
        ...cartResult.value,
        items: [],
        updatedAt: new Date().toISOString(),
      });

      await this.kv.set(["carts", sessionId], clearedCart);
      return ok(undefined);
    } catch (error) {
      return err({
        code: "CLEAR_CART_FAILED",
        message: "Failed to clear cart",
        details: { error: error.message },
      });
    }
  }

  async getCartSummary(
    sessionId: string,
  ): Promise<Result<CartSummary, ApiError>> {
    try {
      const cartResult = await this.getCart(sessionId);
      if (!cartResult.ok) return err(cartResult.error);

      const cart = cartResult.value;
      return ok({
        itemCount: cart.itemCount,
        subtotal: cart.subtotal,
        total: cart.total,
      });
    } catch (error) {
      return err({
        code: "CART_SUMMARY_FAILED",
        message: "Failed to get cart summary",
        details: { error: error.message },
      });
    }
  }

  // ============================================================
  // User Operations (Simplified for demo)
  // ============================================================

  async createUser(
    request: CreateUserRequest,
  ): Promise<Result<User, ApiError>> {
    try {
      const existingResult = await this.kv.get(["usersByEmail", request.email]);
      if (existingResult.value) {
        return err({
          code: "EMAIL_ALREADY_EXISTS",
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

      await this.kv.set(["users", user.id], user);
      await this.kv.set(["usersByEmail", user.email], user);

      return ok(user);
    } catch (error) {
      return err({
        code: "USER_CREATION_FAILED",
        message: "Failed to create user",
        details: { error: error.message },
      });
    }
  }

  async getUser(id: string): Promise<Result<User, ApiError>> {
    try {
      const result = await this.kv.get<User>(["users", id]);
      if (!result.value) {
        return err({
          code: "USER_NOT_FOUND",
          message: `User with id ${id} not found`,
        });
      }
      return ok(result.value);
    } catch (error) {
      return err({
        code: "USER_FETCH_FAILED",
        message: "Failed to fetch user",
        details: { error: error.message },
      });
    }
  }

  async getUserByEmail(email: string): Promise<Result<User, ApiError>> {
    try {
      const result = await this.kv.get<User>(["usersByEmail", email]);
      if (!result.value) {
        return err({
          code: "USER_NOT_FOUND",
          message: `User with email ${email} not found`,
        });
      }
      return ok(result.value);
    } catch (error) {
      return err({
        code: "USER_FETCH_FAILED",
        message: "Failed to fetch user",
        details: { error: error.message },
      });
    }
  }

  async updateUser(
    id: string,
    updates: Partial<User>,
  ): Promise<Result<User, ApiError>> {
    try {
      const userResult = await this.getUser(id);
      if (!userResult.ok) return userResult;

      const updatedUser = {
        ...userResult.value,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await this.kv.set(["users", id], updatedUser);
      if (updates.email && updates.email !== userResult.value.email) {
        await this.kv.delete(["usersByEmail", userResult.value.email]);
        await this.kv.set(["usersByEmail", updates.email], updatedUser);
      }

      return ok(updatedUser);
    } catch (error) {
      return err({
        code: "USER_UPDATE_FAILED",
        message: "Failed to update user",
        details: { error: error.message },
      });
    }
  }

  // ============================================================
  // Order Operations (Simplified for demo)
  // ============================================================

  async createOrder(
    request: CreateOrderRequest,
  ): Promise<Result<Order, ApiError>> {
    try {
      const cartResult = await this.getCart(request.cartId);
      if (!cartResult.ok) return err(cartResult.error);

      const cart = cartResult.value;
      if (cart.items.length === 0) {
        return err({
          code: "EMPTY_CART",
          message: "Cannot create order from empty cart",
        });
      }

      const order: Order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderNumber: `ORD-${Date.now()}`,
        userId: cart.userId || "guest",
        status: "pending",
        items: cart.items.map((item) => ({
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

      await this.kv.set(["orders", order.id], order);
      if (order.userId !== "guest") {
        await this.kv.set(["ordersByUser", order.userId, order.id], order);
      }

      // Clear the cart after successful order
      await this.clearCart(request.cartId);

      return ok(order);
    } catch (error) {
      return err({
        code: "ORDER_CREATION_FAILED",
        message: "Failed to create order",
        details: { error: error.message },
      });
    }
  }

  async getOrder(id: string): Promise<Result<Order, ApiError>> {
    try {
      const result = await this.kv.get<Order>(["orders", id]);
      if (!result.value) {
        return err({
          code: "ORDER_NOT_FOUND",
          message: `Order with id ${id} not found`,
        });
      }
      return ok(result.value);
    } catch (error) {
      return err({
        code: "ORDER_FETCH_FAILED",
        message: "Failed to fetch order",
        details: { error: error.message },
      });
    }
  }

  async getUserOrders(
    userId: string,
  ): Promise<Result<readonly Order[], ApiError>> {
    try {
      const orders: Order[] = [];
      const results = await this.kv.list<Order>({
        prefix: ["ordersByUser", userId],
      });
      for await (const entry of results) {
        orders.push(entry.value);
      }

      // Sort by creation date (newest first)
      orders.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return ok(orders);
    } catch (error) {
      return err({
        code: "USER_ORDERS_FETCH_FAILED",
        message: "Failed to fetch user orders",
        details: { error: error.message },
      });
    }
  }

  async getOrderSummary(
    userId: string,
  ): Promise<Result<OrderSummary, ApiError>> {
    try {
      const ordersResult = await this.getUserOrders(userId);
      if (!ordersResult.ok) return err(ordersResult.error);

      const orders = ordersResult.value;
      const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
      const statusBreakdown = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return ok({
        totalOrders: orders.length,
        totalSpent,
        averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0,
        statusBreakdown: statusBreakdown as any,
      });
    } catch (error) {
      return err({
        code: "ORDER_SUMMARY_FAILED",
        message: "Failed to get order summary",
        details: { error: error.message },
      });
    }
  }

  // ============================================================
  // Search Operations
  // ============================================================

  async searchProducts(
    query: string,
    limit = 10,
  ): Promise<Result<readonly Product[], ApiError>> {
    const filter: ProductFilter = { search: query, limit };
    const result = await this.getProducts(filter);
    return result.ok ? ok(result.value.items) : err(result.error);
  }

  async getRecommendedProducts(
    userId?: string,
    limit = 4,
  ): Promise<Result<readonly Product[], ApiError>> {
    try {
      // Simple recommendation: return random featured products
      const featuredResult = await this.getFeaturedProducts(limit * 2);
      if (!featuredResult.ok) return err(featuredResult.error);

      const products = [...featuredResult.value];
      // Shuffle and take limit
      for (let i = products.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [products[i], products[j]] = [products[j], products[i]];
      }

      return ok(products.slice(0, limit));
    } catch (error) {
      return err({
        code: "RECOMMENDATIONS_FAILED",
        message: "Failed to get recommendations",
        details: { error: error.message },
      });
    }
  }

  // ============================================================
  // Helper Methods
  // ============================================================

  private calculateCartTotals(
    cart: Omit<Cart, "subtotal" | "tax" | "total" | "itemCount">,
  ): Cart {
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
  }
}

// ============================================================
// Repository Factory
// ============================================================

let repository: ShoppingRepository | null = null;

export async function createRepository(): Promise<
  Result<ShoppingRepository, ApiError>
> {
  try {
    const kv = await Deno.openKv();
    const repo = new KvShoppingRepository(kv);
    const initResult = await repo.initialize();

    if (!initResult.ok) return err(initResult.error);

    repository = repo;
    return ok(repo);
  } catch (error) {
    return err({
      code: "REPOSITORY_CREATION_FAILED",
      message: "Failed to create repository",
      details: { error: error.message },
    });
  }
}

export function getRepository(): ShoppingRepository {
  if (!repository) {
    throw new Error(
      "Repository not initialized. Call createRepository() first.",
    );
  }
  return repository;
}

export function setRepositoryForTesting(
  instance: ShoppingRepository | null,
): void {
  repository = instance;
}
