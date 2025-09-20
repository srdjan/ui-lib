/**
 * TodoFilters Component
 * Filter and view controls for todo list using defineComponent
 */

import { defineComponent, get, renderComponent, string } from "../../../mod.ts";
import { todoAPI } from "../api/index.ts";
import type { TodoFilter, TodoStats } from "../api/types.ts";

const LIST_TARGET = "#todo-list";
const PRIORITY_FIELD_ID = "todo-priority";

defineComponent("todo-filters", {
  api: {
    filterTodos: get(
      "/api/todos",
      (req) => todoAPI.listTodos(req),
    ),
  },
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
  render: ({
    currentFilter = string(""),
    todoCount = string(""),
    userId = string(""),
  }, api) => {
    const parsedFilter = safeParse<TodoFilter>(
      typeof currentFilter === "string" ? currentFilter : undefined,
      { status: "all" },
    );
    const parsedStats = safeParse<TodoStats>(
      typeof todoCount === "string" ? todoCount : undefined,
      { total: 0, active: 0, completed: 0 },
    );
    const user = typeof userId === "string" ? userId : String(userId ?? "");

    const buildFilterAttrs = (status: TodoFilter["status"]) => {
      if (!api?.filterTodos) {
        console.error("TodoFilters: API not available - check component registration");
        return "";
      }

      return api.filterTodos({
        status,
        priority: parsedFilter.priority ?? "",
        user,
      }, {
        target: LIST_TARGET,
        swap: "outerHTML",
      });
    };

    const filterAllAttrs = buildFilterAttrs("all");
    const filterActiveAttrs = buildFilterAttrs("active");
    const filterCompletedAttrs = buildFilterAttrs("completed");

    const priorityFilterAttrs = api?.filterTodos ? api.filterTodos({
      status: parsedFilter.status,
      priority: parsedFilter.priority ?? "",
      user,
    }, {
      target: LIST_TARGET,
      trigger: "change",
      swap: "outerHTML",
      include: `#${PRIORITY_FIELD_ID}`,
    }) : "";

    return `
      <div class="todo-filters">
        <div class="filter-stats">
          <span>${parsedStats.active} active</span>
          <span>${parsedStats.completed} completed</span>
          <span>${parsedStats.total} total</span>
        </div>

        <div class="filter-buttons">
          <button
            type="button"
            class="filter-btn ${parsedFilter.status === "all" ? "active" : ""}"
            ${filterAllAttrs}
          >
            All
          </button>

          <button
            type="button"
            class="filter-btn ${
      parsedFilter.status === "active" ? "active" : ""
    }"
            ${filterActiveAttrs}
          >
            Active
          </button>

          <button
            type="button"
            class="filter-btn ${
      parsedFilter.status === "completed" ? "active" : ""
    }"
            ${filterCompletedAttrs}
          >
            Completed
          </button>
        </div>

        <div class="priority-filters">
          <select
            id="${PRIORITY_FIELD_ID}"
            class="priority-filter"
            name="priority"
            ${priorityFilterAttrs}
          >
            <option value="">All priorities</option>
            <option value="high">High priority</option>
            <option value="medium">Medium priority</option>
            <option value="low">Low priority</option>
          </select>
        </div>
      </div>
    `;
  },
});

// Export JSX component for direct use
export const TodoFilters = ({
  currentFilter,
  todoCount,
  userId,
}: {
  currentFilter: string | object;
  todoCount: string | object;
  userId: string;
}) => {
  const filterStr = typeof currentFilter === "string"
    ? currentFilter
    : JSON.stringify(currentFilter);
  const countStr = typeof todoCount === "string"
    ? todoCount
    : JSON.stringify(todoCount);

  return renderComponent("todo-filters", {
    currentFilter: filterStr,
    todoCount: countStr,
    userId,
  });
};

function safeParse<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
