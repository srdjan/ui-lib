// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * TodoApp Component
 * Main application component matching PRD layout
 * Features: Header, Add Form, Filter Tabs, Task List
 * Zero exposed HTMX - uses ui-lib API helpers
 */

import { h } from "jsx";
import { defineComponent, get, getBaseThemeCss, hx, lightTheme, darkTheme } from "../../../mod.ts";
import { generateCSS } from "../../../lib/styles/css-generator.ts";

// Import app-specific components
import "./todo-form.tsx";
import "./todo-list.tsx";
import "./todo-stats.tsx";

import type { Todo } from "../api/types.ts";

export type TodoAppProps = {
  todos: readonly Todo[];
  stats: {
    total: number;
    active: number;
    completed: number;
  };
  filter?: "all" | "active" | "completed";
};

defineComponent<TodoAppProps>("todo-app", {
  api: {
    // These route to the main GET "/" handler which renders full page
    filterAll: get("/?filter=all", () => new Response("")),
    filterActive: get("/?filter=active", () => new Response("")),
    filterCompleted: get("/?filter=completed", () => new Response("")),
  },
  render: (props, api) => {
    const { todos, stats, filter = "all" } = props;

    // Generate CSS
    const themeCSS = getBaseThemeCss([lightTheme, darkTheme], {
      includeSystemPreference: true,
      defaultTheme: "light",
    });
    const componentCSS = generateCSS();

    const appContent = (
      <div class="container container--md">
        <div class="stack stack--vertical stack--gap-xl">
          {/* App Header */}
          <div class="app-header">
            <h1 class="app-title">✓ My Tasks</h1>
            <p class="app-subtitle">
              {stats.active} active • {stats.completed} completed
            </p>
          </div>

          {/* Add New Task Form */}
          <div class="card card--elevated">
            <div class="stack stack--vertical stack--gap-sm">
              <h2 class="section-header">Add New Task</h2>
              <todo-form />
            </div>
          </div>

          {/* Filter Tabs - using API helpers to hide HTMX */}
          <div class="filter-tabs">
            <button
              type="button"
              class={`filter-tab ${filter === "all" ? "active" : ""}`}
              {...api!.filterAll(hx({ target: "body", swap: "outerHTML", pushUrl: true }))}
            >
              All ({stats.total})
            </button>
            <button
              type="button"
              class={`filter-tab ${filter === "active" ? "active" : ""}`}
              {...api!.filterActive(hx({ target: "body", swap: "outerHTML", pushUrl: true }))}
            >
              Active ({stats.active})
            </button>
            <button
              type="button"
              class={`filter-tab ${filter === "completed" ? "active" : ""}`}
              {...api!.filterCompleted(hx({ target: "body", swap: "outerHTML", pushUrl: true }))}
            >
              Completed ({stats.completed})
            </button>
          </div>

          {/* Task List */}
          <div class="card card--elevated">
            <div class="stack stack--vertical stack--gap-md">
              <h2 class="section-header">Your Tasks</h2>
              <todo-list todos={todos} emptyMessage={`No ${filter} tasks yet.`} />
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>My Tasks - Todo App</title>
          <script src="https://unpkg.com/htmx.org"></script>
          <script src="https://unpkg.com/htmx-ext-json-enc@2.0.1/json-enc.js">
          </script>
          <style dangerouslySetInnerHTML={{ __html: themeCSS }}></style>
          <style dangerouslySetInnerHTML={{ __html: componentCSS }}></style>
        </head>
        <body>
          {appContent}
        </body>
      </html>
    );
  },
});

export const TodoApp = "todo-app";
