# funcwc's Unified API System

The `.api()` method is funcwc's revolutionary unified API system that eliminates
duplication between server route definitions and client-side HTMX attributes.
Define your API endpoints once, and funcwc automatically generates type-safe
client functions.

## How It Works

### 1. **Define Server Routes Once**

Instead of writing server routes in one place and HTMX attributes in another,
you define everything together:

```tsx
defineComponent("todo-item", {
  props: { id: "string", text: "string", done: "boolean?" },
  api: {
    // ✨ These are actual server handlers that will process requests
    "PATCH /api/todos/:id/toggle": async (req, params) => {
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
    },

    "DELETE /api/todos/:id": async (req, params) => {
      // Delete from database here...
      await deleteTodoFromDB(params.id);

      return new Response(null, { status: 204 });
    },
  },

  render: ({ id, text, done }, api, classes) => (
    <div class="todo" data-id={id}>
      <input
        type="checkbox"
        checked={done}
        {...api.toggle(id)}
      />{" "}
      // ← Magic happens here!
      <span>{text}</span>
      <button {...api.delete(id)}>Delete</button>
    </div>
  ),
});
```

### 2. **Auto-Generated Client Functions**

funcwc analyzes your routes and creates client functions automatically:

| Server Route                  | Generated Function | What It Returns                                                                           |
| ----------------------------- | ------------------ | ----------------------------------------------------------------------------------------- |
| `PATCH /api/todos/:id/toggle` | `api.toggle(id)`   | `{ "hx-patch": "/api/todos/123/toggle", "hx-target": "closest .todo" }`                   |
| `DELETE /api/todos/:id`       | `api.delete(id)`   | `{ "hx-delete": "/api/todos/123", "hx-target": "closest .todo", "hx-swap": "outerHTML" }` |
| `POST /api/todos`             | `api.create()`     | `{ "hx-post": "/api/todos" }`                                                             |
| `GET /api/todos/:id`          | `api.get(id)`      | `{ "hx-get": "/api/todos/123" }`                                                          |

### 3. **Route-to-Function Mapping Logic**

The function names are intelligently generated based on HTTP methods and paths:

```tsx
// Route pattern → Generated function name
"POST /api/items"              → api.create()
"GET /api/items/:id"           → api.get(id)  
"PUT /api/items/:id"           → api.update(id)
"PATCH /api/items/:id"         → api.update(id)
"PATCH /api/todos/:id/toggle"  → api.toggle(id)  // Special case: action in path
"DELETE /api/items/:id"        → api.delete(id)
"POST /api/users/:id/follow"   → api.follow(id)  // Action becomes function name
```

## Real-World Example: Shopping Cart

```tsx
defineComponent("cart-item", {
  props: {
    productId: "string",
    name: "string",
    quantity: { type: "number", default: 1 },
    price: { type: "number", default: 0 },
  },

  api: {
    // Server handlers - these actually run on the server
    "PATCH /api/cart/:productId/quantity": async (req, params) => {
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

    "DELETE /api/cart/:productId": async (req, params) => {
      await removeFromCart(params.productId);
      return new Response("", { status: 200 });
    },

    "POST /api/cart/:productId/favorite": async (req, params) => {
      await addToFavorites(params.productId);
      return new Response(
        renderComponent("cart-item", {
          productId: params.productId,
          // ... other props with favorite: true
        }),
      );
    },
  },

  render: ({ productId, name, quantity, price }, api) => (
    <div class="cart-item" data-product-id={productId}>
      <h3>{name}</h3>
      <div class="quantity-controls">
        <input
          type="number"
          name="quantity"
          value={quantity}
          {...api.update(productId)}
        />{" "}
        // ← PATCH /api/cart/:id/quantity
      </div>
      <div class="price">${price}</div>
      <div class="actions">
        <button {...api.favorite(productId)}>
          ❤️ Favorite
        </button>
        <button {...api.delete(productId)}>
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

## Traditional Approach vs funcwc's Unified API

### ❌ **Traditional Approach (Duplication):**

**Server routes (separate file):**

```tsx
// routes/todos.ts
app.patch("/api/todos/:id/toggle", async (req, res) => {
  // Handle toggle logic...
});

app.delete("/api/todos/:id", async (req, res) => {
  // Handle delete logic...
});
```

**Client HTMX attributes (separate, manually written):**

```html
<!-- You have to manually write these attributes -->
<input
  type="checkbox"
  hx-patch="/api/todos/123/toggle"
  <!--
  Manual
  duplication
  --
>
hx-target="closest .todo" hx-include="closest .todo" />
<button
  hx-delete="/api/todos/123"
  <!--
  Manual
  duplication
  --
>
  hx-target="closest .todo" hx-swap="outerHTML" >Delete
</button>
```

### ✅ **funcwc's Unified Approach (No Duplication):**

```tsx
defineComponent("todo-item", {
  api: {
    // Single source of truth - defines both server logic AND client attributes
    "PATCH /api/todos/:id/toggle": async (req, params) => { /* logic */ },
    "DELETE /api/todos/:id": async (req, params) => { /* logic */ }
  },
  render: ({ id }, api) => (
    <div>
      <input {...api.toggle(id)} />  {/* Auto-generated */
      <button {...api.delete(id)}>Delete</button>
    </div>
  )
})
```

## Advanced Examples

### Multi-Action Component

```tsx
defineComponent("user-profile", {
  props: {
    userId: "string",
    name: "string",
    isFollowing: { type: "boolean", default: false },
    isBlocked: { type: "boolean", default: false },
  },

  api: {
    "POST /api/users/:userId/follow": async (req, params) => {
      await followUser(params.userId);
      return new Response(
        renderComponent("user-profile", {
          userId: params.userId,
          name: await getUserName(params.userId),
          isFollowing: true,
          isBlocked: false,
        }),
      );
    },

    "DELETE /api/users/:userId/follow": async (req, params) => {
      await unfollowUser(params.userId);
      return new Response(
        renderComponent("user-profile", {
          userId: params.userId,
          name: await getUserName(params.userId),
          isFollowing: false,
          isBlocked: false,
        }),
      );
    },

    "POST /api/users/:userId/block": async (req, params) => {
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
    },

    "PUT /api/users/:userId/profile": async (req, params) => {
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
    },
  },

  render: ({ userId, name, isFollowing, isBlocked }, api) => (
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
                ? api.delete(userId) // Unfollow (DELETE)
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
defineComponent("task-list", {
  props: {
    tasks: "string", // JSON string of tasks
    selectedCount: { type: "number", default: 0 },
  },

  api: {
    "POST /api/tasks/batch/complete": async (req) => {
      const form = await req.formData();
      const taskIds = form.getAll("taskId") as string[];

      await Promise.all(taskIds.map((id) => completeTask(id)));

      return new Response(
        renderComponent("task-list", {
          tasks: JSON.stringify(await getUpdatedTasks()),
          selectedCount: 0,
        }),
      );
    },

    "DELETE /api/tasks/batch": async (req) => {
      const form = await req.formData();
      const taskIds = form.getAll("taskId") as string[];

      await Promise.all(taskIds.map((id) => deleteTask(id)));

      return new Response(
        renderComponent("task-list", {
          tasks: JSON.stringify(await getRemainingTasks()),
          selectedCount: 0,
        }),
      );
    },
  },

  render: ({ tasks, selectedCount }, api) => {
    const taskList = JSON.parse(tasks);

    return (
      <div class="task-list">
        <div
          class="batch-actions"
          style={selectedCount > 0 ? "" : "display: none"}
        >
          <form {...api.create()}>
            {taskList.filter((t) => t.selected).map((task) => (
              <input type="hidden" name="taskId" value={task.id} />
            ))}
            <button type="submit">Complete Selected ({selectedCount})</button>
          </form>

          <form {...api.delete()}>
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

When you define an `api` object, funcwc automatically:

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

funcwc uses intelligent defaults for HTMX targeting:

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
  "GET /api/items/:id":    () => { /* fetch */ },
  "POST /api/items":       () => { /* create */ },
  "PUT /api/items/:id":    () => { /* replace */ },
  "PATCH /api/items/:id":  () => { /* update */ },
  "DELETE /api/items/:id": () => { /* remove */ }
}
```

### 3. **Handle Errors Gracefully**

```tsx
"DELETE /api/items/:id": async (req, params) => {
  try {
    await deleteItem(params.id);
    return new Response("", { status: 200 });
  } catch (error) {
    return new Response(
      `<div class="error">Failed to delete: ${error.message}</div>`,
      { status: 400 }
    );
  }
}
```

### 4. **Use Path Parameters for Actions**

Include action names in the path for clearer function names:

```tsx
api: {
  "POST /api/users/:id/follow":   () => { /* api.follow(id) */ },
  "POST /api/posts/:id/like":     () => { /* api.like(id) */ },
  "POST /api/items/:id/archive":  () => { /* api.archive(id) */ }
}
```

This system makes funcwc incredibly productive for building HTMX-powered
applications while maintaining the benefits of server-side rendering and
DOM-native state management!
