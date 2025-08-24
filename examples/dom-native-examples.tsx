import { html } from "../src/lib/ssr.ts";
import { component, spreadAttrs, toggleClasses, updateParentCounter, conditionalClass, syncCheckboxToClass, resetCounter, activateTab, toggleParentClass, renderComponent } from "../src/index.ts";

// Example 1: Pure DOM-based Theme Toggle
// No JavaScript state management - just CSS class manipulation
component("f-theme-toggle-dom")
  .view(() => html`
    <button 
      class="theme-btn light" 
      onclick="${toggleClasses(['light', 'dark'])}"
      title="Toggle theme"
    >
      <span class="light-icon">☀️ Light</span>
      <span class="dark-icon" style="display: none;">🌙 Dark</span>
    </button>
    
    <style>
      .theme-btn {
        padding: 0.5rem 1rem;
        border: 1px solid;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
      }
      
      .theme-btn.light {
        background: #fff;
        color: #333;
        border-color: #ccc;
      }
      
      .theme-btn.dark {
        background: #333;
        color: #fff;
        border-color: #666;
      }
      
      .theme-btn.dark .light-icon { display: none; }
      .theme-btn.dark .dark-icon { display: inline !important; }
      .theme-btn.light .light-icon { display: inline; }
      .theme-btn.light .dark-icon { display: none !important; }
      
      .theme-btn:hover.light { background: #f5f5f5; }
      .theme-btn:hover.dark { background: #444; }
    </style>
  `);

// Example 2: Simple Counter with DOM State
// Counter value stored in DOM, no JavaScript objects
component("f-counter-dom")
  .props({ initialCount: "number?", step: "number?" })
  .view((props) => {
    const { initialCount, step } = props as { initialCount?: number; step?: number };
    const count = initialCount || 0;
    const stepValue = step || 1;
    
    return html`
      <div class="counter" data-count="${count}">
        <button 
          onclick="${updateParentCounter('.counter', '.count-display', -stepValue)}"
          class="counter-btn decrement"
        >
          -${stepValue}
        </button>
        
        <span class="count-display">${count}</span>
        
        <button 
          onclick="${updateParentCounter('.counter', '.count-display', stepValue)}"
          class="counter-btn increment"
        >
          +${stepValue}
        </button>
        
        <button 
          onclick="${resetCounter('.count-display', count, '.counter')}"
          class="counter-btn reset"
        >
          Reset
        </button>
      </div>
      
      <style>
        .counter {
          display: inline-flex;
          gap: 0.5rem;
          align-items: center;
          padding: 1rem;
          border: 2px solid #007bff;
          border-radius: 8px;
          font-family: monospace;
          background: #f8f9fa;
        }
        
        .counter-btn {
          padding: 0.5rem;
          border: 1px solid #007bff;
          background: #007bff;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          min-width: 3rem;
        }
        
        .counter-btn:hover {
          background: #0056b3;
        }
        
        .counter-btn.reset {
          background: #6c757d;
          border-color: #6c757d;
          font-size: 0.8rem;
        }
        
        .counter-btn.reset:hover {
          background: #545b62;
        }
        
        .count-display {
          font-size: 1.5rem;
          font-weight: bold;
          min-width: 3rem;
          text-align: center;
          padding: 0.5rem;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      </style>
    `;
  });

// Example 3: Todo Item with Server Actions
// DOM state for UI, server actions for persistence
component("f-todo-item-dom")
  .props({ id: "string", text: "string", done: "boolean?" })
  .serverActions({
    toggle: (id) => ({ "hx-patch": `/api/todos/${id}/toggle` }),
    delete: (id) => ({ "hx-delete": `/api/todos/${id}` })
  })
  .api({
    'PATCH /api/todos/:id/toggle': async (req, params) => {
      console.log(`Toggling todo with id: ${params.id}`);
      // In a real app, you would update a database here.
      // For this example, we'll just fake it.
      const form = await req.formData();
      const isDone = form.get('done') === 'true';
      return new Response(renderComponent("f-todo-item-dom", {
        id: params.id,
        text: "Toggled item!",
        done: !isDone
      }));
    },
    'DELETE /api/todos/:id': (req, params) => {
      console.log(`Deleting todo with id: ${params.id}`);
      // In a real app, you would delete from a database here.
      return new Response(null, { status: 200 });
    }
  })
  .view((props, serverActions) => {
    const { id, text, done } = props as { id: string; text: string; done?: boolean };
    const actions = serverActions as { toggle?: (id: string) => Record<string, unknown>; delete?: (id: string) => Record<string, unknown> } | undefined;
    const isDone = Boolean(done);
    
    return html`
      <div class="todo ${conditionalClass(isDone, 'done')}" data-id="${id}">
        <input 
          type="checkbox" 
          ${isDone ? 'checked' : ''}
          onchange="${syncCheckboxToClass('done')}"
          ${spreadAttrs(actions?.toggle?.(id) || {})}
        />
        
        <span class="todo-text">${text}</span>
        
        <button 
          class="delete-btn"
          ${spreadAttrs(actions?.delete?.(id) || {})}
          title="Delete todo"
        >
          ×
        </button>
      </div>
      
      <style>
        .todo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 0.5rem;
          background: white;
          transition: all 0.2s ease;
        }
        
        .todo.done {
          background: #f8f9fa;
          opacity: 0.7;
        }
        
        .todo.done .todo-text {
          text-decoration: line-through;
          color: #6c757d;
        }
        
        .todo-text {
          flex: 1;
          padding: 0.25rem;
        }
        
        .delete-btn {
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .delete-btn:hover {
          background: #c82333;
        }
      </style>
    `;
  });

// Example 4: Accordion with Pure DOM State
// No JavaScript state - just CSS classes for open/closed
component("f-accordion-dom")
  .props({ title: "string", content: "string", initiallyOpen: "boolean?" })
  .view((props) => {
    const { title, content, initiallyOpen } = props as { title: string; content: string; initiallyOpen?: boolean };
    const isOpen = Boolean(initiallyOpen);
    
    return html`
      <div class="accordion ${conditionalClass(isOpen, 'open')}">
        <button 
          class="accordion-header"
          onclick="${toggleParentClass('open')}"
        >
          <span class="title">${title}</span>
          <span class="icon">▼</span>
        </button>
        
        <div class="accordion-content">
          <div class="content-inner">
            ${content}
          </div>
        </div>
      </div>
      
      <style>
        .accordion {
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }
        
        .accordion-header {
          width: 100%;
          padding: 1rem;
          background: #f8f9fa;
          border: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 500;
        }
        
        .accordion-header:hover {
          background: #e9ecef;
        }
        
        .accordion .icon {
          transition: transform 0.2s ease;
        }
        
        .accordion.open .icon {
          transform: rotate(180deg);
        }
        
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        
        .accordion.open .accordion-content {
          max-height: 500px;
        }
        
        .content-inner {
          padding: 1rem;
          border-top: 1px solid #ddd;
        }
      </style>
    `;
  });

// Example 5: Tab System with DOM State
// Active tab stored as CSS class, no JavaScript objects
component("f-tabs-dom")
  .props({ tabs: "string", activeTab: "string?" })
  .view((props) => {
    const { tabs: tabsStr, activeTab: activeTabProp } = props as { tabs?: string; activeTab?: string };
    const tabs = String(tabsStr || "").split(',').map(t => t.trim()).filter(Boolean);
    const activeTab = activeTabProp || tabs[0] || '';
    
    if (tabs.length === 0) {
      return html`<div class="tabs-error">No tabs provided</div>`;
    }
    
    return html`
      <div class="tabs" data-active="${activeTab}">
        <div class="tab-nav">
          ${tabs.map(tab => html`
            <button 
              class="tab-btn ${conditionalClass(tab === activeTab, 'active')}"
              onclick="${activateTab('.tabs', '.tab-btn', '.tab-content', 'active')}"
              data-tab="${tab}"
            >
              ${tab}
            </button>
          `).join('')}
        </div>
        
        <div class="tab-contents">
          ${tabs.map(tab => html`
            <div class="tab-content ${conditionalClass(tab === activeTab, 'active')}" data-tab="${tab}">
              <h3>${tab} Content</h3>
              <p>This is the content for the ${tab} tab.</p>
              <p>The active tab is stored in the DOM using CSS classes and data attributes.</p>
            </div>
          `).join('')}
        </div>
      </div>
      
      <style>
        .tabs {
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .tab-nav {
          display: flex;
          background: #f8f9fa;
          border-bottom: 1px solid #ddd;
        }
        
        .tab-btn {
          padding: 0.75rem 1rem;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }
        
        .tab-btn:hover {
          background: #e9ecef;
        }
        
        .tab-btn.active {
          background: white;
          border-bottom-color: #007bff;
          font-weight: 500;
        }
        
        .tab-content {
          display: none;
          padding: 1rem;
        }
        
        .tab-content.active {
          display: block;
        }
      </style>
    `;
  });