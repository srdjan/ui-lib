# Todo App Example

A full-featured todo application demonstrating ui-lib's capabilities with
**properly organized components** and functional programming patterns.

## 🚀 Quick Start

```bash
# Start the development server
deno task serve

# Or with type checking first
deno task start

# Bundle the client state helper when serving SSR output
deno task bundle:state

# Server runs on http://localhost:8080
```

## 🏗️ New Structure

```
todo-app/
├── components/          # UI Components (one file per component)
│   ├── TodoItem.tsx    # Individual todo item with actions
│   ├── TodoForm.tsx    # Add/edit todo form
│   ├── TodoList.tsx    # Todo list container
│   ├── TodoFilters.tsx # Filter controls
│   └── index.ts        # Component exports
│
├── api/                # Backend logic
│   ├── types.ts       # Shared type definitions
│   ├── repository.ts  # Data layer with functional error handling
│   ├── handlers.ts    # Request handlers
│   └── index.ts       # API exports
│

├── server.tsx         # Main server with routing
├── server-simple.tsx  # Alternative server implementation
└── README.md         # This documentation
```

## ✨ Key Features

- **Component-based architecture** - Each component in its own file for better
  organization
- **Functional programming** - Pure functions, immutable data, Result types for
  error handling
- **Type-safe** - Full TypeScript with strict typing throughout
- **SSR-first** - Server-side rendering with HTMX enhancements
- **DOM-native state** - State lives in the DOM, not JavaScript memory
- **Zero runtime** - No client-side framework needed

## 📦 Component Details

### TodoItem (`components/TodoItem.tsx`)

- Displays individual todo with priority badge
- Checkbox for completion toggle
- Edit and delete actions
- HTMX-powered interactions with `generateClientApi` helpers
- Self-contained styles

### TodoForm (`components/TodoForm.tsx`)

- Add new todos with text and priority
- Edit existing todos
- Form validation
- Auto-reset after submission
- Clean form layout
- Submits via HTMX JSON (`json-enc`) so handlers receive structured payloads

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
- Handlers expect HTMX JSON bodies (`Content-Type: application/json`); see `handlers.test.ts` for examples

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

### HTMX Integration

```html
<!-- Form submission updates todo list -->
<form hx-post="/api/todos" hx-target="#todo-list">

<!-- Toggle completion -->
<input type="checkbox" hx-post="/api/todos/123/toggle">

<!-- Delete with confirmation -->
<button hx-delete="/api/todos/123" hx-confirm="Are you sure?">
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
