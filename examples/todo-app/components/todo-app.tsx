/** @jsx h */
/**
 * TodoApp Component
 * Main application component that orchestrates all todo functionality
 */

import { defineComponent, h } from "../../../lib/define-component.ts";
import { renderComponent } from "../../../lib/component-state.ts";
import { generateCSS } from "../../../lib/styles/css-generator.ts";

// Import all layout components
import "../../../lib/components/layout/page.tsx";
import "../../../lib/components/layout/stack.tsx";
import "../../../lib/components/layout/section.tsx";
import "../../../lib/components/layout/header.tsx";

// Import app-specific components
import "./todo-form.tsx";
import "./todo-stats.tsx";
import "./todo-list.tsx";

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

    // Build page content using layout components
    const headerContent = renderComponent("header", {
      title: "Clean Component Architecture Demo",
      subtitle: "Todo App Built with Separated Components",
      description: "This demonstrates a refactored todo application using separated component files, library layout components, and clean architecture patterns.",
      level: "1",
      centered: "true",
    });

    const addTodoSection = renderComponent("section", {
      title: "Add New Todo",
    }).replace("{{children}}", renderComponent("todo-form", {}));

    const statsSection = renderComponent("section", {}).replace(
      "{{children}}",
      renderComponent("todo-stats", { stats })
    );

    const todosSection = renderComponent("section", {
      title: `Your Todos (${todos.length} items)`,
    }).replace("{{children}}", renderComponent("todo-list", { todos }));

    const stackContent = renderComponent("stack", {
      spacing: "2xl",
    }).replace("{{children}}", [
      headerContent,
      addTodoSection,
      statsSection,
      todosSection,
    ].join(""));

    const pageContent = renderComponent("page", {
      variant: "constrained",
    }).replace("{{children}}", stackContent);

    // Generate CSS for the application
    const css = generateCSS();

    return (
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Clean Component Architecture Demo - ui-lib</title>
          <style dangerouslySetInnerHTML={{ __html: css }} />
          <script src="https://unpkg.com/htmx.org@1.9.10"></script>
          <script src="https://unpkg.com/htmx.org@1.9.10/dist/ext/json-enc.js"></script>
          <script dangerouslySetInnerHTML={{ __html: `
            window.editTodo = function(id) {
              alert('Edit UI not implemented in MVP');
            };
            window.deleteTodo = function(id) {
              if (confirm('Are you sure you want to delete this todo?')) {
                fetch('/api/todos/' + id, { method: 'DELETE' })
                  .then(() => location.reload());
              }
            };
          ` }} />
        </head>
        <body dangerouslySetInnerHTML={{ __html: pageContent }} />
      </html>
    );
  },
});

export const TodoApp = "todo-app";