# ui-lib's Unified API System

The `.api()` method is ui-lib's revolutionary unified API system that eliminates
duplication between server route definitions and client-side HTMX attributes.
Define your API endpoints once, and ui-lib automatically generates type-safe
client functions.

## How It Works

### 1. **Define Server Routes Once**

Instead of writing server routes in one place and HTMX attributes in another,
you define everything together:

```tsx
import {
  boolean,
  defineComponent,
  h,
  patch,
  remove,
  renderComponent,
  string,
} from "../src/index.ts";

defineComponent("todo-item", {
  // ✨ Function-style props - no duplication!
  // 🎨 Unified styles with object form (preferred)
  styles: {
    item: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.75rem",
      border: "1px solid #ddd",
      borderRadius: "4px",
      background: "white",
    },
    checkbox: { marginRight: "0.5rem" },
    deleteBtn: {
      background: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      cursor: "pointer",
    },
  },
  api: {
    // ✨ These are actual server handlers that will process requests
    toggle: patch("/api/todos/:id/toggle", async (req, params) => {
      const form = await req.formData();
      const isDone = form.get("done") === "true";

      // Update database here...
      await updateTodoInDB(params.id, { done: !isDone });

      // Return updated component HTML
      return new Response(
        renderComponent("todo-item", {
          id: params.id,
          text: "Task updated!",
          done: !isDone,
        }),
      );
    }),

    remove: remove("/api/todos/:id", async (req, params) => {
      // Delete from database here...
      await deleteTodoFromDB(params.id);

      return new Response(null, { status: 204 });
    }),
  },

  render: (
    {
      id = string("1"),
      text = string("Todo item"),
      done = boolean(false),
    },
    api,
    classes,
  ) => (
    <div class={classes!.item} data-id={id}>
      <input
        type="checkbox"
        checked={done}
        class={classes!.checkbox}
        {...api.toggle(id)}
      />{" "}
      {/* ← Magic happens here! */}
      <span>{text}</span>
      <button class={classes!.deleteBtn} {...api.remove(id)}>Delete</button>
    </div>
  ),
});
```

### 2. **Auto-Generated Client Functions**

ui-lib analyzes your routes and creates client functions automatically:

| Server Route Definition                   | Generated Function | What It Returns                                                                                            |
| ----------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------- |
| `patch("/api/todos/:id/toggle", handler)` | `api.toggle(id)`   | `{ "hx-patch": "/api/todos/123/toggle", "hx-target": "closest [data-component]", "hx-swap": "outerHTML" }` |
| `remove("/api/todos/:id", handler)`       | `api.remove(id)`   | `{ "hx-delete": "/api/todos/123", "hx-target": "closest [data-component]", "hx-swap": "outerHTML" }`       |
| `post("/api/todos", handler)`             | `api.create()`     | `{ "hx-post": "/api/todos", "hx-target": "closest [data-component]", "hx-swap": "outerHTML" }`             |
| `get("/api/todos/:id", handler)`          | `api.get(id)`      | `{ "hx-get": "/api/todos/123" }`                                                                           |

Defaults and overrides

- For non-GET requests, ui-lib defaults to `hx-swap="outerHTML"` and
  `hx-target="closest [data-component]"`.
- Components render with `data-component="<name>"` on the root element to make
  scoping trivial.
- You can override library-wide defaults via `configure()` and per-call via
  client options:

```ts
import { configure } from "../index.ts";

configure({
  hx: {
    swapDefault: "innerHTML",
    targetDefault: "#content-area",
    headers: { "X-Requested-With": "XMLHttpRequest" },
  },
});

// Per-call overrides
button {...api.create({ title: "Hello" }, { target: "#list", swap: "afterend" })}
```

Callout: When to use selector strings

- Use object-form `styles` for rule bodies (properties only). It’s typeable and
  lintable, and class names are auto‑generated from keys.
- Use selector strings (e.g., `.theme-btn.dark .light-icon { ... }`) when you
  need complex selectors with combinators, pseudo‑classes, or descendant logic
  that a single class rule cannot express.

### 3. **Route-to-Function Mapping Logic**

The function names are intelligently generated based on the key you use in the
`api` object:

```tsx
// API key → Generated function name
api: {
  create: post("/api/items", handler),        → api.create()
  get: get("/api/items/:id", handler),        → api.get(id)
  update: patch("/api/items/:id", handler),   → api.update(id)
  toggle: patch("/api/todos/:id/toggle", handler), → api.toggle(id)
  remove: remove("/api/items/:id", handler),     → api.remove(id)
  follow: post("/api/users/:id/follow", handler), → api.follow(id)
}
```

## Real-World Example: Shopping Cart

```tsx
import {
  defineComponent,
  h,
  number,
  patch,
  post,
  remove,
  renderComponent,
  string,
} from "../src/index.ts";

defineComponent("cart-item", {
  api: {
    // Server handlers - these actually run on the server
    updateQuantity: patch(
      "/api/cart/:productId/quantity",
      async (req, params) => {
        const form = await req.formData();
        const newQuantity = parseInt(form.get("quantity") as string);

        // Update cart in database/session
        await updateCartQuantity(params.productId, newQuantity);

        // Return updated component
        return new Response(
          renderComponent("cart-item", {
            productId: params.productId,
            name: await getProductName(params.productId),
            quantity: newQuantity,
            price: await getProductPrice(params.productId),
          }),
        );
      },
    ),

    remove: remove("/api/cart/:productId", async (req, params) => {
      await removeFromCart(params.productId);
      return new Response("", { status: 200 });
    }),

    favorite: post("/api/cart/:productId/favorite", async (req, params) => {
      await addToFavorites(params.productId);
      return new Response(
        renderComponent("cart-item", {
          productId: params.productId,
          // ... other props with favorite: true
        }),
      );
    }),
  },

  render: ({
    productId = string("1"),
    name = string("Product"),
    quantity = number(1),
    price = number(0),
  }, api) => (
    <div class="cart-item" data-product-id={productId}>
      <h3>{name}</h3>
      <div class="quantity-controls">
        <input
          type="number"
          name="quantity"
          value={quantity}
          {...api.updateQuantity(productId)}
        />{" "}
        {/* ← PATCH /api/cart/:id/quantity */}
      </div>
      <div class="price">${price}</div>
      <div class="actions">
        <button {...api.favorite(productId)}>
          ❤️ Favorite
        </button>
        <button {...api.remove(productId)}>
          🗑️ Remove
        </button>
      </div>
    </div>
  ),
});
```

**Generated HTML with HTMX attributes:**

```html
<div class="cart-item" data-product-id="123">
  <h3>Awesome Product</h3>
  <div class="quantity-controls">
    <input
      type="number"
      name="quantity"
      value="2"
      hx-patch="/api/cart/123/quantity"
      hx-target="closest .cart-item"
      hx-trigger="change"
    />
  </div>
  <div class="actions">
    <button
      hx-post="/api/cart/123/favorite"
      hx-target="closest .cart-item"
    >
      ❤️ Favorite
    </button>
    <button
      hx-delete="/api/cart/123"
      hx-target="closest .cart-item"
      hx-swap="outerHTML"
    >
      🗑️ Remove
    </button>
  </div>
</div>
```

<!-- Comparison with traditional approaches removed to focus on current usage. -->

## Advanced Examples

### Multi-Action Component

```tsx
import {
  boolean,
  defineComponent,
  del,
  h,
  post,
  put,
  renderComponent,
  string,
} from "../src/index.ts";

defineComponent("user-profile", {
  api: {
    follow: post("/api/users/:userId/follow", async (req, params) => {
      await followUser(params.userId);
      return new Response(
        renderComponent("user-profile", {
          userId: params.userId,
          name: await getUserName(params.userId),
          isFollowing: true,
          isBlocked: false,
        }),
      );
    }),

    unfollow: remove("/api/users/:userId/follow", async (req, params) => {
      await unfollowUser(params.userId);
      return new Response(
        renderComponent("user-profile", {
          userId: params.userId,
          name: await getUserName(params.userId),
          isFollowing: false,
          isBlocked: false,
        }),
      );
    }),

    block: post("/api/users/:userId/block", async (req, params) => {
      await blockUser(params.userId);
      await unfollowUser(params.userId); // Auto-unfollow when blocking
      return new Response(
        renderComponent("user-profile", {
          userId: params.userId,
          name: await getUserName(params.userId),
          isFollowing: false,
          isBlocked: true,
        }),
      );
    }),

    update: put("/api/users/:userId/profile", async (req, params) => {
      const form = await req.formData();
      const newName = form.get("name") as string;

      await updateUserProfile(params.userId, { name: newName });
      return new Response(
        renderComponent("user-profile", {
          userId: params.userId,
          name: newName,
          isFollowing: false,
          isBlocked: false,
        }),
      );
    }),
  },

  render: ({
    userId = string("1"),
    name = string("User"),
    isFollowing = boolean(false),
    isBlocked = boolean(false),
  }, api) => (
    <div class="user-profile">
      <h3>{name}</h3>

      {/* Edit profile form */}
      <form {...api.update(userId)}>
        <input name="name" value={name} placeholder="Update name" />
        <button type="submit">Update</button>
      </form>

      {/* Action buttons */}
      <div class="actions">
        {!isBlocked && (
          <button
            {...(
              isFollowing
                ? api.unfollow(userId) // Unfollow (DELETE)
                : api.follow(userId) // Follow (POST)
            )}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}

        <button {...api.block(userId)}>
          {isBlocked ? "Blocked" : "Block User"}
        </button>
      </div>
    </div>
  ),
});
```

### Batch Operations

```tsx
import {
  defineComponent,
  del,
  h,
  number,
  post,
  renderComponent,
  string,
} from "../src/index.ts";

defineComponent("task-list", {
  api: {
    completeBatch: post("/api/tasks/batch/complete", async (req) => {
      const form = await req.formData();
      const taskIds = form.getAll("taskId") as string[];

      await Promise.all(taskIds.map((id) => completeTask(id)));

      return new Response(
        renderComponent("task-list", {
          tasks: JSON.stringify(await getUpdatedTasks()),
          selectedCount: 0,
        }),
      );
    }),

    deleteBatch: remove("/api/tasks/batch", async (req) => {
      const form = await req.formData();
      const taskIds = form.getAll("taskId") as string[];

      await Promise.all(taskIds.map((id) => deleteTask(id)));

      return new Response(
        renderComponent("task-list", {
          tasks: JSON.stringify(await getRemainingTasks()),
          selectedCount: 0,
        }),
      );
    }),
  },

  render: ({
    tasks = string("[]"), // JSON string of tasks
    selectedCount = number(0),
  }, api) => {
    const taskList = JSON.parse(tasks);

    return (
      <div class="task-list">
        <div
          class="batch-actions"
          style={selectedCount > 0 ? "" : "display: none"}
        >
          <form {...api.completeBatch()}>
            {taskList.filter((t) => t.selected).map((task) => (
              <input type="hidden" name="taskId" value={task.id} />
            ))}
            <button type="submit">Complete Selected ({selectedCount})</button>
          </form>

          <form {...api.deleteBatch()}>
            {taskList.filter((t) => t.selected).map((task) => (
              <input type="hidden" name="taskId" value={task.id} />
            ))}
            <button type="submit">Delete Selected ({selectedCount})</button>
          </form>
        </div>

        <div class="tasks">
          {taskList.map((task) => (
            <div class="task">
              <input
                type="checkbox"
                onchange={`/* update selectedCount logic */`}
              />
              <span>{task.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
});
```

## Implementation Details

### Route Registration

When you define an `api` object, ui-lib automatically:

1. **Registers server routes** with the internal router
2. **Generates client functions** based on HTTP method and path
3. **Injects HTMX attributes** with proper targeting and swapping

```tsx
// This happens automatically behind the scenes:
appRouter.register("PATCH", "/api/todos/:id/toggle", yourHandler);
appRouter.register("DELETE", "/api/todos/:id", yourHandler);
```

### HTMX Attribute Generation

Generated functions return objects with HTMX attributes:

```tsx
// api.toggle("123") returns:
{
  "hx-patch": "/api/todos/123/toggle",
  "hx-target": "closest .todo",
  "hx-swap": "outerHTML",
  "hx-trigger": "change" // For inputs
}

// api.delete("123") returns:
{
  "hx-delete": "/api/todos/123", 
  "hx-target": "closest .todo",
  "hx-swap": "outerHTML"
}
```

### Smart Targeting

ui-lib uses intelligent defaults for HTMX targeting:

- **`closest .component-class`** - Updates the entire component
- **`this`** - Updates just the triggering element (for inputs)
- **Custom targeting** can be specified via additional configuration

## Benefits

1. **🚫 No Duplication** - Write routes once, get client functions free
2. **🔧 Type Safety** - Generated functions are fully typed
3. **🔄 Stay in Sync** - Server routes and client attributes can't get out of
   sync
4. **⚡ Productivity** - No manual HTMX attribute writing
5. **🛡️ Fewer Bugs** - No typos in URLs or forgotten attribute updates
6. **📖 Single Source of Truth** - All API logic lives in one place
7. **🎯 Smart Defaults** - Intelligent HTMX targeting and swapping
8. **🔀 Parameter Handling** - URL parameters automatically become function
   arguments

## Best Practices

### 1. **Return Updated Components**

Always return the updated component HTML from your API handlers:

```tsx
"PATCH /api/items/:id": async (req, params) => {
  // Update data
  await updateItem(params.id, newData);
  
  // Return updated component
  return new Response(
    renderComponent("my-item", { 
      id: params.id, 
      ...updatedData 
    })
  );
}
```

### 2. **Use Semantic HTTP Methods**

Choose HTTP methods that match your intent:

```tsx
api: {
  get: get("/api/items/:id", () => { /* fetch */ }),
  create: post("/api/items", () => { /* create */ }),
  replace: put("/api/items/:id", () => { /* replace */ }),
  update: patch("/api/items/:id", () => { /* update */ }),
  remove: remove("/api/items/:id", () => { /* remove */ })
}
```

### 3. **Handle Errors Gracefully**

```tsx
remove: remove("/api/items/:id", async (req, params) => {
  try {
    await deleteItem(params.id);
    return new Response("", { status: 200 });
  } catch (error) {
    return new Response(
      `<div class="error">Failed to delete: ${error.message}</div>`,
      { status: 400 },
    );
  }
});
```

### 4. **Use Path Parameters for Actions**

Include action names in the path for clearer function names:

```tsx
api: {
  follow: post("/api/users/:id/follow", () => { /* api.follow(id) */ }),
  like: post("/api/posts/:id/like", () => { /* api.like(id) */ }),
  archive: post("/api/items/:id/archive", () => { /* api.archive(id) */ })
}
```

This system makes ui-lib incredibly productive for building HTMX-powered
applications while maintaining the benefits of server-side rendering and
DOM-native state management!

## Client Options and Types

Generated client functions accept `(…params, payload?, opts?)`. The optional
`opts` is typed as:

```ts
type ApiClientOptions = {
  headers?: Record<string, string>;
  target?: string;
  swap?: string;
};

// Example
api.update(id, { name: "A" }, { target: "#content", swap: "innerHTML" });
```

## TypeScript Typing Tip

When using function‑style props (defaults written with `string()`, `number()`,
`boolean()`, etc.) the library introspects those defaults to auto‑generate the
props transformer. TypeScript doesn’t know that at type level, so add inline
casts and annotate the param to keep strong types inside your render while
preserving auto‑generation.

Example:

```tsx
defineComponent("typed-example", {
  styles: { box: `{ padding: .5rem; }` },
  render: (
    {
      title = string("Hello") as unknown as string,
      count = number(0) as unknown as number,
      enabled = boolean(false) as unknown as boolean,
    }: { title: string; count: number; enabled: boolean },
    _api,
    classes,
  ) => (
    <div class={classes!.box}>
      <h3>{title}</h3>
      <span>{count}</span>
      <span>{enabled ? "On" : "Off"}</span>
    </div>
  ),
});
```

See also: AUTHORING.md → “Typing function‑style props in TypeScript”.

## JSON-in, HTML-out (standard)

ui-lib standardizes on JSON requests for all htmx interactions, while responses
are server-rendered HTML for swapping. The Unified API helpers:

- include `hx-ext="json-enc"` and `hx-encoding="json"`
- set `hx-headers` with `Accept: text/html; charset=utf-8` and
  `X-Requested-With: XMLHttpRequest`
- accept a payload object that becomes the JSON body via `hx-vals`

Client:

```tsx
<button {...api.toggleLike(id, { liked: !liked, note: "from-card" })}>
  Like
</button>;
```

Server:

```ts
export const toggleLike = patch("/api/items/:id/like", async (req, params) => {
  const body = await req.json() as { liked?: boolean; note?: string };
  return new Response(
    renderComponent("like-card", { id: params.id, liked: !!body.liked }),
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
});
```

Per-request headers (e.g., CSRF) can be injected server-side and are merged by
the API generator into `hx-headers`. You can also override per call:

```tsx
<button
  {...api.toggleLike(id, { liked: true }, {
    headers: { "X-CSRF-Token": token },
    target: "closest .card",
  })}
>
  Like
</button>;
```

## Utilities

- `UnwrapHelpers<T>`: Maps a record of `PropHelper<*>` to its unwrapped
  primitive types. Useful for strongly typed render props when using helper
  defaults.
- `PropsOf<T extends Record<string, PropHelper<any>>>`: Alias for
  `UnwrapHelpers<T>` when you keep your defaults in a constant object.

Example:

```ts
import { boolean, number, string } from "../src/index.ts";
import type { PropsOf } from "../src/index.ts";

const defaults = {
  title: string("Hello"),
  count: number(0),
  enabled: boolean(false),
} satisfies Record<string, import("../src/index.ts").PropHelper<any>>;

render: ((
  props: PropsOf<typeof defaults> =
    (defaults as unknown as PropsOf<typeof defaults>),
  api,
  classes,
) => {
  // props.title: string; props.count: number; props.enabled: boolean
});
```
