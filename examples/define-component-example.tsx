/** @jsx h */
import { defineComponent, h, renderComponent } from "../src/index.ts";

// Example 1: Simple component with basic props
defineComponent("simple-button", {
  props: { text: "string", disabled: "boolean?" },
  styles: `
    .simple-btn {
      padding: 0.5rem 1rem;
      border: 2px solid #007bff;
      background: white;
      color: #007bff;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    .simple-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  classes: { btn: "simple-btn" },
  render: ({ text, disabled }, api, classes) => (
    <button class={classes!.btn} disabled={disabled}>
      {text}
    </button>
  ),
});

// Example 2: Component with enhanced props syntax (defaults)
defineComponent("enhanced-counter", {
  props: {
    label: "string",
    initialCount: { type: "number", default: 0 },
    step: { type: "number", default: 1 },
    disabled: { type: "boolean", default: false }
  },
  styles: `
    .counter {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      border: 2px solid #28a745;
      border-radius: 6px;
      background: #f8f9fa;
    }
    .counter-btn {
      padding: 0.25rem 0.5rem;
      border: 1px solid #28a745;
      background: #28a745;
      color: white;
      border-radius: 3px;
      cursor: pointer;
      min-width: 2rem;
    }
    .counter-btn:hover {
      background: #218838;
    }
    .counter-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .counter-display {
      font-size: 1.2rem;
      font-weight: bold;
      min-width: 3rem;
      text-align: center;
      color: #28a745;
    }
    .counter-label {
      font-weight: 500;
      color: #495057;
    }
  `,
  classes: {
    container: "counter",
    button: "counter-btn",
    display: "counter-display",
    label: "counter-label"
  },
  render: ({ label, initialCount, step, disabled }, api, classes) => (
    <div class={classes!.container}>
      <span class={classes!.label}>{label}:</span>
      <button class={classes!.button} disabled={disabled}>-{step}</button>
      <span class={classes!.display}>{initialCount}</span>
      <button class={classes!.button} disabled={disabled}>+{step}</button>
    </div>
  ),
});

// Example 3: Component with API integration
defineComponent("todo-item", {
  props: {
    id: "string",
    text: "string", 
    done: { type: "boolean", default: false }
  },
  api: {
    toggle: {
      route: "PATCH /api/todos/:id/toggle",
      handler: async (req, params) => {
        const form = await req.formData();
        const isDone = form.get('done') === 'true';
        return new Response(
          renderComponent("todo-item", { 
            id: params.id, 
            text: "Updated task!", 
            done: !isDone 
          })
        );
      }
    },
    remove: {
      route: "DELETE /api/todos/:id",
      handler: async (req, params) => {
        console.log(`Deleting todo ${params.id}`);
        return new Response(null, { status: 204 });
      }
    }
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
    .todo-delete {
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
    .todo-delete:hover {
      background: #c82333;
    }
  `,
  classes: {
    item: "todo",
    checkbox: "todo-checkbox",
    text: "todo-text", 
    deleteBtn: "todo-delete"
  },
  render: ({ id, text, done }, api, classes) => {
    const itemClass = `${classes!.item} ${done ? "done" : ""}`;
    return (
      <div class={itemClass} data-id={id}>
        <input
          type="checkbox"
          class={classes!.checkbox}
          checked={done}
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
  },
});

// Example 4: Explicit props syntax
defineComponent("profile-card", {
  props: {
    name: { type: "string", required: true },
    email: { type: "string", required: true },
    age: { type: "number", required: false },
    verified: { type: "boolean", required: false }
  },
  styles: `
    .profile {
      max-width: 300px;
      padding: 1.5rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .profile-name {
      font-size: 1.25rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 0.5rem;
    }
    .profile-email {
      color: #666;
      margin-bottom: 0.5rem;
    }
    .profile-age {
      color: #888;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
    .profile-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }
    .profile-badge.verified {
      background: #d4edda;
      color: #155724;
    }
    .profile-badge.unverified {
      background: #f8d7da;
      color: #721c24;
    }
  `,
  classes: {
    card: "profile",
    name: "profile-name",
    email: "profile-email", 
    age: "profile-age",
    badge: "profile-badge"
  },
  render: ({ name, email, age, verified }, api, classes) => (
    <div class={classes!.card}>
      <div class={classes!.name}>{name}</div>
      <div class={classes!.email}>{email}</div>
      {age && <div class={classes!.age}>Age: {age}</div>}
      <span class={`${classes!.badge} ${verified ? "verified" : "unverified"}`}>
        {verified ? "Verified" : "Unverified"}
      </span>
    </div>
  ),
});

console.log("✅ defineComponent examples loaded successfully!");