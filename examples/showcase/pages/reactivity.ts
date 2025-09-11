import { defineComponent, h, renderComponent } from "../../../mod.ts";

// Define the reactivity page component
defineComponent("showcase-reactivity", {
  render: () => h("div", {}, [
    h("header", { class: "hero" }, [
      h("h1", { style: "font-size: var(--font-size-6); margin: var(--size-3) 0;" }, "Declarative Bindings"),
      h("p", { style: "font-size: var(--font-size-2); color: var(--text-2);" }, 
        "Explore ui-lib's three-tier reactivity system with data-bind-* attributes")
    ]),
    
    // Text Binding Section
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Text Binding"),
      h("p", {}, "Bind text content to state values using data-bind-text"),
      h("div", { class: "demo-example" }, [
        h("div", { class: "demo-controls" }, [
          h("label", {}, "Name:"),
          h("input", { 
            type: "text",
            "data-bind-value": "username",
            placeholder: "Enter your name",
            style: "padding: var(--size-2); border: 1px solid var(--surface-3); border-radius: var(--radius-1);"
          })
        ]),
        h("div", { class: "demo-output" }, [
          h("p", {}, [
            "Hello, ",
            h("span", { 
              "data-bind-text": "username",
              style: "font-weight: bold; color: var(--brand);"
            }, "World"),
            "!"
          ]),
          h("h3", { 
            "data-bind-text": "username",
            style: "color: var(--text-2);"
          }, "Default Title")
        ]),
        createCodeExample(`<!-- Input with two-way binding -->
<input data-bind-value="username" placeholder="Enter your name" />

<!-- Text content binding -->
<span data-bind-text="username">World</span>
<h3 data-bind-text="username">Default Title</h3>`)
      ])
    ]),
    
    // Class Binding Section
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Class Binding"),
      h("p", {}, "Dynamically change CSS classes based on state"),
      h("div", { class: "demo-example" }, [
        h("div", { class: "demo-controls" }, [
          h("label", {}, "Theme:"),
          h("select", { 
            "data-bind-value": "theme",
            style: "padding: var(--size-2); border: 1px solid var(--surface-3); border-radius: var(--radius-1);"
          }, [
            h("option", { value: "light" }, "Light"),
            h("option", { value: "dark" }, "Dark"),
            h("option", { value: "blue" }, "Blue"),
            h("option", { value: "green" }, "Green")
          ])
        ]),
        h("div", { class: "demo-output" }, [
          h("div", { 
            "data-bind-class": "theme",
            class: "theme-demo-box",
            style: `
              padding: var(--size-4);
              border-radius: var(--radius-2);
              text-align: center;
              border: 2px solid var(--surface-3);
            `
          }, "Theme will change me!")
        ]),
        createCodeExample(`<!-- Class binding -->
<div data-bind-class="theme" class="theme-demo-box">
  Theme will change me!
</div>

<!-- CSS for different themes -->
.light { background: #f9f9f9; color: #333; }
.dark { background: #333; color: #f9f9f9; }
.blue { background: #e3f2fd; color: #1565c0; }
.green { background: #e8f5e8; color: #2e7d32; }`)
      ])
    ]),
    
    // Style Binding Section
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Style Binding"),
      h("p", {}, "Bind individual CSS properties to state values"),
      h("div", { class: "demo-example" }, [
        h("div", { class: "demo-controls" }, [
          h("div", { style: "margin-bottom: var(--size-2);" }, [
            h("label", {}, "Color: "),
            h("input", { 
              type: "color",
              "data-bind-value": "boxColor",
              value: "#3b82f6"
            })
          ]),
          h("div", { style: "margin-bottom: var(--size-2);" }, [
            h("label", {}, "Size: "),
            h("input", { 
              type: "range",
              "data-bind-value": "boxSize",
              min: "50",
              max: "200",
              value: "100"
            }),
            h("span", { "data-bind-text": "boxSize" }, "100"),
            "px"
          ])
        ]),
        h("div", { class: "demo-output" }, [
          h("div", { 
            "data-bind-style": "backgroundColor:boxColor,width:boxSize,height:boxSize",
            style: `
              margin: var(--size-3) auto;
              border-radius: var(--radius-2);
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            `
          }, "Styled!")
        ]),
        createCodeExample(`<!-- Color picker -->
<input type="color" data-bind-value="boxColor" value="#3b82f6" />

<!-- Range slider -->  
<input type="range" data-bind-value="boxSize" min="50" max="200" value="100" />

<!-- Multiple style bindings -->
<div data-bind-style="backgroundColor:boxColor,width:boxSize,height:boxSize">
  Styled!
</div>`)
      ])
    ]),
    
    // Show/Hide Binding Section
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Show/Hide Binding"),
      h("p", {}, "Conditionally show or hide elements based on state"),
      h("div", { class: "demo-example" }, [
        h("div", { class: "demo-controls" }, [
          h("label", {}, [
            h("input", { 
              type: "checkbox",
              "data-bind-value": "showAlert",
              style: "margin-right: var(--size-1);"
            }),
            "Show Alert"
          ]),
          h("br"),
          h("label", {}, [
            h("input", { 
              type: "checkbox", 
              "data-bind-value": "hideWarning",
              style: "margin-right: var(--size-1);"
            }),
            "Hide Warning"
          ])
        ]),
        h("div", { class: "demo-output" }, [
          h("div", { 
            "data-show-if": "showAlert",
            style: `
              padding: var(--size-3);
              background: #d1ecf1;
              color: #0c5460;
              border: 1px solid #bee5eb;
              border-radius: var(--radius-1);
              margin: var(--size-2) 0;
            `,
            class: "alert"
          }, "✅ This alert shows when checkbox is checked!"),
          h("div", { 
            "data-hide-if": "hideWarning",
            style: `
              padding: var(--size-3);
              background: #fff3cd;
              color: #856404;
              border: 1px solid #ffeaa7;
              border-radius: var(--radius-1);
              margin: var(--size-2) 0;
            `,
            class: "warning"
          }, "⚠️ This warning hides when checkbox is checked!")
        ]),
        createCodeExample(`<!-- Checkbox controls -->
<input type="checkbox" data-bind-value="showAlert" /> Show Alert
<input type="checkbox" data-bind-value="hideWarning" /> Hide Warning

<!-- Conditional visibility -->
<div data-show-if="showAlert" class="alert">
  This shows when showAlert is true
</div>

<div data-hide-if="hideWarning" class="warning">
  This hides when hideWarning is true  
</div>`)
      ])
    ]),
    
    // Event Binding Section
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Event Binding"),
      h("p", {}, "Emit custom events and listen for them across components"),
      h("div", { class: "demo-example" }, [
        h("div", { class: "demo-controls" }, [
          h("button", {
            "data-emit": "notification",
            "data-emit-value": '{"type": "info", "message": "Hello from button!"}',
            style: `
              padding: var(--size-2) var(--size-3);
              background: var(--brand);
              color: white;
              border: none;
              border-radius: var(--radius-1);
              cursor: pointer;
              margin-right: var(--size-2);
            `
          }, "Send Info"),
          h("button", {
            "data-emit": "notification", 
            "data-emit-value": '{"type": "warning", "message": "This is a warning!"}',
            style: `
              padding: var(--size-2) var(--size-3);
              background: #f59e0b;
              color: white;
              border: none;
              border-radius: var(--radius-1);
              cursor: pointer;
              margin-right: var(--size-2);
            `
          }, "Send Warning"),
          h("button", {
            "data-emit": "clear-notifications",
            style: `
              padding: var(--size-2) var(--size-3);
              background: var(--surface-3);
              color: var(--text-1);
              border: none;
              border-radius: var(--radius-1);
              cursor: pointer;
            `
          }, "Clear All")
        ]),
        h("div", { class: "demo-output" }, [
          h("div", { 
            id: "notification-area",
            "data-listen": "notification:showNotification(),clear-notifications:clearNotifications()",
            style: `
              min-height: 60px;
              padding: var(--size-3);
              background: var(--surface-2);
              border-radius: var(--radius-1);
              border: 1px dashed var(--surface-3);
            `
          }, [
            h("div", { id: "notifications" }, "Click buttons to see notifications appear here...")
          ])
        ]),
        createCodeExample(`<!-- Event emitters -->
<button data-emit="notification" 
        data-emit-value='{"type": "info", "message": "Hello!"}'>
  Send Info
</button>

<button data-emit="clear-notifications">Clear All</button>

<!-- Event listener -->
<div data-listen="notification:showNotification(),clear-notifications:clearNotifications()">
  <div id="notifications">Notifications will appear here...</div>
</div>`)
      ])
    ]),
    
    // Advanced Example Section
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Advanced Example: Todo List"),
      h("p", {}, "Combining multiple binding types for a complete interactive component"),
      h("div", { class: "demo-example" }, [
        h("div", { class: "todo-app" }, [
          h("div", { class: "todo-input" }, [
            h("input", {
              type: "text",
              "data-bind-value": "newTodo",
              placeholder: "Add a new todo...",
              style: `
                flex: 1;
                padding: var(--size-2);
                border: 1px solid var(--surface-3);
                border-radius: var(--radius-1);
                margin-right: var(--size-2);
              `
            }),
            h("button", {
              "data-emit": "add-todo",
              "data-emit-value": "{}",
              style: `
                padding: var(--size-2) var(--size-3);
                background: var(--brand);
                color: white;
                border: none;
                border-radius: var(--radius-1);
                cursor: pointer;
              `
            }, "Add")
          ]),
          h("div", { 
            id: "todo-list",
            "data-listen": "add-todo:addTodo(),toggle-todo:toggleTodo(),remove-todo:removeTodo()",
            style: "margin-top: var(--size-3);"
          }, [
            h("div", { class: "todo-item", style: "padding: var(--size-2); border: 1px solid var(--surface-3); border-radius: var(--radius-1); margin-bottom: var(--size-1);" }, [
              h("span", {}, "Sample todo item (click buttons above to add more)")
            ])
          ]),
          h("div", { 
            class: "todo-stats",
            style: "margin-top: var(--size-3); padding: var(--size-2); background: var(--surface-2); border-radius: var(--radius-1);"
          }, [
            h("span", { "data-bind-text": "todoCount" }, "0"), " todos total"
          ])
        ]),
        createCodeExample(`<!-- Todo input with binding -->
<input data-bind-value="newTodo" placeholder="Add a new todo..." />
<button data-emit="add-todo" data-emit-value="{}">Add</button>

<!-- Todo list with event listeners -->  
<div data-listen="add-todo:addTodo(),toggle-todo:toggleTodo(),remove-todo:removeTodo()">
  <!-- Todo items will be added dynamically -->
</div>

<!-- Stats with text binding -->
<span data-bind-text="todoCount">0</span> todos total`)
      ])
    ])
  ])
});

function createCodeExample(code: string) {
  return h("details", { 
    class: "code-example",
    style: "margin-top: var(--size-3);"
  }, [
    h("summary", { 
      style: "cursor: pointer; font-size: var(--font-size-0); color: var(--text-2); padding: var(--size-1);"
    }, "💻 View Code"),
    h("pre", { 
      style: `
        margin: var(--size-2) 0 0 0;
        font-size: var(--font-size-0);
        background: var(--gray-9);
        color: var(--gray-0);
        padding: var(--size-3);
        border-radius: var(--radius-1);
        overflow-x: auto;
        line-height: 1.5;
      `
    }, code)
  ]);
}

export function createReactivityPage(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reactivity - ui-lib Showcase</title>
      <link rel="stylesheet" href="/css/styles.css">
      <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    </head>
    <body>
      <nav>
        <ul>
          <li><strong>ui-lib</strong></li>
          <li><a href="/">Home</a></li>
          <li><a href="/components">Components</a></li>
          <li><a href="/reactivity" class="active">Reactivity</a></li>
          <li><a href="/forms">Forms</a></li>
          <li><a href="/layouts">Layouts</a></li>
        </ul>
      </nav>
      <div class="container">
        ${renderComponent("showcase-reactivity")}
      </div>
      
      <style>
        .demo-example {
          margin: var(--size-4) 0;
          padding: var(--size-4);
          background: var(--surface-1);
          border-radius: var(--radius-2);
          border: 1px solid var(--surface-3);
        }
        
        .demo-controls {
          padding: var(--size-3);
          background: var(--surface-2);
          border-radius: var(--radius-1);
          margin-bottom: var(--size-3);
        }
        
        .demo-controls > * {
          margin-bottom: var(--size-2);
        }
        .demo-controls > *:last-child {
          margin-bottom: 0;
        }
        
        .demo-output {
          padding: var(--size-3);
          background: var(--surface-2);
          border-radius: var(--radius-1);
          margin-bottom: var(--size-3);
        }
        
        .theme-demo-box.light {
          background: #f9f9f9;
          color: #333;
        }
        
        .theme-demo-box.dark {
          background: #333;
          color: #f9f9f9;
        }
        
        .theme-demo-box.blue {
          background: #e3f2fd;
          color: #1565c0;
        }
        
        .theme-demo-box.green {
          background: #e8f5e8;
          color: #2e7d32;
        }
        
        .todo-input {
          display: flex;
          margin-bottom: var(--size-3);
        }
        
        .todo-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--size-2);
          border: 1px solid var(--surface-3);
          border-radius: var(--radius-1);
          margin-bottom: var(--size-1);
        }
        
        .todo-item.completed {
          text-decoration: line-through;
          opacity: 0.6;
        }
      </style>
      
      <script>
        // Initialize state
        document.addEventListener('DOMContentLoaded', () => {
          // Set default values
          document.dispatchEvent(new CustomEvent('ui-lib:username', { 
            detail: { data: '' } 
          }));
          document.dispatchEvent(new CustomEvent('ui-lib:theme', { 
            detail: { data: 'light' } 
          }));
          document.dispatchEvent(new CustomEvent('ui-lib:boxColor', { 
            detail: { data: '#3b82f6' } 
          }));
          document.dispatchEvent(new CustomEvent('ui-lib:boxSize', { 
            detail: { data: '100' } 
          }));
          document.dispatchEvent(new CustomEvent('ui-lib:showAlert', { 
            detail: { data: false } 
          }));
          document.dispatchEvent(new CustomEvent('ui-lib:hideWarning', { 
            detail: { data: false } 
          }));
          document.dispatchEvent(new CustomEvent('ui-lib:newTodo', { 
            detail: { data: '' } 
          }));
          document.dispatchEvent(new CustomEvent('ui-lib:todoCount', { 
            detail: { data: '1' } 
          }));
        });
        
        // Notification system
        let notificationCount = 0;
        
        function showNotification(event) {
          const { type, message } = event.detail;
          const notifications = document.getElementById('notifications');
          
          const notification = document.createElement('div');
          notification.style.cssText = \`
            padding: var(--size-2);
            margin-bottom: var(--size-1);
            border-radius: var(--radius-1);
            background: \${type === 'warning' ? '#fff3cd' : '#d1ecf1'};
            color: \${type === 'warning' ? '#856404' : '#0c5460'};
            border: 1px solid \${type === 'warning' ? '#ffeaa7' : '#bee5eb'};
          \`;
          notification.textContent = \`\${type === 'warning' ? '⚠️' : 'ℹ️'} \${message}\`;
          
          if (notificationCount === 0) {
            notifications.innerHTML = '';
          }
          
          notifications.appendChild(notification);
          notificationCount++;
          
          // Auto remove after 3 seconds
          setTimeout(() => {
            if (notification.parentNode) {
              notification.remove();
              notificationCount--;
              if (notificationCount === 0) {
                notifications.innerHTML = 'Click buttons to see notifications appear here...';
              }
            }
          }, 3000);
        }
        
        function clearNotifications() {
          const notifications = document.getElementById('notifications');
          notifications.innerHTML = 'Click buttons to see notifications appear here...';
          notificationCount = 0;
        }
        
        // Todo system
        let todos = [{ id: 1, text: 'Sample todo item', completed: false }];
        
        function addTodo() {
          const newTodoInput = document.querySelector('[data-bind-value="newTodo"]');
          const text = newTodoInput.value.trim();
          
          if (text) {
            todos.push({
              id: Date.now(),
              text: text,
              completed: false
            });
            
            newTodoInput.value = '';
            document.dispatchEvent(new CustomEvent('ui-lib:newTodo', { 
              detail: { data: '' } 
            }));
            
            updateTodoList();
          }
        }
        
        function toggleTodo(event) {
          const todoId = parseInt(event.detail.id);
          todos = todos.map(todo => 
            todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
          );
          updateTodoList();
        }
        
        function removeTodo(event) {
          const todoId = parseInt(event.detail.id);
          todos = todos.filter(todo => todo.id !== todoId);
          updateTodoList();
        }
        
        function updateTodoList() {
          const todoList = document.getElementById('todo-list');
          
          todoList.innerHTML = todos.map(todo => \`
            <div class="todo-item \${todo.completed ? 'completed' : ''}">
              <span>\${todo.text}</span>
              <div>
                <button onclick="document.dispatchEvent(new CustomEvent('ui-lib:toggle-todo', {detail: {id: \${todo.id}}}))" 
                        style="margin-right: var(--size-1); padding: var(--size-1); border: none; background: var(--surface-3); border-radius: var(--radius-1); cursor: pointer;">
                  \${todo.completed ? '↩️' : '✅'}
                </button>
                <button onclick="document.dispatchEvent(new CustomEvent('ui-lib:remove-todo', {detail: {id: \${todo.id}}}))"
                        style="padding: var(--size-1); border: none; background: var(--surface-4); border-radius: var(--radius-1); cursor: pointer;">
                  🗑️
                </button>
              </div>
            </div>
          \`).join('');
          
          document.dispatchEvent(new CustomEvent('ui-lib:todoCount', { 
            detail: { data: todos.length.toString() } 
          }));
        }
        
        // Global functions for data-listen attributes
        window.showNotification = showNotification;
        window.clearNotifications = clearNotifications;
        window.addTodo = addTodo;
        window.toggleTodo = toggleTodo;
        window.removeTodo = removeTodo;
      </script>
    </body>
    </html>
  `;
}