import { defineComponent, h, renderComponent } from "../../../mod.ts";

// Define the layouts page component
defineComponent("showcase-layouts", {
  render: () => h("div", {}, [
    h("header", { class: "hero" }, [
      h("h1", { style: "font-size: var(--font-size-6); margin: var(--size-3) 0;" }, "Layout Patterns"),
      h("p", { style: "font-size: var(--font-size-2); color: var(--text-2);" }, 
        "Explore responsive layout patterns and CSS-in-TS styling capabilities")
    ]),
    
    // Grid Layouts Section
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Grid Layouts"),
      h("p", {}, "Responsive grid systems using CSS Grid and Flexbox"),
      h("div", { class: "layout-examples" }, [
        // Basic Grid
        h("div", { class: "layout-example" }, [
          h("h3", {}, "Basic Grid Layout"),
          h("div", { class: "grid-demo basic-grid" }, [
            h("div", { class: "grid-item header" }, "Header"),
            h("div", { class: "grid-item sidebar" }, "Sidebar"),
            h("div", { class: "grid-item main" }, "Main Content"),
            h("div", { class: "grid-item footer" }, "Footer")
          ]),
          createCodeExample(`/* CSS Grid Layout */
.grid-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  gap: var(--size-3);
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }`)
        ]),
        
        // Card Grid
        h("div", { class: "layout-example" }, [
          h("h3", {}, "Responsive Card Grid"),
          h("div", { class: "grid-demo card-grid" }, [
            h("div", { class: "card" }, [
              h("div", { class: "card-header" }, "Card 1"),
              h("div", { class: "card-content" }, "This is some sample content for the first card.")
            ]),
            h("div", { class: "card" }, [
              h("div", { class: "card-header" }, "Card 2"),
              h("div", { class: "card-content" }, "This is some sample content for the second card.")
            ]),
            h("div", { class: "card" }, [
              h("div", { class: "card-header" }, "Card 3"),
              h("div", { class: "card-content" }, "This is some sample content for the third card.")
            ]),
            h("div", { class: "card" }, [
              h("div", { class: "card-header" }, "Card 4"),
              h("div", { class: "card-content" }, "This is some sample content for the fourth card.")
            ]),
            h("div", { class: "card" }, [
              h("div", { class: "card-header" }, "Card 5"),
              h("div", { class: "card-content" }, "This is some sample content for the fifth card.")
            ]),
            h("div", { class: "card" }, [
              h("div", { class: "card-header" }, "Card 6"),
              h("div", { class: "card-content" }, "This is some sample content for the sixth card.")
            ])
          ]),
          createCodeExample(`/* Responsive Card Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--size-3);
}

.card {
  background: var(--surface-1);
  border: 1px solid var(--surface-3);
  border-radius: var(--radius-2);
  overflow: hidden;
}

.card-header {
  padding: var(--size-3);
  background: var(--surface-2);
  font-weight: 500;
}

.card-content {
  padding: var(--size-3);
}`)
        ])
      ])
    ]),
    
    // Flexbox Layouts Section
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Flexbox Patterns"),
      h("p", {}, "Common flexbox layouts for navigation, content, and UI patterns"),
      h("div", { class: "layout-examples" }, [
        // Navigation Bar
        h("div", { class: "layout-example" }, [
          h("h3", {}, "Navigation Bar"),
          h("div", { class: "flex-demo navbar" }, [
            h("div", { class: "nav-brand" }, "ui-lib"),
            h("div", { class: "nav-links" }, [
              h("a", { href: "#" }, "Home"),
              h("a", { href: "#" }, "About"),
              h("a", { href: "#" }, "Services"),
              h("a", { href: "#" }, "Contact")
            ]),
            h("div", { class: "nav-actions" }, [
              h("button", { class: "btn outline" }, "Login"),
              h("button", { class: "btn primary" }, "Sign Up")
            ])
          ]),
          createCodeExample(`/* Flexbox Navigation */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--size-3) var(--size-4);
  background: var(--surface-2);
  border-radius: var(--radius-2);
}

.nav-brand {
  font-weight: bold;
  font-size: var(--font-size-2);
}

.nav-links {
  display: flex;
  gap: var(--size-4);
}

.nav-actions {
  display: flex;
  gap: var(--size-2);
}`)
        ]),
        
        // Content Layout
        h("div", { class: "layout-example" }, [
          h("h3", {}, "Content with Sidebar"),
          h("div", { class: "flex-demo content-layout" }, [
            h("div", { class: "content-main" }, [
              h("h4", {}, "Main Content Area"),
              h("p", {}, "This is the main content area where your primary content would go. It takes up most of the space and is flexible."),
              h("p", {}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
            ]),
            h("div", { class: "content-sidebar" }, [
              h("h5", {}, "Sidebar"),
              h("div", { class: "sidebar-item" }, "Navigation Links"),
              h("div", { class: "sidebar-item" }, "Recent Posts"),
              h("div", { class: "sidebar-item" }, "Categories"),
              h("div", { class: "sidebar-item" }, "Archive")
            ])
          ]),
          createCodeExample(`/* Content + Sidebar Layout */
.content-layout {
  display: flex;
  gap: var(--size-4);
  align-items: flex-start;
}

.content-main {
  flex: 1;
  background: var(--surface-1);
  padding: var(--size-4);
  border-radius: var(--radius-2);
}

.content-sidebar {
  flex: 0 0 200px;
  background: var(--surface-2);
  padding: var(--size-3);
  border-radius: var(--radius-2);
}

@media (max-width: 768px) {
  .content-layout {
    flex-direction: column;
  }
  
  .content-sidebar {
    flex: none;
  }
}`)
        ])
      ])
    ]),
    
    // Interactive Layouts Section
    h("section", { class: "demo-section" }, [
      h("h2", {}, "Interactive Layouts"),
      h("p", {}, "Dynamic layouts that respond to user interaction using declarative bindings"),
      h("div", { class: "layout-examples" }, [
        // Collapsible Sidebar
        h("div", { class: "layout-example" }, [
          h("h3", {}, "Collapsible Sidebar"),
          h("div", { 
            class: "interactive-layout",
            "data-listen": "toggle-sidebar:toggleSidebar()"
          }, [
            h("div", { 
              class: "sidebar-container",
              "data-bind-class": "sidebarState"
            }, [
              h("div", { class: "sidebar-header" }, [
                h("button", { 
                  "data-emit": "toggle-sidebar",
                  "data-emit-value": "{}",
                  class: "sidebar-toggle"
                }, "☰"),
                h("span", { 
                  class: "sidebar-title",
                  "data-show-if": "sidebarExpanded"
                }, "Menu")
              ]),
              h("nav", { class: "sidebar-nav" }, [
                h("a", { href: "#", class: "nav-item" }, [
                  h("span", { class: "nav-icon" }, "🏠"),
                  h("span", { 
                    class: "nav-text",
                    "data-show-if": "sidebarExpanded"
                  }, "Dashboard")
                ]),
                h("a", { href: "#", class: "nav-item" }, [
                  h("span", { class: "nav-icon" }, "📊"),
                  h("span", { 
                    class: "nav-text",
                    "data-show-if": "sidebarExpanded"
                  }, "Analytics")
                ]),
                h("a", { href: "#", class: "nav-item" }, [
                  h("span", { class: "nav-icon" }, "⚙️"),
                  h("span", { 
                    class: "nav-text",
                    "data-show-if": "sidebarExpanded"
                  }, "Settings")
                ]),
                h("a", { href: "#", class: "nav-item" }, [
                  h("span", { class: "nav-icon" }, "👤"),
                  h("span", { 
                    class: "nav-text",
                    "data-show-if": "sidebarExpanded"
                  }, "Profile")
                ])
              ])
            ]),
            h("div", { class: "layout-main" }, [
              h("div", { class: "main-header" }, [
                h("h4", {}, "Main Content"),
                h("p", {}, "This content area adjusts when the sidebar is collapsed")
              ]),
              h("div", { class: "content-grid" }, [
                h("div", { class: "metric-card" }, [
                  h("h5", {}, "Users"),
                  h("div", { class: "metric-value" }, "1,234")
                ]),
                h("div", { class: "metric-card" }, [
                  h("h5", {}, "Revenue"),
                  h("div", { class: "metric-value" }, "$12.4K")
                ]),
                h("div", { class: "metric-card" }, [
                  h("h5", {}, "Orders"),
                  h("div", { class: "metric-value" }, "89")
                ]),
                h("div", { class: "metric-card" }, [
                  h("h5", {}, "Conversion"),
                  h("div", { class: "metric-value" }, "3.2%")
                ])
              ])
            ])
          ]),
          createCodeExample(`<!-- Interactive Sidebar -->
<div data-listen="toggle-sidebar:toggleSidebar()">
  
  <div class="sidebar" data-bind-class="sidebarState">
    <button data-emit="toggle-sidebar">☰</button>
    
    <nav>
      <a href="#" class="nav-item">
        <span class="nav-icon">🏠</span>
        <span class="nav-text" data-show-if="sidebarExpanded">
          Dashboard
        </span>
      </a>
      <!-- More nav items... -->
    </nav>
  </div>
  
  <main class="content">
    <!-- Main content adjusts automatically -->
  </main>
  
</div>

<!-- JavaScript handles the toggle -->
function toggleSidebar() {
  const expanded = !sidebarExpanded;
  document.dispatchEvent(new CustomEvent('ui-lib:sidebarExpanded', { 
    detail: { data: expanded } 
  }));
  document.dispatchEvent(new CustomEvent('ui-lib:sidebarState', { 
    detail: { data: expanded ? 'expanded' : 'collapsed' } 
  }));
}`)
        ]),
        
        // Tab Layout
        h("div", { class: "layout-example" }, [
          h("h3", {}, "Tab Layout"),
          h("div", { 
            class: "tab-layout",
            "data-listen": "switch-tab:switchTab()"
          }, [
            h("div", { class: "tab-header" }, [
              h("button", { 
                class: "tab-button",
                "data-bind-class": "tabs.overview",
                "data-emit": "switch-tab",
                "data-emit-value": '{"tab": "overview"}'
              }, "Overview"),
              h("button", { 
                class: "tab-button",
                "data-bind-class": "tabs.details",
                "data-emit": "switch-tab",
                "data-emit-value": '{"tab": "details"}'
              }, "Details"),
              h("button", { 
                class: "tab-button",
                "data-bind-class": "tabs.settings",
                "data-emit": "switch-tab",
                "data-emit-value": '{"tab": "settings"}'
              }, "Settings")
            ]),
            h("div", { class: "tab-content" }, [
              h("div", { 
                class: "tab-panel",
                "data-show-if": "activeTab.overview"
              }, [
                h("h4", {}, "Overview"),
                h("p", {}, "This is the overview tab with summary information and key metrics."),
                h("div", { class: "overview-stats" }, [
                  h("div", { class: "stat" }, [
                    h("div", { class: "stat-value" }, "42"),
                    h("div", { class: "stat-label" }, "Total Items")
                  ]),
                  h("div", { class: "stat" }, [
                    h("div", { class: "stat-value" }, "18"),
                    h("div", { class: "stat-label" }, "Active")
                  ]),
                  h("div", { class: "stat" }, [
                    h("div", { class: "stat-value" }, "3"),
                    h("div", { class: "stat-label" }, "Pending")
                  ])
                ])
              ]),
              h("div", { 
                class: "tab-panel",
                "data-show-if": "activeTab.details"
              }, [
                h("h4", {}, "Details"),
                h("p", {}, "This tab contains detailed information and data tables."),
                h("table", { class: "details-table" }, [
                  h("thead", {}, [
                    h("tr", {}, [
                      h("th", {}, "Name"),
                      h("th", {}, "Status"),
                      h("th", {}, "Date")
                    ])
                  ]),
                  h("tbody", {}, [
                    h("tr", {}, [
                      h("td", {}, "Item 1"),
                      h("td", {}, "Active"),
                      h("td", {}, "2024-01-15")
                    ]),
                    h("tr", {}, [
                      h("td", {}, "Item 2"),
                      h("td", {}, "Pending"),
                      h("td", {}, "2024-01-14")
                    ]),
                    h("tr", {}, [
                      h("td", {}, "Item 3"),
                      h("td", {}, "Active"),
                      h("td", {}, "2024-01-13")
                    ])
                  ])
                ])
              ]),
              h("div", { 
                class: "tab-panel",
                "data-show-if": "activeTab.settings"
              }, [
                h("h4", {}, "Settings"),
                h("p", {}, "Configure your preferences and options here."),
                h("div", { class: "settings-form" }, [
                  h("div", { class: "setting-item" }, [
                    h("label", {}, [
                      h("input", { type: "checkbox", checked: "checked" }),
                      " Enable notifications"
                    ])
                  ]),
                  h("div", { class: "setting-item" }, [
                    h("label", {}, [
                      h("input", { type: "checkbox" }),
                      " Auto-save changes"
                    ])
                  ]),
                  h("div", { class: "setting-item" }, [
                    h("label", {}, "Theme:"),
                    h("select", {}, [
                      h("option", {}, "Light"),
                      h("option", {}, "Dark"),
                      h("option", {}, "Auto")
                    ])
                  ])
                ])
              ])
            ])
          ]),
          createCodeExample(`<!-- Tab Layout -->
<div data-listen="switch-tab:switchTab()">
  
  <!-- Tab Headers -->
  <div class="tab-header">
    <button class="tab-button" 
            data-bind-class="tabs.overview"
            data-emit="switch-tab" 
            data-emit-value='{"tab": "overview"}'>
      Overview
    </button>
    <button class="tab-button" 
            data-bind-class="tabs.details"
            data-emit="switch-tab" 
            data-emit-value='{"tab": "details"}'>
      Details
    </button>
  </div>
  
  <!-- Tab Content -->
  <div class="tab-content">
    <div class="tab-panel" data-show-if="activeTab.overview">
      <h4>Overview</h4>
      <!-- Overview content -->
    </div>
    
    <div class="tab-panel" data-show-if="activeTab.details">
      <h4>Details</h4>
      <!-- Details content -->
    </div>
  </div>
  
</div>`)
        ])
      ])
    ]),
    
    // CSS-in-TS Section
    h("section", { class: "demo-section" }, [
      h("h2", {}, "CSS-in-TS Styling"),
      h("p", {}, "Generate type-safe, scoped CSS using ui-lib's CSS-in-TS utilities"),
      h("div", { class: "layout-examples" }, [
        h("div", { class: "layout-example" }, [
          h("h3", {}, "Component Styling Example"),
          h("div", { class: "css-demo" }, [
            h("div", { class: "styled-component" }, [
              h("div", { class: "component-header" }, "Styled Component"),
              h("div", { class: "component-body" }, [
                h("p", {}, "This component uses CSS-in-TS for styling with automatic class name generation."),
                h("button", { class: "component-button primary" }, "Primary Action"),
                h("button", { class: "component-button secondary" }, "Secondary Action")
              ])
            ])
          ]),
          createCodeExample(`import { css } from "ui-lib";

// CSS-in-TS with automatic scoping
const styles = css({
  container: {
    background: "var(--surface-1)",
    borderRadius: "var(--radius-2)",
    border: "1px solid var(--surface-3)",
    overflow: "hidden"
  },
  
  header: {
    padding: "var(--size-3)",
    background: "var(--surface-2)",
    fontWeight: 500,
    borderBottom: "1px solid var(--surface-3)"
  },
  
  body: {
    padding: "var(--size-4)",
  },
  
  button: {
    padding: "var(--size-2) var(--size-3)",
    border: "none",
    borderRadius: "var(--radius-1)",
    cursor: "pointer",
    marginRight: "var(--size-2)",
    
    "&.primary": {
      background: "var(--brand)",
      color: "white"
    },
    
    "&.secondary": {
      background: "var(--surface-3)",
      color: "var(--text-1)"
    }
  }
});

// Use in component
export function StyledComponent() {
  return \`
    <div class="\${styles.classMap.container}">
      <div class="\${styles.classMap.header}">Header</div>
      <div class="\${styles.classMap.body}">
        <button class="\${styles.classMap.button} primary">Primary</button>
        <button class="\${styles.classMap.button} secondary">Secondary</button>
      </div>
    </div>
    <style>\${styles.css}</style>
  \`;
}`)
        ])
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

export function createLayoutsPage(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Layouts - ui-lib Showcase</title>
      <link rel="stylesheet" href="/css/styles.css">
      <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    </head>
    <body>
      <nav>
        <ul>
          <li><strong>ui-lib</strong></li>
          <li><a href="/">Home</a></li>
          <li><a href="/components">Components</a></li>
          <li><a href="/reactivity">Reactivity</a></li>
          <li><a href="/forms">Forms</a></li>
          <li><a href="/layouts" class="active">Layouts</a></li>
        </ul>
      </nav>
      <div class="container">
        ${renderComponent("showcase-layouts")}
      </div>
      
      <style>
        .layout-examples {
          display: flex;
          flex-direction: column;
          gap: var(--size-6);
        }
        
        .layout-example {
          background: var(--surface-1);
          border-radius: var(--radius-2);
          border: 1px solid var(--surface-3);
          padding: var(--size-4);
        }
        
        .layout-example h3 {
          margin: 0 0 var(--size-3) 0;
          color: var(--brand);
        }
        
        /* Grid Demo Styles */
        .basic-grid {
          display: grid;
          grid-template-columns: 200px 1fr;
          grid-template-rows: auto 1fr auto;
          grid-template-areas:
            "header header"
            "sidebar main"
            "footer footer";
          gap: var(--size-2);
          height: 300px;
          border: 2px dashed var(--surface-3);
          border-radius: var(--radius-1);
        }
        
        .grid-item {
          padding: var(--size-3);
          background: var(--surface-2);
          border-radius: var(--radius-1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }
        
        .header { grid-area: header; background: #e3f2fd; }
        .sidebar { grid-area: sidebar; background: #f3e5f5; }
        .main { grid-area: main; background: #e8f5e8; }
        .footer { grid-area: footer; background: #fff3e0; }
        
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--size-3);
        }
        
        .card {
          background: var(--surface-2);
          border: 1px solid var(--surface-3);
          border-radius: var(--radius-2);
          overflow: hidden;
          min-height: 120px;
        }
        
        .card-header {
          padding: var(--size-2);
          background: var(--surface-3);
          font-weight: 500;
          text-align: center;
        }
        
        .card-content {
          padding: var(--size-2);
          font-size: var(--font-size-0);
          color: var(--text-2);
        }
        
        /* Flexbox Demo Styles */
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--size-3);
          background: var(--surface-2);
          border-radius: var(--radius-2);
          border: 1px solid var(--surface-3);
        }
        
        .nav-brand {
          font-weight: bold;
          font-size: var(--font-size-1);
          color: var(--brand);
        }
        
        .nav-links {
          display: flex;
          gap: var(--size-3);
        }
        
        .nav-links a {
          color: var(--text-1);
          text-decoration: none;
          padding: var(--size-1) var(--size-2);
          border-radius: var(--radius-1);
          transition: background 0.2s;
        }
        
        .nav-links a:hover {
          background: var(--surface-3);
        }
        
        .nav-actions {
          display: flex;
          gap: var(--size-2);
        }
        
        .btn {
          padding: var(--size-1) var(--size-2);
          border: none;
          border-radius: var(--radius-1);
          font-size: var(--font-size-0);
          cursor: pointer;
        }
        
        .btn.outline {
          background: transparent;
          border: 1px solid var(--surface-3);
          color: var(--text-1);
        }
        
        .btn.primary {
          background: var(--brand);
          color: white;
        }
        
        .content-layout {
          display: flex;
          gap: var(--size-4);
          align-items: flex-start;
          min-height: 200px;
        }
        
        .content-main {
          flex: 1;
          background: var(--surface-2);
          padding: var(--size-3);
          border-radius: var(--radius-1);
        }
        
        .content-sidebar {
          flex: 0 0 150px;
          background: var(--surface-3);
          padding: var(--size-2);
          border-radius: var(--radius-1);
        }
        
        .sidebar-item {
          padding: var(--size-1);
          margin-bottom: var(--size-1);
          background: var(--surface-2);
          border-radius: var(--radius-1);
          font-size: var(--font-size-0);
          text-align: center;
        }
        
        /* Interactive Layout Styles */
        .interactive-layout {
          display: flex;
          min-height: 300px;
          border: 1px solid var(--surface-3);
          border-radius: var(--radius-2);
          overflow: hidden;
        }
        
        .sidebar-container {
          background: var(--surface-2);
          border-right: 1px solid var(--surface-3);
          transition: all 0.3s ease;
          width: 200px;
        }
        
        .sidebar-container.collapsed {
          width: 60px;
        }
        
        .sidebar-header {
          display: flex;
          align-items: center;
          padding: var(--size-2);
          border-bottom: 1px solid var(--surface-3);
        }
        
        .sidebar-toggle {
          background: none;
          border: none;
          font-size: var(--font-size-2);
          cursor: pointer;
          padding: var(--size-1);
          border-radius: var(--radius-1);
        }
        
        .sidebar-toggle:hover {
          background: var(--surface-3);
        }
        
        .sidebar-title {
          margin-left: var(--size-2);
          font-weight: 500;
        }
        
        .sidebar-nav {
          padding: var(--size-2) 0;
        }
        
        .nav-item {
          display: flex;
          align-items: center;
          padding: var(--size-2);
          color: var(--text-1);
          text-decoration: none;
          transition: background 0.2s;
        }
        
        .nav-item:hover {
          background: var(--surface-3);
        }
        
        .nav-icon {
          font-size: var(--font-size-1);
          width: 24px;
          text-align: center;
        }
        
        .nav-text {
          margin-left: var(--size-2);
          font-size: var(--font-size-0);
        }
        
        .layout-main {
          flex: 1;
          padding: var(--size-4);
        }
        
        .main-header h4 {
          margin: 0 0 var(--size-1) 0;
        }
        
        .main-header p {
          color: var(--text-2);
          margin: 0 0 var(--size-4) 0;
        }
        
        .content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--size-3);
        }
        
        .metric-card {
          background: var(--surface-1);
          padding: var(--size-3);
          border-radius: var(--radius-1);
          border: 1px solid var(--surface-3);
          text-align: center;
        }
        
        .metric-card h5 {
          margin: 0 0 var(--size-2) 0;
          color: var(--text-2);
          font-size: var(--font-size-0);
        }
        
        .metric-value {
          font-size: var(--font-size-3);
          font-weight: bold;
          color: var(--brand);
        }
        
        /* Tab Layout Styles */
        .tab-layout {
          border: 1px solid var(--surface-3);
          border-radius: var(--radius-2);
          overflow: hidden;
        }
        
        .tab-header {
          display: flex;
          background: var(--surface-2);
          border-bottom: 1px solid var(--surface-3);
        }
        
        .tab-button {
          padding: var(--size-2) var(--size-4);
          background: none;
          border: none;
          border-right: 1px solid var(--surface-3);
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .tab-button:last-child {
          border-right: none;
        }
        
        .tab-button:hover {
          background: var(--surface-3);
        }
        
        .tab-button.active {
          background: var(--brand);
          color: white;
        }
        
        .tab-content {
          min-height: 300px;
        }
        
        .tab-panel {
          padding: var(--size-4);
        }
        
        .tab-panel h4 {
          margin: 0 0 var(--size-3) 0;
          color: var(--brand);
        }
        
        .overview-stats {
          display: flex;
          gap: var(--size-4);
          margin-top: var(--size-4);
        }
        
        .stat {
          text-align: center;
          background: var(--surface-1);
          padding: var(--size-3);
          border-radius: var(--radius-1);
          border: 1px solid var(--surface-3);
          flex: 1;
        }
        
        .stat-value {
          font-size: var(--font-size-4);
          font-weight: bold;
          color: var(--brand);
        }
        
        .stat-label {
          font-size: var(--font-size-0);
          color: var(--text-2);
          margin-top: var(--size-1);
        }
        
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: var(--size-3);
        }
        
        .details-table th,
        .details-table td {
          padding: var(--size-2);
          text-align: left;
          border-bottom: 1px solid var(--surface-3);
        }
        
        .details-table th {
          background: var(--surface-2);
          font-weight: 500;
        }
        
        .settings-form {
          margin-top: var(--size-3);
        }
        
        .setting-item {
          margin-bottom: var(--size-3);
        }
        
        .setting-item label {
          display: flex;
          align-items: center;
          gap: var(--size-2);
        }
        
        .setting-item select {
          margin-left: var(--size-2);
          padding: var(--size-1);
          border: 1px solid var(--surface-3);
          border-radius: var(--radius-1);
        }
        
        /* CSS Demo Styles */
        .css-demo {
          margin-top: var(--size-3);
        }
        
        .styled-component {
          background: var(--surface-1);
          border-radius: var(--radius-2);
          border: 1px solid var(--surface-3);
          overflow: hidden;
          max-width: 400px;
        }
        
        .component-header {
          padding: var(--size-3);
          background: var(--surface-2);
          font-weight: 500;
          border-bottom: 1px solid var(--surface-3);
        }
        
        .component-body {
          padding: var(--size-4);
        }
        
        .component-button {
          padding: var(--size-2) var(--size-3);
          border: none;
          border-radius: var(--radius-1);
          cursor: pointer;
          margin-right: var(--size-2);
          transition: background 0.2s;
        }
        
        .component-button.primary {
          background: var(--brand);
          color: white;
        }
        
        .component-button.secondary {
          background: var(--surface-3);
          color: var(--text-1);
        }
        
        .component-button:hover {
          opacity: 0.9;
        }
        
        @media (max-width: 768px) {
          .content-layout {
            flex-direction: column;
          }
          
          .content-sidebar {
            flex: none;
          }
          
          .navbar {
            flex-direction: column;
            gap: var(--size-2);
          }
          
          .nav-links {
            order: 1;
          }
          
          .nav-actions {
            order: 2;
          }
          
          .interactive-layout {
            flex-direction: column;
          }
          
          .sidebar-container {
            width: 100%;
          }
          
          .sidebar-container.collapsed {
            width: 100%;
            height: 60px;
          }
          
          .overview-stats {
            flex-direction: column;
          }
        }
      </style>
      
      <script>
        // Interactive layout state
        let sidebarExpanded = true;
        let activeTabName = 'overview';
        
        // Initialize state
        document.addEventListener('DOMContentLoaded', () => {
          // Sidebar state
          document.dispatchEvent(new CustomEvent('ui-lib:sidebarExpanded', { 
            detail: { data: sidebarExpanded } 
          }));
          document.dispatchEvent(new CustomEvent('ui-lib:sidebarState', { 
            detail: { data: sidebarExpanded ? 'expanded' : 'collapsed' } 
          }));
          
          // Tab state
          updateTabState();
        });
        
        // Sidebar toggle
        function toggleSidebar() {
          sidebarExpanded = !sidebarExpanded;
          
          document.dispatchEvent(new CustomEvent('ui-lib:sidebarExpanded', { 
            detail: { data: sidebarExpanded } 
          }));
          document.dispatchEvent(new CustomEvent('ui-lib:sidebarState', { 
            detail: { data: sidebarExpanded ? 'expanded' : 'collapsed' } 
          }));
        }
        
        // Tab switching
        function switchTab(event) {
          const { tab } = event.detail;
          activeTabName = tab;
          updateTabState();
        }
        
        function updateTabState() {
          // Update tab button states
          ['overview', 'details', 'settings'].forEach(tabName => {
            document.dispatchEvent(new CustomEvent(\`ui-lib:tabs.\${tabName}\`, { 
              detail: { data: activeTabName === tabName ? 'active' : '' } 
            }));
            
            document.dispatchEvent(new CustomEvent(\`ui-lib:activeTab.\${tabName}\`, { 
              detail: { data: activeTabName === tabName } 
            }));
          });
        }
        
        // Global functions for data-listen attributes
        window.toggleSidebar = toggleSidebar;
        window.switchTab = switchTab;
      </script>
    </body>
    </html>
  `;
}