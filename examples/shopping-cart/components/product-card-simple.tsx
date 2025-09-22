/**
 * Product Card Component - Simplified Version
 *
 * Demonstrates:
 * - Standard ui-lib component patterns
 * - CSS-in-JS styling
 * - HTMX integration for cart actions
 * - Responsive design
 * - Accessibility features
 */

import type { Product } from "../api/types.ts";

export interface ProductCardProps {
  product: Product;
  sessionId: string;
  className?: string;
}

export function ProductCard({ product, sessionId, className = "" }: ProductCardProps): string {
  const isOnSale = product.salePrice && product.salePrice < product.price;
  const displayPrice = isOnSale ? product.salePrice! : product.price;
  const originalPrice = isOnSale ? product.price : null;
  const discountPercent = isOnSale
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  return `
    <div class="product-card ${className}" data-product-id="${product.id}">
      <!-- Product Image -->
      <div class="product-card__image">
        <img
          src="${product.imageUrl}"
          alt="${product.name}"
          loading="lazy"
          decoding="async"
        >
        ${isOnSale ? `
          <div class="product-card__badge">
            ${discountPercent}% OFF
          </div>
        ` : ''}
        ${!product.inStock ? `
          <div class="product-card__out-of-stock">
            Out of Stock
          </div>
        ` : ''}
      </div>

      <!-- Product Info -->
      <div class="product-card__content">
        <div class="product-card__category">${product.category}</div>
        <h3 class="product-card__title">${product.name}</h3>
        <p class="product-card__description">${product.description}</p>

        <!-- Price -->
        <div class="product-card__price">
          <span class="product-card__current-price">$${displayPrice.toFixed(2)}</span>
          ${originalPrice ? `
            <span class="product-card__original-price">$${originalPrice.toFixed(2)}</span>
          ` : ''}
        </div>

        <!-- Rating -->
        ${product.rating ? `
          <div class="product-card__rating" aria-label="Rating: ${product.rating} out of 5 stars">
            <div class="product-card__stars">
              ${Array.from({ length: 5 }, (_, i) =>
                `<span class="star ${i < Math.floor(product.rating!) ? 'star--filled' : ''}">${i < Math.floor(product.rating!) ? '★' : '☆'}</span>`
              ).join('')}
            </div>
            <span class="product-card__rating-text">(${product.rating})</span>
          </div>
        ` : ''}

        <!-- Add to Cart Button -->
        <button
          class="product-card__add-to-cart ${!product.inStock ? 'product-card__add-to-cart--disabled' : ''}"
          ${product.inStock ? `
            hx-post="/api/cart/add"
            hx-vals='{"productId": "${product.id}", "quantity": 1}'
            hx-headers='{"X-Session-ID": "${sessionId}"}'
            hx-target="#cart-feedback"
            hx-swap="innerHTML"
          ` : 'disabled'}
          aria-label="${product.inStock ? `Add ${product.name} to cart` : 'Product out of stock'}"
        >
          ${product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>

    <style>
      .product-card {
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 300ms ease;
        overflow: hidden;
        height: 100%;
        position: relative;
      }

      .product-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }

      .product-card__image {
        position: relative;
        aspect-ratio: 1;
        overflow: hidden;
      }

      .product-card__image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 300ms ease;
      }

      .product-card:hover .product-card__image img {
        transform: scale(1.05);
      }

      .product-card__badge {
        position: absolute;
        top: 12px;
        right: 12px;
        background: #EF4444;
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        z-index: 2;
      }

      .product-card__out-of-stock {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 600;
        z-index: 2;
      }

      .product-card__content {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.75rem;
      }

      .product-card__category {
        font-size: 0.75rem;
        text-transform: uppercase;
        font-weight: 600;
        color: #6366F1;
        letter-spacing: 0.05em;
      }

      .product-card__title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1F2937;
        margin: 0;
        line-height: 1.3;
      }

      .product-card__description {
        font-size: 0.875rem;
        color: #6B7280;
        line-height: 1.5;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .product-card__price {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0.5rem 0;
      }

      .product-card__current-price {
        font-size: 1.25rem;
        font-weight: 700;
        color: #059669;
      }

      .product-card__original-price {
        font-size: 1rem;
        color: #9CA3AF;
        text-decoration: line-through;
      }

      .product-card__rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
      }

      .product-card__stars {
        display: flex;
        gap: 1px;
      }

      .star {
        color: #D1D5DB;
        font-size: 1rem;
      }

      .star--filled {
        color: #FBBF24;
      }

      .product-card__rating-text {
        color: #6B7280;
      }

      .product-card__add-to-cart {
        width: 100%;
        padding: 0.75rem;
        background: #6366F1;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 200ms ease;
        margin-top: auto;
        font-size: 0.875rem;
      }

      .product-card__add-to-cart:hover:not(:disabled) {
        background: #5B21B6;
        transform: translateY(-1px);
      }

      .product-card__add-to-cart:active:not(:disabled) {
        transform: translateY(0);
      }

      .product-card__add-to-cart--disabled {
        background: #9CA3AF;
        cursor: not-allowed;
      }

      .product-card__add-to-cart:focus-visible {
        outline: 2px solid #6366F1;
        outline-offset: 2px;
      }

      /* Loading state */
      .product-card.htmx-request {
        opacity: 0.7;
      }

      .product-card.htmx-request .product-card__add-to-cart {
        background: #9CA3AF;
        cursor: wait;
      }

      /* Mobile responsiveness */
      @media (max-width: 640px) {
        .product-card__content {
          padding: 1rem;
        }

        .product-card__title {
          font-size: 1rem;
        }

        .product-card__current-price {
          font-size: 1.125rem;
        }
      }

      /* High contrast mode */
      @media (prefers-contrast: high) {
        .product-card {
          border: 2px solid #000;
        }

        .product-card__add-to-cart {
          border: 2px solid #fff;
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .product-card,
        .product-card__image img,
        .product-card__add-to-cart {
          transition: none;
        }

        .product-card:hover {
          transform: none;
        }

        .product-card:hover .product-card__image img {
          transform: none;
        }
      }
    </style>
  `;
}