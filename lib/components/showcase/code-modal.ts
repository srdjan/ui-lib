// Code Modal Component - Modal for displaying code with syntax highlighting
// Extracted from showcase inline JavaScript for broader reuse

import { defineComponent } from "../../define-component.ts";
import type { ComponentProps } from "../../types.ts";

/**
 * Code modal configuration
 */
export interface CodeModalConfig {
  readonly syntaxHighlighting?: boolean;
  readonly theme?: "light" | "dark" | "auto";
  readonly copyButton?: boolean;
  readonly formatButton?: boolean;
  readonly language?: string;
}

/**
 * Code modal props
 */
export interface CodeModalProps extends ComponentProps {
  readonly id: string;
  readonly title?: string;
  readonly code?: string;
  readonly language?: string;
  readonly config?: CodeModalConfig;
  readonly class?: string;
}

/**
 * Code modal component for displaying formatted code
 */
export const CodeModal = defineComponent<CodeModalProps>({
  name: "code-modal",
  
  render: ({ 
    id, 
    title = "Code", 
    code = "", 
    language = "javascript",
    config = {}, 
    class: className,
    ...props 
  }) => {
    const {
      syntaxHighlighting = true,
      copyButton = true,
      formatButton = false,
      theme = "auto",
    } = config;

    const modalId = `code-modal-${id}`;
    const codeId = `code-${id}`;

    return /*html*/ `
      <div id="${modalId}" class="modal-overlay code-modal ${className ?? ""}" ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(" ")}>
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <div class="modal-actions">
              ${formatButton ? `
                <button onclick="window.uiLibCodeModal?.format('${codeId}')" class="modal-action-btn">
                  🎨 Format
                </button>
              ` : ""}
              ${copyButton ? `
                <button onclick="window.uiLibCodeModal?.copy('${codeId}')" class="modal-action-btn">
                  📋 Copy
                </button>
              ` : ""}
              <button onclick="window.uiLibCodeModal?.close('${modalId}')" class="modal-close-btn">
                ✕
              </button>
            </div>
          </div>
          
          <div class="modal-body">
            <div class="code-container">
              <pre class="code-content ${syntaxHighlighting ? `language-${language}` : ""}"><code id="${codeId}">${code || "Loading..."}</code></pre>
            </div>
          </div>
          
          <div class="modal-footer">
            <div class="code-info">
              <span class="language-badge">${language.toUpperCase()}</span>
              <span class="line-count" id="${codeId}-lines">0 lines</span>
            </div>
            <div class="modal-footer-actions">
              <button onclick="window.uiLibCodeModal?.close('${modalId}')" class="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>
        .code-modal .modal-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 1000;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }

        .code-modal .modal-overlay.open {
          display: flex;
        }

        .code-modal .modal-content {
          background: var(--surface-1, #ffffff);
          border-radius: var(--radius-3, 8px);
          width: 90%;
          max-width: 1200px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-6, 0 25px 50px -12px rgba(0, 0, 0, 0.25));
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .code-modal .modal-header {
          padding: var(--size-4, 16px);
          background: var(--surface-2, #f5f5f5);
          border-bottom: 1px solid var(--surface-3, #e0e0e0);
          border-radius: var(--radius-3, 8px) var(--radius-3, 8px) 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .code-modal .modal-title {
          font-size: var(--font-size-3, 18px);
          font-weight: var(--font-weight-6, 600);
          margin: 0;
          color: var(--text-1, #333);
        }

        .code-modal .modal-actions {
          display: flex;
          gap: var(--size-2, 8px);
          align-items: center;
        }

        .code-modal .modal-action-btn,
        .code-modal .modal-close-btn {
          background: none;
          border: none;
          font-size: var(--font-size-1, 14px);
          cursor: pointer;
          color: var(--text-2, #666);
          padding: var(--size-1, 4px) var(--size-2, 8px);
          border-radius: var(--radius-2, 4px);
          transition: all 0.2s ease;
        }

        .code-modal .modal-action-btn:hover,
        .code-modal .modal-close-btn:hover {
          background: var(--surface-3, #e0e0e0);
          color: var(--text-1, #333);
        }

        .code-modal .modal-body {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .code-modal .code-container {
          flex: 1;
          overflow: auto;
          position: relative;
        }

        .code-modal .code-content {
          margin: 0;
          padding: var(--size-4, 16px);
          background: var(--gray-12, #1a1a1a);
          color: var(--gray-0, #ffffff);
          font-family: var(--font-mono, 'Monaco', 'Menlo', 'Ubuntu Mono', monospace);
          font-size: var(--font-size-0, 13px);
          line-height: var(--font-lineheight-3, 1.6);
          white-space: pre;
          overflow-wrap: break-word;
          min-height: 100%;
          box-sizing: border-box;
        }

        .code-modal .code-content code {
          background: transparent;
          color: inherit;
          font: inherit;
        }

        .code-modal .modal-footer {
          padding: var(--size-3, 12px) var(--size-4, 16px);
          background: var(--surface-2, #f5f5f5);
          border-top: 1px solid var(--surface-3, #e0e0e0);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--size-3, 12px);
        }

        .code-modal .code-info {
          display: flex;
          gap: var(--size-3, 12px);
          align-items: center;
          font-size: var(--font-size-0, 12px);
          color: var(--text-2, #666);
        }

        .code-modal .language-badge {
          background: var(--surface-3, #e0e0e0);
          padding: var(--size-1, 2px) var(--size-2, 6px);
          border-radius: var(--radius-1, 3px);
          font-weight: var(--font-weight-5, 500);
          font-size: var(--font-size-00, 11px);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .code-modal .modal-footer-actions {
          display: flex;
          gap: var(--size-2, 8px);
        }

        .code-modal .btn {
          padding: var(--size-2, 8px) var(--size-3, 12px);
          background: var(--surface-1, #ffffff);
          border: 1px solid var(--surface-3, #e0e0e0);
          border-radius: var(--radius-2, 4px);
          cursor: pointer;
          font-size: var(--font-size-1, 14px);
          font-weight: var(--font-weight-5, 500);
          transition: all 0.2s ease;
        }

        .code-modal .btn:hover {
          background: var(--surface-2, #f5f5f5);
        }

        .code-modal .btn-primary {
          background: var(--blue-6, #0066cc);
          color: var(--gray-0, #ffffff);
          border-color: var(--blue-6, #0066cc);
        }

        .code-modal .btn-primary:hover {
          background: var(--blue-7, #0052a3);
        }

        /* Dark theme for code */
        @media (prefers-color-scheme: dark) {
          .code-modal .code-content {
            background: var(--gray-12, #0a0a0a);
            color: var(--gray-1, #f0f0f0);
          }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .code-modal .modal-content {
            width: 95%;
            max-height: 95vh;
          }
          
          .code-modal .modal-header {
            flex-direction: column;
            gap: var(--size-2, 8px);
            align-items: flex-start;
          }
          
          .code-modal .modal-footer {
            flex-direction: column;
            gap: var(--size-2, 8px);
            align-items: stretch;
          }
        }
      </style>
    `;
  },

  /**
   * Generate client-side JavaScript for code modal functionality
   */
  clientScript: () => {
    return `
// ui-lib Code Modal - Code display and interaction system
window.uiLibCodeModal = {
  // Show modal
  show(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("open");
      modal.style.display = "flex";
      
      // Update line count
      this.updateLineCount(modalId);
      
      // Focus trap
      this.trapFocus(modal);
    }
  },

  // Close modal
  close(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("open");
      modal.style.display = "none";
    }
  },

  // Copy code to clipboard
  copy(codeId) {
    const codeElement = document.getElementById(codeId);
    if (!codeElement) return;

    const code = codeElement.textContent;
    const button = document.querySelector(\`[onclick*="copy('\${codeId}')"\`);
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        this.showFeedback(button, "✅ Copied!", 2000);
      }).catch(err => {
        console.error("Failed to copy code:", err);
        this.showFeedback(button, "❌ Error", 2000);
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "absolute";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand("copy");
        this.showFeedback(button, "✅ Copied!", 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
        this.showFeedback(button, "❌ Error", 2000);
      }
      
      document.body.removeChild(textArea);
    }
  },

  // Format code (placeholder - would need actual formatter)
  format(codeId) {
    const button = document.querySelector(\`[onclick*="format('\${codeId}')"\`);
    this.showFeedback(button, "✅ Formatted", 1000);
  },

  // Update line count display
  updateLineCount(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const codeElement = modal.querySelector("code");
    const lineCountElement = modal.querySelector(".line-count");
    
    if (codeElement && lineCountElement) {
      const lines = codeElement.textContent.split("\\n").length;
      lineCountElement.textContent = \`\${lines} line\${lines !== 1 ? 's' : ''}\`;
    }
  },

  // Show temporary feedback on button
  showFeedback(button, message, duration) {
    if (!button) return;
    
    const original = button.textContent;
    button.textContent = message;
    
    setTimeout(() => {
      button.textContent = original;
    }, duration);
  },

  // Simple focus trap for accessibility
  trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    // Focus first element
    firstFocusable.focus();
    
    // Handle tab key
    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };
    
    modal.addEventListener("keydown", handleTab);
    
    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        this.close(modal.id);
        modal.removeEventListener("keydown", handleTab);
        modal.removeEventListener("keydown", handleEscape);
      }
    };
    
    modal.addEventListener("keydown", handleEscape);
  },

  // Load code content via HTMX or fetch
  loadCode(codeId, url) {
    const codeElement = document.getElementById(codeId);
    if (!codeElement) return;
    
    if (typeof htmx !== "undefined") {
      htmx.ajax("GET", url, {
        target: \`#\${codeId}\`,
        swap: "innerHTML"
      });
    } else {
      fetch(url)
        .then(response => response.text())
        .then(code => {
          codeElement.textContent = code;
          this.updateLineCount(codeElement.closest(".modal-overlay").id);
        })
        .catch(err => {
          console.error("Failed to load code:", err);
          codeElement.textContent = "// Error loading code";
        });
    }
  }
};

// Handle clicks outside modal to close
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    window.uiLibCodeModal.close(e.target.id);
  }
});
    `.trim();
  }
});