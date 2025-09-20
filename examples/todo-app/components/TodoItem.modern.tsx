/**
 * TodoItem Component - Modern CSS Architecture Version
 * Individual todo item with modern CSS patterns, design tokens, and container queries
 */

import { h } from "../../../lib/jsx-runtime.ts";
import { Button } from "../../../mod-simple.ts";
import {
  boolean,
  defineComponent,
  del,
  post,
  renderComponent,
  string,
} from "../../../mod.ts";
import { css, token } from "../../../lib/modern-css.ts";
import { todoAPI } from "../api/index.ts";
import type { Todo } from "../api/types.ts";

// Helper to generate target for this todo item
const getTargetFor = (id: string) => `#todo-${id}`;

// Create modern CSS styles using the new architecture
const todoItemStyles = css.responsive("todo-item", {
  // Base component styles using design tokens
  base: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: token("space", "6"), // 1.5rem = 24px
    marginBlockEnd: token("space", "3"), // 0.75rem = 12px
    backgroundColor: token("surface", "background"),
    border: `1px solid ${token("surface", "border")}`,
    borderRadius: token("radius", "lg"),
    transition: `all ${token("animation", "fast")} ${token("animation", "ease")}`,

    // Container query setup
    containerType: "inline-size",

    // Modern focus management
    "&:focus-within": {
      borderColor: token("color", "primary-500"),
      boxShadow: token("shadow", "focus"),
    },

    // Hover effects
    "&:hover": {
      borderColor: token("surface", "border-hover"),
      boxShadow: token("shadow", "sm"),
    },
  },

  // State variants using data attributes
  variants: {
    completed: {
      opacity: "0.7",
      backgroundColor: token("surface", "background-subtle"),
    },
    priority: {
      high: {
        borderInlineStart: `4px solid ${token("color", "danger-500")}`,
      },
      medium: {
        borderInlineStart: `4px solid ${token("color", "warning-500")}`,
      },
      low: {
        borderInlineStart: `4px solid ${token("color", "success-500")}`,
      },
    },
  },

  // Container queries for responsive layout
  "@container": {
    "(max-width: 400px)": {
      flexDirection: "column",
      gap: token("space", "3"),
    },
    "(min-width: 500px)": {
      padding: token("space", "8"),
    },
  },

  // Nested component styles
  content: {
    display: "flex",
    alignItems: "flex-start",
    gap: token("space", "4"),
    flex: "1",

    // Checkbox styles
    input: {
      marginBlockStart: token("space", "1"),
      inlineSize: token("size", "4"),
      blockSize: token("size", "4"),
      cursor: "pointer",
      accentColor: token("color", "primary-500"),
    },
  },

  details: {
    flex: "1",
    minInlineSize: "0", // Prevent overflow
  },

  text: {
    display: "block",
    fontSize: token("typography", "base-size"),
    lineHeight: token("typography", "base-height"),
    color: token("color", "text-primary"),
    marginBlockEnd: token("space", "2"),

    // Completed state styling
    "[data-completed='true'] &": {
      textDecoration: "line-through",
      color: token("color", "text-secondary"),
    },
  },

  meta: {
    display: "flex",
    alignItems: "center",
    gap: token("space", "3"),
    flexWrap: "wrap",
  },

  badge: {
    fontSize: token("typography", "xs-size"),
    fontWeight: token("typography", "semibold"),
    color: token("color", "white"),
    padding: `${token("space", "1")} ${token("space", "3")}`,
    borderRadius: token("radius", "full"),
    textTransform: "uppercase",
    letterSpacing: token("typography", "tracking-wide"),

    // Priority-specific colors
    "&[data-priority='high']": {
      backgroundColor: token("color", "danger-500"),
    },
    "&[data-priority='medium']": {
      backgroundColor: token("color", "warning-500"),
    },
    "&[data-priority='low']": {
      backgroundColor: token("color", "success-500"),
    },
  },

  date: {
    fontSize: token("typography", "sm-size"),
    color: token("color", "text-tertiary"),
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: token("space", "2"),
    marginInlineStart: token("space", "4"),

    // Responsive stacking on small containers
    "@container": {
      "(max-width: 400px)": {
        marginInlineStart: "0",
        justifyContent: "flex-end",
      },
    },
  },

  deleteBtn: {
    backgroundColor: "transparent",
    color: token("color", "danger-500"),
    border: `1px solid ${token("color", "danger-200")}`,
    padding: `${token("space", "1")} ${token("space", "2")}`,
    borderRadius: token("radius", "md"),
    fontSize: token("typography", "sm-size"),
    cursor: "pointer",
    transition: `all ${token("animation", "fast")} ${token("animation", "ease")}`,

    "&:hover": {
      backgroundColor: token("color", "danger-50"),
      borderColor: token("color", "danger-300"),
    },

    "&:focus-visible": {
      outline: `2px solid ${token("color", "danger-500")}`,
      outlineOffset: "2px",
    },
  },
});

defineComponent("todo-item-modern", {
  api: {
    toggleTodo: post(
      "/api/todos/:id/toggle",
      (req, params) => {
        const id = (params as Record<string, string>).id ??
          (params as Record<string, string>)["i"];
        if (!id) throw new Error("Missing todo id in route params");
        return todoAPI.toggleTodo(req, { id });
      },
    ),
    deleteTodo: del(
      "/api/todos/:id",
      (req, params) => {
        const id = (params as Record<string, string>).id ??
          (params as Record<string, string>)["i"];
        if (!id) throw new Error("Missing todo id in route params");
        return todoAPI.deleteTodo(req, { id });
      },
    ),
  },
  // Use the modern CSS system
  styles: todoItemStyles.css,
  render: ({
    todo = string(""),
    showActions = boolean(true),
  }, api) => {
    const parsedTodo = parseTodo(typeof todo === "string" ? todo : "");
    const { classMap } = todoItemStyles;

    const target = getTargetFor(parsedTodo.id);

    const toggleAction = api?.toggleTodo ? api.toggleTodo(parsedTodo.id, {
      target,
      swap: "outerHTML",
    }) : "";

    const deleteAction = api?.deleteTodo ? api.deleteTodo(parsedTodo.id, {
      target: "#todo-list",
      swap: "outerHTML",
      confirm: "Are you sure you want to delete this todo?",
    }) : "";

    return (
      <div
        class={classMap.base}
        data-completed={parsedTodo.completed.toString()}
        data-priority={parsedTodo.priority}
        id={`todo-${parsedTodo.id}`}
        style={`container-name: todo-${parsedTodo.id}`}
      >
        <div class={classMap.content}>
          <input
            type="checkbox"
            checked={parsedTodo.completed}
            onAction={toggleAction}
            aria-label={`Mark "${parsedTodo.text}" as ${parsedTodo.completed ? 'incomplete' : 'complete'}`}
          />

          <div class={classMap.details}>
            <span class={classMap.text}>{parsedTodo.text}</span>
            <div class={classMap.meta}>
              <span
                class={classMap.badge}
                data-priority={parsedTodo.priority}
              >
                {parsedTodo.priority}
              </span>
              <span class={classMap.date}>
                {new Date(parsedTodo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {(typeof showActions === "boolean" ? showActions : true) && (
          <div class={classMap.actions}>
            <Button
              size="sm"
              variant="ghost"
              onClick={`editTodo('${parsedTodo.id}')`}
              aria-label={`Edit "${parsedTodo.text}"`}
            >
              Edit
            </Button>

            <button
              type="button"
              class={classMap.deleteBtn}
              onAction={deleteAction}
              aria-label={`Delete "${parsedTodo.text}"`}
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
export const TodoItemModern = (
  { todo, showActions = "true" }: { todo: Todo | string; showActions?: string },
) => {
  const todoStr = typeof todo === "string" ? todo : JSON.stringify(todo);
  return renderComponent("todo-item-modern", { todo: todoStr, showActions });
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