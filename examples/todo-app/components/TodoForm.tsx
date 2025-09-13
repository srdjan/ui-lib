/** @jsx h */

/**
 * TodoForm Component
 * Add/edit todo form with validation and HTMX submission
 */

import { h } from "../../../lib/simple.tsx";
import { Button, Input } from "../../../mod-simple.ts";
import type { Todo } from "../api/types.ts";

export interface TodoFormProps {
  todo?: Todo;
  userId: string;
  actionUrl?: string;
  method?: "POST" | "PUT";
  onCancel?: string;
}

export function TodoForm({
  todo,
  userId,
  actionUrl = "/api/todos",
  method = "POST",
  onCancel,
}: TodoFormProps) {
  const isEditing = !!todo;

  return (
    <div class="todo-form">
      <form
        hx-post={method === "POST" ? actionUrl : undefined}
        hx-put={method === "PUT" ? actionUrl : undefined}
        hx-target="#todo-list"
        hx-swap="innerHTML"
        hx-on--after-request="this.reset()"
      >
        <input type="hidden" name="user" value={userId} />
        {isEditing && <input type="hidden" name="id" value={todo.id} />}

        <div class="form-group">
          <Input
            name="text"
            placeholder="What needs to be done?"
            value={todo?.text || ""}
            required={true}
            className="todo-input"
          />
        </div>

        <div class="form-group">
          <select name="priority" class="priority-select" required>
            <option value="">Select priority</option>
            <option value="low" selected={todo?.priority === "low"}>
              Low Priority
            </option>
            <option value="medium" selected={todo?.priority === "medium"}>
              Medium Priority
            </option>
            <option value="high" selected={todo?.priority === "high"}>
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

          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      <style>
        {`
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
      `}
      </style>
    </div>
  );
}