/** @jsx h */
import { 
  component, 
  toggleClasses, 
  updateParentCounter, 
  conditionalClass, 
  syncCheckboxToClass, 
  resetCounter, 
  activateTab, 
  toggleParentClass, 
  renderComponent,
  h
} from "../src/index.ts";

// Example 1: Pure DOM-based Theme Toggle
component("f-theme-toggle-dom")
  .styles(`
    .theme-btn { padding: 0.5rem 1rem; border: 1px solid; border-radius: 6px; cursor: pointer; }
    .theme-btn.light { background: #fff; color: #333; border-color: #ccc; }
    .theme-btn.dark { background: #333; color: #fff; border-color: #666; }
    .theme-btn.dark .light-icon, .theme-btn.light .dark-icon { display: none; }
    .theme-btn.dark .dark-icon, .theme-btn.light .light-icon { display: inline; }
  `)
  .view((props) => (
    <button
      class="theme-btn light"
      onClick={toggleClasses(['light', 'dark'])}
      title="Toggle theme"
    >
      <span class="light-icon">☀️ Light</span>
      <span class="dark-icon" style="display: none;">🌙 Dark</span>
    </button>
  ));

// Example 2: Simple Counter with DOM State
component("f-counter-dom")
  .props({ initialCount: "number?", step: "number?" })
  .parts({
    self: '.counter',
    display: '.count-display'
  })
  .styles(`
    .counter { display: inline-flex; gap: 0.5rem; align-items: center; padding: 1rem; border: 2px solid #007bff; border-radius: 8px; }
    .counter button { padding: 0.5rem; border: 1px solid #007bff; background: #007bff; color: white; border-radius: 4px; cursor: pointer; }
    .count-display { font-size: 1.5rem; min-width: 3rem; text-align: center; }
  `)
  .view((props, _api, parts) => {
    const count = (props as any).initialCount ?? 0;
    const stepValue = (props as any).step ?? 1;

    return (
      <div class="counter" data-count={count}>
        <button onClick={updateParentCounter(parts!.self, parts!.display, -stepValue)}>-{stepValue}</button>
        <span class="count-display">{count}</span>
        <button onClick={updateParentCounter(parts!.self, parts!.display, stepValue)}>+{stepValue}</button>
        <button onClick={resetCounter(parts!.display, count, parts!.self)}>Reset</button>
      </div>
    );
  });

// Example 3: Todo Item with Unified API
component("f-todo-item-dom")
  .props({ id: "string", text: "string", done: "boolean?" })
  .api({
    // Just define the API endpoints - client functions are auto-generated!
    'PATCH /api/todos/:id/toggle': async (req, params) => {
      const form = await req.formData();
      const isDone = form.get('done') === 'true';
      return new Response(renderComponent("f-todo-item-dom", { id: params.id, text: "Toggled item!", done: !isDone }));
    },
    'DELETE /api/todos/:id': (_req, _params) => {
      return new Response(null, { status: 200 });
    }
  })
  .styles(`
    .todo { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 0.5rem; }
    .todo.done { background: #f8f9fa; opacity: 0.7; }
    .todo.done .todo-text { text-decoration: line-through; color: #6c757d; }
    .delete-btn { background: #dc3545; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; }
  `)
  .view((props, api) => {
    const isDone = Boolean((props as any).done);
    const id = (props as any).id as string;
    const text = (props as any).text as string;
    const todoClass = "todo " + conditionalClass(isDone, 'done');

    return (
      <div class={todoClass} data-id={id}>
        <input
          type="checkbox"
          checked={isDone}
          onChange={syncCheckboxToClass('done')}
          {...(api?.toggle?.(id) || {})}
        />
        <span class="todo-text">{text}</span>
        <button class="delete-btn" {...(api?.delete?.(id) || {})}>×</button>
      </div>
    );
  });

// Example 4: Accordion with Pure DOM State
component("f-accordion-dom")
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
    const isOpen = Boolean((props as any).initiallyOpen);
    const title = (props as any).title as string;
    const content = (props as any).content as string;
    const accordionClass = "accordion " + conditionalClass(isOpen, 'open');

    return (
      <div class={accordionClass}>
        <button class="accordion-header" onClick={toggleParentClass('open')}>
          <span class="title">{title}</span>
          <span class="icon">▼</span>
        </button>
        <div class="accordion-content"><div class="content-inner">{content}</div></div>
      </div>
    );
  });

// Example 5: Tab System with DOM State
component("f-tabs-dom")
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
    const tabs = String((props as any).tabs || "").split(',').map((t) => t.trim()).filter(Boolean);
    const activeTab = (props as any).activeTab as string || tabs[0] || '';

    return (
      <div class="tabs" data-active={activeTab}>
        <div class="tab-nav">
          {tabs.map((tab) => {
            const tabBtnClass = "tab-btn " + conditionalClass(tab === activeTab, 'active');
            return (
            <button
              class={tabBtnClass}
              onClick={activateTab('.tabs', '.tab-btn', '.tab-content', 'active')}
              data-tab={tab}
            >
              {tab}
            </button>
            );
          })}
        </div>
        <div class="tab-contents">
          {tabs.map((tab) => {
            const tabContentClass = "tab-content " + conditionalClass(tab === activeTab, 'active');
            return (
            <div class={tabContentClass} data-tab={tab}>
              <h3>{tab} Content</h3>
              <p>This is the content for the {tab} tab.</p>
            </div>
            );
          })}
        </div>
      </div>
    );
  });
