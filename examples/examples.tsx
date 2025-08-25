/** @jsx h */
import {
  component,
  conditionalClass,
  h,
  renderComponent,
  toggleClasses,
} from "../src/index.ts";

// Import the new defineComponent examples
import "./define-component-example.tsx";
import {
  activateTab,
  resetCounter,
  syncCheckboxToClass,
  toggleParentClass,
  updateParentCounter,
} from "./dom-actions.ts";

// Example 1: Pure DOM-based Theme Toggle
component("f-theme-toggle")
  .styles(`
    .theme-btn { 
      padding: 0.5rem 1rem; 
      border: 2px solid; 
      border-radius: 6px; 
      cursor: pointer; 
      font-weight: 500;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .theme-btn.light { 
      background: #fff; 
      color: #333; 
      border-color: #ddd;
    }
    .theme-btn.light:hover {
      border-color: #007bff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .theme-btn.dark { 
      background: #2d3748; 
      color: #f7fafc; 
      border-color: #4a5568;
    }
    .theme-btn.dark:hover {
      border-color: #63b3ed;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    .theme-btn.dark .light-icon, .theme-btn.light .dark-icon { display: none !important; }
    .theme-btn.dark .dark-icon, .theme-btn.light .light-icon { display: inline; }
  `)
  .view(() => (
    <button
      type="button"
      class="theme-btn light"
      onClick={toggleClasses(["light", "dark"])}
      title="Toggle theme"
    >
      <span class="light-icon">☀️ Light</span>
      <span class="dark-icon">🌙 Dark</span>
    </button>
  ));

// Example 2: Simple Counter with DOM State
component("f-counter")
  .props({ initialCount: "number?", step: "number?" })
  .styles(`
    .counter { display: inline-flex; gap: 0.5rem; align-items: center; padding: 1rem; border: 2px solid #007bff; border-radius: 8px; }
    .counter button { padding: 0.5rem; border: 1px solid #007bff; background: #007bff; color: white; border-radius: 4px; cursor: pointer; }
    .count-display { font-size: 1.5rem; min-width: 3rem; text-align: center; }
  `)
  .view((props) => {
    const count = Number(props.initialCount) || 0;
    const stepValue = Number(props.step) || 1;

    return (
      <div class="counter" data-count={count}>
        <button
          type="button"
          onclick={updateParentCounter(
            ".counter",
            ".count-display",
            -stepValue,
          )}
        >
          -{stepValue}
        </button>
        <span class="count-display">{count}</span>
        <button
          type="button"
          onclick={updateParentCounter(".counter", ".count-display", stepValue)}
        >
          +{stepValue}
        </button>
        <button
          type="button"
          onclick={resetCounter(".count-display", count, ".counter")}
        >
          Reset
        </button>
      </div>
    );
  });

// Example 3: Todo Item with Unified API
component("f-todo-item")
  .props({ id: "string", text: "string", done: "boolean?" })
  .api({
    "PATCH /api/todos/:id/toggle": async (req, params) => {
      const form = await req.formData();
      const isDone = form.get("done") === "true";
      return new Response(
        renderComponent("f-todo-item", {
          id: params.id,
          text: "Toggled item!",
          done: !isDone,
        }),
      );
    },
    "DELETE /api/todos/:id": () => {
      return new Response(null, { status: 200 });
    },
  })
  .styles(`
    .todo { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 0.5rem; }
    .todo.done { background: #f8f9fa; opacity: 0.7; }
    .todo.done .todo-text { text-decoration: line-through; color: #6c757d; }
    .delete-btn { background: #dc3545; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; }
  `)
  .view((props, api) => {
    const isDone = Boolean(props.done);
    const id = props.id as string;
    const text = props.text as string;
    const todoClass = "todo " + conditionalClass(isDone, "done");

    return (
      <div class={todoClass} data-id={id}>
        <input
          type="checkbox"
          checked={isDone}
          onChange={syncCheckboxToClass("done")}
          {...(api?.toggle?.(id) || {})}
        />
        <span class="todo-text">{text}</span>
        <button type="button" class="delete-btn" {...(api?.delete?.(id) || {})}>
          ×
        </button>
      </div>
    );
  });

// Example 4: Accordion with Pure DOM State
component("f-accordion")
  .props({ title: "string", content: "string", initiallyOpen: "boolean?" })
  .styles(`
    .accordion { border: 1px solid #ddd; border-radius: 4px; margin-bottom: 0.5rem; }
    .accordion-header { width: 100%; padding: 1rem; background: #f8f9fa; border: none; text-align: left; cursor: pointer; display: flex; justify-content: space-between; }
    .accordion .icon { transition: transform 0.2s ease; }
    .accordion.open .icon { transform: rotate(180deg); }
    .accordion-content { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
    .accordion.open .accordion-content { max-height: 500px; }
    .content-inner { padding: 1rem; border-top: 1px solid #ddd; }
  `)
  .view((props) => {
    const isOpen = Boolean(props.initiallyOpen);
    const title = props.title as string;
    const content = props.content as string;
    const accordionClass = "accordion " + conditionalClass(isOpen, "open");

    return (
      <div class={accordionClass}>
        <button
          type="button"
          class="accordion-header"
          onClick={toggleParentClass("open")}
        >
          <span class="title">{title}</span>
          <span class="icon">▼</span>
        </button>
        <div class="accordion-content">
          <div class="content-inner">{content}</div>
        </div>
      </div>
    );
  });

// Example 5: Tab System with DOM State
component("f-tabs")
  .props({ tabs: "string", activeTab: "string?" })
  .styles(`
    .tabs { border: 1px solid #ddd; border-radius: 4px; }
    .tab-nav { display: flex; background: #f8f9fa; border-bottom: 1px solid #ddd; }
    .tab-btn { padding: 0.75rem 1rem; border: none; background: none; cursor: pointer; }
    .tab-btn.active { background: white; border-bottom: 2px solid #007bff; }
    .tab-content { display: none; padding: 1rem; }
    .tab-content.active { display: block; }
  `)
  .view((props) => {
    const tabs = String(props.tabs || "").split(",").map((t) => t.trim())
      .filter(Boolean);
    const activeTab = props.activeTab as string || tabs[0] || "";

    return (
      <div class="tabs" data-active={activeTab}>
        <div class="tab-nav">
          {tabs.map((tab) => {
            const tabBtnClass = "tab-btn " +
              conditionalClass(tab === activeTab, "active");
            return (
              <button
                type="button"
                class={tabBtnClass}
                onClick={activateTab(
                  ".tabs",
                  ".tab-btn",
                  ".tab-content",
                  "active",
                )}
                data-tab={tab}
              >
                {tab}
              </button>
            );
          })}
        </div>
        <div class="tab-contents">
          {tabs.map((tab) => {
            const tabContentClass = "tab-content " +
              conditionalClass(tab === activeTab, "active");
            
            // Generate different content based on tab name
            const getTabContent = (tabName: string) => {
              const name = tabName.toLowerCase();
              if (name.includes('home') || name.includes('overview')) {
                return {
                  title: '🏠 Welcome Home',
                  content: 'Welcome to our application! This is your dashboard where you can see an overview of all your activities and quick access to important features.'
                };
              } else if (name.includes('about') || name.includes('info')) {
                return {
                  title: 'ℹ️ About Us',
                  content: 'We are a team of developers building awesome web components with funcwc. Our library focuses on DOM-native SSR components with minimal overhead.'
                };
              } else if (name.includes('contact') || name.includes('support')) {
                return {
                  title: '📞 Get in Touch',
                  content: 'Need help or have questions? Reach out to our support team at support@funcwc.dev or visit our documentation for detailed guides.'
                };
              } else if (name.includes('settings') || name.includes('config')) {
                return {
                  title: '⚙️ Configuration',
                  content: 'Customize your experience with these settings. You can change themes, notifications, and other preferences to suit your workflow.'
                };
              } else if (name.includes('docs') || name.includes('help')) {
                return {
                  title: '📚 Documentation',
                  content: 'Learn how to use funcwc with our comprehensive guides. From basic components to advanced patterns, we\'ve got you covered.'
                };
              } else {
                return {
                  title: `✨ ${tab}`,
                  content: `This is the ${tab} section. Each tab can contain unique content, components, and functionality tailored to its specific purpose.`
                };
              }
            };
            
            const { title, content } = getTabContent(tab);
            
            return (
              <div class={tabContentClass} data-tab={tab}>
                <h3>{title}</h3>
                <p>{content}</p>
                {tab.toLowerCase().includes('home') && (
                  <div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 4px;">
                    <strong>Quick Stats:</strong>
                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                      <li>Components loaded: 5</li>
                      <li>Active tabs: {tabs.length}</li>
                      <li>Current tab: {tab}</li>
                    </ul>
                  </div>
                )}
                {tab.toLowerCase().includes('settings') && (
                  <div style="margin-top: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">
                      <input type="checkbox" style="margin-right: 0.5rem;" />
                      Enable notifications
                    </label>
                    <label style="display: block;">
                      <input type="checkbox" style="margin-right: 0.5rem;" checked />
                      Dark mode theme
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  });
