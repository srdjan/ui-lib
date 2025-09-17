/**
 * TodoItem Component
 * Individual todo item with actions and styling using defineComponent
 */

import { boolean, defineComponent, h, string } from "../../../mod.ts";
import { Button } from "../../../mod-simple.ts";
import type { Todo } from "../api/types.ts";

defineComponent("todo-item", {
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
  render: (
    todo = string(""),
    showActions = boolean(true),
  ) => {
    const parsedTodo = parseTodo(todo);
    const priorityColors = {
      low: "#22c55e",
      medium: "#f59e0b",
      high: "#ef4444",
    };

    return (
      <div
        class={`todo-item ${parsedTodo.completed ? "completed" : ""}`}
        id={`todo-${parsedTodo.id}`}
      >
        <div class="todo-content">
          <input
            type="checkbox"
            checked={parsedTodo.completed}
            hx-post={`/api/todos/${parsedTodo.id}/toggle`}
            hx-target={`#todo-${parsedTodo.id}`}
            hx-swap="outerHTML"
          />

          <div class="todo-details">
            <span class="todo-text">{parsedTodo.text}</span>
            <div class="todo-meta">
              <span
                class="priority-badge"
                style={`background-color: ${
                  priorityColors[parsedTodo.priority]
                }`}
              >
                {parsedTodo.priority}
              </span>
              <span class="todo-date">
                {new Date(parsedTodo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {showActions && (
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
              hx-delete={`/api/todos/${parsedTodo.id}`}
              hx-target={`#todo-${parsedTodo.id}`}
              hx-swap="outerHTML"
              hx-confirm="Are you sure you want to delete this todo?"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    );
  },
});

// Export JSX function for backwards compatibility and direct use
export function TodoItem(
  { todo, showActions = true }: { todo: Todo; showActions?: boolean },
) {
  return (
    <todo-item
      todo={JSON.stringify(todo)}
      showActions={showActions ? "true" : "false"}
    />
  );
}

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
