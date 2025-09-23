// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * TodoApp Component
 * Main application component that orchestrates all todo functionality
 */

import { h } from "jsx";
import { defineComponent } from "../../../lib/define-component.ts";
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
};

defineComponent<TodoAppProps>("todo-app", {
  render: (props) => {
    const { todos, stats } = props;
    const css = generateCSS();
    const componentStyles = `
      .todo-app {
        max-width: 960px;
        margin: 0 auto;
        padding: 2.5rem 1.5rem 4rem;
        display: grid;
        gap: 2.5rem;
      }

      .todo-app__hero {
        display: grid;
        gap: 0.5rem;
        text-align: center;
      }

      .todo-app__tagline {
        margin: 0;
        font-size: 1.05rem;
        color: var(--color-text-secondary, #6b7280);
      }

      .todo-app__content {
        display: grid;
        gap: 2rem;
      }

      @media (min-width: 960px) {
        .todo-app__content {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          align-items: start;
        }

        .todo-app__panel:last-of-type {
          grid-column: span 2;
        }
      }

      .todo-app__panel {
        background: var(--surface-background, #ffffff);
        border: 1px solid var(--surface-border, #e5e7eb);
        border-radius: 1.5rem;
        padding: 1.75rem;
        box-shadow: 0 24px 40px rgba(15, 23, 42, 0.08);
        display: grid;
        gap: 1.5rem;
      }

      .todo-app__panel-header h2 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
      }

      .todo-app__panel-header p {
        margin: 0.5rem 0 0;
        color: var(--color-text-secondary, #6b7280);
        font-size: 0.95rem;
      }

      .todo-form__header {
        display: grid;
        gap: 0.35rem;
      }

      .todo-form__header h2 {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 600;
      }

      .todo-form__header p {
        margin: 0;
        color: var(--color-text-secondary, #6b7280);
        font-size: 0.9rem;
      }

      .todo-form__body {
        display: grid;
        gap: 1rem;
      }

      .form-field {
        display: grid;
        gap: 0.5rem;
      }

      .form-field label {
        font-weight: 600;
        font-size: 0.95rem;
      }

      .form-field input,
      .form-field select {
        font: inherit;
        border-radius: 0.9rem;
        border: 1px solid var(--surface-border, #d1d5db);
        padding: 0.65rem 0.85rem;
        transition: border-color 120ms ease, box-shadow 120ms ease;
      }

      .form-field input:focus,
      .form-field select:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.16);
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
      }

      .form-actions button {
        border: none;
        border-radius: 0.9rem;
        background: #2563eb;
        color: #fff;
        font-weight: 600;
        padding: 0.65rem 1.35rem;
        cursor: pointer;
        transition: filter 120ms ease, transform 120ms ease;
      }

      .form-actions button:hover {
        filter: brightness(0.94);
        transform: translateY(-1px);
      }

      .todo-stats__grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      }

      .todo-stat {
        background: rgba(37, 99, 235, 0.08);
        border-radius: 1rem;
        padding: 1.25rem;
        display: grid;
        gap: 0.35rem;
        text-align: center;
      }

      .todo-stat--success {
        background: rgba(16, 185, 129, 0.12);
      }

      .todo-stat__value {
        font-size: 2rem;
        font-weight: 700;
      }

      .todo-stat__label {
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 0.75rem;
        color: #6b7280;
      }

      .todo-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 1rem;
      }

      .todo-list__item {
        list-style: none;
      }

      .todo-list--empty {
        text-align: center;
        padding: 2.5rem;
        border-radius: 1.25rem;
        border: 1px dashed var(--surface-border, #d1d5db);
        color: var(--color-text-secondary, #6b7280);
        background: rgba(241, 245, 249, 0.45);
      }
    `;
    const styles = `${css}\n${componentStyles}`;

    const appContent = (
      <div class="todo-app">
        <header class="todo-app__hero">
          <h1>Clean Component Architecture Demo</h1>
          <p class="todo-app__tagline">
            Todo app built with separated components, JSX markup, and SSR
            rendering.
          </p>
        </header>

        <main class="todo-app__content">
          <section class="todo-app__panel" aria-labelledby="todo-form-heading">
            <div class="todo-app__panel-header">
              <h2 id="todo-form-heading">Add New Todo</h2>
              <p>
                Capture a task and assign a priority for the active demo user.
              </p>
            </div>
            <todo-form />
          </section>

          <section class="todo-app__panel" aria-labelledby="todo-stats-heading">
            <div class="todo-app__panel-header">
              <h2 id="todo-stats-heading">Stats</h2>
              <p>High-level snapshot of your completion progress.</p>
            </div>
            <todo-stats stats={stats} />
          </section>

          <section class="todo-app__panel" aria-labelledby="todo-list-heading">
            <div class="todo-app__panel-header">
              <h2 id="todo-list-heading">Your Todos ({todos.length})</h2>
              <p>Todos are sorted by creation time with priority indicators.</p>
            </div>
            <todo-list todos={todos} />
          </section>
        </main>
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
          <title>Clean Component Architecture Demo - ui-lib</title>
          <style dangerouslySetInnerHTML={{ __html: styles }} />
          <script src="https://unpkg.com/htmx.org"></script>
<script src="https://unpkg.com/htmx-ext-json-enc@2.0.1/json-enc.js"></script>        </head>
        <body>
          {appContent}
        </body>
      </html>
    );
  },
});

export const TodoApp = "todo-app";
