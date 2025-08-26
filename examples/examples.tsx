/** @jsx h */
import {
  defineComponent,
  h,
  renderComponent,
  toggleClasses,
  patch,
  del,
} from "../src/index.ts";

import {
  activateTab,
  resetCounter,
  syncCheckboxToClass,
  toggleParentClass,
  updateParentCounter,
} from "./dom-actions.ts";

// Theme Toggle - Pure DOM State Management (no props needed)
defineComponent("theme-toggle", {
  classes: {
    button: "theme-btn",
    lightIcon: "light-icon",
    darkIcon: "dark-icon"
  },
  styles: `
    .theme-btn {
      padding: 0.5rem 1rem;
      border: 2px solid;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      background: none;
    }
    .theme-btn.light {
      background: #fff;
      color: #333;
      border-color: #ddd;
    }
    .theme-btn.light:hover {
      border-color: #007bff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .theme-btn.dark {
      background: #2d3748;
      color: #f7fafc;
      border-color: #4a5568;
    }
    .theme-btn.dark:hover {
      border-color: #63b3ed;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    .theme-btn.dark .light-icon,
    .theme-btn.light .dark-icon {
      display: none !important;
    }
    .theme-btn.dark .dark-icon,
    .theme-btn.light .light-icon {
      display: inline;
    }
  `,
  render: (_props, _api, classes) => (
    <button
      type="button"
      class={`${classes!.button} light`}
      onclick={toggleClasses(["light", "dark"])}
    >
      <span class={classes!.lightIcon}>☀️ Light</span>
      <span class={classes!.darkIcon}>🌙 Dark</span>
    </button>
  )
});

// Enhanced Counter with Props Transformer
defineComponent("counter", {
  props: (attrs) => ({
    initialCount: parseInt(attrs.initialCount || "0"),
    step: parseInt(attrs.step || "1")
  }),
  classes: {
    container: "counter",
    button: "counter-btn",
    display: "count-display"
  },
  styles: `
    .counter {
      display: inline-flex;
      gap: 0.5rem;
      padding: 1rem;
      border: 2px solid #007bff;
      border-radius: 6px;
      align-items: center;
      background: white;
    }
    .counter-btn {
      padding: 0.5rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      min-width: 2rem;
      font-weight: bold;
    }
    .counter-btn:hover {
      background: #0056b3;
    }
    .count-display {
      font-size: 1.5rem;
      min-width: 3rem;
      text-align: center;
      font-weight: bold;
      color: #007bff;
    }
  `,
  render: ({ initialCount, step }, _api, classes) => (
    <div class={classes!.container} data-count={initialCount}>
      <button
        type="button"
        class={classes!.button}
        onclick={updateParentCounter(`.${classes!.container}`, `.${classes!.display}`, -step)}
      >        -{step}
      </button>
      <span class={classes!.display}>{initialCount}</span>
      <button
        type="button"
        class={classes!.button}
        onclick={updateParentCounter(`.${classes!.container}`, `.${classes!.display}`, step)}
      >
        +{step}
      </button>
      <button
        type="button"
        class={classes!.button}
        onclick={resetCounter(`.${classes!.display}`, initialCount, `.${classes!.container}`)}
      >
        Reset
      </button>
    </div>
  )
});

// Todo Item with HTMX Integration
defineComponent("todo-item", {
  props: (attrs) => ({
    id: attrs.id,
    text: attrs.text,
    done: "done" in attrs
  }),
  api: {
    toggle: patch("/api/todos/:id/toggle", async (req, params) => {
      const form = await req.formData();
      const isDone = form.get("done") === "true";
      return new Response(
        renderComponent("todo-item", {
          id: params.id,
          text: "Task updated!",
          done: !isDone,
        })
      );
    }),
    remove: del("/api/todos/:id", (_req, _params) => {
      return new Response(null, { status: 200 });
    }),
  },
  classes: {
    item: "todo",
    checkbox: "todo-checkbox",
    text: "todo-text",
    deleteBtn: "delete-btn"
  },
  styles: `
    .todo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: white;
      transition: background-color 0.2s;
    }
    .todo.done {
      background: #f8f9fa;
      opacity: 0.8;
    }
    .todo-checkbox {
      margin-right: 0.5rem;
    }
    .todo-text {
      flex: 1;
      font-size: 1rem;
    }
    .todo.done .todo-text {
      text-decoration: line-through;
      color: #6c757d;
    }
    .delete-btn {
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      line-height: 1;
    }
    .delete-btn:hover {
      background: #c82333;
    }
  `,
  // @ts-ignore - example doesn't need strict types
  render: ({ id, text, done }, api, classes) => {
    const todoClass = `${classes!.item} ${done ? "done" : ""}`;
    return (
      <div class={todoClass} data-id={id}>
        <input
          type="checkbox"
          class={classes!.checkbox}
          checked={done}
          onChange={syncCheckboxToClass("done")}
          {...api.toggle(id)}
        />
        <span class={classes!.text}>{text}</span>
        <button
          type="button"
          class={classes!.deleteBtn}
          {...api.remove(id)}
        >
          ×
        </button>
      </div>
    );
  }
});

// Accordion Component
defineComponent("accordion", {
  props: (attrs) => ({
    title: attrs.title,
    content: attrs.content,
    initiallyOpen: "initiallyOpen" in attrs
  }),
  classes: {
    container: "accordion",
    header: "accordion-header", 
    content: "accordion-content",
    icon: "accordion-icon"
  },
  styles: `
    .accordion {
      border: 1px solid #ddd;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      overflow: hidden;
    }
    .accordion-header {
      background: #f8f9fa;
      padding: 1rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      user-select: none;
      transition: background-color 0.2s;
    }
    .accordion-header:hover {
      background: #e9ecef;
    }
    .accordion-icon {
      transition: transform 0.2s;
      font-size: 1.2rem;
    }
    .accordion.open .accordion-icon {
      transform: rotate(180deg);
    }
    .accordion-content {
      padding: 0 1rem;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease, padding 0.3s ease;
    }
    .accordion.open .accordion-content {
      max-height: 500px;
      padding: 1rem;
    }
  `,
  render: ({ title, content, initiallyOpen }, _api, classes) => (
    <div class={`${classes!.container} ${initiallyOpen ? "open" : ""}`}>
      <div
        class={classes!.header}
        onclick={toggleParentClass("open")}
      >
        <span>{title}</span>
        <span class={classes!.icon}>▼</span>
      </div>
      <div class={classes!.content}>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    </div>
  )
});

// Tabs Component
defineComponent("tabs", {
  props: (attrs) => ({
    tabs: attrs.tabs || "",
    activeTab: attrs.activeTab || ""
  }),
  classes: {
    container: "tabs-container",
    nav: "tabs-nav",
    button: "tab-btn", 
    content: "tab-content",
    panel: "tab-panel"
  },
  styles: `
    .tabs-container {
      border: 1px solid #ddd;
      border-radius: 6px;
      overflow: hidden;
    }
    .tabs-nav {
      display: flex;
      background: #f8f9fa;
      border-bottom: 1px solid #ddd;
    }
    .tab-btn {
      flex: 1;
      padding: 1rem;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }
    .tab-btn:hover {
      background: #e9ecef;
    }
    .tab-btn.active {
      background: white;
      border-bottom: 2px solid #007bff;
      font-weight: 500;
      color: #007bff;
    }
    .tab-content {
      padding: 1.5rem;
      min-height: 200px;
    }
    .tab-panel {
      display: none;
    }
    .tab-panel.active {
      display: block;
    }
  `,
  render: ({ tabs, activeTab }, _api, classes) => {
    const tabList = (tabs as string).split(",").map((t: string) => t.trim());
    const active = activeTab || tabList[0];
    
    return (
      <div class={classes!.container}>
        <div class={classes!.nav}>
          {tabList.map((tab: string) => (
            <button
              type="button"
              class={`${classes!.button} ${tab === active ? "active" : ""}`}
              onclick={activateTab(`.${classes!.container}`, `.${classes!.button}`, `.${classes!.content}`, "active")}
              data-tab={tab}
            >
              {tab}
            </button>
          ))}
        </div>
        <div class={classes!.content}>
          {tabList.map((tab: string) => (
            <div 
              class={`${classes!.panel} ${tab === active ? "active" : ""}`}
              data-tab-content={tab}
            >
              <h3>{tab} Content</h3>
              <p>This is the content for the {tab} tab. Each tab can contain different content, components, or interactive elements.</p>
              {tab === "Settings" && (
                <div>
                  <label>
                    <input type="checkbox" /> Enable notifications
                  </label><br/>
                  <label>
                    <input type="checkbox" /> Auto-save changes
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
});

console.log("✅ All defineComponent examples loaded successfully!");