/** @jsx h */
import { defineComponent, h, string, number, boolean, array } from "../../src/index.ts";
import { post, patch, del } from "../../src/index.ts";
import { renderComponent } from "../../src/index.ts";

// Real-World Todo Application - Complete CRUD with State Management

console.log("🚀 Loading Real-World Todo Application...");

// Mock database for demo
const todoDatabase = new Map();
let todoIdCounter = 3;

// Initialize with sample data
todoDatabase.set(1, { id: 1, text: "Learn funcwc basics", completed: true, priority: "high", category: "Learning", createdAt: new Date('2024-01-15').toISOString() });
todoDatabase.set(2, { id: 2, text: "Build awesome components", completed: false, priority: "medium", category: "Development", createdAt: new Date('2024-01-16').toISOString() });
todoDatabase.set(3, { id: 3, text: "Deploy to production", completed: false, priority: "high", category: "DevOps", createdAt: new Date('2024-01-17').toISOString() });

// 1. Todo App Container - Main application wrapper
defineComponent("todo-app", {
  styles: {
    container: {
      maxWidth: '1000px', margin: '0 auto', padding: '2rem', background: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '2px solid #007bff'
    },
    header: {
      textAlign: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #e2e8f0'
    },
    title: {
      fontSize: '2rem', fontWeight: 'bold', color: '#333', margin: '0 0 0.5rem 0'
    },
    subtitle: { color: '#666', fontSize: '1.1rem', margin: 0 },
    content: { padding: '2rem', background: '#f8f9fa', borderRadius: '10px', textAlign: 'center' }
  },
  render: (props, api, classes) => (
    h('div', { class: classes!.container },
      h('div', { class: classes!.header },
        h('h1', { class: classes!.title }, '✅ funcwc Todo'),
        h('p', { class: classes!.subtitle }, 'Real-world application built with funcwc')
      ),
      h('div', { class: classes!.content },
        h('p', {}, 'This is a simplified todo app for testing. The full interactive version is being debugged.'),
        h('p', {}, 'Features: Task management, filtering, real-time updates, and state synchronization.'),
        h('ul', {},
          h('li', {}, '✅ Learn funcwc basics (completed)'),
          h('li', {}, '🔄 Build awesome components (in progress)'),
          h('li', {}, '🎯 Deploy to production (pending)')
        )
      )
    )
  )
} as any);

// 2. Todo Add Form - Form for creating new todos
defineComponent("todo-add-form", {
  api: {
    create: post("/api/todos", async (req) => {
      const data = await req.json();
      const newTodo = {
        id: ++todoIdCounter,
        text: data.text || "New Task",
        completed: false,
        priority: data.priority || "medium",
        category: data.category || "General",
        createdAt: new Date().toISOString()
      };
      
      todoDatabase.set(newTodo.id, newTodo);
      const updatedTodos = Array.from(todoDatabase.values());
      
      // Update global state
      setTimeout(() => {
        if (window.StateManager) {
          window.StateManager.publish('todos', updatedTodos);
        }
      }, 0);
      
      return new Response(renderComponent("todo-add-form"), {
        headers: { "content-type": "text/html; charset=utf-8" }
      });
    })
  },
  styles: {
    container: { background: 'var(--theme-bg, #ffffff)', border: '2px solid var(--theme-border, #e2e8f0)', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' },
    title: { fontSize: '1.5rem', fontWeight: '600', color: 'var(--theme-text, #1e293b)', margin: '0 0 1.5rem 0' },
    form: { display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '1rem', alignItems: 'end' },
    input: { padding: '0.75rem 1rem', border: '1px solid var(--theme-border, #d1d5db)', borderRadius: '8px', fontSize: '1rem', transition: 'border-color 0.2s ease' },
    select: { padding: '0.75rem 1rem', border: '1px solid var(--theme-border, #d1d5db)', borderRadius: '8px', fontSize: '1rem', background: 'white' },
    button: { padding: '0.75rem 1.5rem', background: 'var(--theme-primary, #3b82f6)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.2s ease' },
    formMobile: `{
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }`
  },
  render: ({}, api: any, classes: any) => (
    h('div', { class: classes!.container },
      h('h2', { class: classes!.title }, '➕ Add New Task'),
      h('form', { 
        class: `${classes!.form} ${classes!.formMobile}`,
        'hx-boost': 'true',
        onsubmit: 'return false'
      },
        h('input', {
          type: 'text',
          name: 'text',
          placeholder: 'Enter task description...',
          class: classes!.input,
          required: true,
          id: 'new-task-input'
        }),
        h('select', {
          name: 'priority',
          class: classes!.select
        },
          h('option', { value: 'low' }, '🟢 Low'),
          h('option', { value: 'medium', selected: true }, '🟡 Medium'),
          h('option', { value: 'high' }, '🔴 High')
        ),
        h('select', {
          name: 'category',
          class: classes!.select
        },
          h('option', { value: 'General', selected: true }, '📋 General'),
          h('option', { value: 'Work' }, '💼 Work'),
          h('option', { value: 'Personal' }, '👤 Personal'),
          h('option', { value: 'Learning' }, '📚 Learning'),
          h('option', { value: 'Health' }, '🏥 Health'),
          h('option', { value: 'Shopping' }, '🛒 Shopping')
        ),
        h('button', {
          type: 'submit',
          class: classes!.button,
          ...api.create(),
          onclick: `
            const form = this.closest('form');
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            this.setAttribute('hx-vals', JSON.stringify(data));
            
            // Reset form after submission
            setTimeout(() => {
              form.reset();
              document.getElementById('new-task-input').focus();
            }, 100);
          `
        }, 'Add Task')
      )
    )
  )
});

// 3. Todo Filters - Filter and search functionality
defineComponent("todo-filters", {
  styles: {
    container: { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', padding: '1.5rem', background: 'var(--theme-secondary, #f8fafc)', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--theme-border, #e2e8f0)' },
    filterGroup: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
    label: { fontWeight: '500', color: 'var(--theme-text, #374151)', fontSize: '0.9rem' },
    select: { padding: '0.5rem 0.75rem', border: '1px solid var(--theme-border, #d1d5db)', borderRadius: '6px', background: 'white', fontSize: '0.9rem' },
    searchInput: { padding: '0.5rem 0.75rem', border: '1px solid var(--theme-border, #d1d5db)', borderRadius: '6px', fontSize: '0.9rem', minWidth: '200px' },
    clearButton: { padding: '0.5rem 1rem', background: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer' }
  },
  stateSubscriptions: {
    "filter-status": `this.updateFilters();`,
    "filter-priority": `this.updateFilters();`,
    "filter-category": `this.updateFilters();`,
    "filter-search": `this.updateFilters();`,
    "todos": `this.updateFilters();`
  },
  onMount: `
    this.updateFilters = () => {
      const todos = window.StateManager?.getState('todos') || [];
      const status = window.StateManager?.getState('filter-status') || 'all';
      const priority = window.StateManager?.getState('filter-priority') || 'all';
      const category = window.StateManager?.getState('filter-category') || 'all';
      const search = window.StateManager?.getState('filter-search') || '';
      
      let filtered = todos;
      
      // Filter by status
      if (status !== 'all') {
        filtered = filtered.filter(todo => 
          status === 'completed' ? todo.completed : !todo.completed
        );
      }
      
      // Filter by priority
      if (priority !== 'all') {
        filtered = filtered.filter(todo => todo.priority === priority);
      }
      
      // Filter by category
      if (category !== 'all') {
        filtered = filtered.filter(todo => todo.category === category);
      }
      
      // Filter by search
      if (search.trim()) {
        filtered = filtered.filter(todo => 
          todo.text.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      window.StateManager?.publish('filtered-todos', filtered);
    };
    
    // Initialize filters
    window.StateManager?.publish('filter-status', 'all');
    window.StateManager?.publish('filter-priority', 'all');
    window.StateManager?.publish('filter-category', 'all');
    window.StateManager?.publish('filter-search', '');
  `,
  render: ({}, api: any, classes: any) => (
    h('div', { class: classes!.container },
      h('div', { class: classes!.filterGroup },
        h('label', { class: classes!.label }, 'Status:'),
        h('select', {
          class: classes!.select,
          onchange: `window.StateManager?.publish('filter-status', this.value);`
        },
          h('option', { value: 'all' }, 'All'),
          h('option', { value: 'pending' }, 'Pending'),
          h('option', { value: 'completed' }, 'Completed')
        )
      ),
      h('div', { class: classes!.filterGroup },
        h('label', { class: classes!.label }, 'Priority:'),
        h('select', {
          class: classes!.select,
          onchange: `window.StateManager?.publish('filter-priority', this.value);`
        },
          h('option', { value: 'all' }, 'All'),
          h('option', { value: 'high' }, '🔴 High'),
          h('option', { value: 'medium' }, '🟡 Medium'),
          h('option', { value: 'low' }, '🟢 Low')
        )
      ),
      h('div', { class: classes!.filterGroup },
        h('label', { class: classes!.label }, 'Category:'),
        h('select', {
          class: classes!.select,
          onchange: `window.StateManager?.publish('filter-category', this.value);`
        },
          h('option', { value: 'all' }, 'All'),
          h('option', { value: 'General' }, '📋 General'),
          h('option', { value: 'Work' }, '💼 Work'),
          h('option', { value: 'Personal' }, '👤 Personal'),
          h('option', { value: 'Learning' }, '📚 Learning'),
          h('option', { value: 'Health' }, '🏥 Health'),
          h('option', { value: 'Shopping' }, '🛒 Shopping')
        )
      ),
      h('div', { class: classes!.filterGroup },
        h('label', { class: classes!.label }, 'Search:'),
        h('input', {
          type: 'text',
          class: classes!.searchInput,
          placeholder: 'Search todos...',
          oninput: `
            clearTimeout(this._searchTimeout);
            this._searchTimeout = setTimeout(() => {
              window.StateManager?.publish('filter-search', this.value);
            }, 300);
          `
        })
      ),
      h('button', {
        class: classes!.clearButton,
        onclick: `
          window.StateManager?.publish('filter-status', 'all');
          window.StateManager?.publish('filter-priority', 'all');
          window.StateManager?.publish('filter-category', 'all');
          window.StateManager?.publish('filter-search', '');
          
          const selects = this.parentElement.querySelectorAll('select');
          const input = this.parentElement.querySelector('input');
          selects.forEach(select => select.selectedIndex = 0);
          if (input) input.value = '';
        `
      }, 'Clear Filters')
    )
  )
} as any);

// 4. Todo List - Display filtered todos
defineComponent("todo-list", {
  styles: {
    container: `{
      background: var(--theme-bg, #ffffff);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--theme-border, #e2e8f0);
    }`,
    header: `{
      background: var(--theme-secondary, #f8fafc);
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--theme-border, #e2e8f0);
      font-weight: 600;
      color: var(--theme-text, #374151);
    }`,
    empty: `{
      text-align: center;
      padding: 3rem;
      color: var(--theme-text, #64748b);
      font-style: italic;
    }`
  },
  stateSubscriptions: {
    "filtered-todos": `
      const todosList = this.querySelector('#todos-list');
      if (!todosList) return;
      
      const todos = Array.isArray(value) ? value : [];
      
      if (todos.length === 0) {
        todosList.innerHTML = '<div class="empty">No todos found matching your filters.</div>';
        return;
      }
      
      todosList.innerHTML = todos.map(todo => 
        '<todo-item-full' +
        ' todo-id="' + todo.id + '"' +
        ' text="' + todo.text.replace(/"/g, '&quot;') + '"' +
        ' completed="' + todo.completed + '"' +
        ' priority="' + todo.priority + '"' +
        ' category="' + todo.category + '"' +
        ' created-at="' + todo.createdAt + '"' +
        '></todo-item-full>'
      ).join('');
    `
  },
  render: ({}, api: any, classes: any) => (
    h('div', { class: classes!.container },
      h('div', { class: classes!.header }, '📋 Task List'),
      h('div', { id: 'todos-list' },
        h('div', { class: classes!.empty }, 'Loading todos...')
      )
    )
  )
} as any);

// 5. Todo Item Full - Individual todo item with full functionality
defineComponent("todo-item-full", {
  api: {
    toggle: patch("/api/todos/:id/toggle", async (req, params) => {
      const id = parseInt(params.id);
      const todo = todoDatabase.get(id);
      if (todo) {
        todo.completed = !todo.completed;
        const updatedTodos = Array.from(todoDatabase.values());
        
        setTimeout(() => {
          if (window.StateManager) {
            window.StateManager.publish('todos', updatedTodos);
          }
        }, 0);
      }
      return new Response("", { status: 204 });
    }),
    delete: del("/api/todos/:id", async (req, params) => {
      const id = parseInt(params.id);
      todoDatabase.delete(id);
      const updatedTodos = Array.from(todoDatabase.values());
      
      setTimeout(() => {
        if (window.StateManager) {
          window.StateManager.publish('todos', updatedTodos);
        }
      }, 0);
      
      return new Response("", { status: 204 });
    }),
    updatePriority: patch("/api/todos/:id/priority", async (req, params) => {
      const id = parseInt(params.id);
      const { priority } = await req.json();
      const todo = todoDatabase.get(id);
      if (todo) {
        todo.priority = priority;
        const updatedTodos = Array.from(todoDatabase.values());
        
        setTimeout(() => {
          if (window.StateManager) {
            window.StateManager.publish('todos', updatedTodos);
          }
        }, 0);
      }
      return new Response("", { status: 204 });
    })
  },
  styles: {
    container: `{
      display: grid;
      grid-template-columns: auto 1fr auto auto auto;
      gap: 1rem;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--theme-border, #e2e8f0);
      transition: background-color 0.2s ease;
    }`,
    containerCompleted: `{
      background: var(--theme-secondary, #f8fafc);
      opacity: 0.7;
    }`,
    checkbox: `{
      width: 20px;
      height: 20px;
      cursor: pointer;
    }`,
    content: `{
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }`,
    text: `{
      font-size: 1rem;
      color: var(--theme-text, #1e293b);
      line-height: 1.4;
    }`,
    textCompleted: `{
      text-decoration: line-through;
      color: var(--theme-text, #64748b);
    }`,
    meta: `{
      display: flex;
      gap: 1rem;
      font-size: 0.8rem;
      color: var(--theme-text, #64748b);
    }`,
    priorityBadge: `{
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }`,
    priorityHigh: `{
      background: #fee2e2;
      color: #dc2626;
    }`,
    priorityMedium: `{
      background: #fef3c7;
      color: #d97706;
    }`,
    priorityLow: `{
      background: #dcfce7;
      color: #16a34a;
    }`,
    categoryBadge: `{
      background: var(--theme-secondary, #f1f5f9);
      color: var(--theme-text, #475569);
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      border: 1px solid var(--theme-border, #e2e8f0);
    }`,
    prioritySelect: `{
      padding: 0.25rem 0.5rem;
      border: 1px solid var(--theme-border, #d1d5db);
      border-radius: 4px;
      font-size: 0.8rem;
      background: white;
    }`,
    button: `{
      padding: 0.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }`,
    deleteButton: `{
      background: #fee2e2;
      color: #dc2626;
    }`
  },
  render: ({ 
    todoId = number(1), 
    text = string("Todo item"), 
    completed = boolean(false),
    priority = string("medium"),
    category = string("General"),
    createdAt = string("")
  }: any, api: any, classes: any) => {
    const priorityIcon = priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢';
    const categoriesMap: Record<string, string> = {
      General: '📋',
      Work: '💼', 
      Personal: '👤',
      Learning: '📚',
      Health: '🏥',
      Shopping: '🛒'
    };
    const categoryIcon = categoriesMap[String(category)] || '📋';
    
    const priorityClass = priority === 'high' ? classes!.priorityHigh : 
                         priority === 'medium' ? classes!.priorityMedium : 
                         classes!.priorityLow;
    
    return h('div', { 
      class: `${classes!.container} ${completed ? classes!.containerCompleted : ''}`,
      'data-todo-id': todoId.toString()
    },
      h('input', {
        type: 'checkbox',
        checked: completed,
        class: classes!.checkbox,
        ...api.toggle(todoId)
      }),
      h('div', { class: classes!.content },
        h('div', { class: `${classes!.text} ${completed ? classes!.textCompleted : ''}` }, text),
        h('div', { class: classes!.meta },
          h('span', { class: `${classes!.priorityBadge} ${priorityClass}` }, 
            priorityIcon, ' ', priority.charAt(0).toUpperCase() + priority.slice(1)
          ),
          h('span', { class: classes!.categoryBadge }, 
            categoryIcon, ' ', category
          ),
          createdAt && h('span', {}, 
            '📅 ', new Date(createdAt).toLocaleDateString()
          )
        )
      ),
      h('select', {
        class: classes!.prioritySelect,
        value: priority,
        title: 'Change priority',
        onchange: `
          const newPriority = this.value;
          this.setAttribute('hx-vals', JSON.stringify({ priority: newPriority }));
          htmx.trigger(this, 'change');
        `,
        ...api.updatePriority(todoId)
      },
        h('option', { value: 'low' }, '🟢 Low'),
        h('option', { value: 'medium' }, '🟡 Medium'),
        h('option', { value: 'high' }, '🔴 High')
      ),
      h('button', {
        class: `${classes!.button} ${classes!.deleteButton}`,
        title: 'Delete todo',
        ...api.delete(todoId)
      }, '🗑️')
    );
  }
});

console.log("✅ Real-World Todo Application loaded - Complete CRUD with state management");
