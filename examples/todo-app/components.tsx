// Todo App Components - Idiomatic ui-lib usage with JSX/TSX
// This demonstrates proper component composition and API integration

import { Button, Input, Alert } from "../../mod-simple.ts";
import { h } from "../../lib/simple.tsx";

// Data types
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

/**
 * TodoItem - Individual todo component with actions
 * Demonstrates: API integration, conditional styling, inline actions
 */
export function TodoItem({ 
  todo, 
  showActions = true 
}: { 
  todo: Todo; 
  showActions?: boolean;
}) {
  const priorityColors = {
    low: "#22c55e",
    medium: "#f59e0b", 
    high: "#ef4444"
  };

  return (
    <div class={`todo-item ${todo.completed ? 'completed' : ''}`} id={`todo-${todo.id}`}>
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
              style={`background-color: ${priorityColors[todo.priority]}`}
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
          
          <button
            class="delete-btn"
            hx-delete={`/api/todos/${todo.id}`}
            hx-target={`#todo-${todo.id}`}
            hx-swap="outerHTML"
            hx-confirm="Are you sure you want to delete this todo?"
          >
            Delete
          </button>
        </div>
      )}

      <style>{`
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
      `}</style>
    </div>
  );
}

/**
 * TodoForm - Add/edit todo form component
 * Demonstrates: Form validation, priority selection, HTMX form submission
 */
export function TodoForm({ 
  todo,
  actionUrl = "/api/todos",
  method = "POST",
  onCancel
}: {
  todo?: Todo;
  actionUrl?: string; 
  method?: "POST" | "PUT";
  onCancel?: string;
}) {
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

      <style>{`
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
      `}</style>
    </div>
  );
}

/**
 * TodoFilters - Filter and view controls
 * Demonstrates: Active state management, URL-based filtering
 */
export function TodoFilters({ 
  currentFilter,
  todoCount
}: {
  currentFilter: TodoFilter;
  todoCount: { total: number; active: number; completed: number };
}) {
  return (
    <div class="todo-filters">
      <div class="filter-stats">
        <span>{todoCount.active} active</span>
        <span>{todoCount.completed} completed</span>
        <span>{todoCount.total} total</span>
      </div>

      <div class="filter-buttons">
        <button
          class={`filter-btn ${currentFilter.status === 'all' ? 'active' : ''}`}
          hx-get="/api/todos?status=all"
          hx-target="#todo-list"
          hx-swap="innerHTML"
        >
          All
        </button>
        
        <button
          class={`filter-btn ${currentFilter.status === 'active' ? 'active' : ''}`}
          hx-get="/api/todos?status=active"
          hx-target="#todo-list"
          hx-swap="innerHTML"
        >
          Active
        </button>
        
        <button
          class={`filter-btn ${currentFilter.status === 'completed' ? 'active' : ''}`}
          hx-get="/api/todos?status=completed"
          hx-target="#todo-list"
          hx-swap="innerHTML"
        >
          Completed
        </button>
      </div>

      <div class="priority-filters">
        <select 
          class="priority-filter"
          hx-get="/api/todos"
          hx-target="#todo-list"
          hx-swap="innerHTML"
          hx-include="[name='status']"
          name="priority"
        >
          <option value="">All priorities</option>
          <option value="high">High priority</option>
          <option value="medium">Medium priority</option>
          <option value="low">Low priority</option>
        </select>
      </div>

      <style>{`
        .todo-filters {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          margin-bottom: 1.5rem;
        }
        
        .filter-stats {
          display: flex;
          gap: 1rem;
          font-size: 14px;
          color: #6b7280;
        }
        
        .filter-buttons {
          display: flex;
          gap: 0.25rem;
          background: #f3f4f6;
          padding: 0.25rem;
          border-radius: 6px;
        }
        
        .filter-btn {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.15s ease;
        }
        
        .filter-btn:hover {
          color: #374151;
        }
        
        .filter-btn.active {
          background: white;
          color: #3b82f6;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        
        .priority-filter {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 14px;
          background: white;
        }
        
        @media (max-width: 640px) {
          .todo-filters {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filter-stats {
            justify-content: center;
          }
          
          .filter-buttons {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * TodoList - Main container for todos
 * Demonstrates: Conditional rendering, empty states, list composition
 */
export function TodoList({ 
  todos,
  filter,
  loading = false
}: {
  todos: Todo[];
  filter: TodoFilter;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div id="todo-list" class="todo-list loading">
        <div class="loading-spinner">Loading todos...</div>
        <style>{`
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
        `}</style>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div id="todo-list" class="todo-list empty">
        <Alert
          variant="info"
        >
          {filter.status === "all" 
            ? "No todos yet. Add one above to get started!"
            : `No ${filter.status} todos found.`}
        </Alert>
      </div>
    );
  }

  return (
    <div id="todo-list" class="todo-list">
      {todos.map(todo => <TodoItem todo={todo} />)}
      
      <style>{`
        .todo-list {
          min-height: 200px;
        }
        
        .todo-list.empty {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
}