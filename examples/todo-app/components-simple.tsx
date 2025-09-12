/** @jsx h */

// Refactored Todo App Components - Using ui-lib components with simple JSX functions
// This demonstrates proper ui-lib usage without the complexity of defineComponent

import { h } from "../../lib/simple.tsx";
import { Alert, Button } from "../../mod-simple.ts";

// Data types (keep the same)
export interface Todo {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
  createdAt: string;
  priority: "low" | "medium" | "high";
}

export interface TodoFilter {
  status: "all" | "active" | "completed";
  priority?: "low" | "medium" | "high";
}

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}

/**
 * TodoItem - Individual todo component using ui-lib Badge and Button components
 */
export function TodoItem({
  todo,
  showActions = true,
}: {
  todo: Todo;
  showActions?: boolean;
}) {
  const priorityColors = {
    low: "#22c55e",
    medium: "#f59e0b",
    high: "#ef4444",
  };

  return (
    <div
      class={`todo-item ${todo.completed ? "completed" : ""}`}
      id={`todo-${todo.id}`}
    >
      <div class="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          hx-post={`/api/todos/${todo.id}/toggle`}
          hx-target={`#todo-${todo.id}`}
          hx-swap="outerHTML"
        />

        <div class="todo-details">
          <span class="todo-text">{todo.text}</span>
          <div class="todo-meta">
            <span
              class="priority-badge"
              style={`background-color: ${
                priorityColors[todo.priority]
              }; color: white; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500; text-transform: uppercase;`}
            >
              {todo.priority}
            </span>
            <span class="todo-date">
              {new Date(todo.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {showActions && (
        <div class="todo-actions">
          <Button
            size="sm"
            variant="ghost"
            onClick={`editTodo('${todo.id}')`}
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="delete-btn"
            hx-delete={`/api/todos/${todo.id}`}
            hx-target={`#todo-${todo.id}`}
            hx-swap="outerHTML"
            hx-confirm="Are you sure you want to delete this todo?"
          >
            Delete
          </Button>
        </div>
      )}

      <style>
        {`
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
          color: #ef4444 !important;
          border-color: #fecaca !important;
        }
        
        .delete-btn:hover {
          background: #fef2f2 !important;
          border-color: #fca5a5 !important;
        }
      `}
      </style>
    </div>
  );
}

/**
 * TodoList - Main container for todos using ui-lib Alert and Container
 */
export function TodoList({
  todos,
  filter,
  loading = false,
}: {
  todos: Todo[];
  filter: TodoFilter;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div id="todo-list" class="todo-list loading">
        <div class="loading-spinner">Loading todos...</div>
        <style>
          {`
          .todo-list.loading {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2rem;
            color: #6b7280;
          }
          
          .loading-spinner:before {
            content: "";
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #d1d5db;
            border-top: 2px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 8px;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
        </style>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div id="todo-list" class="todo-list empty">
        <Alert variant="info">
          {filter.status === "all"
            ? "No todos yet. Add one above to get started!"
            : `No ${filter.status} todos found.`}
        </Alert>
      </div>
    );
  }

  return (
    <div id="todo-list" class="todo-list">
      {todos.map((todo) => <TodoItem todo={todo} />)}

      <style>
        {`
        .todo-list {
          min-height: 200px;
        }
        
        .todo-list.empty {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
        }
      `}
      </style>
    </div>
  );
}

/**
 * TodoForm - Add/edit todo form using ui-lib Button component
 */
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
  const isEditing = !!todo;
  const title = isEditing ? "Edit Todo" : "Add New Todo";
  const submitText = isEditing ? "Update" : "Add Todo";

  return (
    <form
      class="todo-form"
      hx-post={actionUrl}
      hx-target="#todo-list"
      hx-swap="innerHTML"
    >
      <h3 class="form-title">{title}</h3>

      <input type="hidden" name="user" value={userId} />
      {isEditing && <input type="hidden" name="id" value={todo.id} />}

      <div class="form-row">
        <div class="text-input">
          <input
            type="text"
            name="text"
            placeholder="What needs to be done?"
            value={todo?.text || ""}
            required
          />
        </div>

        <div class="priority-select">
          <select name="priority" value={todo?.priority || "medium"}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div class="submit-button">
          <Button type="submit" variant="primary" size="md">
            {submitText}
          </Button>
        </div>
      </div>

      {isEditing && onCancel && (
        <div class="form-actions">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      )}

      <style>
        {`
        .todo-form {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          margin-bottom: 1.5rem;
        }

        .form-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 1rem 0;
        }

        .form-row {
          display: flex;
          gap: 1rem;
          align-items: end;
          margin-bottom: 1rem;
        }

        .text-input {
          flex: 1;
        }

        .text-input input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
        }

        .priority-select {
          min-width: 120px;
        }

        .priority-select select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          background: white;
        }

        .submit-button {
          min-width: 100px;
        }

        .form-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }

        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            align-items: stretch;
          }
          
          .priority-select {
            min-width: auto;
          }
        }
      `}
      </style>
    </form>
  );
}

/**
 * TodoFilters - Filter controls and stats using ui-lib Badge component
 */
export function TodoFilters({
  currentFilter,
  todoCount,
  userId,
}: {
  currentFilter: TodoFilter;
  todoCount: TodoStats;
  userId: string;
}) {
  // Status filter options
  const statusOptions = [
    {
      value: "all",
      label: "All",
      count: todoCount.total,
      active: currentFilter.status === "all",
      href: `/?user=${userId}&status=all`,
    },
    {
      value: "active",
      label: "Active",
      count: todoCount.active,
      active: currentFilter.status === "active",
      href: `/?user=${userId}&status=active`,
    },
    {
      value: "completed",
      label: "Completed",
      count: todoCount.completed,
      active: currentFilter.status === "completed",
      href: `/?user=${userId}&status=completed`,
    },
  ];

  // Priority filter options
  const priorityOptions = [
    {
      value: "all",
      label: "All Priorities",
      active: !currentFilter.priority,
      href: `/?user=${userId}&status=${currentFilter.status}`,
    },
    {
      value: "high",
      label: "High",
      active: currentFilter.priority === "high",
      href: `/?user=${userId}&status=${currentFilter.status}&priority=high`,
    },
    {
      value: "medium",
      label: "Medium",
      active: currentFilter.priority === "medium",
      href: `/?user=${userId}&status=${currentFilter.status}&priority=medium`,
    },
    {
      value: "low",
      label: "Low",
      active: currentFilter.priority === "low",
      href: `/?user=${userId}&status=${currentFilter.status}&priority=low`,
    },
  ];

  return (
    <div class="filters-container">
      <div class="filters-header">
        <h3 class="filters-title">Filter Todos</h3>

        <div class="stats-container">
          <div class="stat-item">
            <span>Total:</span>
            <span
              class="stat-badge"
              style="background: #f3f4f6; color: #374151;"
            >
              {todoCount.total}
            </span>
          </div>
          <div class="stat-item">
            <span>Active:</span>
            <span
              class="stat-badge"
              style="background: #dbeafe; color: #1d4ed8;"
            >
              {todoCount.active}
            </span>
          </div>
          <div class="stat-item">
            <span>Done:</span>
            <span
              class="stat-badge"
              style="background: #dcfce7; color: #16a34a;"
            >
              {todoCount.completed}
            </span>
          </div>
        </div>
      </div>

      <div class="filter-section">
        <label class="filter-label">Status</label>
        <div class="filter-tabs">
          {statusOptions.map((option) => (
            <a
              href={option.href}
              class={`filter-tab ${option.active ? "active" : ""}`}
              aria-current={option.active ? "page" : undefined}
            >
              {option.label} ({option.count})
            </a>
          ))}
        </div>
      </div>

      <div class="filter-section">
        <label class="filter-label">Priority</label>
        <div class="filter-pills">
          {priorityOptions.map((option) => (
            <a
              href={option.href}
              class={`filter-pill ${option.active ? "active" : ""}`}
              aria-current={option.active ? "page" : undefined}
            >
              {option.label}
            </a>
          ))}
        </div>
      </div>

      <style>
        {`
        .filters-container {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          margin-bottom: 1.5rem;
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .filters-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .stats-container {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .stat-badge {
          padding: 0.125rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .filter-section {
          margin-bottom: 1rem;
        }

        .filter-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
          display: block;
        }

        .filter-tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
        }

        .filter-tab {
          padding: 0.5rem 1rem;
          text-decoration: none;
          color: #6b7280;
          border-bottom: 2px solid transparent;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .filter-tab:hover {
          color: #374151;
          border-bottom-color: #d1d5db;
        }

        .filter-tab.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
          font-weight: 600;
        }

        .filter-pills {
          display: flex;
          gap: 0.5rem;
          background: #f3f4f6;
          padding: 0.25rem;
          border-radius: 0.5rem;
        }

        .filter-pill {
          padding: 0.375rem 0.75rem;
          text-decoration: none;
          color: #6b7280;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .filter-pill:hover {
          background: white;
          color: #374151;
        }

        .filter-pill.active {
          background: white;
          color: #3b82f6;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .filters-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .stats-container {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .filter-tabs {
            flex-wrap: wrap;
          }

          .filter-pills {
            flex-wrap: wrap;
          }
        }
      `}
      </style>
    </div>
  );
}
