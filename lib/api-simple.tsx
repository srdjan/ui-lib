// Simplified API integration for ui-lib components
// Shows how components can have both UI and backend functionality

import { h } from "./simple.tsx";

/**
 * Simple API helper for HTMX-style interactions
 * Much simpler than the original complex API generator
 */
export function apiAction(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  target?: string,
) {
  const attrs: Record<string, string> = {
    [`hx-${method.toLowerCase()}`]: url,
    "hx-swap": "outerHTML",
  };

  if (target) {
    attrs["hx-target"] = target;
  }

  return attrs;
}

/**
 * TodoItem - Example component with API integration
 * Demonstrates how a component can have both UI and backend endpoints
 */
export function TodoItem({
  id,
  text,
  done = false,
  onToggle,
  onDelete,
}: {
  id: string;
  text: string;
  done?: boolean;
  onToggle?: string;
  onDelete?: string;
}) {
  return (
    <div
      className={`todo-item ${done ? "todo-done" : ""}`}
      id={`todo-${id}`}
    >
      <input
        type="checkbox"
        checked={done}
        {...(onToggle ? apiAction("POST", onToggle, `#todo-${id}`) : {})}
      />
      <span className="todo-text">{text}</span>
      {onDelete && (
        <button
          className="todo-delete"
          {...apiAction("DELETE", onDelete, `#todo-${id}`)}
        >
          ×
        </button>
      )}
      <style>
        {`
        .todo-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          margin-bottom: 0.5rem;
          background: white;
        }
        
        .todo-item.todo-done .todo-text {
          text-decoration: line-through;
          opacity: 0.7;
        }
        
        .todo-text {
          flex: 1;
          color: #374151;
        }
        
        .todo-delete {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          width: 24px;
          height: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          line-height: 1;
        }
        
        .todo-delete:hover {
          background: #dc2626;
        }
      `}
      </style>
    </div>
  );
}

/**
 * TodoList - Container for multiple todos with add functionality
 */
export function TodoList({
  todos = [],
  onAdd,
}: {
  todos?: Array<{ id: string; text: string; done: boolean }>;
  onAdd?: string;
}) {
  return (
    <div className="todo-list">
      <div className="todo-add">
        <form {...(onAdd ? apiAction("POST", onAdd, "#todo-container") : {})}>
          <input
            type="text"
            name="text"
            placeholder="Add a new todo..."
            required
            className="todo-input"
          />
          <button type="submit" className="todo-add-btn">Add</button>
        </form>
      </div>

      <div id="todo-container" className="todos">
        {todos.map((todo) =>
          TodoItem({
            id: todo.id,
            text: todo.text,
            done: todo.done,
            onToggle: `/api/todos/${todo.id}/toggle`,
            onDelete: `/api/todos/${todo.id}`,
          })
        ).join("")}
      </div>

      <style>
        {`
        .todo-list {
          max-width: 400px;
          margin: 0 auto;
        }
        
        .todo-add {
          margin-bottom: 1rem;
        }
        
        .todo-add form {
          display: flex;
          gap: 0.5rem;
        }
        
        .todo-input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .todo-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .todo-add-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        
        .todo-add-btn:hover {
          background: #2563eb;
        }
        
        .todos {
          min-height: 100px;
        }
      `}
      </style>
    </div>
  );
}

/**
 * Simple API endpoint handlers for the todo example
 */
export const todoHandlers = {
  // In-memory store for demo (in real app, use database)
  todos: new Map<string, { id: string; text: string; done: boolean }>(),

  // GET /api/todos - List all todos
  listTodos: () => {
    const todos = Array.from(todoHandlers.todos.values());
    return Response.json(todos);
  },

  // POST /api/todos - Create new todo
  createTodo: async (req: Request) => {
    const formData = await req.formData();
    const text = formData.get("text") as string;

    if (!text?.trim()) {
      return new Response("Text required", { status: 400 });
    }

    const id = crypto.randomUUID();
    const todo = { id, text: text.trim(), done: false };
    todoHandlers.todos.set(id, todo);

    // Return updated todo list HTML for HTMX
    const todos = Array.from(todoHandlers.todos.values());
    return new Response(
      `<div id="todo-container" class="todos">
        ${
        todos.map((t) =>
          TodoItem({
            id: t.id,
            text: t.text,
            done: t.done,
            onToggle: `/api/todos/${t.id}/toggle`,
            onDelete: `/api/todos/${t.id}`,
          })
        ).join("")
      }
      </div>`,
      { headers: { "Content-Type": "text/html" } },
    );
  },

  // POST /api/todos/:id/toggle - Toggle todo completion
  toggleTodo: (req: Request, params: { id: string }) => {
    const todo = todoHandlers.todos.get(params.id);
    if (!todo) {
      return new Response("Not found", { status: 404 });
    }

    todo.done = !todo.done;
    todoHandlers.todos.set(params.id, todo);

    // Return updated todo item HTML
    return new Response(
      TodoItem({
        id: todo.id,
        text: todo.text,
        done: todo.done,
        onToggle: `/api/todos/${todo.id}/toggle`,
        onDelete: `/api/todos/${todo.id}`,
      }),
      { headers: { "Content-Type": "text/html" } },
    );
  },

  // DELETE /api/todos/:id - Delete todo
  deleteTodo: (req: Request, params: { id: string }) => {
    const deleted = todoHandlers.todos.delete(params.id);
    if (!deleted) {
      return new Response("Not found", { status: 404 });
    }

    // Return empty response (item gets removed from DOM)
    return new Response("", { headers: { "Content-Type": "text/html" } });
  },
};

// Initialize with some sample data
todoHandlers.todos.set("1", {
  id: "1",
  text: "Try the simplified ui-lib",
  done: false,
});
todoHandlers.todos.set("2", {
  id: "2",
  text: "Build something awesome",
  done: false,
});
todoHandlers.todos.set("3", {
  id: "3",
  text: "Enjoy the simplicity",
  done: true,
});
