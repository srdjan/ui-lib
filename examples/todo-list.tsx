import { html, raw } from "../src/lib/ssr.ts";
import { component } from "../src/index.ts";

// Todo list component following the documentation
component("f-todo-list")
  .state({
    tasks: [] as Array<{ id: string; text: string; done: boolean }>,
  })
  .actions({
    addTask: (state, ...args) => {
      const text = args[0] as string;
      if (!text || typeof text !== "string" || !text.trim()) return {};
      const currentState = state as { tasks: Array<{ id: string; text: string; done: boolean }> };
      return {
        tasks: [...currentState.tasks, {
          id: Date.now().toString(),
          text: text.trim(),
          done: false,
        }],
      };
    },
    toggleTask: (state, ...args) => {
      const id = args[0] as string;
      const currentState = state as { tasks: Array<{ id: string; text: string; done: boolean }> };
      return {
        tasks: currentState.tasks.map((task) =>
          task.id === id ? { ...task, done: !task.done } : task
        ),
      };
    },
  })
  .view((state, _props, actions) => {
    const currentState = state as { 
      tasks: Array<{ id: string; text: string; done: boolean }>;
    };
    const { htmxAction } = actions as { htmxAction: (action: string, args?: unknown[]) => string };
    
    const taskItems = currentState.tasks.length === 0 ? 
      "<p>No tasks yet.</p>" :
      currentState.tasks.map((task) => html`
        <div data-key="${task.id}" class="task ${task.done ? "done" : ""}">
          <input
            type="checkbox"
            ${task.done ? "checked" : ""}
            ${raw(htmxAction('toggleTask', [task.id]))}
          />
          <span>${task.text}</span>
        </div>
      `).join("");
    
    return html`
      <div class="todo-list">
        <form ${raw(htmxAction('addTask', []))} hx-trigger="submit">
          <div class="input-section">
            <input
              type="text"
              value=""
              placeholder="Add a task..."
              name="taskText"
              required
            />
            <button type="submit">Add</button>
          </div>
        </form>
        <div class="tasks">
          ${raw(taskItems)}
        </div>
      </div>
    `;
  });