/**
 * TodoList Component - Modern CSS Architecture Version
 * Container for displaying todos with modern CSS patterns and container queries
 */

import { Alert } from "../../../mod-simple.ts";
import {
  boolean,
  defineComponent,
  renderComponent,
  string,
} from "../../../mod.ts";
import { css, token } from "../../../lib/modern-css.ts";
import { h } from "../../../lib/jsx-runtime.ts";
import type { Todo, TodoFilter } from "../api/types.ts";
import "./TodoItem.modern.tsx"; // Import to register the modern component

// Create modern CSS styles for the todo list
const todoListStyles = css.responsive("todo-list", {
  base: {
    minBlockSize: token("size", "48"), // 12rem = 192px
    containerType: "inline-size",
    containerName: "todo-list",

    // CSS Grid for better layout control
    display: "grid",
    gap: token("space", "4"),
    gridTemplateColumns: "1fr",

    // Modern focus management
    "&:focus-within": {
      outline: "none",
    },
  },

  // State variants
  variants: {
    empty: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: token("space", "12"),
      backgroundColor: token("surface", "background-subtle"),
      borderRadius: token("radius", "xl"),
      border: `2px dashed ${token("surface", "border")}`,
    },
    loading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: token("space", "12"),
      color: token("color", "text-secondary"),
    },
  },

  // Container queries for responsive layout
  "@container": {
    "(min-width: 600px)": {
      gap: token("space", "6"),
    },
    "(min-width: 800px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    },
  },

  // Loading spinner with modern CSS
  spinner: {
    "&::before": {
      content: '""',
      display: "inline-block",
      inlineSize: token("size", "4"),
      blockSize: token("size", "4"),
      border: `2px solid ${token("surface", "border")}`,
      borderBlockStart: `2px solid ${token("color", "primary-500")}`,
      borderRadius: token("radius", "full"),
      animation: `spin ${token("animation", "normal")} linear infinite`,
      marginInlineEnd: token("space", "2"),
    },
  },

  // Alert styling within the list
  alert: {
    backgroundColor: token("color", "primary-50"),
    color: token("color", "primary-700"),
    padding: token("space", "6"),
    borderRadius: token("radius", "lg"),
    border: `1px solid ${token("color", "primary-200")}`,
    textAlign: "center",
    fontSize: token("typography", "sm-size"),
  },
});

// Add keyframes for spinner animation
const spinnerAnimation = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

defineComponent("todo-list-modern", {
  styles: todoListStyles.css + spinnerAnimation,
  render: (attrs: Record<string, string>) => {
    const todos = attrs.todos || "[]";
    const filter = attrs.filter || '{"status":"all"}';
    const loadingAttr = attrs.loading;
    const loading = loadingAttr === "true" || loadingAttr === "1";

    const parsedTodos = safeParseArray<Todo>(todos, []);
    const parsedFilter = safeParse<TodoFilter>(filter, { status: "all" });
    const { classMap } = todoListStyles;

    if (loading) {
      return (
        <div
          id="todo-list"
          class={`${classMap.base} ${classMap.variants?.loading || ""}`}
          data-component="todo-list"
          aria-live="polite"
          aria-label="Loading todos"
        >
          <div class={classMap.spinner}>Loading todos...</div>
        </div>
      );
    }

    if (parsedTodos.length === 0) {
      const alertContent = parsedFilter.status === "all"
        ? "No todos yet. Add one above to get started!"
        : `No ${parsedFilter.status} todos found.`;

      return (
        <div
          id="todo-list"
          class={`${classMap.base} ${classMap.variants?.empty || ""}`}
          data-component="todo-list"
          role="region"
          aria-label="Todo list"
        >
          <div class={classMap.alert}>
            {alertContent}
          </div>
        </div>
      );
    }

    return (
      <div
        id="todo-list"
        class={classMap.base}
        data-component="todo-list"
        role="region"
        aria-label={`Todo list with ${parsedTodos.length} items`}
      >
        {parsedTodos.map((todo) =>
          renderComponent("todo-item-modern", { todo: JSON.stringify(todo) })
        ).join("")}
      </div>
    );
  },
});

// Export JSX component for direct use
export const TodoListModern = ({
  todos,
  filter,
  loading = false,
}: {
  todos: string | readonly Todo[] | Todo[];
  filter: string | object;
  loading?: boolean;
}) => {
  const todosStr = typeof todos === "string" ? todos : JSON.stringify(todos);
  const filterStr = typeof filter === "string"
    ? filter
    : JSON.stringify(filter);

  const props: Record<string, string> = {
    todos: todosStr,
    filter: filterStr,
  };

  if (loading) {
    props.loading = "true";
  }

  return renderComponent("todo-list-modern", props);
};

function safeParse<T>(value: string, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function safeParseArray<T>(value: string, fallback: T[]): T[] {
  const parsed = safeParse<T[] | null>(value, null);
  return Array.isArray(parsed) ? parsed : fallback;
}