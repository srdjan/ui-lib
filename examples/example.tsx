/** @jsx h */
import {
  defineComponent,
  del,
  h,
  patch,
  renderComponent,
  toggleClasses,
} from "../src/index.ts";
import type { GeneratedApiMap } from "../src/index.ts";

import {
  activateTab,
  resetCounter,
  syncCheckboxToClass,
  toggleParentClass,
  updateParentCounter,
} from "./dom-actions.ts";

// 🎉 NEW: Unified Styles API Showcase
defineComponent("unified-card", {
  props: (attrs) => ({
    title: attrs.title || "Unified Styles",
    highlighted: "highlighted" in attrs,
  }),
  styles: {
    // ✨ Define class names and styles together!
    card: `.card { border: 2px solid #e9ecef; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; background: white; transition: all 0.2s ease; }`,
    title: `.card-title { font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem; color: #495057; }`,
    content: `.card-content { color: #6c757d; line-height: 1.5; }`,
    highlight: `.card-highlight { border-color: #007bff !important; background: #f8f9ff; box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15); }`,
  },
  render: ({ title, highlighted }, _api, classes) => (
    <div class={`${classes!.card} ${highlighted ? classes!.highlight : ""}`}>
      <h3 class={classes!.title}>{title}</h3>
      <div class={classes!.content}>
        <p>🚀 This component uses the new unified styles API!</p>
        <p>✅ No more duplication between classes and styles</p>
        <p>🎯 Class names are automatically extracted from CSS selectors</p>
        <p>💡 Much cleaner and more maintainable</p>
      </div>
    </div>
  ),
});

// Theme Toggle - Pure DOM State
defineComponent("theme-toggle", {
  styles: {
    button: `.theme-btn { padding: 0.5rem 1rem; border: 2px solid; border-radius: 6px; cursor: pointer; font-weight: 500; transition: border-color 0.2s ease, box-shadow 0.2s ease; background: none; }`,
    buttonLight: `.theme-btn.light { background: #fff; color: #333; border-color: #ddd; }`,
    buttonLightHover: `.theme-btn.light:hover { border-color: #007bff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }`,
    buttonDark: `.theme-btn.dark { background: #2d3748; color: #f7fafc; border-color: #4a5568; }`,
    buttonDarkHover: `.theme-btn.dark:hover { border-color: #63b3ed; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }`,
    lightIcon: `.light-icon { display: inline; }`,
    darkIcon: `.dark-icon { display: inline; }`,
    iconHiddenInDark: `.theme-btn.dark .light-icon, .theme-btn.light .dark-icon { display: none !important; }`,
    iconVisibleInTheme: `.theme-btn.dark .dark-icon, .theme-btn.light .light-icon { display: inline; }`
  },
  render: (
    _props: Record<string, never>,
    _api: undefined,
    classes?: Record<string, string>,
  ) => (
    <button
      type="button"
      class={`${classes!.button} light`}
      onclick={toggleClasses(["light", "dark"])}
    >
      <span class={classes!.lightIcon}>☀️ Light</span>
      <span class={classes!.darkIcon}>🌙 Dark</span>
    </button>
  ),
});

// Counter - Props transformer for numbers
defineComponent("counter", {
  props: (attrs) => ({
    initialCount: parseInt(attrs.initialCount || "0"),
    step: parseInt(attrs.step || "1"),
  }),
  styles: {
    container: `.counter { display: inline-flex; gap: 0.5rem; padding: 1rem; border: 2px solid #007bff; border-radius: 6px; align-items: center; background: white; }`,
    button: `.counter-btn { padding: 0.5rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; min-width: 2rem; font-weight: bold; }`,
    buttonHover: `.counter-btn:hover { background: #0056b3; }`,
    display: `.count-display { font-size: 1.5rem; min-width: 3rem; text-align: center; font-weight: bold; color: #007bff; }`
  },
  render: (
    { initialCount, step }: { initialCount: number; step: number },
    _api: undefined,
    classes?: Record<string, string>,
  ) => (
    <div class={classes!.container} data-count={initialCount}>
      <button
        type="button"
        class={classes!.button}
        onclick={updateParentCounter(
          `.${classes!.container}`,
          `.${classes!.display}`,
          -step,
        )}
      >
        -{step}
      </button>
      <span class={classes!.display}>{initialCount}</span>
      <button
        type="button"
        class={classes!.button}
        onclick={updateParentCounter(
          `.${classes!.container}`,
          `.${classes!.display}`,
          step,
        )}
      >
        +{step}
      </button>
      <button
        type="button"
        class={classes!.button}
        onclick={resetCounter(
          `.${classes!.display}`,
          initialCount,
          `.${classes!.container}`,
        )}
      >
        Reset
      </button>
    </div>
  ),
});

// Todo Item - HTMX Integration
defineComponent("todo-item", {
  props: (attrs) => ({
    id: attrs.id,
    text: attrs.text,
    done: "done" in attrs,
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
        }),
      );
    }),
    remove: del("/api/todos/:id", (_req, _params) => {
      return new Response(null, { status: 200 });
    }),
  },
  styles: {
    item: `.todo { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 0.5rem; background: white; transition: background-color 0.2s; }`,
    itemDone: `.todo.done { background: #f8f9fa; opacity: 0.8; }`,
    checkbox: `.todo-checkbox { margin-right: 0.5rem; }`,
    text: `.todo-text { flex: 1; font-size: 1rem; }`,
    textDone: `.todo.done .todo-text { text-decoration: line-through; color: #6c757d; }`,
    deleteBtn: `.delete-btn { background: #dc3545; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; line-height: 1; }`,
    deleteBtnHover: `.delete-btn:hover { background: #c82333; }`
  },
  render: (
    { id, text, done }: { id: string; text: string; done: boolean },
    api: GeneratedApiMap,
    classes?: Record<string, string>,
  ) => {
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
        <button type="button" class={classes!.deleteBtn} {...api.remove(id)}>
          ×
        </button>
      </div>
    );
  },
});

// Accordion - showcasing new unified styles API!
defineComponent("accordion", {
  props: (attrs) => ({
    title: attrs.title,
    content: attrs.content,
    initiallyOpen: "initiallyOpen" in attrs,
  }),
  styles: {
    container: `.accordion { border: 1px solid #ddd; border-radius: 6px; margin-bottom: 0.5rem; overflow: hidden; }`,
    header: `.accordion-header { background: #f8f9fa; padding: 1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: 500; user-select: none; transition: background-color 0.2s; }`,
    headerHover: `.accordion-header:hover { background: #e9ecef; }`,
    icon: `.accordion-icon { transition: transform 0.2s; font-size: 1.2rem; }`,
    iconOpen: `.accordion.open .accordion-icon { transform: rotate(180deg); }`,
    content: `.accordion-content { padding: 0 1rem; max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease; }`,
    contentOpen: `.accordion.open .accordion-content { max-height: 500px; padding: 1rem; }`
  },
  render: (
    { title, content, initiallyOpen }: {
      title: string;
      content: string;
      initiallyOpen: boolean;
    },
    _api: undefined,
    classes?: Record<string, string>,
  ) => (
    <div class={`${classes!.container} ${initiallyOpen ? "open" : ""}`}>
      <div class={classes!.header} onclick={toggleParentClass("open")}>
        <span>{title}</span>
        <span class={classes!.icon}>▼</span>
      </div>
      <div class={classes!.content}>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    </div>
  ),
});

// Tabs
defineComponent("tabs", {
  props: (attrs) => ({
    tabs: attrs.tabs || "",
    activeTab: attrs.activeTab || "",
  }),
  styles: {
    container: `.tabs-container { border: 1px solid #ddd; border-radius: 6px; overflow: hidden; }`,
    nav: `.tabs-nav { display: flex; background: #f8f9fa; border-bottom: 1px solid #ddd; }`,
    button: `.tab-btn { flex: 1; padding: 1rem; background: none; border: none; cursor: pointer; font-size: 1rem; transition: background-color 0.2s; }`,
    buttonHover: `.tab-btn:hover { background: #e9ecef; }`,
    buttonActive: `.tab-btn.active { background: white; border-bottom: 2px solid #007bff; font-weight: 500; color: #007bff; }`,
    content: `.tab-content { padding: 1.5rem; min-height: 200px; }`,
    panel: `.tab-panel { display: none; }`,
    panelActive: `.tab-panel.active { display: block; }`
  },
  render: (
    { tabs, activeTab }: { tabs: string; activeTab: string },
    _api: undefined,
    classes?: Record<string, string>,
  ) => {
    const tabList = tabs.split(",").map((t) => t.trim());
    const active = activeTab || tabList[0];

    return (
      <div class={classes!.container}>
        <div class={classes!.nav}>
          {tabList.map((tab) => (
            <button
              type="button"
              class={`${classes!.button} ${tab === active ? "active" : ""}`}
              onclick={activateTab(
                `.${classes!.container}`,
                `.${classes!.button}`,
                `.${classes!.content}`,
                "active",
              )}
              data-tab={tab}
            >
              {tab}
            </button>
          ))}
        </div>
        <div class={classes!.content}>
          {tabList.map((tab) => (
            <div
              class={`${classes!.panel} ${tab === active ? "active" : ""}`}
              data-tab-content={tab}
            >
              <h3>{tab} Content</h3>
              <p>
                This is the content for the {tab}{" "}
                tab. Each tab can contain different content, components, or
                interactive elements.
              </p>
              {tab === "Settings" && (
                <div>
                  <label>
                    <input type="checkbox" /> Enable notifications
                  </label>
                  <br />
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
  },
});

console.log("✅ All examples registered from example.tsx");
