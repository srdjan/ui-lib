// Code Actions - Reusable code interaction utilities
// Extracted from showcase inline JavaScript for broader reuse

/**
 * Code action configuration
 */
export type CodeActionConfig = {
  readonly copyTimeout?: number;
  readonly successMessage?: string;
  readonly errorMessage?: string;
  readonly formatter?: (code: string) => string;
};

/**
 * Code action result
 */
export interface CodeActionResult {
  readonly success: boolean;
  readonly message: string;
  readonly error?: string;
}

/**
 * Code actions utility class
 */
export class CodeActions {
  private readonly config: Required<CodeActionConfig>;

  constructor(config: CodeActionConfig = {}) {
    this.config = {
      copyTimeout: config.copyTimeout ?? 2000,
      successMessage: config.successMessage ?? "✅ Copied!",
      errorMessage: config.errorMessage ?? "❌ Error",
      formatter: config.formatter ?? this.defaultFormatter,
    };
  }

  /**
   * Copy code to clipboard
   */
  async copyToClipboard(code: string): Promise<CodeActionResult> {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        return {
          success: true,
          message: this.config.successMessage,
        };
      } else {
        // Fallback for older browsers
        return this.fallbackCopy(code);
      }
    } catch (error) {
      return {
        success: false,
        message: this.config.errorMessage,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Format code using configured formatter
   */
  formatCode(code: string): CodeActionResult {
    try {
      const formatted = this.config.formatter(code);
      return {
        success: true,
        message: "✅ Formatted",
      };
    } catch (error) {
      return {
        success: false,
        message: "❌ Format Error",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Copy code from a DOM element
   */
  async copyFromElement(element: Element): Promise<CodeActionResult> {
    const codeElement = element.querySelector("code") ?? element;
    const code = codeElement.textContent ?? "";
    return this.copyToClipboard(code);
  }

  /**
   * Show temporary feedback on a button
   */
  showButtonFeedback(
    button: Element,
    message: string,
    duration: number = this.config.copyTimeout,
  ): void {
    const original = button.textContent;
    button.textContent = message;

    setTimeout(() => {
      button.textContent = original;
    }, duration);
  }

  /**
   * Handle copy action with visual feedback
   */
  async handleCopyAction(
    source: Element | string,
    button?: Element,
  ): Promise<CodeActionResult> {
    const code = typeof source === "string" ? source : source.textContent ?? "";

    const result = await this.copyToClipboard(code);

    if (button) {
      this.showButtonFeedback(
        button,
        result.message,
        this.config.copyTimeout,
      );
    }

    return result;
  }

  private fallbackCopy(code: string): CodeActionResult {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "absolute";
      textArea.style.left = "-9999px";
      textArea.style.top = "-9999px";
      textArea.setAttribute("readonly", "");

      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, code.length);

      const success = document.execCommand("copy");
      document.body.removeChild(textArea);

      return {
        success,
        message: success
          ? this.config.successMessage
          : this.config.errorMessage,
      };
    } catch (error) {
      return {
        success: false,
        message: this.config.errorMessage,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private defaultFormatter(code: string): string {
    // Basic code formatting - in real implementation, you might use prettier or similar
    return code
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      .replace(/;/g, ";\n")
      .replace(/\{/g, " {\n")
      .replace(/\}/g, "\n}");
  }
}

/**
 * Global code actions instance
 */
export const codeActions = new CodeActions();

/**
 * Generate JavaScript code for copy button functionality
 * This matches the inline functions from the showcase
 */
export const createCopyButtonScript = (
  config: CodeActionConfig = {},
): string => {
  const {
    copyTimeout = 2000,
    successMessage = "✅ Copied!",
    errorMessage = "❌ Error",
  } = config;

  return `
// ui-lib Code Actions - Copy and formatting functionality
window.uiLibCodeActions = {
  // Copy code to clipboard
  async copyCode(button) {
    const codePanel = button.closest(".code-panel, .modal-content, .code-container");
    if (!codePanel) {
      console.warn("Code panel not found");
      return;
    }

    const code = codePanel.querySelector("code").textContent;
    const original = button.textContent;
    
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        button.textContent = "${successMessage}";
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        
        const success = document.execCommand("copy");
        document.body.removeChild(textArea);
        
        button.textContent = success ? "${successMessage}" : "${errorMessage}";
      }
      
      setTimeout(() => {
        button.textContent = original;
      }, ${copyTimeout});
      
    } catch (error) {
      console.error("Failed to copy code:", error);
      button.textContent = "${errorMessage}";
      
      setTimeout(() => {
        button.textContent = original;
      }, ${copyTimeout});
    }
  },

  // Format code (basic implementation)
  formatCode(button) {
    const codePanel = button.closest(".code-panel, .modal-content, .code-container");
    if (!codePanel) {
      console.warn("Code panel not found");
      return;
    }

    const codeElement = codePanel.querySelector("code");
    const code = codeElement.textContent;
    
    // Basic formatting (in real implementation, use proper formatter)
    const formatted = code
      .split('\\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\\n');
    
    codeElement.textContent = formatted;
    
    const original = button.textContent;
    button.textContent = "✅ Formatted";
    
    setTimeout(() => {
      button.textContent = original;
    }, 1000);
  },

  // Copy from specific element
  async copyFromElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn("Element not found:", elementId);
      return false;
    }
    
    const code = element.textContent || element.value;
    
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        return true;
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        
        const success = document.execCommand("copy");
        document.body.removeChild(textArea);
        return success;
      }
    } catch (error) {
      console.error("Failed to copy:", error);
      return false;
    }
  }
};

`.trim();
};

/**
 * Create copy button component
 */
export const createCopyButton = (
  targetSelector: string,
  config: CodeActionConfig = {},
): string => {
  const {
    successMessage = "✅ Copied!",
    errorMessage = "❌ Error",
  } = config;

  return /*html*/ `
    <button 
      class="copy-button"
      onclick="window.uiLibCodeActions?.copyCode(this)"
      data-target="${targetSelector}"
      title="Copy to clipboard"
    >
      📋 Copy
    </button>

    <style>
      .copy-button {
        background: var(--surface-1, #ffffff);
        border: 1px solid var(--surface-3, #e0e0e0);
        border-radius: var(--radius-2, 4px);
        padding: var(--size-1, 4px) var(--size-2, 8px);
        font-size: var(--font-size-0, 12px);
        cursor: pointer;
        color: var(--text-2, #666);
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: var(--size-1, 4px);
      }

      .copy-button:hover {
        background: var(--surface-2, #f5f5f5);
        color: var(--text-1, #333);
        border-color: var(--surface-4, #ccc);
      }

      .copy-button:active {
        transform: translateY(1px);
      }
    </style>
  `;
};
