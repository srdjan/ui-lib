# Examples

Real-world examples demonstrating ui-lib's capabilities.

## Component Composition Pattern

**Important:** ui-lib enforces a composition-only pattern for application
components. Applications can use `defineComponent()` to create custom
components, but **cannot add custom styles**. Instead, apps must compose
pre-styled library components using their variant APIs.

### Why This Constraint?

- **UI Consistency**: All apps using ui-lib have a uniform look and feel
- **Reduced Code**: 94% reduction in app-specific styling code
- **Faster Development**: Compose existing components instead of writing CSS
- **Shared Testing**: Library components are thoroughly tested once
- **Easier Maintenance**: Style updates happen at the library level

### App Component Pattern

```tsx
import { defineComponent, h } from "ui-lib";
// Import pre-styled components
import { Badge, Button, Card } from "ui-lib/components";

// ✅ CORRECT: Compose library components with variants
defineComponent("todo-item", {
  api: {
    toggle: ["POST", "/api/todos/:id/toggle", handler],
    delete: ["DELETE", "/api/todos/:id", handler],
  },
  render: ({ todo }, api) => (
    <div>
      {/* Use library Item component with variants */}
      <item
        title={todo.text}
        completed={todo.completed}
        priority={todo.priority}
        badges={[{
          text: todo.priority,
          variant: todo.priority === "high" ? "danger" : "success",
        }]}
        actions={[
          { text: "Delete", variant: "danger", ...api.delete(todo.id) },
        ]}
      />
    </div>
  ),
});

// ❌ WRONG: Custom styles are not allowed
defineComponent("custom-styled", {
  styles: { color: "red" }, // ERROR: Property 'styles' not allowed
  render: () => <div>...</div>,
});
```

### Available Library Components

Applications can compose these pre-styled components:

- **Buttons**: Button, ButtonGroup (variants: primary, secondary, outline,
  ghost)
- **Forms**: Input, Select, Textarea, Form (with validation styling)
- **Layouts**: Card, Container, Grid, Stack, Flex
- **Feedback**: Alert, Badge, Toast, Progress (variants: success, warning,
  error, info)
- **Data Display**: Item, List, Stat, AnimatedCounter
- **Media**: Image, Video, Audio
- **Overlays**: Modal, Drawer, Popover, Tooltip

See the [Component API](component-api.md) for full variant lists and props.

## Running the Todo App Example

The Todo demo lives under `examples/todo-app` and demonstrates SSR-first,
JSX-only components with colocated API, styles, and reactivity.

```bash
deno task serve
# Opens http://localhost:8080 and serves examples/todo-app/server.tsx
```

Key files:

```
examples/todo-app/
├── server.tsx     # HTTP server for the demo
├── api/           # Handlers, types, repository
└── components/    # SSR components (colocated API/styles/reactivity)
```

## Basic Examples

### Hello World Component

The simplest possible component:

```tsx
import { defineComponent, h } from "ui-lib";

const HelloWorld = defineComponent({
  name: "hello-world",
  render: () => <h1>Hello, World!</h1>,
});

// Usage
const html = <HelloWorld />;
console.log(html); // <h1>Hello, World!</h1>
```

### Component with Props

Using typed props with defaults:

```tsx
import { defineComponent, h, number, string } from "ui-lib";

const Greeting = defineComponent({
  name: "greeting",
  render: (
    name = string("Guest"),
    age = number(0),
  ) => (
    <div class="greeting">
      <h2>Hello, {name}!</h2>
      {age > 0 && <p>You are {age} years old.</p>}
    </div>
  ),
});

// Usage
<Greeting name="Alice" age={25} />;
```

### Styled Component

Component with CSS-in-TypeScript styling:

```tsx
import { css, defineComponent, h } from "ui-lib";

const StyledBox = defineComponent({
  name: "styled-box",
  styles: css({
    padding: "2rem",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
  }),
  render: ({ content }) => (
    <div class="styled-box">
      {content}
    </div>
  ),
});
```

## Form Examples

### Login Form

Complete login form with validation:

```tsx
import { defineComponent, h } from "ui-lib";
import { Alert, Button, Card, Input } from "ui-lib/components";

const LoginForm = defineComponent({
  name: "login-form",
  render: ({ error }) => (
    <Card title="Login">
      {error && <Alert type="error">{error}</Alert>}

      <form method="POST" action="/api/login">
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="your@email.com"
          required
        />

        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          required
        />

        <div class="form-footer">
          <Button
            type="submit"
            variant="primary"
            fullWidth
          >
            Sign In
          </Button>
        </div>
      </form>
    </Card>
  ),
});
```

### Multi-Step Form

Form with multiple steps and progress indicator:

```tsx
import { defineComponent, h } from "ui-lib";
import { Button, Input, Select, Stepper } from "ui-lib/components";

const MultiStepForm = defineComponent({
  name: "multi-step-form",
  render: ({ currentStep = 1 }) => (
    <>
      <Stepper
        steps={[
          { label: "Personal Info", completed: currentStep > 1 },
          { label: "Contact Details", completed: currentStep > 2 },
          { label: "Preferences", completed: currentStep > 3 },
        ]}
        current={currentStep - 1}
      />

      <div class="form-content">
        {currentStep === 1 && (
          <div class="step-1">
            <Input label="First Name" name="firstName" />
            <Input label="Last Name" name="lastName" />
            <Select
              label="Gender"
              name="gender"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div class="step-2">
            <Input label="Email" type="email" name="email" />
            <Input label="Phone" type="tel" name="phone" />
            <Input label="Address" name="address" />
          </div>
        )}

        {currentStep === 3 && (
          <div class="step-3">
            {/* Preferences content */}
          </div>
        )}
      </div>

      <div class="form-actions">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onclick={`setStep(${currentStep - 1})`}
          >
            Previous
          </Button>
        )}

        {currentStep < 3
          ? (
            <Button
              variant="primary"
              onclick={`setStep(${currentStep + 1})`}
            >
              Next
            </Button>
          )
          : (
            <Button variant="primary">
              Submit
            </Button>
          )}
      </div>
    </>
  ),
});
```

## Data Display Examples

### Data Table

Interactive data table with sorting and filtering:

```tsx
import { defineComponent, h } from "ui-lib";
import { Table, Input, Select } from "ui-lib/components";

const UserTable = defineComponent({
  name: "user-table",
  render: ({ users, filter = "", sortBy = "name" }) => (
    <div class="table-container">
      <div class="table-controls">
        ${Input({
          type: "search",
          placeholder: "Search users...",
          value: filter,
          onchange: "filterUsers(this.value)"
        })}
        
        ${Select({
          label: "Sort by",
          value: sortBy,
          options: [
            { value: "name", label: "Name" },
            { value: "email", label: "Email" },
            { value: "role", label: "Role" }
          ],
          onchange: "sortUsers(this.value)"
        })}
      </div>
      
      ${Table({
        columns: [
          { key: "name", label: "Name", sortable: true },
          { key: "email", label: "Email", sortable: true },
          { key: "role", label: "Role" },
          { key: "status", label: "Status" }
        ],
        data: users.filter(u => 
          !filter || u.name.includes(filter) || u.email.includes(filter)
        ).sort((a, b) => 
          a[sortBy].localeCompare(b[sortBy])
        ),
        striped: true,
        hover: true
      })}
    </div>
  `
});
```

### Dashboard Cards

Analytics dashboard with metric cards:

```typescript
import { defineComponent } from "ui-lib";
import { Badge, Card, Progress } from "ui-lib/components";

const MetricCard = defineComponent({
  name: "metric-card",
  render: ({ title, value, change, trend }) =>
    Card({
      children: `
      <div class="metric">
        <h3>${title}</h3>
        <div class="value">${value}</div>
        <div class="change ${trend}">
          ${
        Badge({
          variant: trend === "up" ? "success" : "danger",
          children: `${change}%`,
        })
      }
          <span>${trend === "up" ? "↑" : "↓"}</span>
        </div>
      </div>
    `,
    }),
});

const Dashboard = defineComponent({
  name: "dashboard",
  render: ({ metrics }) => `
    <div class="dashboard-grid">
      ${metrics.map((metric) => MetricCard(metric)).join("")}
    </div>
  `,
});
```

## Reactive Examples

### Theme Switcher

CSS property reactivity for instant theme changes:

```typescript
import { defineComponent } from "ui-lib";
import { Button } from "ui-lib/components";

const ThemeSwitcher = defineComponent({
  name: "theme-switcher",
  reactive: {
    css: {
      "--bg-color": "data-theme-bg",
      "--text-color": "data-theme-text",
      "--accent-color": "data-theme-accent",
    },
  },
  styles: {
    backgroundColor: "var(--bg-color)",
    color: "var(--text-color)",
    padding: "2rem",
    transition: "all 0.3s ease",
  },
  render: () => `
    <div class="theme-switcher" 
         data-theme-bg="#ffffff" 
         data-theme-text="#000000"
         data-theme-accent="#007bff">
      <h2>Theme Demo</h2>
      <p>Click buttons to change theme instantly</p>
      
      ${
    Button({
      children: "Light Theme",
      onclick: `
          this.closest('.theme-switcher').dataset.themeBg = '#ffffff';
          this.closest('.theme-switcher').dataset.themeText = '#000000';
        `,
    })
  }
      
      ${
    Button({
      children: "Dark Theme",
      onclick: `
          this.closest('.theme-switcher').dataset.themeBg = '#1a1a1a';
          this.closest('.theme-switcher').dataset.themeText = '#ffffff';
        `,
    })
  }
    </div>
  `,
});
```

### Shopping Cart

State management with pub/sub:

```typescript
import { defineComponent } from "ui-lib";
import { Badge, Button } from "ui-lib/components";

const CartButton = defineComponent({
  name: "cart-button",
  reactive: {
    state: {
      "cart-count": "data-count",
    },
  },
  render: () => (
    <>
      <button class="cart-button" data-count="0">
        🛒 Cart
        <Badge variant="danger">
          <span class="cart-count">0</span>
        </Badge>
      </button>

      <script>
        {`
          subscribeToState('cart-count', (count) => {
            document.querySelector('.cart-count').textContent = count;
          });
        `}
      </script>
    </>
  ),
});

const ProductCard = defineComponent({
  name: "product-card",
  render: ({ name, price }) =>
    Card({
      title: name,
      children: `
      <p class="price">$${price}</p>
      ${
        Button({
          children: "Add to Cart",
          onclick: `
          const count = getState('cart-count') || 0;
          publishState('cart-count', count + 1);
        `,
        })
      }
    `,
    }),
});
```

### Live Notifications

DOM event communication:

```typescript
import { defineComponent } from "ui-lib";
import { Toast } from "ui-lib/components";

const NotificationCenter = defineComponent({
  name: "notification-center",
  reactive: {
    on: {
      "app:notify": "showNotification",
      "app:error": "showError",
      "app:success": "showSuccess",
    },
    mount: `
      this.showNotification = (e) => {
        const toast = ${
      Toast({
        message: "e.detail.message",
        type: "e.detail.type",
      })
    };
        this.appendChild(toast);
      };
    `,
  },
  render: () => `
    <div class="notification-center"></div>
  `,
});

// Trigger notifications from anywhere
const TriggerButton = defineComponent({
  render: () =>
    Button({
      children: "Show Notification",
      onclick: `
      dispatchEvent('app:notify', {
        message: 'Hello from ui-lib!',
        type: 'success'
      });
    `,
    }),
});
```

## Layout Examples

### Admin Dashboard Layout

Complete admin interface:

```typescript
import { AppLayout, Navbar, Sidebar } from "ui-lib/layout";
import { defineComponent } from "ui-lib";

const AdminDashboard = defineComponent({
  name: "admin-dashboard",
  render: ({ content, user }) =>
    AppLayout({
      navbar: Navbar({
        brand: {
          name: "Admin Panel",
          logo: "🎛️",
        },
        items: [
          { label: "Dashboard", href: "/admin" },
          { label: "Users", href: "/admin/users" },
          { label: "Settings", href: "/admin/settings" },
        ],
        actions: `
        <span>Welcome, ${user.name}</span>
        ${
          Button({
            variant: "ghost",
            size: "sm",
            children: "Logout",
          })
        }
      `,
      }),

      sidebar: Sidebar({
        items: [
          {
            label: "Analytics",
            icon: "📊",
            items: [
              { label: "Overview", href: "/analytics" },
              { label: "Reports", href: "/analytics/reports" },
            ],
          },
          {
            label: "Content",
            icon: "📝",
            items: [
              { label: "Pages", href: "/content/pages" },
              { label: "Posts", href: "/content/posts" },
            ],
          },
        ],
        collapsible: true,
      }),

      content: content,

      footer: `
      <p>&copy; 2024 Your Company. All rights reserved.</p>
    `,
    }),
});
```

## Integration Examples

### HTMX Integration

Dynamic content loading with HTMX:

```typescript
import { defineComponent } from "ui-lib";

const HTMXExample = defineComponent({
  name: "htmx-example",
  api: {
    load: ["GET", "/api/content", loadHandler],
  },
  render: (props, api) => `
    <div class="htmx-demo">
      <button onAction={{ api: "load", attributes: { "hx-target": "#content", "hx-indicator": "#spinner" } }}>
        Load Content
      </button>
      <div id="spinner" class="htmx-indicator" hidden></div>
      <div id="content"><!-- Content loads here --></div>
    </div>
  `,
});
```

### API Integration

Component with API endpoint definition:

```typescript
import { defineComponent, post } from "ui-lib";

const SearchComponent = defineComponent({
  name: "search",
  api: {
    search: post("/api/search", async (req) => {
      const { query } = await req.json();
      const results = await searchDatabase(query);
      return Response.json(results);
    }),
  },
  render: () => `
    <form hx-post="/api/search" hx-target="#results">
      ${
    Input({
      name: "query",
      placeholder: "Search...",
    })
  }
      ${
    Button({
      type: "submit",
      children: "Search",
    })
  }
    </form>
    <div id="results"></div>
  `,
});
```

## Performance Examples

### Cached Components

Components with render caching:

```typescript
import { cachedRender, defineComponent } from "ui-lib";

const ExpensiveComponent = defineComponent({
  name: "expensive",
  render: cachedRender(
    ({ data }) => {
      // Expensive computation
      const processed = data.map((item) => complexTransform(item));

      return `
        <div class="results">
          ${processed.map((item) => `<div>${item}</div>`).join("")}
        </div>
      `;
    },
    {
      ttl: 60000, // Cache for 1 minute
      key: (props) => props.data.length, // Cache key
    },
  ),
});
```

### Streaming Response

Large list with streaming:

```typescript
import { defineComponent } from "ui-lib";

const StreamingList = defineComponent({
  name: "streaming-list",
  render: async function* ({ items }) {
    yield `<ul class="streaming-list">`;

    for (const item of items) {
      // Yield each item as it's processed
      yield `<li>${item.name}</li>`;

      // Allow other work to happen
      if (items.indexOf(item) % 100 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    yield `</ul>`;
  },
});
```

## Testing Examples

### Component Testing

```typescript
import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { MyComponent } from "./my-component.ts";

Deno.test("MyComponent renders correctly", () => {
  const result = MyComponent({
    title: "Test",
    content: "Content",
  });

  assertEquals(result.includes("Test"), true);
  assertEquals(result.includes("Content"), true);
});

Deno.test("MyComponent handles missing props", () => {
  const result = MyComponent({});

  assertEquals(result.includes("Default Title"), true);
});
```

### Integration Testing

```typescript
import { serve } from "./server.ts";
import { assertEquals } from "https://deno.land/std/assert/mod.ts";

Deno.test("Server renders homepage", async () => {
  const response = await fetch("http://localhost:8000/");
  const html = await response.text();

  assertEquals(response.status, 200);
  assertEquals(html.includes("<h1>Welcome</h1>"), true);
});
```

## Real-World Application

### E-Commerce Product Page

Complete product page example:

```typescript
import { defineComponent } from "ui-lib";
import { Badge, Button, Card, Gallery, Rating, Tabs } from "ui-lib/components";

const ProductPage = defineComponent({
  name: "product-page",
  render: ({ product }) => `
    <div class="product-page">
      <div class="product-gallery">
        ${
    Gallery({
      images: product.images,
      thumbnails: true,
    })
  }
      </div>
      
      <div class="product-info">
        <h1>${product.name}</h1>
        
        <div class="price-section">
          <span class="price">$${product.price}</span>
          ${
    product.oldPrice
      ? `
            <span class="old-price">$${product.oldPrice}</span>
            ${
        Badge({
          variant: "success",
          children: `${
            Math.round((1 - product.price / product.oldPrice) * 100)
          }% OFF`,
        })
      }
          `
      : ""
  }
        </div>
        
        ${
    Rating({
      value: product.rating,
      reviews: product.reviewCount,
    })
  }
        
        <div class="add-to-cart">
          ${
    Select({
      label: "Size",
      options: product.sizes,
    })
  }
          
          ${
    Input({
      type: "number",
      label: "Quantity",
      value: "1",
      min: "1",
      max: product.stock,
    })
  }
          
          ${
    Button({
      variant: "primary",
      size: "lg",
      fullWidth: true,
      leftIcon: "🛒",
      children: "Add to Cart",
      onclick: "addToCart()",
    })
  }
        </div>
        
        ${
    Tabs({
      items: [
        {
          id: "description",
          label: "Description",
          content: product.description,
        },
        {
          id: "specifications",
          label: "Specifications",
          content: renderSpecs(product.specs),
        },
        {
          id: "reviews",
          label: `Reviews (${product.reviewCount})`,
          content: renderReviews(product.reviews),
        },
      ],
    })
  }
      </div>
    </div>
  `,
});
```

## Running the Examples

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ui-lib.git
cd ui-lib
```

2. Start the example server:

```bash
deno task serve
```

3. Open your browser:

```
http://localhost:8080
```

4. Explore the showcase:

- Component Gallery
- Interactive Demos
- Form Examples
- Layout Patterns
- Performance Tests

## Next Steps

- Explore the [Component API](component-api.md) for detailed reference
- Read about [Architecture](architecture.md) to understand how it works
- Check [Best Practices](best-practices.md) for production tips
- Join our [Community](https://discord.gg/ui-lib) for help and updates
