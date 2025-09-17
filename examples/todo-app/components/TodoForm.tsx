/**
 * TodoForm Component
 * Add/edit todo form with validation and HTMX submission using defineComponent
 */

import { defineComponent, h, string } from "../../../mod.ts";
import { Button, Input } from "../../../mod-simple.ts";
import type { Todo } from "../api/types.ts";

defineComponent("todo-form", {
  styles: `
    .todo-form {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      margin-bottom: 1.5rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .todo-input {
      font-size: 16px;
      padding: 12px;
    }
    
    .priority-select {
      width: 100%;
      padding: 12px;
      font-size: 16px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      color: #374151;
    }
    
    .priority-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-actions {
      display: flex;
      gap: 0.5rem;
    }
  `,
  render: (
    todo = string(""),
    userId = string(""),
    actionUrl = string("/api/todos"),
    method = string("POST"),
    onCancel = string(""),
  ) => {
    const parsedTodo = parseOptionalTodo(todo);
    const normalizedMethod = method === "PUT" ? "PUT" : "POST";
    const cancelHook = onCancel || undefined;
    const isEditing = Boolean(parsedTodo);

    return (
      <div class="todo-form">
        <form
          hx-post={normalizedMethod === "POST" ? actionUrl : undefined}
          hx-put={normalizedMethod === "PUT" ? actionUrl : undefined}
          hx-target="#todo-list"
          hx-swap="innerHTML"
          hx-on--after-request="this.reset()"
        >
          <input type="hidden" name="user" value={userId} />
          {isEditing && parsedTodo && (
            <input type="hidden" name="id" value={parsedTodo.id} />
          )}

          <div class="form-group">
            <Input
              name="text"
              placeholder="What needs to be done?"
              value={parsedTodo?.text || ""}
              required={true}
              className="todo-input"
            />
          </div>

          <div class="form-group">
            <select name="priority" class="priority-select" required>
              <option value="">Select priority</option>
              <option value="low" selected={parsedTodo?.priority === "low"}>
                Low Priority
              </option>
              <option
                value="medium"
                selected={parsedTodo?.priority === "medium"}
              >
                Medium Priority
              </option>
              <option value="high" selected={parsedTodo?.priority === "high"}>
                High Priority
              </option>
            </select>
          </div>

          <div class="form-actions">
            <Button
              type="submit"
              variant="primary"
            >
              {isEditing ? "Update Todo" : "Add Todo"}
            </Button>

            {cancelHook && (
              <Button
                type="button"
                variant="ghost"
                onClick={cancelHook}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
    );
  },
});

// Export JSX function for backwards compatibility and direct use
export function TodoForm({
  todo,
  userId,
  actionUrl = "/api/todos",
  method = "POST",
  onCancel,
}: {
  todo?: Todo;
  userId: string;
  actionUrl?: string;
  method?: "POST" | "PUT";
  onCancel?: string;
}) {
  return (
    <todo-form
      todo={todo ? JSON.stringify(todo) : undefined}
      userId={userId}
      actionUrl={actionUrl}
      method={method}
      onCancel={onCancel}
    />
  );
}

function parseOptionalTodo(value: string): Todo | undefined {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value) as Todo;
    return parsed;
  } catch {
    return undefined;
  }
}
