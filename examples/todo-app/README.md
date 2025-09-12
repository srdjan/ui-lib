# Todo App Examples - ui-lib Showcase

Multiple complete todo applications demonstrating different approaches to using
ui-lib, from traditional patterns to cutting-edge ergonomic APIs.

## 🚀 Quick Start

```bash
# Original idiomatic ui-lib usage
deno task serve:todo

# Refactored with ui-lib components
deno task serve:simple

# Ergonomic API demonstration
deno task serve:ergonomic

# All servers run on http://localhost:8080
```

## 📋 Three Different Approaches

### 1️⃣ **Original Todo App** (`server.tsx`)

**Traditional ui-lib usage with manual component patterns**

- ✅ **Component composition** - TodoItem, TodoForm, TodoFilters, TodoList
- ✅ **Props with TypeScript** - Type-safe interfaces and validation
- ✅ **HTMX integration** - Seamless form submissions and updates
- ✅ **Server-side rendering** - Components render to HTML strings
- ✅ **Manual styling** - Custom CSS classes and inline styles

### 2️⃣ **Simple Todo App** (`server-simple.tsx`)

**Refactored to use ui-lib component library**

- ✅ **ui-lib components** - Button, Alert, Container, Badge components
- ✅ **Consistent styling** - Design system with component variants
- ✅ **Simple JSX functions** - Clean component patterns without complexity
- ✅ **Type-safe props** - Full TypeScript support with proper interfaces
- ✅ **HTMX preserved** - All interactive features maintained

### 3️⃣ **Ergonomic Demo** (`demo-ergonomic.tsx`)

**Cutting-edge ergonomic API with three breakthroughs**

- ✨ **Function-Style Props** - Zero duplication, auto-inferred from parameters
- ✨ **CSS-Only Format** - Auto-generated classes from pure CSS strings
- ✨ **Unified API System** - Ready for HTMX attribute auto-generation
- ✅ **Type safety** - Full TypeScript inference and validation
- ✅ **Beautiful UI** - Gradient designs and responsive layouts

## 🏗️ Project Structure

```
todo-app/
├── server.tsx              # Original idiomatic ui-lib server
├── server-simple.tsx       # Refactored with ui-lib components
├── demo-ergonomic.tsx      # Ergonomic API demonstration
├── components.tsx          # Original UI components
├── components-simple.tsx   # Refactored ui-lib components
├── api.tsx                 # Shared backend API handlers
└── README.md              # This documentation
```

## 🎯 Key Features Across All Versions

### **Shared Functionality**

- ✅ **Complete CRUD operations** - Create, read, update, delete todos
- ✅ **Priority levels** - High, Medium, Low with visual indicators
- ✅ **HTMX integration** - Seamless form submissions and updates
- ✅ **Server-side rendering** - Fast initial page loads
- ✅ **Type safety** - Full TypeScript support throughout
- ✅ **Responsive design** - Works on mobile and desktop

### **Progressive Enhancement**

Each version builds upon the previous:

1. **Original** → Manual components, custom styling
2. **Simple** → ui-lib components, consistent design system
3. **Ergonomic** → Zero duplication, auto-generated classes

## 🚀 Getting Started

### **Run Any Version**

```bash
# Original idiomatic ui-lib (default)
deno task serve:todo

# Refactored with ui-lib components
deno task serve:simple

# Ergonomic API demonstration
deno task serve:ergonomic
```

### **Explore the Code**

Each server demonstrates different ui-lib patterns:

- **`server.tsx`** - Traditional component patterns with manual styling
- **`server-simple.tsx`** - Clean refactor using ui-lib Button, Alert, Badge
  components
- **`demo-ergonomic.tsx`** - Cutting-edge ergonomic API with three breakthroughs

### **Learn More**

- 📚 [Ergonomic API Documentation](../../docs/ergonomic-api.md)
- 🎯 [Component Library Guide](../../docs/components.md)
- 🔧 [HTMX Integration Patterns](../../docs/htmx-integration.md)

## 🔧 Shared API Architecture

All three versions use the same backend API (`api.tsx`) with:

### **Type-Safe Data Models**

```tsx
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: "low" | "medium" | "high";
  userId: string;
}
```

### **RESTful Endpoints**

- `GET /` - Main application
- `GET /api` - API documentation
- `GET /health` - Health check
- `POST /api/todos` - Create todo
- `PATCH /api/todos/:id/toggle` - Toggle completion
- `DELETE /api/todos/:id` - Delete todo

### **HTMX Integration**

All versions use HTMX for seamless server-client communication:

```html
<!-- Form submission updates todo list -->
<form hx-post="/api/todos" hx-target="#todo-list">

<!-- Toggle completion -->
<button hx-patch="/api/todos/123/toggle" hx-target="#todo-list">
```

## 💡 Key Benefits

### **Across All Versions**

- ✅ **Zero Hydration** - State lives in DOM, not JavaScript memory
- ✅ **Type Safety** - Shared types between components and API
- ✅ **Progressive Enhancement** - Works without JavaScript, enhanced with HTMX
- ✅ **Server-Side Rendering** - Fast initial page loads
- ✅ **Simple State Management** - No complex stores or reducers needed

### **Version-Specific Benefits**

**Original** → Learn traditional ui-lib patterns **Simple** → Experience
consistent design system **Ergonomic** → See the future of component development

## 🎯 Choose Your Path

- **New to ui-lib?** Start with `server.tsx` to learn the fundamentals
- **Want consistency?** Try `server-simple.tsx` for design system benefits
- **Ready for the future?** Explore `demo-ergonomic.tsx` for cutting-edge
  patterns

Each version demonstrates the **power and flexibility** of ui-lib while
showcasing different approaches to component development.
