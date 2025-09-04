/** @jsx h */
import { 
  array, 
  boolean, 
  createCartAction, 
  defineComponent, 
  del, 
  dispatchEvent, 
  get, 
  h, 
  number, 
  object, 
  patch, 
  post, 
  publishState, 
  setCSSProperty, 
  string 
} from "../../index.ts";

/**
 * 🏗️ Real-World Examples Showcase
 * 
 * Complete applications demonstrating ui-lib's capabilities:
 * - E-commerce product catalog with cart
 * - Interactive dashboard with real-time updates
 * - Multi-step form wizard with validation
 * - Social media feed with infinite scroll
 */
defineComponent("real-world-examples", {
  styles: {
    showcase: `{
      background: var(--gray-0);
      border-radius: var(--radius-4);
      padding: var(--size-6);
      margin: var(--size-6) 0;
    }`,

    showcaseTitle: `{
      font-size: var(--font-size-4);
      font-weight: var(--font-weight-7);
      color: var(--violet-6);
      margin-bottom: var(--size-4);
    }`,

    showcaseSubtitle: `{
      font-size: var(--font-size-1);
      color: var(--gray-7);
      margin-bottom: var(--size-6);
    }`,

    examplesGrid: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: var(--size-6);
      margin-bottom: var(--size-6);
    }`,

    exampleCard: `{
      background: white;
      border: 2px solid var(--gray-3);
      border-radius: var(--radius-4);
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }`,

    exampleHeader: `{
      background: linear-gradient(135deg, var(--violet-6) 0%, var(--purple-6) 100%);
      color: white;
      padding: var(--size-4);
      text-align: center;
    }`,

    exampleTitle: `{
      font-size: var(--font-size-3);
      font-weight: var(--font-weight-6);
      margin-bottom: var(--size-2);
    }`,

    exampleDescription: `{
      font-size: var(--font-size-1);
      opacity: 0.9;
    }`,

    exampleContent: `{
      padding: var(--size-4);
    }`,

    featuresList: `{
      list-style: none;
      padding: 0;
      margin: var(--size-3) 0;
    }`,

    featureItem: `{
      display: flex;
      align-items: center;
      gap: var(--size-2);
      margin-bottom: var(--size-2);
      font-size: var(--font-size-1);
      color: var(--gray-7);
    }`,

    featureIcon: `{
      color: var(--violet-6);
      font-size: var(--font-size-2);
    }`,

    demoButton: `{
      background: var(--violet-6);
      color: white;
      border: none;
      padding: var(--size-3) var(--size-4);
      border-radius: var(--radius-3);
      cursor: pointer;
      font-size: var(--font-size-1);
      font-weight: var(--font-weight-6);
      width: 100%;
      margin-top: var(--size-3);
      transition: all 0.3s ease;
    }`,

    statsGrid: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: var(--size-3);
      margin: var(--size-6) 0;
      padding: var(--size-4);
      background: white;
      border-radius: var(--radius-4);
      border: 1px solid var(--gray-3);
    }`,

    statCard: `{
      text-align: center;
      padding: var(--size-3);
      border-radius: var(--radius-3);
      background: var(--violet-0);
      border: 1px solid var(--violet-3);
    }`,

    statValue: `{
      font-size: var(--font-size-3);
      font-weight: var(--font-weight-7);
      color: var(--violet-7);
      margin-bottom: var(--size-1);
    }`,

    statLabel: `{
      font-size: var(--font-size-0);
      color: var(--violet-6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }`,
  },

  render: (
    {
      title = string("Real-World Applications"),
      showStats = boolean(true),
    },
    _api,
    classes,
  ) => (
    <section class={classes!.showcase} id="real-world">
      <h2 class={classes!.showcaseTitle}>{title}</h2>
      <p class={classes!.showcaseSubtitle}>
        Complete applications built with ui-lib, showcasing production-ready patterns and best practices.
      </p>

      {showStats && (
        <div class={classes!.statsGrid}>
          <div class={classes!.statCard}>
            <div class={classes!.statValue}>4</div>
            <div class={classes!.statLabel}>Complete Apps</div>
          </div>
          <div class={classes!.statCard}>
            <div class={classes!.statValue}>0KB</div>
            <div class={classes!.statLabel}>Client JS</div>
          </div>
          <div class={classes!.statCard}>
            <div class={classes!.statValue}>100%</div>
            <div class={classes!.statLabel}>SSR</div>
          </div>
          <div class={classes!.statCard}>
            <div class={classes!.statValue}>3-Tier</div>
            <div class={classes!.statLabel}>Reactivity</div>
          </div>
        </div>
      )}

      <div class={classes!.examplesGrid}>
        <div class={classes!.exampleCard}>
          <div class={classes!.exampleHeader}>
            <div class={classes!.exampleTitle}>🛍️ E-commerce Store</div>
            <div class={classes!.exampleDescription}>
              Product catalog with cart, checkout, and inventory management
            </div>
          </div>
          <div class={classes!.exampleContent}>
            <ul class={classes!.featuresList}>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>✨</span>
                Function-style props for product configuration
              </li>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>🛒</span>
                Pub/sub cart state across components
              </li>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>🔄</span>
                Unified API for product CRUD operations
              </li>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>🎨</span>
                CSS-only styling with responsive design
              </li>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>📱</span>
                Mobile-first responsive layout
              </li>
            </ul>
            <button 
              class={classes!.demoButton}
              onclick="document.getElementById('ecommerce-demo').scrollIntoView({behavior: 'smooth'})"
            >
              View E-commerce Demo
            </button>
          </div>
        </div>

        <div class={classes!.exampleCard}>
          <div class={classes!.exampleHeader}>
            <div class={classes!.exampleTitle}>📊 Analytics Dashboard</div>
            <div class={classes!.exampleDescription">
              Real-time data visualization with interactive controls
            </div>
          </div>
          <div class={classes!.exampleContent}>
            <ul class={classes!.featuresList}>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>📈</span>
                Live data updates via pub/sub system
              </li>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>🎯</span>
                Interactive filters and controls
              </li>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>🌓</span>
                Theme switching with CSS properties
              </li>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>📱</span>
                Responsive grid system
              </li>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>⚡</span>
                Real-time performance monitoring
              </li>
            </ul>
            <button 
              class={classes!.demoButton}
              onclick="document.getElementById('dashboard-demo').scrollIntoView({behavior: 'smooth'})"
            >
              View Dashboard Demo
            </button>
          </div>
        </div>

        <div class={classes!.exampleCard}>
          <div class={classes!.exampleHeader}>
            <div class={classes!.exampleTitle}>📝 Form Wizard</div>
            <div class={classes!.exampleDescription">
              Multi-step form with validation and progress tracking
            </div>
          </div>
          <div class={classes!.exampleContent}>
            <ul class={classes!.featuresList}>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>📋</span>
                Multi-step form progression
              </li>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>✅</span>
                Client and server-side validation
              </li>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>💾</span>
                Auto-save draft functionality
              </li>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>🔄</span>
                Progress state management
              </li>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>🎨</span>
                Dynamic styling based on form state
              </li>
            </ul>
            <button 
              class={classes!.demoButton}
              onclick="document.getElementById('form-wizard-demo').scrollIntoView({behavior: 'smooth'})"
            >
              View Form Wizard Demo
            </button>
          </div>
        </div>

        <div class={classes!.exampleCard}>
          <div class={classes!.exampleHeader}>
            <div class={classes!.exampleTitle}>📱 Social Feed</div>
            <div class={classes!.exampleDescription}>
              Infinite scroll feed with likes, comments, and real-time updates
            </div>
          </div>
          <div class={classes!.exampleContent}>
            <ul class={classes!.featuresList}>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>🔄</span>
                Infinite scroll with HTMX
              </li>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>💬</span>
                Real-time comments via DOM events
              </li>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon}>❤️</span>
                Like/unlike with optimistic updates
              </li>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon">📨</span>
                Notification system integration
              </li>
              <li class={classes!.featureItem}>
                <span class={classes!.featureIcon">🎭</span>
                User interaction animations
              </li>
            </ul>
            <button 
              class={classes!.demoButton}
              onclick="document.getElementById('social-feed-demo').scrollIntoView({behavior: 'smooth'})"
            >
              View Social Feed Demo  
            </button>
          </div>
        </div>
      </div>

      <div style="margin-top: var(--size-8); padding: var(--size-6); background: white; border-radius: var(--radius-4); border: 1px solid var(--gray-3); text-center;">
        <h3 style="color: var(--violet-7); margin-bottom: var(--size-3);">
          🏗️ Production-Ready Architecture
        </h3>
        <p style="color: var(--gray-7); margin-bottom: var(--size-4); font-size: var(--font-size-1);">
          Each example demonstrates real-world patterns: error handling, loading states, 
          accessibility, responsive design, and performance optimization.
        </p>
        <div style="display: flex; justify-content: center; gap: var(--size-4); flex-wrap: wrap;">
          <div style="color: var(--green-6); font-size: var(--font-size-0);">✅ Accessible</div>
          <div style="color: var(--blue-6); font-size: var(--font-size-0);">✅ Responsive</div>
          <div style="color: var(--purple-6); font-size: var(--font-size-0);">✅ Fast</div>
          <div style="color: var(--orange-6); font-size: var(--font-size-0);">✅ Scalable</div>
          <div style="color: var(--cyan-6); font-size: var(--font-size-0);">✅ Maintainable</div>
        </div>
      </div>
    </section>
  ),
});

/**
 * 🛍️ E-commerce Demo - Complete shopping experience
 */
defineComponent("ecommerce-demo", {
  api: {
    // Product API endpoints
    getProducts: get("/demo/products", async (req) => {
      const url = new URL(req.url);
      const category = url.searchParams.get("category");
      const search = url.searchParams.get("search");
      
      // Mock product data
      const products = [
        { id: "1", name: "Smartphone Pro", price: 899, category: "electronics", image: "📱", rating: 4.5, stock: 12 },
        { id: "2", name: "Laptop Ultra", price: 1299, category: "electronics", image: "💻", rating: 4.8, stock: 8 },
        { id: "3", name: "Wireless Headphones", price: 199, category: "electronics", image: "🎧", rating: 4.3, stock: 25 },
        { id: "4", name: "Smart Watch", price: 299, category: "electronics", image: "⌚", rating: 4.1, stock: 15 },
        { id: "5", name: "Coffee Maker", price: 129, category: "home", image: "☕", rating: 4.6, stock: 20 },
        { id: "6", name: "Desk Chair", price: 249, category: "home", image: "🪑", rating: 4.4, stock: 10 },
      ];

      let filtered = products;
      if (category && category !== "all") {
        filtered = filtered.filter(p => p.category === category);
      }
      if (search) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      return new Response(renderComponent("product-grid", { products: JSON.stringify(filtered) }), {
        headers: { "Content-Type": "text/html" }
      });
    }),

    addToCart: post("/demo/cart", async (req) => {
      const data = await req.json();
      // In a real app, this would update the cart in database/session
      return Response.json({ success: true, item: data });
    }),
  },

  styles: {
    store: `{
      background: white;
      border: 2px solid var(--violet-3);
      border-radius: var(--radius-4);
      overflow: hidden;
      margin: var(--size-4) 0;
    }`,

    storeHeader: `{
      background: linear-gradient(135deg, var(--violet-6) 0%, var(--purple-6) 100%);
      color: white;
      padding: var(--size-4);
      text-align: center;
    }`,

    storeTitle: `{
      font-size: var(--font-size-3);
      font-weight: var(--font-weight-7);
      margin-bottom: var(--size-2);
    }`,

    storeSubtitle: `{
      font-size: var(--font-size-1);
      opacity: 0.9);
    }`,

    storeContent: `{
      padding: var(--size-4);
    }`,

    searchFilters: `{
      display: flex;
      gap: var(--size-3);
      margin-bottom: var(--size-4);
      flex-wrap: wrap;
      align-items: center;
    }`,

    searchInput: `{
      flex: 1;
      min-width: 200px;
      padding: var(--size-2);
      border: 1px solid var(--gray-4);
      border-radius: var(--radius-2);
      font-size: var(--font-size-1);
    }`,

    categorySelect: `{
      padding: var(--size-2);
      border: 1px solid var(--gray-4);
      border-radius: var(--radius-2);
      background: white;
      font-size: var(--font-size-1);
      cursor: pointer;
    }`,

    searchButton: `{
      background: var(--violet-6);
      color: white;
      border: none;
      padding: var(--size-2) var(--size-4);
      border-radius: var(--radius-2);
      cursor: pointer;
      font-size: var(--font-size-1);
      font-weight: var(--font-weight-5);
    }`,

    cartSummary: `{
      position: sticky;
      top: var(--size-4);
      background: var(--violet-1);
      border: 1px solid var(--violet-3);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      margin-bottom: var(--size-4);
    }`,

    cartTitle: `{
      font-size: var(--font-size-2);
      font-weight: var(--font-weight-6);
      color: var(--violet-7);
      margin-bottom: var(--size-3);
    }`,

    cartItems: `{
      font-family: var(--font-mono);
      font-size: var(--font-size-1);
      color: var(--violet-8);
    }`,
  },

  render: (
    {
      title = string("ui-lib Store"),
      showCart = boolean(true),
    },
    api,
    classes,
  ) => (
    <div class={classes!.store} id="ecommerce-demo">
      <div class={classes!.storeHeader}>
        <h3 class={classes!.storeTitle}>{title}</h3>
        <div class={classes!.storeSubtitle}>Complete e-commerce built with ui-lib</div>
      </div>

      <div class={classes!.storeContent}>
        {showCart && (
          <div class={classes!.cartSummary}>
            <h4 class={classes!.cartTitle}>🛒 Shopping Cart</h4>
            <div class={classes!.cartItems} id="cart-summary">
              Cart: 0 items ($0.00)
            </div>
          </div>
        )}

        <div class={classes!.searchFilters}>
          <input 
            type="text" 
            placeholder="Search products..." 
            class={classes!.searchInput}
            name="search"
          />
          
          <select class={classes!.categorySelect} name="category">
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="home">Home & Garden</option>
            <option value="clothing">Clothing</option>
          </select>

          <button 
            class={classes!.searchButton}
            {...api.getProducts()}
            hx-include="[name='search'], [name='category']"
            hx-target="#products-grid"
          >
            Search
          </button>
        </div>

        <div id="products-grid">
          <product-grid products='[
            {"id": "1", "name": "Smartphone Pro", "price": 899, "image": "📱", "rating": 4.5, "stock": 12},
            {"id": "2", "name": "Laptop Ultra", "price": 1299, "image": "💻", "rating": 4.8, "stock": 8},
            {"id": "3", "name": "Wireless Headphones", "price": 199, "image": "🎧", "rating": 4.3, "stock": 25}
          ]' />
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var cartSummary = document.getElementById('cart-summary');
            if (!cartSummary || !window.funcwcState) return;
            
            window.funcwcState.subscribe('cart', function(cartData) {
              var count = cartData.count || 0;
              var total = cartData.total || 0;
              cartSummary.textContent = 'Cart: ' + count + ' items ($' + total.toFixed(2) + ')';
              
              if (count > 0) {
                cartSummary.parentElement.style.background = 'var(--green-1)';
                cartSummary.parentElement.style.borderColor = 'var(--green-3)';
              } else {
                cartSummary.parentElement.style.background = 'var(--violet-1)';
                cartSummary.parentElement.style.borderColor = 'var(--violet-3)';
              }
            }, cartSummary);
          })();
        `
      }}>
      </script>
    </div>
  ),
});

/**
 * 📦 Product Grid - Displays products with add-to-cart functionality
 */
defineComponent("product-grid", {
  styles: {
    grid: `{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--size-4);
      margin-top: var(--size-4);
    }`,

    productCard: `{
      background: white;
      border: 1px solid var(--gray-3);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }`,

    productImage: `{
      font-size: var(--font-size-6);
      text-align: center;
      margin-bottom: var(--size-3);
    }`,

    productName: `{
      font-size: var(--font-size-2);
      font-weight: var(--font-weight-6);
      color: var(--gray-8);
      margin-bottom: var(--size-2);
    }`,

    productPrice: `{
      font-size: var(--font-size-3);
      font-weight: var(--font-weight-7);
      color: var(--violet-6);
      margin-bottom: var(--size-3);
    }`,

    productMeta: `{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--size-3);
      font-size: var(--font-size-0);
      color: var(--gray-6);
    }`,

    addToCartButton: `{
      background: var(--violet-6);
      color: white;
      border: none;
      padding: var(--size-2) var(--size-3);
      border-radius: var(--radius-2);
      cursor: pointer;
      font-size: var(--font-size-1);
      font-weight: var(--font-weight-5);
      width: 100%;
      transition: all 0.3s ease;
    }`,

    outOfStock: `{
      background: var(--gray-4);
      cursor: not-allowed;
    }`,

    rating: `{
      color: var(--orange-5);
    }`,

    stock: `{
      color: var(--green-6);
    }`,
  },

  render: (
    {
      products = array([]),
    },
    _api,
    classes,
  ) => {
    const productList = Array.isArray(products) ? products : [];

    if (productList.length === 0) {
      return (
        <div style="text-align: center; padding: var(--size-6); color: var(--gray-6);">
          <div style="font-size: var(--font-size-4); margin-bottom: var(--size-3);">🔍</div>
          <div>No products found. Try adjusting your search or filters.</div>
        </div>
      );
    }

    return (
      <div class={classes!.grid}>
        {productList.map((product: any) => (
          <div class={classes!.productCard}>
            <div class={classes!.productImage}>{product.image}</div>
            <h4 class={classes!.productName}>{product.name}</h4>
            <div class={classes!.productPrice}>${product.price}</div>
            
            <div class={classes!.productMeta}>
              <span class={classes!.rating}>
                ⭐ {product.rating} ({Math.floor(Math.random() * 100) + 50} reviews)
              </span>
              <span class={`${classes!.stock} ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <button 
              class={`${classes!.addToCartButton} ${product.stock === 0 ? classes!.outOfStock : ''}`}
              onclick={createCartAction("add", JSON.stringify({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image
              }))}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? '🛒 Add to Cart' : '❌ Out of Stock'}
            </button>
          </div>
        ))}
      </div>
    );
  },
});

/**
 * 📊 Analytics Dashboard Demo
 */
defineComponent("analytics-dashboard", {
  styles: {
    dashboard: `{
      background: white;
      border: 2px solid var(--blue-3);
      border-radius: var(--radius-4);
      margin: var(--size-4) 0;
      overflow: hidden;
    }`,

    dashboardHeader: `{
      background: linear-gradient(135deg, var(--blue-6) 0%, var(--cyan-6) 100%);
      color: white;
      padding: var(--size-4);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--size-3);
    }`,

    dashboardTitle: `{
      font-size: var(--font-size-3);
      font-weight: var(--font-weight-7);
    }`,

    dashboardControls: `{
      display: flex;
      gap: var(--size-2);
      align-items: center;
    }`,

    controlButton: `{
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: var(--size-2) var(--size-3);
      border-radius: var(--radius-2);
      cursor: pointer;
      font-size: var(--font-size-0);
    }`,

    dashboardContent: `{
      padding: var(--size-4);
    }`,

    metricsGrid: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--size-4);
      margin-bottom: var(--size-6);
    }`,

    metricCard: `{
      background: var(--blue-0);
      border: 1px solid var(--blue-3);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      text-align: center;
      transition: all 0.3s ease;
    }`,

    metricValue: `{
      font-size: var(--font-size-4);
      font-weight: var(--font-weight-7);
      color: var(--blue-7);
      margin-bottom: var(--size-2);
    }`,

    metricLabel: `{
      font-size: var(--font-size-1);
      color: var(--blue-6);
      margin-bottom: var(--size-1);
    }`,

    metricChange: `{
      font-size: var(--font-size-0);
      font-weight: var(--font-weight-5);
    }`,

    positive: `{ color: var(--green-6); }`,
    negative: `{ color: var(--red-6); }`,

    chartArea: `{
      background: var(--gray-1);
      border: 1px solid var(--gray-3);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      text-align: center;
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--gray-6);
    }`,
  },

  render: (
    {
      title = string("Analytics Dashboard"),
    },
    _api,
    classes,
  ) => (
    <div class={classes!.dashboard} id="dashboard-demo">
      <div class={classes!.dashboardHeader}>
        <h3 class={classes!.dashboardTitle}>{title}</h3>
        
        <div class={classes!.dashboardControls}>
          <button 
            class={classes!.controlButton}
            onclick={setCSSProperty("dashboard-theme", "light")}
          >
            ☀️ Light
          </button>
          <button 
            class={classes!.controlButton}
            onclick={setCSSProperty("dashboard-theme", "dark")}
          >
            🌙 Dark
          </button>
          <button 
            class={classes!.controlButton}
            onclick={publishState("dashboard-data", JSON.stringify({
              timestamp: Date.now(),
              users: Math.floor(Math.random() * 1000) + 500,
              revenue: Math.floor(Math.random() * 50000) + 25000,
              orders: Math.floor(Math.random() * 100) + 50
            }))}
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>

      <div class={classes!.dashboardContent}>
        <div class={classes!.metricsGrid}>
          <div class={classes!.metricCard} id="users-metric">
            <div class={classes!.metricValue}>1,234</div>
            <div class={classes!.metricLabel}>Active Users</div>
            <div class={`${classes!.metricChange} ${classes!.positive}`}>+12.5% ↗</div>
          </div>

          <div class={classes!.metricCard} id="revenue-metric">
            <div class={classes!.metricValue}>$45,678</div>
            <div class={classes!.metricLabel}>Revenue</div>
            <div class={`${classes!.metricChange} ${classes!.positive}`}>+8.2% ↗</div>
          </div>

          <div class={classes!.metricCard} id="orders-metric">
            <div class={classes!.metricValue}>89</div>
            <div class={classes!.metricLabel}>Orders</div>
            <div class={`${classes!.metricChange} ${classes!.negative}`}>-3.1% ↘</div>
          </div>

          <div class={classes!.metricCard} id="conversion-metric">
            <div class={classes!.metricValue}>3.4%</div>
            <div class={classes!.metricLabel}>Conversion Rate</div>
            <div class={`${classes!.metricChange} ${classes!.positive}`}>+0.7% ↗</div>
          </div>
        </div>

        <div class={classes!.chartArea}>
          📈 Interactive charts would render here<br/>
          <small>(Click refresh data to see metrics update via pub/sub)</small>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var usersMetric = document.getElementById('users-metric');
            var revenueMetric = document.getElementById('revenue-metric');
            var ordersMetric = document.getElementById('orders-metric');
            
            if (!window.funcwcState || !usersMetric) return;
            
            window.funcwcState.subscribe('dashboard-data', function(data) {
              if (usersMetric && data.users) {
                usersMetric.querySelector('.${classes!.metricValue.replace(/[{}]/g, '')}').textContent = data.users.toLocaleString();
              }
              if (revenueMetric && data.revenue) {
                revenueMetric.querySelector('.${classes!.metricValue.replace(/[{}]/g, '')}').textContent = '$' + data.revenue.toLocaleString();
              }
              if (ordersMetric && data.orders) {
                ordersMetric.querySelector('.${classes!.metricValue.replace(/[{}]/g, '')}').textContent = data.orders.toString();
              }
              
              // Visual feedback
              [usersMetric, revenueMetric, ordersMetric].forEach(function(el) {
                if (el) {
                  el.style.transform = 'scale(1.05)';
                  el.style.transition = 'all 0.3s ease';
                  setTimeout(function() {
                    el.style.transform = 'scale(1)';
                  }, 300);
                }
              });
            });
          })();
        `
      }}>
      </script>
    </div>
  ),
});