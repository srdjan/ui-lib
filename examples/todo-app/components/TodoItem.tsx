/**
 * TodoItem Component
 * Individual todo item with actions and styling using defineComponent
 */

import { defineComponent, hx, renderComponent } from "../../../mod.ts";
import { string, boolean } from "../../../lib/prop-helpers.ts";
import { h } from "../../../lib/jsx-runtime.ts";
import { Button } from "../../../mod-simple.ts";
import type { Todo } from "../api/types.ts";

// Helper to parse HTMX attribute strings into JSX props
function parseHtmxAttrs(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  if (!attrString) return attrs;

  // Simple regex to parse key="value" pairs
  const matches = attrString.matchAll(/([\w-]+)=["']([^"']*)["']/g);
  for (const match of matches) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

defineComponent("todo-item", {
  api: {
    toggleTodo: ["POST", "/api/todos/:id/toggle", () => new Response()],
    deleteTodo: ["DELETE", "/api/todos/:id", () => new Response()],
  },
  styles: `
    .todo-item {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 1rem;
      margin-bottom: 0.5rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      transition: all 0.2s ease;
    }
    
    .todo-item:hover {
      border-color: #d1d5db;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .todo-item.completed {
      opacity: 0.7;
    }
    
    .todo-content {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      flex: 1;
    }
    
    .todo-content input[type="checkbox"] {
      margin-top: 0.25rem;
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    
    .todo-details {
      flex: 1;
    }
    
    .todo-text {
      display: block;
      font-size: 16px;
      line-height: 1.5;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }
    
    .todo-item.completed .todo-text {
      text-decoration: line-through;
      color: #6b7280;
    }
    
    .todo-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .priority-badge {
      font-size: 11px;
      font-weight: 600;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      text-transform: uppercase;
    }
    
    .todo-date {
      font-size: 12px;
      color: #6b7280;
    }
    
    .todo-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: 1rem;
    }
    
    .delete-btn {
      background: transparent;
      color: #ef4444;
      border: 1px solid #fecaca;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    
    .delete-btn:hover {
      background: #fef2f2;
      border-color: #fca5a5;
    }
  `,
  render: ({
    todo = string(""),
    showActions = boolean(true),
  }, api) => {
    const parsedTodo = parseTodo(typeof todo === "string" ? todo : "");
    const priorityColors = {
      low: "#22c55e",
      medium: "#f59e0b",
      high: "#ef4444",
    };

    // Generate HTMX attributes for actions
    const toggleAttrs = api?.toggleTodo?.(parsedTodo.id, hx({
      target: `#todo-${parsedTodo.id}`,
      swap: "outerHTML"
    })) || "";

    const deleteAttrs = api?.deleteTodo?.(parsedTodo.id, hx({
      target: `#todo-${parsedTodo.id}`,
      swap: "outerHTML",
      confirm: "Are you sure you want to delete this todo?"
    })) || "";

    return (
      <div
        class={`todo-item ${parsedTodo.completed ? "completed" : ""}`}
        id={`todo-${parsedTodo.id}`}
      >
        <div class="todo-content">
          <input
            type="checkbox"
            checked={parsedTodo.completed}
            {...parseHtmxAttrs(toggleAttrs)}
          />

          <div class="todo-details">
            <span class="todo-text">{parsedTodo.text}</span>
            <div class="todo-meta">
              <span
                class="priority-badge"
                style={`background-color: ${priorityColors[parsedTodo.priority]}`}
              >
                {parsedTodo.priority}
              </span>
              <span class="todo-date">
                {new Date(parsedTodo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {(typeof showActions === "boolean" ? showActions : true) && (
          <div class="todo-actions">
            <Button
              size="sm"
              variant="ghost"
              onClick={`editTodo('${parsedTodo.id}')`}
            >
              Edit
            </Button>

            <button
              type="button"
              class="delete-btn"
              {...parseHtmxAttrs(deleteAttrs)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    );
  },
});

// Export JSX component for direct use
export const TodoItem = ({ todo, showActions = "true" }: { todo: Todo | string; showActions?: string }) => {
  const todoStr = typeof todo === "string" ? todo : JSON.stringify(todo);
  return renderComponent("todo-item", { todo: todoStr, showActions });
};

const FALLBACK_TODO: Todo = {
  id: "todo-fallback",
  userId: "",
  text: "",
  completed: false,
  createdAt: new Date(0).toISOString(),
  priority: "low",
};

function parseTodo(value: string): Todo {
  if (!value) return FALLBACK_TODO;
  try {
    const parsed = JSON.parse(value) as Todo;
    return parsed;
  } catch {
    return FALLBACK_TODO;
  }
}
