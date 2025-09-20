/**
 * TodoForm Component
 * Add/edit todo form with validation and HTMX submission using defineComponent
 */

import { defineComponent, renderComponent, string } from "../../../mod.ts";
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
  render: ({
    todo = string(""),
    userId = string(""),
    actionUrl = string("/api/todos"),
    method = string("POST"),
    onCancel = string(""),
  }, _api) => {
    const parsedTodo = parseOptionalTodo(typeof todo === "string" ? todo : "");
    const normalizedMethod = method === "PUT" ? "PUT" : "POST";
    const cancelHook = typeof onCancel === "string" ? onCancel : undefined;
    const isEditing = Boolean(parsedTodo);

    // Manual HTMX wiring with predictable swap target for list refresh
    const hxTarget = "#todo-list";
    const createAttrs =
      `hx-post="/api/todos" hx-target="${hxTarget}" hx-swap="outerHTML" hx-ext="json-enc"`;
    const updateAttrs = parsedTodo
      ? `hx-put="/api/todos/${parsedTodo.id}" hx-target="${hxTarget}" hx-swap="outerHTML" hx-ext="json-enc"`
      : createAttrs;
    const formAttrs = isEditing && parsedTodo ? updateAttrs : createAttrs;

    return `
      <div class="todo-form">
        <form
          ${formAttrs}
          onsubmit="setTimeout(() => this.reset(), 100)"
        >
          <input type="hidden" name="user" value="${userId}" />
          ${
      isEditing && parsedTodo
        ? `<input type="hidden" name="id" value="${parsedTodo.id}" />`
        : ""
    }

          <div class="form-group">
            <input
              name="text"
              class="todo-input"
              placeholder="What needs to be done?"
              value="${parsedTodo?.text || ""}"
              required
              style="width: 100%; padding: 12px; font-size: 16px; border: 1px solid #d1d5db; border-radius: 6px;"
            />
          </div>

          <div class="form-group">
            <select name="priority" class="priority-select" required>
              <option value="">Select priority</option>
              <option value="low" ${
      parsedTodo?.priority === "low" ? "selected" : ""
    }>
                Low Priority
              </option>
              <option value="medium" ${
      parsedTodo?.priority === "medium" ? "selected" : ""
    }>
                Medium Priority
              </option>
              <option value="high" ${
      parsedTodo?.priority === "high" ? "selected" : ""
    }>
                High Priority
              </option>
            </select>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary"
              style="padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;"
            >
              ${isEditing ? "Update Todo" : "Add Todo"}
            </button>

            ${
      cancelHook
        ? `
              <button
                type="button"
                class="btn btn-ghost"
                onclick="${cancelHook}"
                style="padding: 0.75rem 1.5rem; background: transparent; color: #6b7280; border: 1px solid #d1d5db; border-radius: 6px; font-weight: 500; cursor: pointer;"
              >
                Cancel
              </button>
            `
        : ""
    }
          </div>
        </form>
      </div>
    `;
  },
});

// Export JSX component for direct use
export const TodoForm = ({
  todo,
  userId,
  actionUrl = "/api/todos",
  method = "POST",
  onCancel,
}: {
  todo?: string;
  userId: string;
  actionUrl?: string;
  method?: string;
  onCancel?: string;
}) => {
  return renderComponent("todo-form", {
    todo: todo || "",
    userId,
    actionUrl,
    method,
    onCancel: onCancel || "",
  });
};

function parseOptionalTodo(value: string): Todo | undefined {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value) as Todo;
    return parsed;
  } catch {
    return undefined;
  }
}
