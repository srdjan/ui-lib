// Demo Viewer Component - Interactive demo viewer with HTMX integration
// Extracted from showcase inline JavaScript for broader reuse

import { defineComponent } from "../../define-component.ts";
import type { ComponentProps } from "../../types.ts";

/**
 * Demo viewer configuration
 */
export interface DemoViewerConfig {
  readonly apiBasePath?: string;
  readonly defaultDemo?: string;
  readonly enableCodeModal?: boolean;
  readonly syntaxHighlighting?: boolean;
}

/**
 * Demo viewer component props
 */
export interface DemoViewerProps extends ComponentProps {
  readonly demos?: readonly string[];
  readonly config?: DemoViewerConfig;
  readonly class?: string;
}

/**
 * Generate demo viewer tabs
 */
const generateTabs = (demos: readonly string[], defaultDemo?: string) => {
  return demos
    .map((demo) => {
      const isActive = demo === (defaultDemo ?? demos[0]);
      const activeClass = isActive ? " active" : "";
      
      return `
        <button 
          class="showcase-demo-tab${activeClass}" 
          data-demo="${demo}"
          onclick="window.uiLibDemoViewer?.loadDemo('${demo}')"
        >
          ${demo.charAt(0).toUpperCase() + demo.slice(1)}
        </button>
      `;
    })
    .join("");
};

/**
 * Interactive demo viewer component
 */
export const DemoViewer = defineComponent<DemoViewerProps>({
  name: "demo-viewer",
  
  render: ({ demos = [], config = {}, class: className, ...props }) => {
    const {
      apiBasePath = "/api/showcase",
      defaultDemo = demos[0],
      enableCodeModal = true,
    } = config;

    const tabsHtml = demos.length > 0 ? generateTabs(demos, defaultDemo) : "";

    return /*html*/ `
      <div class="demo-viewer ${className ?? ""}" data-component="demo-viewer" ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(" ")}>
        ${tabsHtml ? `
          <div class="demo-tabs">
            ${tabsHtml}
            ${demos.includes("playground") ? "" : `
              <button 
                class="showcase-demo-tab" 
                data-demo="playground"
                onclick="window.uiLibDemoViewer?.loadPlayground()"
              >
                Playground
              </button>
            `}
            ${enableCodeModal ? `
              <button 
                class="demo-action-button" 
                onclick="window.uiLibDemoViewer?.showCodeModal()"
                title="View Code"
              >
                📝 Code
              </button>
            ` : ""}
          </div>
        ` : ""}
        
        <div id="demo-content" class="demo-content">
          ${defaultDemo ? `
            <div class="loading">Loading ${defaultDemo} demo...</div>
          ` : `
            <div class="demo-placeholder">
              <p>Select a demo to view its interactive preview</p>
            </div>
          `}
        </div>
      </div>

      <style>
        .demo-viewer {
          border: 1px solid var(--surface-3, #e0e0e0);
          border-radius: var(--radius-3, 8px);
          overflow: hidden;
          background: var(--surface-1, #ffffff);
        }

        .demo-tabs {
          display: flex;
          background: var(--surface-2, #f5f5f5);
          border-bottom: 1px solid var(--surface-3, #e0e0e0);
          gap: 0;
          align-items: center;
        }

        .showcase-demo-tab, .demo-action-button {
          padding: var(--size-2, 12px) var(--size-4, 16px);
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: var(--font-size-1, 14px);
          font-weight: var(--font-weight-5, 500);
          color: var(--text-2, #666);
          border-right: 1px solid var(--surface-3, #e0e0e0);
          transition: all 0.2s ease;
        }

        .showcase-demo-tab:hover, .demo-action-button:hover {
          background: var(--surface-1, #ffffff);
          color: var(--text-1, #333);
        }

        .showcase-demo-tab.active {
          background: var(--surface-1, #ffffff);
          color: var(--text-1, #333);
          font-weight: var(--font-weight-6, 600);
        }

        .demo-action-button {
          margin-left: auto;
          border-right: none;
        }

        .demo-content {
          min-height: 400px;
          position: relative;
        }

        .loading, .demo-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 400px;
          color: var(--text-2, #666);
          font-style: italic;
        }

        .demo-placeholder p {
          text-align: center;
          line-height: 1.5;
        }
      </style>
    `;
  },

  /**
   * Generate client-side JavaScript for demo functionality
   */
  clientScript: (config: DemoViewerConfig = {}) => {
    const {
      apiBasePath = "/api/showcase",
      enableCodeModal = true,
      syntaxHighlighting = true,
    } = config;

    return `
// ui-lib Demo Viewer - Interactive demo loading system
window.uiLibDemoViewer = {
  currentDemo: null,
  config: ${JSON.stringify(config)},

  loadDemo(demoName) {
    console.log("🎬 Loading demo:", demoName);
    
    // Update active tab
    document.querySelectorAll(".showcase-demo-tab").forEach(tab => {
      tab.classList.remove("active");
    });
    
    const activeTab = document.querySelector(\`[data-demo="\${demoName}"]\`);
    if (activeTab) {
      activeTab.classList.add("active");
    }

    this.currentDemo = demoName;
    
    // Load demo content with preview-only layout and modal for code
    const content = document.getElementById("demo-content");
    const modalId = \`code-modal-\${demoName}\`;

    content.innerHTML = \`
      <div class="viewer" data-component="showcase-demo-viewer">
        <!-- Full-width Preview -->
        <div class="preview-panel">
          <div 
            class="preview-content" 
            id="preview-\${demoName}" 
            hx-get="${apiBasePath}/preview/\${demoName}" 
            hx-trigger="load"
          >
            Loading preview...
          </div>
        </div>

        <!-- Code Modal -->
        <div id="\${modalId}" class="modal-overlay" style="display: none;">
          <div class="modal-content">
            <div class="modal-header">
              <span class="modal-title">📝 \${demoName} Code</span>
              <button onclick="document.getElementById('\${modalId}').style.display='none'" class="modal-close-btn">✕</button>
            </div>
            <div class="modal-body">
              <pre class="code-content">
                <code 
                  id="code-\${demoName}" 
                  hx-get="${apiBasePath}/code/\${demoName}" 
                  hx-trigger="load"
                >
                  Loading code example...
                </code>
              </pre>
            </div>
            <div class="modal-footer">
              <button onclick="window.uiLibDemoViewer.copyCode(this)" class="btn">📋 Copy Code</button>
              <button onclick="document.getElementById('\${modalId}').style.display='none'" class="btn btn-primary">Close</button>
            </div>
          </div>
        </div>
      </div>
    \`;

    // Process the new content with HTMX
    if (typeof htmx !== "undefined") {
      htmx.process(content);
    }
  },

  loadPlayground() {
    console.log("🎮 Loading playground");
    
    // Update active tab
    document.querySelectorAll(".showcase-demo-tab").forEach(tab => {
      tab.classList.remove("active");
    });
    
    const playgroundTab = document.querySelector('[data-demo="playground"]');
    if (playgroundTab) {
      playgroundTab.classList.add("active");
    }

    this.currentDemo = "playground";
    
    // Load playground content
    const content = document.getElementById("demo-content");
    
    if (typeof htmx !== "undefined") {
      htmx.ajax("GET", "${apiBasePath}/playground", {
        target: "#demo-content",
        swap: "innerHTML"
      });
    } else {
      content.innerHTML = \`
        <div class="playground-fallback">
          <p>Playground requires HTMX to be loaded</p>
        </div>
      \`;
    }
  },

  showCodeModal() {
    if (!this.currentDemo) {
      console.warn("No demo selected");
      return;
    }
    
    const modalId = \`code-modal-\${this.currentDemo}\`;
    const modal = document.getElementById(modalId);
    
    if (modal) {
      modal.style.display = "flex";
    } else {
      console.warn("Code modal not found for demo:", this.currentDemo);
    }
  },

  copyCode(button) {
    const codePanel = button.closest(".modal-content");
    if (!codePanel) return;

    const code = codePanel.querySelector("code").textContent;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        const original = button.textContent;
        button.textContent = "✅ Copied!";
        setTimeout(() => button.textContent = original, 2000);
      }).catch(err => {
        console.error("Failed to copy code:", err);
        button.textContent = "❌ Error";
        setTimeout(() => button.textContent = "📋 Copy", 2000);
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand("copy");
        const original = button.textContent;
        button.textContent = "✅ Copied!";
        setTimeout(() => button.textContent = original, 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
        button.textContent = "❌ Error";  
        setTimeout(() => button.textContent = "📋 Copy", 2000);
      }
      
      document.body.removeChild(textArea);
    }
  },

  // Initialize demo viewer
  init(defaultDemo) {
    if (defaultDemo) {
      this.loadDemo(defaultDemo);
    }
  }
};

// Auto-initialize if DOM is already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    const viewer = document.querySelector("[data-component='demo-viewer']");
    if (viewer) {
      const defaultDemo = viewer.querySelector(".showcase-demo-tab.active")?.dataset.demo;
      if (defaultDemo) {
        window.uiLibDemoViewer.init(defaultDemo);
      }
    }
  });
} else {
  const viewer = document.querySelector("[data-component='demo-viewer']");
  if (viewer) {
    const defaultDemo = viewer.querySelector(".showcase-demo-tab.active")?.dataset.demo;
    if (defaultDemo) {
      window.uiLibDemoViewer.init(defaultDemo);
    }
  }
}
    `.trim();
  }
});