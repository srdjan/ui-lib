/** @jsx h */
import { array, defineComponent, h, string } from "../../../index.ts";
import { showcaseClasses } from "../utilities/showcase-utilities.ts";

/**
 * Demo Viewer Component
 * Interactive demo section with tabs and content area
 * Uses Open Props for consistent styling
 */
defineComponent("showcase-demo-viewer", {
  render: (props) => {
    const activeDemo = props?.activeDemo || "ecommerce";
    const tabs = props?.tabs ? JSON.parse(props.tabs) : [
      { id: "ecommerce", label: "E-commerce", icon: "🏪" },
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "forms", label: "Forms", icon: "📝" },
      { id: "components", label: "Components", icon: "🧩" },
      { id: "playground", label: "Playground", icon: "🚀" },
    ];

    return (
      <section class={showcaseClasses.showcaseSection}>
        <div
          class={showcaseClasses.showcaseContainer}
          style="text-align: center; margin-bottom: var(--size-fluid-6);"
        >
          <h2
            style={`font-size: var(--font-size-fluid-2); font-weight: var(--font-weight-8); 
                    background: var(--gradient-3); -webkit-background-clip: text; 
                    background-clip: text; -webkit-text-fill-color: transparent; 
                    margin-bottom: var(--size-3);`}
          >
            See It In Action
          </h2>
          <p style="color: var(--text-2);">
            Real components, real code, real performance metrics
          </p>
        </div>

        <div class="showcase-demo-tabs">
          {tabs.map((tab: any) => {
            const isActive = tab.id === activeDemo;
            const tabClass = isActive
              ? `showcase-demo-tab active`
              : `showcase-demo-tab`;
            const clickHandler = tab.id === "playground"
              ? `loadPlayground()`
              : `loadDemo('${tab.id}')`;

            return (
              <button
                class={tabClass}
                onclick={clickHandler}
                data-demo={tab.id}
              >
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </div>

        <div
          class="showcase-demo-content"
          id="demo-content"
        >
          {/* Content will be loaded dynamically via HTMX */}
        </div>
      </section>
    );
  },
});

/**
 * Demo Panel Component
 * Reusable panel for code and preview sections
 */
defineComponent("showcase-demo-panel", {
  render: (props) => {
    const title = props?.title || "Panel";
    const icon = props?.icon || "👁️";
    const type = props?.type || "preview";
    const content = props?.content || "";
    const actions = props?.actions ? JSON.parse(props.actions) : [];

    const contentClass = type === "code"
      ? showcaseClasses.showcaseCodeContent
      : showcaseClasses.showcasePreviewContent;

    return (
      <div class={showcaseClasses.showcasePanel}>
        <div class={showcaseClasses.showcasePanelHeader}>
          <span class={showcaseClasses.showcasePanelTitle}>
            {icon} {title}
          </span>
          {actions.length > 0 && (
            <div class={showcaseClasses.showcasePanelActions}>
              {actions.map((action: any) => (
                <button
                  type="button"
                  class={showcaseClasses.showcasePanelAction}
                  onclick={action.onclick}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div class={contentClass} innerHTML={content}></div>
      </div>
    );
  },
});