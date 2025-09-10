/** @jsx h */
import {
  array,
  boolean,
  createCartAction,
  defineComponent,
  del,
  get,
  h,
  number,
  object,
  patch,
  post,
  publishState,
  renderComponent,
  string,
} from "../../index.ts";
import { router } from "../router.ts";

/**
 * 🏪 E-commerce Product Catalog
 *
 * This complete application demonstrates:
 * ✨ Function-style props with zero duplication
 * 🎨 CSS-only format with auto-generated classes
 * 📡 Three-tier hybrid reactivity system
 * 🚀 Unified API System with HTMX
 * 🎯 DOM-native state management
 * ⚡ SSR-first architecture
 */

// Product Card Component
defineComponent("product-card", {
  router,
  api: {
    addToCart: post("/api/cart/add", async (req) => {
      const product = await req.json();
      // In real app, this would update database
      return new Response(JSON.stringify({
        success: true,
        message: "Added to cart!",
      }));
    }),

    toggleFavorite: patch("/api/products/:id/favorite", async (req, params) => {
      const productId = params.id;
      const isFavorited = Math.random() > 0.5;

      // Return HTML heart span that replaces the current heart
      const heartHtml = `<span id="heart-${productId}" class="heart ${
        isFavorited ? "is-favorite" : ""
      }">${isFavorited ? "❤️" : "🤍"}</span>`;

      return new Response(heartHtml, {
        headers: { "Content-Type": "text/html" },
      });
    }),
  },

  styles: {
    card: `{
      background: white;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
    }`,

    cardHover: `{
      transform: translateY(-4px);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    }`,

    imageContainer: `{
      position: relative;
      width: 100%;
      height: 200px;
      background: var(--gray-100);
      overflow: hidden;
    }`,

    image: `{
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }`,

    badge: `{
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.25rem 0.75rem;
      background: var(--red-6);
      color: white;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }`,

    favoriteBtn: `{
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      width: 2rem;
      height: 2rem;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }`,

    content: `{
      padding: 1rem;
    }`,

    title: `{
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--gray-900);
      margin-bottom: 0.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }`,

    description: `{
      font-size: 0.875rem;
      color: var(--gray-500);
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }`,

    priceRow: `{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }`,

    price: `{
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--blue-6);
    }`,

    originalPrice: `{
      font-size: 1rem;
      color: var(--gray-400);
      text-decoration: line-through;
      margin-left: 0.5rem;
    }`,

    rating: `{
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      color: var(--gray-500);
    }`,

    addToCartBtn: `{
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, var(--blue-6), var(--cyan-6));
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }`,

    addToCartBtnHover: `{
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgb(37 99 235 / 0.3);
    }`,

    quickViewBtn: `{
      position: absolute;
      bottom: 4rem;
      left: 50%;
      transform: translateX(-50%) translateY(100%);
      padding: 0.5rem 1rem;
      background: rgba(0,0,0,0.8);
      color: white;
      border: none;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: transform 0.3s ease;
      opacity: 0;
    }`,
  },

  render: (
    {
      id = string(""),
      name = string("Product Name"),
      description = string("Amazing product description"),
      price = number(99.99),
      originalPrice = number(0),
      image = string("/api/placeholder/300/200"),
      rating = number(4.5),
      reviews = number(0),
      inStock = boolean(true),
      isFavorite = boolean(false),
      discount = number(0),
    },
    _api: any,
    classes: any,
  ) => {
    const productId = typeof id === "string" ? id : "";
    const productName = typeof name === "string" ? name : "Product";
    const productDescription = typeof description === "string"
      ? description
      : "";
    const productPrice = typeof price === "number" ? price : 0;
    const productOriginalPrice = typeof originalPrice === "number"
      ? originalPrice
      : 0;
    const productImage = typeof image === "string" ? image : "";
    const productRating = typeof rating === "number" ? rating : 0;
    const reviewCount = typeof reviews === "number" ? reviews : 0;
    const isInStock = typeof inStock === "boolean" ? inStock : true;
    const isFav = typeof isFavorite === "boolean" ? isFavorite : false;
    const discountPercent = typeof discount === "number" ? discount : 0;

    return (
      <div
        class={classes!.card}
        data-product-id={productId}
        onmouseenter={`this.classList.add('${classes!.cardHover}')`}
        onmouseleave={`this.classList.remove('${classes!.cardHover}')`}
      >
        <div class={classes!.imageContainer}>
          <img
            src={productImage}
            alt={productName}
            class={classes!.image}
            loading="lazy"
          />

          {discountPercent > 0 && (
            <span class={classes!.badge}>-{discountPercent}%</span>
          )}

          <button
            type="button"
            class={classes!.favoriteBtn}
            {..._api.toggleFavorite(productId)}
            hx-target={`#heart-${productId}`}
            hx-swap="outerHTML"
            aria-label="Toggle favorite"
          >
            <span
              id={`heart-${productId}`}
              class={`heart ${isFav ? "is-favorite" : ""}`}
            >
              {isFav ? "❤️" : "🤍"}
            </span>
          </button>

          <button class={classes!.quickViewBtn}>
            Quick View
          </button>
        </div>

        <div class={classes!.content}>
          <h3 class={classes!.title} title={productName}>{productName}</h3>
          <p class={classes!.description}>{productDescription}</p>

          <div class={classes!.priceRow}>
            <div>
              <span class={classes!.price}>${productPrice}</span>
              {productOriginalPrice > productPrice && (
                <span class={classes!.originalPrice}>
                  ${productOriginalPrice}
                </span>
              )}
            </div>
            <div class={classes!.rating}>
              ⭐ {productRating} ({reviewCount})
            </div>
          </div>

          <button
            class={classes!.addToCartBtn}
            onclick={`
              ${
              createCartAction(
                "add",
                JSON.stringify({
                  id: productId,
                  name: productName,
                  price: productPrice,
                  quantity: 1,
                  image: productImage,
                }),
              )
            }
              this.textContent = '✓ Added!';
              this.classList.add('added');
              setTimeout(() => {
                this.textContent = '🛒 Add to Cart';
                this.classList.remove('added');
              }, 2000);
            `}
            disabled={!isInStock}
            onmouseenter={`this.classList.add('${classes!.addToCartBtnHover}')`}
            onmouseleave={`this.classList.remove('${
              classes!.addToCartBtnHover
            }')`}
          >
            {isInStock ? "🛒 Add to Cart" : "Out of Stock"}
          </button>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          .${classes!.card}:hover .${classes!.quickViewBtn} {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
          .${classes!.card}:hover .${classes!.image} {
            transform: scale(1.05);
          }
          .${classes!.card}:hover .${classes!.quickViewBtn} {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
          .${classes!.card}:hover .${classes!.image} {
            transform: scale(1.05);
          }
          .heart { color: var(--gray-600); font-size: 1.1rem; }
          .heart.is-favorite { color: var(--red-6); }
          .${classes!.addToCartBtn}.added { background: var(--green-6); }
        `,
          }}
        />
      </div>
    );
  },
});

// Product Grid Component
defineComponent("product-grid", {
  api: {
    loadProducts: get("/api/products", async (req) => {
      // Simulate loading products
      const products = [
        {
          id: "1",
          name: "Premium Wireless Headphones",
          description: "Crystal clear sound with active noise cancellation",
          price: 149.99,
          originalPrice: 199.99,
          image: "https://picsum.photos/300/200?random=1",
          rating: 4.8,
          reviews: 342,
          inStock: true,
          discount: 25,
        },
        {
          id: "2",
          name: "Smart Watch Pro",
          description: "Track your fitness and stay connected",
          price: 299.99,
          originalPrice: 399.99,
          image: "https://picsum.photos/300/200?random=2",
          rating: 4.6,
          reviews: 567,
          inStock: true,
          discount: 25,
        },
        {
          id: "3",
          name: "4K Webcam",
          description: "Professional quality video for remote work",
          price: 89.99,
          image: "https://picsum.photos/300/200?random=3",
          rating: 4.5,
          reviews: 123,
          inStock: true,
        },
        {
          id: "4",
          name: "Mechanical Keyboard",
          description: "RGB backlit with custom switches",
          price: 129.99,
          originalPrice: 159.99,
          image: "https://picsum.photos/300/200?random=4",
          rating: 4.9,
          reviews: 892,
          inStock: false,
          discount: 19,
        },
      ];

      const html = products.map((p) => renderComponent("product-card", p)).join(
        "",
      );

      return new Response(html);
    }),
  },

  styles: {
    container: `{
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }`,

    header: `{
      text-align: center;
      margin-bottom: 3rem;
    }`,

    title: `{
      font-size: 3rem;
      font-weight: 900;
      background: linear-gradient(135deg, var(--blue-6), var(--cyan-6));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
    }`,

    subtitle: `{
      font-size: 1.25rem;
      color: var(--gray-500);
    }`,

    filters: `{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }`,

    filterGroup: `{
      display: flex;
      gap: 0.5rem;
    }`,

    filterBtn: `{
      padding: 0.5rem 1rem;
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }`,

    filterBtnActive: `{
      background: var(--blue-6);
      color: white;
      border-color: var(--blue-6);
    }`,

    searchBox: `{
      padding: 0.75rem 1rem;
      border: 1px solid var(--gray-200);
      border-radius: 0.5rem;
      width: 300px;
      font-size: 1rem;
    }`,

    grid: `{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }`,

    loadMoreBtn: `{
      display: block;
      margin: 2rem auto;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, var(--blue-6), var(--cyan-6));
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }`,
  },

  render: (
    {
      category = string("all"),
    },
    api: any,
    classes: any,
  ) => (
    <div class={classes!.container}>
      <div class={classes!.header}>
        <h1 class={classes!.title}>Product Catalog</h1>
        <p class={classes!.subtitle}>
          Discover amazing products built with ui-lib's revolutionary components
        </p>
      </div>

      <div class={classes!.filters}>
        <div class={classes!.filterGroup}>
          <button class={`${classes!.filterBtn} ${classes!.filterBtnActive}`}>
            All Products
          </button>
          <button class={classes!.filterBtn}>Electronics</button>
          <button class={classes!.filterBtn}>Accessories</button>
          <button class={classes!.filterBtn}>On Sale</button>
        </div>

        <input
          type="search"
          class={classes!.searchBox}
          placeholder="Search products..."
          hx-get="/api/products/search"
          hx-trigger="keyup changed delay:300ms"
          hx-target="#product-grid"
          name="q"
        />
      </div>

      <div
        class={classes!.grid}
        id="product-grid"
        hx-get="/api/products"
        hx-trigger="load"
        hx-swap="innerHTML"
        hx-on={`htmx:afterRequest: if (event.detail.successful) htmx.process(this)`}
      >
        <product-card
          id="1"
          name="Loading..."
          description="Products are loading..."
          price="0"
        />
      </div>

      <button
        class={classes!.loadMoreBtn}
        hx-get="/api/products?page=2"
        hx-target="#product-grid"
        hx-swap="beforeend"
      >
        Load More Products
      </button>
    </div>
  ),
});

// Shopping Cart Sidebar
defineComponent("shopping-cart", {
  /* stateSubscriptions: {
    cart: `
      const items = data.items || [];
      const itemsContainer = this.querySelector('.cart-items');
      const totalEl = this.querySelector('.cart-total');
      const countEl = this.querySelector('.cart-count');

      if (items.length === 0) {
        itemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
      } else {
        itemsContainer.innerHTML = items.map(item => \`
          <div class="cart-item">
            <img class="cart-item-img" src="\${item.image}">
            <div class="cart-item-main">
              <div class="cart-item-title">\${item.name}</div>
              <div class="cart-item-qty">Qty: \${item.quantity}</div>
            </div>
            <div class="cart-item-price">$\${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        \`).join('');
      }

      totalEl.textContent = '$' + (data.total || 0).toFixed(2);
      countEl.textContent = data.count || 0;
    `
  }, */

  styles: {
    sidebar: `{
      position: fixed;
      right: 0;
      top: 0;
      width: 400px;
      height: 100vh;
      background: white;
      box-shadow: -4px 0 6px -1px rgb(0 0 0 / 0.1);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      z-index: 1000;
      display: flex;
      flex-direction: column;
    }`,

    sidebarOpen: `{
      transform: translateX(0);
    }`,

    header: `{
      padding: 1.5rem;
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }`,

    title: `{
      font-size: 1.25rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }`,

    closeBtn: `{
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--gray-500);
    }`,

    items: `{
      flex: 1;
      overflow-y: auto;
    }`,

    footer: `{
      padding: 1.5rem;
      border-top: 1px solid var(--gray-200);
    }`,

    totalRow: `{
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-size: 1.25rem;
      font-weight: 700;
    }`,

    checkoutBtn: `{
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, var(--blue-6), var(--cyan-6));
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }`,
  },

  render: (_: any, __: any, classes: any) => (
    <div class={classes!.sidebar} id="shopping-cart-sidebar">
      <div class={classes!.header}>
        <h2 class={classes!.title}>
          🛒 Shopping Cart (<span class="cart-count">0</span>)
        </h2>
        <button
          class={classes!.closeBtn}
          onclick="document.getElementById('shopping-cart-sidebar').classList.remove('open')"
        >
          ✕
        </button>
      </div>

      <div class={`${classes!.items} cart-items`}>
        <div class="cart-empty">
          Your cart is empty
        </div>
      </div>

      <div class={classes!.footer}>
        <div class={classes!.totalRow}>
          <span>Total:</span>
          <span class="cart-total">$0.00</span>
        </div>
        <button class={classes!.checkoutBtn}>
          Proceed to Checkout
        </button>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        #shopping-cart-sidebar.open {
          transform: translateX(0);
        }
        .cart-empty { padding: 2rem; text-align: center; color: var(--gray-600); }
        .cart-item { display: flex; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--gray-200); }
        .cart-item-img { width: 60px; height: 60px; object-fit: cover; border-radius: 0.5rem; }
        .cart-item-main { flex: 1; }
        .cart-item-title { font-weight: 600; }
        .cart-item-qty { color: var(--gray-500); font-size: 0.875rem; }
        .cart-item-price { font-weight: 600; color: var(--blue-7); }
      `,
        }}
      />
    </div>
  ),
});
