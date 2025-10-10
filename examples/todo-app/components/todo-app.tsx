// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * TodoApp Component
 * Main application component that orchestrates all todo functionality
 */

import { h } from "jsx";
import { defineComponent, getBaseThemeCss, lightTheme, darkTheme } from "../../../mod.ts";
import { generateCSS } from "../../../lib/styles/css-generator.ts";
import "../../../lib/components/layout/container.ts";
import "../../../lib/components/layout/grid.ts";
import "../../../lib/components/layout/card.ts";
import "../../../lib/components/layout/stack.ts";

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
};

defineComponent<TodoAppProps>("todo-app", {
  render: (props) => {
    const { todos, stats } = props;

    // Generate CSS
    const themeCSS = getBaseThemeCss([lightTheme, darkTheme], {
      includeSystemPreference: true,
      defaultTheme: "light",
    });
    const componentCSS = generateCSS();

    const appContent = (
      <container size="lg">
        <stack direction="vertical" gap="xl">
          <stack direction="vertical" gap="sm" align="center">
            <h1>Composition-Only Architecture Demo</h1>
            <p>
              Todo app using only library components with variants - no custom
              CSS
            </p>
          </stack>

          <grid columns="2" gap="lg" responsive>
            <card variant="elevated" padding="lg">
              <stack direction="vertical" gap="md">
                <stack direction="vertical" gap="xs">
                  <h2>Add New Todo</h2>
                  <p>
                    Capture a task and assign a priority
                  </p>
                </stack>
                <todo-form />
              </stack>
            </card>

            <card variant="elevated" padding="lg">
              <stack direction="vertical" gap="md">
                <stack direction="vertical" gap="xs">
                  <h2>Stats</h2>
                  <p>
                    Completion progress snapshot
                  </p>
                </stack>
                <todo-stats stats={stats} />
              </stack>
            </card>

            <card variant="elevated" padding="lg" span="2">
              <stack direction="vertical" gap="md">
                <stack direction="vertical" gap="xs">
                  <h2>Your Todos ({todos.length})</h2>
                  <p>
                    Sorted by creation time with priority indicators
                  </p>
                </stack>
                <todo-list todos={todos} />
              </stack>
            </card>
          </grid>
        </stack>
      </container>
    );

    return (
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Composition-Only Architecture Demo - ui-lib</title>
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
