/**
 * TodoFilters Component
 * Filter and view controls for todo list using defineComponent
 */

import { defineComponent, h } from "../../../mod.ts";
import type { TodoFilter, TodoStats } from "../api/types.ts";

defineComponent("todo-filters", {
  props: (attrs) => ({
    currentFilter: JSON.parse(attrs.currentFilter) as TodoFilter,
    todoCount: JSON.parse(attrs.todoCount) as TodoStats,
    userId: attrs.userId || ""
  }),
  styles: `
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
  `,
  render: ({ currentFilter, todoCount, userId }) => {
    return (
      <div class="todo-filters">
        <div class="filter-stats">
          <span>{todoCount.active} active</span>
          <span>{todoCount.completed} completed</span>
          <span>{todoCount.total} total</span>
        </div>

        <div class="filter-buttons">
          <button
            type="button"
            class={`filter-btn ${currentFilter.status === "all" ? "active" : ""}`}
            hx-get={`/api/todos?status=all&user=${userId}`}
            hx-target="#todo-list"
            hx-swap="innerHTML"
          >
            All
          </button>

          <button
            type="button"
            class={`filter-btn ${
              currentFilter.status === "active" ? "active" : ""
            }`}
            hx-get={`/api/todos?status=active&user=${userId}`}
            hx-target="#todo-list"
            hx-swap="innerHTML"
          >
            Active
          </button>

          <button
            type="button"
            class={`filter-btn ${
              currentFilter.status === "completed" ? "active" : ""
            }`}
            hx-get={`/api/todos?status=completed&user=${userId}`}
            hx-target="#todo-list"
            hx-swap="innerHTML"
          >
            Completed
          </button>
        </div>

        <div class="priority-filters">
          <select
            class="priority-filter"
            hx-get={`/api/todos?user=${userId}`}
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
      </div>
    );
  }
});

// Export JSX function for backwards compatibility and direct use
export function TodoFilters({
  currentFilter,
  todoCount,
  userId,
}: {
  currentFilter: TodoFilter;
  todoCount: TodoStats;
  userId: string;
}) {
  return (
    <todo-filters 
      currentFilter={JSON.stringify(currentFilter)}
      todoCount={JSON.stringify(todoCount)}
      userId={userId}
    />
  );
}