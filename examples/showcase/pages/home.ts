import { defineComponent, h, renderComponent } from "../../../mod.ts";

// Define the home page component
defineComponent("showcase-home", {
  render: () => h("div", {}, [
    h("header", { class: "hero" }, [
      h("h1", { style: "font-size: var(--font-size-7); margin: var(--size-4) 0;" }, "ui-lib"),
      h("p", { style: "font-size: var(--font-size-3); color: var(--text-2);" }, 
        "Ultra-lightweight, type-safe SSR components with DOM-native state management"),
      h("div", { class: "flex gap-3 mt-4" }, [
        h("a", { 
          href: "/components", 
          class: "btn primary",
          style: "padding: var(--size-3) var(--size-5); background: var(--brand); color: white; text-decoration: none; border-radius: var(--radius-2);"
        }, "View Components"),
        h("a", { 
          href: "https://github.com/yourusername/ui-lib", 
          class: "btn secondary",
          style: "padding: var(--size-3) var(--size-5); background: var(--surface-3); color: var(--text-1); text-decoration: none; border-radius: var(--radius-2);"
        }, "GitHub")
      ])
    ]),
    
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Key Features"),
      h("div", { class: "demo-grid" }, [
        createFeatureCard("🚀 Zero Runtime", "Pure HTML/CSS output, no client-side framework needed"),
        createFeatureCard("🎯 DOM-Native State", "State lives in CSS classes, data attributes, and element content"),
        createFeatureCard("⚡ Hybrid Reactivity", "Three-tier system: CSS properties, pub/sub, and DOM events"),
        createFeatureCard("🔧 Type-Safe", "Full TypeScript support with strict typing"),
        createFeatureCard("🎨 CSS-in-TS", "Auto-generated class names from CSS properties"),
        createFeatureCard("📦 50+ Components", "Enterprise-grade component library included")
      ])
    ]),
    
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Quick Start"),
      h("p", {}, "Define a component with the new declarative bindings:"),
      h("pre", {}, `import { defineComponent, h } from "ui-lib";

defineComponent("greeting-card", {
  render: () => 
    h("div", { class: "card" }, [
      h("h2", { "data-bind-text": "title" }, "Hello World"),
      h("input", { 
        "data-bind-value": "message",
        placeholder: "Type a message..." 
      }),
      h("button", { 
        "data-emit": "save",
        "data-emit-value": '{"action": "save"}'
      }, "Save")
    ])
});`),
      h("p", { class: "mt-3" }, [
        "Learn more in the ",
        h("a", { href: "/reactivity" }, "Reactivity section"),
        " or explore ",
        h("a", { href: "/components" }, "Built-in Components")
      ])
    ]),
    
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Philosophy"),
      h("p", {}, "ui-lib reimagines web components by embracing the platform:"),
      h("ul", { style: "line-height: var(--font-lineheight-4);" }, [
        h("li", {}, h("strong", {}, "State belongs in the DOM"), " - Not in JavaScript memory"),
        h("li", {}, h("strong", {}, "CSS is the styling language"), " - Not JavaScript objects"),
        h("li", {}, h("strong", {}, "HTML is the structure"), " - Not virtual DOM trees"),
        h("li", {}, h("strong", {}, "Progressive enhancement"), " - Not hydration"),
        h("li", {}, h("strong", {}, "Server-first"), " - Not client-first with SSR bolted on")
      ])
    ])
  ])
});

function createFeatureCard(title: string, description: string) {
  return h("div", { 
    style: "padding: var(--size-3); background: var(--surface-1); border-radius: var(--radius-2); border: 1px solid var(--surface-3);" 
  }, [
    h("h3", { style: "font-size: var(--font-size-2); margin: 0 0 var(--size-2) 0;" }, title),
    h("p", { style: "font-size: var(--font-size-0); color: var(--text-2); margin: 0;" }, description)
  ]);
}

export function createHomePage(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ui-lib - Minimal Showcase</title>
      <link rel="stylesheet" href="/css/styles.css">
      <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    </head>
    <body>
      <nav>
        <ul>
          <li><strong>ui-lib</strong></li>
          <li><a href="/" class="active">Home</a></li>
          <li><a href="/components">Components</a></li>
          <li><a href="/reactivity">Reactivity</a></li>
          <li><a href="/forms">Forms</a></li>
          <li><a href="/layouts">Layouts</a></li>
        </ul>
      </nav>
      <div class="container">
        ${renderComponent("showcase-home")}
      </div>
    </body>
    </html>
  `;
}