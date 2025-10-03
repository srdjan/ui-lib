# Todo App Example

A full-featured todo application demonstrating ui-lib's capabilities with two different architectural approaches.

## 🚀 Quick Start

```bash
# Start the development server (runs server-custom.tsx)
deno task serve

# Or with type checking first
deno task start

# Bundle the client state helper when serving SSR output
deno task bundle:state

# Server runs on http://localhost:8080
```

## 📚 Two Architectural Approaches

This example includes two different server implementations showcasing different component architecture patterns:

### 1. **server-library.tsx** - Library Components Architecture
- Uses pre-built, reusable library components (Button, Card, Input, etc.)
- Demonstrates **94% code reduction** (800+ lines → 50 lines)
- Best for: Rapid prototyping, consistent design systems, minimal custom UI
- Architecture: Generic, composable components from the library

### 2. **server-custom.tsx** - Custom Components Architecture (Default)
- Custom components with clean separation of concerns
- Demonstrates best practices for component authoring
- Best for: Unique designs, full control, learning component patterns
- Architecture: Purpose-built components with no inline CSS

**Choose based on your needs:**
- Building quickly with consistent UI? → Use `server-library.tsx`
- Need full design control or learning patterns? → Use `server-custom.tsx`

## 🏗️ Project Structure

```
todo-app/
├── components/          # Custom UI Components (used by server-custom.tsx)
│   ├── TodoItem.tsx    # Individual todo item with actions
│   ├── TodoForm.tsx    # Add/edit todo form
│   ├── TodoList.tsx    # Todo list container
│   ├── TodoFilters.tsx # Filter controls
│   └── index.ts        # Component exports
│
├── api/                # Backend logic (shared by both servers)
│   ├── types.ts       # Shared type definitions
│   ├── repository.ts  # Data layer with functional error handling
│   ├── handlers.ts    # Request handlers
│   └── index.ts       # API exports
│
├── server-library.tsx  # Server using library components
├── server-custom.tsx   # Server using custom components (default)
└── README.md          # This documentation
```

## ✨ Key Features

- **Component-based architecture** - Each component in its own file for better
  organization
- **Functional programming** - Pure functions, immutable data, Result types for
  error handling
- **Type-safe** - Full TypeScript with strict typing throughout
- **SSR-first, JSX-always** - Server-side rendering with JSX-only components
- **DOM-native state** - State lives in the DOM (classes, data-*, content, CSS
  vars)
- **HTMX encapsulated** - No hx-* in app code; use `onAction`/`itemAction`
  helpers
- **Zero framework runtime** - Progressive enhancement optional

## 📦 Component Details

### TodoItem (`components/TodoItem.tsx`)

- Displays individual todo with priority badge
- Checkbox for completion toggle
- Edit and delete actions
- Interactions via `onAction` using colocated `api` definitions (HTMX hidden)
- Self-contained styles

### TodoForm (`components/TodoForm.tsx`)

- Add new todos with text and priority
- Edit existing todos
- Form validation
- Auto-reset after submission
- Clean form layout
- Submits to real handlers; progressive enhancement via HTMX happens under the
  hood

### TodoList (`components/TodoList.tsx`)

- Container for todo items
- Loading state with spinner
- Empty state messaging
- Conditional rendering based on filter

### TodoFilters (`components/TodoFilters.tsx`)

- Status filters (All, Active, Completed)
- Priority filtering dropdown
- Statistics display
- URL-based filtering with HTMX
- Responsive layout

## 🔧 API Architecture

### Types (`api/types.ts`)

Core data models and type definitions:

```typescript
export interface Todo {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
  createdAt: string;
  priority: "low" | "medium" | "high";
}
```

### Repository (`api/repository.ts`)

- Functional data layer with Result types
- In-memory storage (easily replaceable with database)
- Pure validation functions
- No throwing errors - all errors as values
- Handlers expect HTMX JSON bodies (`Content-Type: application/json`); see
  `handlers.test.ts` for examples

### Handlers (`api/handlers.ts`)

- HTTP request handlers
- Content negotiation (HTML for HTMX, JSON for API)
- Error response formatting
- Functional composition of operations

- `GET /api/todos` - List todos with filtering
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `POST /api/todos/:id/toggle` - Toggle completion
- `DELETE /api/todos/:id` - Delete todo
- `POST /api/todos/clear-completed` - Bulk delete
- `GET /api/todos/stats` - Get statistics

## 🎯 Key Patterns

### Functional Error Handling

```typescript
import type { Result } from "../../../lib/result.ts";

// Usage
const result = todoRepository.create(todoData);
if (!result.ok) {
  return handleDatabaseError(result.error);
}
```

### Component Separation

- Each component is self-contained with its own styles
- Props are typed interfaces
- Components are pure functions
- No side effects in render functions

### HTMX Integration (encapsulated)

All HTMX attributes are generated for you. Components bind to real handlers
using `onAction`:

```tsx
// In components/todo-item.tsx
<button onAction={{ api: "deleteTodo", args: [todo.id], attributes: { "hx-confirm": "Are you sure?" } }}>
  Delete
</button>
<input type="checkbox" checked={todo.completed} onAction={{ api: "toggle", args: [todo.id] }} />

// In components/todo-list.tsx
<button class="btn btn--danger" onAction={{ api: "clearCompleted" }}>
  Clear completed
</button>
```

## 🚀 Customization

### Adding New Features

1. Create new component in `components/`
2. Add types to `api/types.ts`
3. Implement repository methods
4. Add API handlers
5. Wire up routes in `server.tsx`

### Styling

- Each component includes its own styles
- Use ui-lib's CSS-in-TS system for type-safe styles
- Leverage CSS custom properties for theming

## 💡 Benefits of This Structure

1. **Maintainability** - Easy to find and modify components
2. **Testability** - Each component/function can be tested in isolation
3. **Reusability** - Components can be imported individually
4. **Type Safety** - Full TypeScript coverage with strict types
5. **Performance** - SSR with zero client runtime
6. **Learning** - Clear patterns for building ui-lib applications
