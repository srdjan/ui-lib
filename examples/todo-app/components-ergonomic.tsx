/** @jsx h */

// ✨ Todo App Components - Showcasing the Three Ergonomic Breakthroughs!
import {
  boolean,
  defineErgonomicComponent,
  defineSimpleComponent,
  del,
  number,
  oneOf,
  patch,
  post,
  string,
} from "../../mod-ergonomic.ts";

// Import API handlers - we'll define them inline for now
const todoHandlers = {
  toggle: async (req: Request) => new Response("OK"),
  remove: async (req: Request) => new Response("OK"),
  create: async (req: Request) => new Response("OK"),
  updatePriority: async (req: Request) => new Response("OK"),
};

// ✨ BREAKTHROUGH SHOWCASE: Navigation Component
// Demonstrates all three breakthroughs working together
defineErgonomicComponent({
  name: "todo-navigation",

  // ✨ Breakthrough 2: CSS-Only Format (Auto-Generated Classes!)
  styles: {
    nav: `{ 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }`,
    brand: `{
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }`,
    subtitle: `{
      color: rgba(255,255,255,0.8);
      font-size: 0.9rem;
      font-weight: normal;
      margin-left: 0.5rem;
    }`,
    links: `{
      display: flex;
      gap: 1rem;
      align-items: center;
    }`,
    link: `{
      color: rgba(255,255,255,0.9);
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      transition: all 0.2s ease;
      font-weight: 500;
    }`,
    linkActive: `{
      background: rgba(255,255,255,0.2);
      color: white;
      font-weight: 600;
    }`,
    linkHover: `{
      background: rgba(255,255,255,0.1);
      color: white;
    }`,
  },

  // ✨ Breakthrough 1: Function-Style Props (Zero Duplication!)
  render: (
    {
      title = string("Todo App"),
      subtitle = string("Built with ui-lib ergonomic API"),
      currentPath = string("/"),
      showUserCount = boolean(false),
      userCount = number(0),
    },
    api,
    classes,
  ) => (
    `<nav class="${classes.nav}">
       <div class="${classes.brand}">
         <span>✨</span>
         ${title}
         <span class="${classes.subtitle}">${subtitle}</span>
       </div>
       <div class="${classes.links}">
         <a href="/" class="${classes.link} ${
      currentPath === "/" ? classes.linkActive : ""
    }"
            onmouseover="this.classList.add('${classes.linkHover}')"
            onmouseout="this.classList.remove('${classes.linkHover}')">
           Home
         </a>
         <a href="/api" class="${classes.link} ${
      currentPath === "/api" ? classes.linkActive : ""
    }"
            onmouseover="this.classList.add('${classes.linkHover}')"
            onmouseout="this.classList.remove('${classes.linkHover}')">
           API
         </a>
         ${
      showUserCount
        ? `<span class="${classes.link}">Users: ${userCount}</span>`
        : ""
    }
       </div>
     </nav>`
  ),
});

// ✨ BREAKTHROUGH SHOWCASE: Todo Item Component
// Demonstrates Unified API System with HTMX auto-generation
defineErgonomicComponent({
  name: "todo-item-ergonomic",

  // ✨ Breakthrough 2: CSS-Only Format
  styles: {
    item: `{
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      margin-bottom: 0.5rem;
      transition: all 0.2s ease;
    }`,
    itemCompleted: `{
      opacity: 0.7;
      background: #f8f9fa;
    }`,
    checkbox: `{
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 0.25rem;
      border: 2px solid #dee2e6;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
    }`,
    checkboxChecked: `{
      background: #28a745;
      border-color: #28a745;
      color: white;
    }`,
    text: `{
      flex: 1;
      font-size: 1rem;
      line-height: 1.4;
    }`,
    textCompleted: `{
      text-decoration: line-through;
      color: #6c757d;
    }`,
    priority: `{
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }`,
    priorityLow: `{ background: #d4edda; color: #155724; }`,
    priorityMedium: `{ background: #fff3cd; color: #856404; }`,
    priorityHigh: `{ background: #f8d7da; color: #721c24; }`,
    deleteBtn: `{
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }`,
    deleteBtnHover: `{
      background: #c82333;
      transform: scale(1.05);
    }`,
  },

  // ✨ Breakthrough 3: Unified API System (HTMX Auto-Generated!)
  api: {
    toggle: patch("/api/todos/:id/toggle", todoHandlers.toggle),
    remove: del("/api/todos/:id", todoHandlers.remove),
    updatePriority: patch(
      "/api/todos/:id/priority",
      todoHandlers.updatePriority,
    ),
  },

  // ✨ Breakthrough 1: Function-Style Props (Zero Duplication!)
  render: (
    {
      id = string(),
      text = string("Untitled Todo"),
      completed = boolean(false),
      priority = oneOf(["low", "medium", "high"], "medium"),
      userId = string(),
      showActions = boolean(true),
    },
    api,
    classes,
  ) => {
    const itemClass = completed
      ? `${classes.item} ${classes.itemCompleted}`
      : classes.item;

    const textClass = completed
      ? `${classes.text} ${classes.textCompleted}`
      : classes.text;

    const checkboxClass = completed
      ? `${classes.checkbox} ${classes.checkboxChecked}`
      : classes.checkbox;

    const priorityClass = `${classes.priority} ${
      classes[`priority${priority.charAt(0).toUpperCase() + priority.slice(1)}`]
    }`;

    return `
      <div class="${itemClass}">
        ${
      showActions
        ? `
          <button class="${checkboxClass}" 
                  ${api.toggle(id)}
                  title="Toggle completion">
            ${completed ? "✓" : ""}
          </button>
        `
        : ""
    }
        
        <span class="${textClass}">${text}</span>
        
        <span class="${priorityClass}">${priority}</span>
        
        ${
      showActions
        ? `
          <button class="${classes.deleteBtn}" 
                  ${api.remove(id)}
                  title="Delete todo"
                  onmouseover="this.classList.add('${classes.deleteBtnHover}')"
                  onmouseout="this.classList.remove('${classes.deleteBtnHover}')">
            ×
          </button>
        `
        : ""
    }
      </div>
    `;
  },
});

// ✨ BREAKTHROUGH SHOWCASE: Todo Form Component
// Demonstrates API integration with form submission
defineErgonomicComponent({
  name: "todo-form-ergonomic",

  // ✨ Breakthrough 2: CSS-Only Format
  styles: {
    form: `{
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }`,
    formGroup: `{
      display: flex;
      gap: 1rem;
      align-items: end;
      margin-bottom: 1rem;
    }`,
    inputGroup: `{
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }`,
    label: `{
      font-weight: 600;
      color: #495057;
      font-size: 0.875rem;
    }`,
    input: `{
      padding: 0.75rem;
      border: 2px solid #dee2e6;
      border-radius: 0.25rem;
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }`,
    inputFocus: `{
      border-color: #007bff;
      outline: none;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
    }`,
    select: `{
      padding: 0.75rem;
      border: 2px solid #dee2e6;
      border-radius: 0.25rem;
      font-size: 1rem;
      background: white;
      cursor: pointer;
    }`,
    submitBtn: `{
      background: #28a745;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.25rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }`,
    submitBtnHover: `{
      background: #218838;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }`,
  },

  // ✨ Breakthrough 3: Unified API System
  api: {
    create: post("/api/todos", todoHandlers.create),
  },

  // ✨ Breakthrough 1: Function-Style Props
  render: (
    {
      userId = string(),
      placeholder = string("Add a new todo..."),
      showPriority = boolean(true),
    },
    api,
    classes,
  ) => (
    `<form class="${classes.form}" ${api.create()}>
       <div class="${classes.formGroup}">
         <div class="${classes.inputGroup}">
           <label class="${classes.label}" for="todo-text">Todo Text</label>
           <input 
             class="${classes.input}"
             type="text" 
             name="text" 
             id="todo-text"
             placeholder="${placeholder}"
             required
             onfocus="this.classList.add('${classes.inputFocus}')"
             onblur="this.classList.remove('${classes.inputFocus}')"
           />
         </div>
         
         ${
      showPriority
        ? `
           <div class="${classes.inputGroup}">
             <label class="${classes.label}" for="todo-priority">Priority</label>
             <select class="${classes.select}" name="priority" id="todo-priority">
               <option value="low">Low</option>
               <option value="medium" selected>Medium</option>
               <option value="high">High</option>
             </select>
           </div>
         `
        : ""
    }
         
         <button 
           type="submit" 
           class="${classes.submitBtn}"
           onmouseover="this.classList.add('${classes.submitBtnHover}')"
           onmouseout="this.classList.remove('${classes.submitBtnHover}')">
           Add Todo
         </button>
       </div>
       
       <input type="hidden" name="userId" value="${userId}" />
     </form>`
  ),
});

// ✨ Simple Component Example (No API needed)
defineSimpleComponent("todo-stats-ergonomic", (
  {
    total = number(0),
    active = number(0),
    completed = number(0),
  },
  api,
  classes,
) => (
  `<div class="${classes.stats}">
       <div class="${classes.stat}">
         <span class="${classes.statNumber}">${total}</span>
         <span class="${classes.statLabel}">Total</span>
       </div>
       <div class="${classes.stat}">
         <span class="${classes.statNumber}">${active}</span>
         <span class="${classes.statLabel}">Active</span>
       </div>
       <div class="${classes.stat}">
         <span class="${classes.statNumber}">${completed}</span>
         <span class="${classes.statLabel}">Completed</span>
       </div>
     </div>`
), {
  stats: `{
      display: flex;
      gap: 2rem;
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }`,
  stat: `{
      text-align: center;
      flex: 1;
    }`,
  statNumber: `{
      display: block;
      font-size: 2rem;
      font-weight: bold;
      color: #007bff;
      margin-bottom: 0.25rem;
    }`,
  statLabel: `{
      color: #6c757d;
      font-size: 0.875rem;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }`,
});
