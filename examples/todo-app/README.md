# Todo App - ui-lib Idiomatic Usage Example

A complete todo application demonstrating the **idiomatic way** to use ui-lib simplified with full backend support.

## 🚀 Quick Start

```bash
# Start the todo application
deno task serve:todo

# Visit http://localhost:8080
```

## 📋 What This Demonstrates

### ✅ **Idiomatic Component Usage**
- **Component composition** - TodoItem, TodoForm, TodoFilters, TodoList
- **Props with TypeScript** - Type-safe interfaces and validation
- **Conditional rendering** - Loading states, empty states, error states
- **Inline styles** - Component-scoped CSS without collision
- **Responsive design** - Mobile-first approach

### ✅ **Full-Stack Architecture**
- **HTMX integration** - Seamless form submissions and updates
- **RESTful API** - Complete CRUD operations
- **Server-side rendering** - Components render to HTML strings
- **Type-safe data flow** - Shared types between frontend and backend
- **Error handling** - Validation, user feedback, graceful failures

### ✅ **Real-World Features**  
- **Priority levels** - High, Medium, Low with visual indicators
- **Filtering** - All, Active, Completed todos
- **Bulk operations** - Clear all completed todos
- **Form validation** - Client and server-side validation
- **Loading states** - Visual feedback during requests

## 🏗️ Project Structure

```
todo-app/
├── components.tsx    # UI components (TodoItem, TodoForm, TodoList, etc.)
├── api.ts           # Backend API handlers with validation
├── server.ts        # Main server with routing and middleware
└── README.md        # This file
```

## 🎯 Component Patterns

### **TodoItem - Individual Todo Component**
```tsx
export function TodoItem({ todo, showActions = true }: { 
  todo: Todo; 
  showActions?: boolean;
}) {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {/* Checkbox with HTMX toggle */}
      <input
        type="checkbox"
        checked={todo.completed}
        hx-post={`/api/todos/${todo.id}/toggle`}
        hx-target={`#todo-${todo.id}`}
        hx-swap="outerHTML"
      />
      {/* Todo content with priority badge */}
      <div className="todo-details">
        <span className="todo-text">{todo.text}</span>
        <span className="priority-badge" style={`background: ${priorityColor}`}>
          {todo.priority}
        </span>
      </div>
      {/* Inline styles scoped to component */}
      <style>{/* Component-specific CSS */}</style>
    </div>
  );
}
```

### **TodoForm - Add/Edit Form**
```tsx
export function TodoForm({ todo, actionUrl = "/api/todos" }: {
  todo?: Todo;
  actionUrl?: string;
}) {
  return (
    <div className="todo-form">
      <form
        hx-post={actionUrl}
        hx-target="#todo-list"
        hx-swap="innerHTML"
      >
        {/* Type-safe input using ui-lib Input component */}
        {renderToString(Input({
          name: "text",
          placeholder: "What needs to be done?",
          required: true
        }))}
        
        {/* Priority selector */}
        <select name="priority" required>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        
        {/* Submit button using ui-lib Button component */}
        {renderToString(Button({
          type: "submit",
          variant: "primary", 
          children: "Add Todo"
        }))}
      </form>
    </div>
  );
}
```

## 🔧 API Architecture

### **Type-Safe Data Models**
```tsx
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  priority: "low" | "medium" | "high";
}

export interface TodoFilter {
  status: "all" | "active" | "completed";
  priority?: "low" | "medium" | "high";
}
```

### **CRUD Operations with Validation**
```tsx
// POST /api/todos - Create new todo
async createTodo(req: Request): Promise<Response> {
  const formData = await req.formData();
  const data = { /* extract form data */ };
  
  // Validate input
  const validation = validateTodoData(data);
  if (!validation.valid) {
    return errorResponse(validation.errors.join(", "));
  }
  
  // Create todo
  const todo = db.create(data);
  
  // Return updated HTML for HTMX
  return htmlResponse(TodoList({ todos: db.getAll() }));
}
```

### **Smart Response Handling**
```tsx
// Return HTML for HTMX requests, JSON for API requests
const acceptsHtml = req.headers.get("hx-request") || 
                   req.headers.get("accept")?.includes("text/html");

if (acceptsHtml) {
  return htmlResponse(TodoList({ todos, filter }));
} else {
  return jsonResponse({ todos, filter, stats });
}
```

## 🎨 UI Patterns

### **Loading States**
```tsx
if (loading) {
  return (
    <div className="todo-list loading">
      <div className="loading-spinner">Loading todos...</div>
    </div>
  );
}
```

### **Empty States**
```tsx
if (todos.length === 0) {
  return (
    <div className="todo-list empty">
      {renderToString(Alert({
        variant: "info",
        children: "No todos yet. Add one above to get started!"
      }))}
    </div>
  );
}
```

### **Error Handling**
```tsx
function errorResponse(message: string, status = 400) {
  return htmlResponse(
    Alert({ 
      variant: "error", 
      title: "Error",
      children: message 
    }),
    status
  );
}
```

## 🌐 API Endpoints

- `GET /` - Main todo application
- `GET /api` - API documentation  
- `GET /health` - Health check with stats

**Todo CRUD:**
- `GET /api/todos` - List todos (supports filtering)
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `POST /api/todos/:id/toggle` - Toggle completion
- `DELETE /api/todos/:id` - Delete todo
- `POST /api/todos/clear-completed` - Bulk delete completed

## 💡 Key Benefits

1. **Zero Hydration** - State lives in DOM, not JavaScript memory
2. **Type Safety** - Shared types between components and API
3. **Component Reuse** - TodoItem works in lists, forms, anywhere
4. **Progressive Enhancement** - Works without JavaScript, enhanced with HTMX
5. **Server-Side Rendering** - Fast initial page loads
6. **Simple State Management** - No complex stores or reducers needed

## 🔄 HTMX Integration

HTMX provides seamless interactions without writing JavaScript:

```html
<!-- Form submission updates todo list -->
<form hx-post="/api/todos" hx-target="#todo-list">
  
<!-- Checkbox toggles individual todo -->
<input hx-post="/api/todos/1/toggle" hx-target="#todo-1">

<!-- Button deletes todo with confirmation -->  
<button hx-delete="/api/todos/1" hx-confirm="Delete?">
```

## 📱 Responsive Design

Mobile-first CSS with progressive enhancement:

```css
/* Mobile first */
.todo-filters {
  flex-direction: column;
}

/* Desktop enhancement */
@media (min-width: 640px) {
  .todo-filters {
    flex-direction: row;
    justify-content: space-between;
  }
}
```

This todo app demonstrates the **complete power** of ui-lib simplified while maintaining **extreme simplicity** in both implementation and usage.