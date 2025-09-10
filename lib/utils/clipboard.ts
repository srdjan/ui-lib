// Clipboard Utilities - Modern clipboard API with fallbacks
// Extracted from showcase code copying functionality

/**
 * Clipboard operation result
 */
export interface ClipboardResult {
  readonly success: boolean;
  readonly error?: string;
}

/**
 * Clipboard utility class
 */
export class ClipboardUtil {
  /**
   * Copy text to clipboard using modern API with fallback
   */
  static async copy(text: string): Promise<ClipboardResult> {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return { success: true };
      } catch (error) {
        console.warn("Clipboard API failed, trying fallback:", error);
        // Fall through to fallback
      }
    }

    // Fallback method for older browsers or non-secure contexts
    return this.fallbackCopy(text);
  }

  /**
   * Read text from clipboard
   */
  static async read(): Promise<string> {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        return await navigator.clipboard.readText();
      } catch (error) {
        console.warn("Clipboard read failed:", error);
        throw new Error("Unable to read from clipboard");
      }
    }

    throw new Error("Clipboard read not supported");
  }

  /**
   * Check if clipboard operations are supported
   */
  static isSupported(): boolean {
    return !!(navigator.clipboard || document.queryCommandSupported?.("copy"));
  }

  /**
   * Check if clipboard read is supported
   */
  static isReadSupported(): boolean {
    return !!(navigator.clipboard && "readText" in navigator.clipboard);
  }

  /**
   * Fallback copy method for older browsers
   */
  private static fallbackCopy(text: string): ClipboardResult {
    try {
      // Create temporary textarea
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "absolute";
      textArea.style.left = "-9999px";
      textArea.style.top = "-9999px";
      textArea.setAttribute("readonly", "");

      document.body.appendChild(textArea);

      // Select and copy
      textArea.select();
      textArea.setSelectionRange(0, text.length);

      const success = document.execCommand("copy");
      document.body.removeChild(textArea);

      return { success };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

/**
 * Copy text to clipboard (convenience function)
 */
export const copyToClipboard = async (text: string): Promise<ClipboardResult> => {
  return ClipboardUtil.copy(text);
};

/**
 * Copy element content to clipboard
 */
export const copyElementContent = async (element: Element): Promise<ClipboardResult> => {
  const text = element.textContent ?? "";
  return ClipboardUtil.copy(text);
};

/**
 * Copy with visual feedback on a button
 */
export const copyWithFeedback = async (
  text: string,
  button: Element,
  options: {
    successMessage?: string;
    errorMessage?: string;
    duration?: number;
  } = {},
): Promise<ClipboardResult> => {
  const {
    successMessage = "✅ Copied!",
    errorMessage = "❌ Error",
    duration = 2000,
  } = options;

  const originalText = button.textContent;
  const result = await ClipboardUtil.copy(text);

  // Show feedback
  button.textContent = result.success ? successMessage : errorMessage;

  // Restore original text after delay
  setTimeout(() => {
    button.textContent = originalText;
  }, duration);

  return result;
};

/**
 * Generate JavaScript code for client-side clipboard functionality
 */
export const createClipboardScript = (): string => {
  return `
// ui-lib Clipboard Utilities - Modern clipboard operations with fallbacks
window.uiLibClipboard = {
  // Copy text to clipboard
  async copy(text) {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return { success: true };
      } catch (error) {
        console.warn("Clipboard API failed, trying fallback:", error);
        // Fall through to fallback
      }
    }

    // Fallback method
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "absolute";
      textArea.style.left = "-9999px";
      textArea.style.top = "-9999px";
      textArea.setAttribute("readonly", "");

      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, text.length);

      const success = document.execCommand("copy");
      document.body.removeChild(textArea);

      return { success };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Read from clipboard
  async read() {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        return await navigator.clipboard.readText();
      } catch (error) {
        console.warn("Clipboard read failed:", error);
        throw new Error("Unable to read from clipboard");
      }
    }
    throw new Error("Clipboard read not supported");
  },

  // Check if clipboard operations are supported
  isSupported() {
    return !!(navigator.clipboard || (document.queryCommandSupported && document.queryCommandSupported("copy")));
  },

  // Copy element content
  async copyElement(element) {
    const text = element.textContent || element.value || "";
    return this.copy(text);
  },

  // Copy with button feedback
  async copyWithFeedback(text, button, options = {}) {
    const {
      successMessage = "✅ Copied!",
      errorMessage = "❌ Error", 
      duration = 2000
    } = options;

    const originalText = button.textContent;
    const result = await this.copy(text);

    button.textContent = result.success ? successMessage : errorMessage;

    setTimeout(() => {
      button.textContent = originalText;
    }, duration);

    return result;
  }
};

// Global convenience functions
window.copyToClipboard = window.uiLibClipboard.copy;
window.copyElement = window.uiLibClipboard.copyElement;
`.trim();
};