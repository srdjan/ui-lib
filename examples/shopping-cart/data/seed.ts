// Sample Data for Shopping Cart Demo
// Realistic product catalog with various categories and price points

import type { Product, User, ProductCategory } from "../api/types.ts";

// ============================================================
// Sample Products
// ============================================================

export const sampleProducts: readonly Product[] = [
  // Electronics
  {
    id: "prod_001",
    name: "Wireless Bluetooth Headphones",
    description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    price: 199.99,
    originalPrice: 249.99,
    category: "electronics",
    tags: ["bluetooth", "wireless", "noise-cancelling", "premium"],
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop"
    ],
    rating: 4.5,
    reviewCount: 2847,
    inStock: true,
    stockCount: 45,
    featured: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },

  {
    id: "prod_002",
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking with heart rate monitoring, GPS, and 7-day battery life. Water-resistant design for all activities.",
    price: 299.99,
    category: "electronics",
    tags: ["fitness", "smartwatch", "gps", "waterproof"],
    imageUrl: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=600&fit=crop"
    ],
    rating: 4.3,
    reviewCount: 1523,
    inStock: true,
    stockCount: 23,
    featured: false,
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
  },

  {
    id: "prod_003",
    name: "4K Ultra HD Webcam",
    description: "Professional webcam with auto-focus, noise reduction microphone, and wide-angle lens. Perfect for streaming and video calls.",
    price: 129.99,
    category: "electronics",
    tags: ["webcam", "4k", "streaming", "professional"],
    imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&h=600&fit=crop"
    ],
    rating: 4.2,
    reviewCount: 892,
    inStock: true,
    stockCount: 67,
    featured: false,
    createdAt: "2024-01-12T12:00:00Z",
    updatedAt: "2024-01-19T09:15:00Z",
  },

  // Clothing
  {
    id: "prod_004",
    name: "Premium Cotton T-Shirt",
    description: "Ultra-soft organic cotton t-shirt with a relaxed fit. Available in multiple colors and sustainably made.",
    price: 24.99,
    originalPrice: 34.99,
    category: "clothing",
    tags: ["cotton", "organic", "comfortable", "sustainable"],
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&h=600&fit=crop"
    ],
    rating: 4.7,
    reviewCount: 3241,
    inStock: true,
    stockCount: 156,
    featured: true,
    createdAt: "2024-01-08T14:00:00Z",
    updatedAt: "2024-01-22T11:20:00Z",
  },

  {
    id: "prod_005",
    name: "Classic Denim Jeans",
    description: "Timeless straight-leg jeans made from premium denim. Comfortable fit that works for any occasion.",
    price: 79.99,
    category: "clothing",
    tags: ["denim", "jeans", "classic", "versatile"],
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=600&fit=crop"
    ],
    rating: 4.4,
    reviewCount: 1876,
    inStock: true,
    stockCount: 89,
    featured: false,
    createdAt: "2024-01-05T16:30:00Z",
    updatedAt: "2024-01-21T13:45:00Z",
  },

  // Books
  {
    id: "prod_006",
    name: "The Art of Web Development",
    description: "Comprehensive guide to modern web development covering React, TypeScript, and best practices. Written by industry experts.",
    price: 39.99,
    category: "books",
    tags: ["programming", "web-development", "react", "typescript"],
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 567,
    inStock: true,
    stockCount: 234,
    featured: true,
    createdAt: "2024-01-03T09:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
  },

  {
    id: "prod_007",
    name: "Mindfulness and Meditation Guide",
    description: "Practical guide to developing mindfulness practices and meditation techniques for stress reduction and mental clarity.",
    price: 19.99,
    category: "books",
    tags: ["mindfulness", "meditation", "wellness", "self-help"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
    ],
    rating: 4.6,
    reviewCount: 423,
    inStock: true,
    stockCount: 178,
    featured: false,
    createdAt: "2024-01-07T11:15:00Z",
    updatedAt: "2024-01-18T08:45:00Z",
  },

  // Home
  {
    id: "prod_008",
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 handcrafted ceramic mugs with ergonomic handles. Microwave and dishwasher safe.",
    price: 34.99,
    category: "home",
    tags: ["ceramic", "coffee", "handcrafted", "set"],
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop"
    ],
    rating: 4.5,
    reviewCount: 1234,
    inStock: true,
    stockCount: 78,
    featured: false,
    createdAt: "2024-01-09T13:20:00Z",
    updatedAt: "2024-01-19T17:10:00Z",
  },

  {
    id: "prod_009",
    name: "Aromatherapy Essential Oil Diffuser",
    description: "Ultrasonic essential oil diffuser with color-changing LED lights and timer settings. Creates a calming atmosphere.",
    price: 49.99,
    originalPrice: 69.99,
    category: "home",
    tags: ["aromatherapy", "essential-oils", "diffuser", "wellness"],
    imageUrl: "https://images.unsplash.com/photo-1585855741519-c76b60c4a7a2?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1585855741519-c76b60c4a7a2?w=800&h=600&fit=crop"
    ],
    rating: 4.3,
    reviewCount: 987,
    inStock: false,
    stockCount: 0,
    featured: false,
    createdAt: "2024-01-11T15:45:00Z",
    updatedAt: "2024-01-23T10:30:00Z",
  },

  // Sports
  {
    id: "prod_010",
    name: "Yoga Mat with Carrying Strap",
    description: "Non-slip yoga mat made from eco-friendly materials. Includes carrying strap and alignment guides.",
    price: 32.99,
    category: "sports",
    tags: ["yoga", "eco-friendly", "non-slip", "exercise"],
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"
    ],
    rating: 4.4,
    reviewCount: 756,
    inStock: true,
    stockCount: 124,
    featured: true,
    createdAt: "2024-01-04T10:30:00Z",
    updatedAt: "2024-01-22T14:15:00Z",
  },

  // Beauty
  {
    id: "prod_011",
    name: "Natural Face Moisturizer",
    description: "Hydrating face moisturizer with organic ingredients and SPF 15. Suitable for all skin types.",
    price: 28.99,
    category: "beauty",
    tags: ["skincare", "moisturizer", "organic", "spf"],
    imageUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800&h=600&fit=crop"
    ],
    rating: 4.6,
    reviewCount: 2134,
    inStock: true,
    stockCount: 89,
    featured: false,
    createdAt: "2024-01-06T12:45:00Z",
    updatedAt: "2024-01-21T16:20:00Z",
  },

  // Toys
  {
    id: "prod_012",
    name: "Educational Building Blocks Set",
    description: "Colorful wooden building blocks that promote creativity and problem-solving skills. Safe for children 3+.",
    price: 45.99,
    category: "toys",
    tags: ["educational", "wooden", "building-blocks", "kids"],
    imageUrl: "https://images.unsplash.com/photo-1558060370-d1a1d5d906c0?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558060370-d1a1d5d906c0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=600&fit=crop"
    ],
    rating: 4.7,
    reviewCount: 1456,
    inStock: true,
    stockCount: 56,
    featured: true,
    createdAt: "2024-01-02T08:15:00Z",
    updatedAt: "2024-01-20T12:00:00Z",
  },
];

// ============================================================
// Sample Users
// ============================================================

export const sampleUsers: readonly User[] = [
  {
    id: "user_001",
    email: "alice@example.com",
    firstName: "Alice",
    lastName: "Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612c913?w=150&h=150&fit=crop&crop=face",
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
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "user_002",
    email: "bob@example.com",
    firstName: "Bob",
    lastName: "Smith",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    preferences: {
      theme: "dark",
      currency: "USD",
      language: "en",
      notifications: {
        email: true,
        orderUpdates: true,
        promotions: true,
      },
    },
    createdAt: "2024-01-05T10:30:00Z",
    updatedAt: "2024-01-22T09:15:00Z",
  },
];

// ============================================================
// Helper Functions
// ============================================================

export function getProductsByCategory(category: ProductCategory): readonly Product[] {
  return sampleProducts.filter(product => product.category === category);
}

export function getFeaturedProducts(): readonly Product[] {
  return sampleProducts.filter(product => product.featured);
}

export function getInStockProducts(): readonly Product[] {
  return sampleProducts.filter(product => product.inStock);
}

export function getProductsByPriceRange(min: number, max: number): readonly Product[] {
  return sampleProducts.filter(product => product.price >= min && product.price <= max);
}

export function searchProducts(query: string): readonly Product[] {
  const lowerQuery = query.toLowerCase();
  return sampleProducts.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getProductById(id: string): Product | undefined {
  return sampleProducts.find(product => product.id === id);
}

export function getCategoryStats(): Record<ProductCategory, number> {
  const stats: Record<ProductCategory, number> = {
    electronics: 0,
    clothing: 0,
    books: 0,
    home: 0,
    sports: 0,
    beauty: 0,
    toys: 0,
  };

  sampleProducts.forEach(product => {
    stats[product.category]++;
  });

  return stats;
}

export function getPriceRange(): { min: number; max: number } {
  const prices = sampleProducts.map(p => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

export function getAverageRating(): number {
  const totalRating = sampleProducts.reduce((sum, product) => sum + product.rating, 0);
  return totalRating / sampleProducts.length;
}

// Generate random product recommendations
export function getRecommendedProducts(excludeId?: string, limit = 4): readonly Product[] {
  const available = sampleProducts.filter(p => p.id !== excludeId && p.inStock);
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

// Get products related to a specific product (same category or tags)
export function getRelatedProducts(product: Product, limit = 4): readonly Product[] {
  const related = sampleProducts.filter(p =>
    p.id !== product.id &&
    p.inStock &&
    (p.category === product.category ||
     p.tags.some(tag => product.tags.includes(tag)))
  );

  return related.slice(0, limit);
}