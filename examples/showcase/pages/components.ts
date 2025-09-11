import { defineComponent, h, renderComponent } from "../../../mod.ts";

// Define the components page component
defineComponent("showcase-components", {
  render: () => h("div", {}, [
    h("header", { class: "hero" }, [
      h("h1", { style: "font-size: var(--font-size-6); margin: var(--size-3) 0;" }, "Component Gallery"),
      h("p", { style: "font-size: var(--font-size-2); color: var(--text-2);" }, 
        "Explore the complete library of built-in ui-lib components with interactive examples")
    ]),
    
    // Buttons Section
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Buttons"),
      h("p", {}, "Interactive button components with various states and styles"),
      h("div", { class: "demo-grid" }, [
        createComponentDemo(
          "Button Variants",
          `<div class="flex gap-3 mb-3">
            <ui-button variant="primary">Primary</ui-button>
            <ui-button variant="secondary">Secondary</ui-button>
            <ui-button variant="outline">Outline</ui-button>
            <ui-button variant="ghost">Ghost</ui-button>
          </div>
          <div class="flex gap-3">
            <ui-button variant="link">Link</ui-button>
            <ui-button variant="destructive">Delete</ui-button>
          </div>`,
          `import { Button } from "ui-lib";

Button({ variant: "primary", children: "Primary" })
Button({ variant: "secondary", children: "Secondary" })
Button({ variant: "outline", children: "Outline" })`
        ),
        
        createComponentDemo(
          "Button Sizes",
          `<div class="flex gap-3 align-items-center">
            <ui-button size="xs">Extra Small</ui-button>
            <ui-button size="sm">Small</ui-button>
            <ui-button size="md">Medium</ui-button>
            <ui-button size="lg">Large</ui-button>
            <ui-button size="xl">Extra Large</ui-button>
          </div>`,
          `Button({ size: "xs", children: "Extra Small" })
Button({ size: "sm", children: "Small" })
Button({ size: "md", children: "Medium" })`
        ),
        
        createComponentDemo(
          "Button States",
          `<div class="flex gap-3 mb-3">
            <ui-button>Normal</ui-button>
            <ui-button loading="true" loading-text="Saving...">Save</ui-button>
            <ui-button disabled="true">Disabled</ui-button>
          </div>
          <div class="flex gap-3">
            <ui-button left-icon="📁">With Icon</ui-button>
            <ui-button right-icon="→">Next Step</ui-button>
          </div>`,
          `Button({ children: "Normal" })
Button({ loading: true, loadingText: "Saving...", children: "Save" })
Button({ disabled: true, children: "Disabled" })`
        )
      ])
    ]),
    
    // Form Inputs Section
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Form Inputs"),
      h("p", {}, "Form input components with validation and interactive states"),
      h("div", { class: "demo-grid" }, [
        createComponentDemo(
          "Input Variants",
          `<div class="form-demo">
            <ui-input placeholder="Default input" />
            <ui-input variant="filled" placeholder="Filled input" />
            <ui-input variant="underlined" placeholder="Underlined input" />
            <ui-input variant="outlined" placeholder="Outlined input" />
          </div>`,
          `Input({ placeholder: "Default input" })
Input({ variant: "filled", placeholder: "Filled input" })
Input({ variant: "underlined", placeholder: "Underlined input" })`
        ),
        
        createComponentDemo(
          "Input Types & States",
          `<div class="form-demo">
            <ui-input type="email" placeholder="Email address" />
            <ui-input type="password" placeholder="Password" />
            <ui-input error="true" error-message="This field is required" placeholder="With error" />
            <ui-input disabled="true" placeholder="Disabled input" />
          </div>`,
          `Input({ type: "email", placeholder: "Email address" })
Input({ type: "password", placeholder: "Password" })
Input({ error: true, errorMessage: "This field is required" })`
        ),
        
        createComponentDemo(
          "Textarea & Select",
          `<div class="form-demo">
            <ui-textarea placeholder="Enter your message..." rows="3"></ui-textarea>
            <ui-select>
              <option value="">Choose an option</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </ui-select>
          </div>`,
          `Textarea({ placeholder: "Enter your message...", rows: 3 })
Select({ options: [
  { value: "", label: "Choose an option" },
  { value: "1", label: "Option 1" }
]})`
        )
      ])
    ]),
    
    // Feedback Components Section
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Feedback Components"),
      h("p", {}, "Alert, progress, badge, and toast components for user feedback"),
      h("div", { class: "demo-grid" }, [
        createComponentDemo(
          "Alert Variants",
          `<div class="alerts-demo">
            <ui-alert variant="info">This is an info alert with helpful information.</ui-alert>
            <ui-alert variant="success">Success! Your action was completed.</ui-alert>
            <ui-alert variant="warning">Warning: Please check your input.</ui-alert>
            <ui-alert variant="error">Error: Something went wrong.</ui-alert>
          </div>`,
          `Alert({ variant: "info", children: "This is an info alert" })
Alert({ variant: "success", children: "Success message" })
Alert({ variant: "warning", children: "Warning message" })`
        ),
        
        createComponentDemo(
          "Progress Indicators",
          `<div class="progress-demo">
            <ui-progress value="25" max="100" color-scheme="blue"></ui-progress>
            <ui-progress value="60" max="100" color-scheme="green"></ui-progress>
            <ui-progress value="85" max="100" color-scheme="orange"></ui-progress>
            <ui-progress indeterminate="true" color-scheme="purple"></ui-progress>
          </div>`,
          `Progress({ value: 25, max: 100, colorScheme: "blue" })
Progress({ value: 60, max: 100, colorScheme: "green" })
Progress({ indeterminate: true, colorScheme: "purple" })`
        ),
        
        createComponentDemo(
          "Badges",
          `<div class="badges-demo">
            <ui-badge variant="solid" color-scheme="blue">New</ui-badge>
            <ui-badge variant="subtle" color-scheme="green">Success</ui-badge>
            <ui-badge variant="outline" color-scheme="orange">Warning</ui-badge>
            <ui-badge variant="solid" color-scheme="red" shape="pill">Hot</ui-badge>
            <ui-badge variant="ghost" color-scheme="purple">Draft</ui-badge>
          </div>`,
          `Badge({ variant: "solid", colorScheme: "blue", children: "New" })
Badge({ variant: "subtle", colorScheme: "green", children: "Success" })
Badge({ variant: "outline", colorScheme: "orange", children: "Warning" })`
        )
      ])
    ]),
    
    // Interactive Demo Section
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Interactive Demo"),
      h("p", {}, "Try out live components with declarative bindings"),
      h("div", { class: "interactive-demo" }, [
        h("div", { class: "demo-controls" }, [
          h("h3", {}, "Component Playground"),
          h("div", { class: "form-demo" }, [
            h("ui-input", { 
              "data-bind-value": "buttonText",
              placeholder: "Button text"
            }),
            h("ui-select", { "data-bind-value": "buttonVariant" }, [
              h("option", { value: "primary" }, "Primary"),
              h("option", { value: "secondary" }, "Secondary"),
              h("option", { value: "outline" }, "Outline"),
              h("option", { value: "ghost" }, "Ghost")
            ]),
            h("ui-select", { "data-bind-value": "buttonSize" }, [
              h("option", { value: "sm" }, "Small"),
              h("option", { value: "md" }, "Medium"),
              h("option", { value: "lg" }, "Large")
            ])
          ])
        ]),
        h("div", { class: "demo-output" }, [
          h("h4", {}, "Live Preview:"),
          h("div", { class: "preview-area" }, [
            h("ui-button", {
              "data-bind-text": "buttonText",
              "data-bind-class": "buttonVariant",
              "data-bind-style": "size:buttonSize",
              "data-emit": "demo-click",
              "data-emit-value": '{"component": "button"}'
            }, "Click me!")
          ])
        ])
      ])
    ])
  ])
});

function createComponentDemo(title: string, htmlExample: string, codeExample: string) {
  return h("div", { 
    style: "background: var(--surface-1); border-radius: var(--radius-2); border: 1px solid var(--surface-3); overflow: hidden;" 
  }, [
    h("div", { style: "padding: var(--size-3); border-bottom: 1px solid var(--surface-3);" }, [
      h("h3", { style: "font-size: var(--font-size-1); margin: 0 0 var(--size-2) 0;" }, title),
      h("div", { style: "padding: var(--size-3); background: var(--surface-2); border-radius: var(--radius-1);" }, [
        h("div", { 
          style: "margin-bottom: var(--size-3);",
          dangerouslySetInnerHTML: { __html: htmlExample }
        }),
        h("details", { style: "margin-top: var(--size-2);" }, [
          h("summary", { style: "cursor: pointer; font-size: var(--font-size-0); color: var(--text-2);" }, "View Code"),
          h("pre", { style: "margin: var(--size-2) 0 0 0; font-size: var(--font-size-0); background: var(--gray-9); color: var(--gray-0); padding: var(--size-2); border-radius: var(--radius-1); overflow-x: auto;" }, codeExample)
        ])
      ])
    ])
  ]);
}

export function createComponentsPage(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Components - ui-lib Showcase</title>
      <link rel="stylesheet" href="/css/styles.css">
      <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    </head>
    <body>
      <nav>
        <ul>
          <li><strong>ui-lib</strong></li>
          <li><a href="/">Home</a></li>
          <li><a href="/components" class="active">Components</a></li>
          <li><a href="/reactivity">Reactivity</a></li>
          <li><a href="/forms">Forms</a></li>
          <li><a href="/layouts">Layouts</a></li>
        </ul>
      </nav>
      <div class="container">
        ${renderComponent("showcase-components")}
      </div>
      
      <style>
        .form-demo > * {
          margin-bottom: var(--size-3);
        }
        .form-demo > *:last-child {
          margin-bottom: 0;
        }
        
        .alerts-demo > * {
          margin-bottom: var(--size-2);
        }
        .alerts-demo > *:last-child {
          margin-bottom: 0;
        }
        
        .progress-demo > * {
          margin-bottom: var(--size-3);
        }
        .progress-demo > *:last-child {
          margin-bottom: 0;
        }
        
        .badges-demo {
          display: flex;
          gap: var(--size-2);
          flex-wrap: wrap;
          align-items: center;
        }
        
        .interactive-demo {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--size-4);
          margin-top: var(--size-4);
        }
        
        .demo-controls {
          padding: var(--size-3);
          background: var(--surface-1);
          border-radius: var(--radius-2);
          border: 1px solid var(--surface-3);
        }
        
        .demo-output {
          padding: var(--size-3);
          background: var(--surface-1);
          border-radius: var(--radius-2);
          border: 1px solid var(--surface-3);
        }
        
        .preview-area {
          padding: var(--size-4);
          background: var(--surface-2);
          border-radius: var(--radius-1);
          margin-top: var(--size-2);
          text-align: center;
        }
        
        @media (max-width: 768px) {
          .interactive-demo {
            grid-template-columns: 1fr;
          }
        }
      </style>
      
      <script>
        // Initialize state for interactive demo
        document.addEventListener('DOMContentLoaded', () => {
          // Set default values for the interactive demo
          document.dispatchEvent(new CustomEvent('ui-lib:buttonText', { 
            detail: { data: 'Click me!' } 
          }));
          document.dispatchEvent(new CustomEvent('ui-lib:buttonVariant', { 
            detail: { data: 'primary' } 
          }));
          document.dispatchEvent(new CustomEvent('ui-lib:buttonSize', { 
            detail: { data: 'md' } 
          }));
        });
        
        // Listen for demo interactions
        document.addEventListener('ui-lib:demo-click', (e) => {
          alert('Button clicked! Component: ' + e.detail.component);
        });
      </script>
    </body>
    </html>
  `;
}