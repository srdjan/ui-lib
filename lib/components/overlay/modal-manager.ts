// Modal Manager - Programmatic modal creation and management
// Extracted from showcase inline JavaScript for broader reuse

import { defineComponent } from "../../define-component.ts";
import type { ComponentProps } from "../../types.ts";

/**
 * Modal configuration
 */
export interface ModalConfig {
  readonly id: string;
  readonly title?: string;
  readonly size?: "sm" | "md" | "lg" | "xl" | "full";
  readonly closable?: boolean;
  readonly backdrop?: boolean | "static";
  readonly keyboard?: boolean;
  readonly className?: string;
  readonly zIndex?: number;
}

/**
 * Modal content configuration
 */
export interface ModalContent {
  readonly header?: string;
  readonly body: string;
  readonly footer?: string;
  readonly actions?: readonly ModalAction[];
}

/**
 * Modal action configuration
 */
export interface ModalAction {
  readonly label: string;
  readonly action: string | (() => void);
  readonly variant?: "primary" | "secondary" | "danger";
  readonly dismiss?: boolean;
}

/**
 * Modal event listeners
 */
export interface ModalEventListeners {
  readonly onShow?: (modal: HTMLElement) => void;
  readonly onShown?: (modal: HTMLElement) => void;
  readonly onHide?: (modal: HTMLElement) => void;
  readonly onHidden?: (modal: HTMLElement) => void;
}

/**
 * Modal manager class for programmatic modal creation
 */
export class ModalManager {
  private static instance: ModalManager;
  private modals = new Map<string, HTMLElement>();
  private zIndexBase = 1000;

  static getInstance(): ModalManager {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager();
    }
    return ModalManager.instance;
  }

  /**
   * Create and show a modal
   */
  create(
    config: ModalConfig,
    content: ModalContent,
    listeners?: ModalEventListeners,
  ): HTMLElement {
    const modal = this.createModalElement(config, content);
    
    // Add to DOM
    document.body.appendChild(modal);
    this.modals.set(config.id, modal);

    // Setup event listeners
    if (listeners) {
      this.setupEventListeners(modal, listeners);
    }

    // Setup close handlers
    this.setupCloseHandlers(modal, config);

    // Show modal
    this.show(config.id);

    return modal;
  }

  /**
   * Show existing modal
   */
  show(modalId: string): void {
    const modal = this.modals.get(modalId);
    if (!modal) {
      console.warn(`Modal ${modalId} not found`);
      return;
    }

    // Trigger show event
    this.triggerEvent(modal, "show");

    // Add classes and show
    modal.classList.add("open");
    modal.style.display = "flex";
    
    // Focus trap
    this.trapFocus(modal);

    // Trigger shown event after animation
    setTimeout(() => {
      this.triggerEvent(modal, "shown");
    }, 300);
  }

  /**
   * Hide modal
   */
  hide(modalId: string): void {
    const modal = this.modals.get(modalId);
    if (!modal) return;

    // Trigger hide event
    this.triggerEvent(modal, "hide");

    // Remove classes and hide
    modal.classList.remove("open");
    
    // Wait for animation before hiding
    setTimeout(() => {
      modal.style.display = "none";
      this.triggerEvent(modal, "hidden");
    }, 300);
  }

  /**
   * Destroy modal
   */
  destroy(modalId: string): void {
    const modal = this.modals.get(modalId);
    if (!modal) return;

    this.hide(modalId);
    
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
      this.modals.delete(modalId);
    }, 300);
  }

  /**
   * Update modal content
   */
  updateContent(modalId: string, content: Partial<ModalContent>): void {
    const modal = this.modals.get(modalId);
    if (!modal) return;

    if (content.header) {
      const headerEl = modal.querySelector(".modal-title");
      if (headerEl) {
        headerEl.innerHTML = content.header;
      }
    }

    if (content.body) {
      const bodyEl = modal.querySelector(".modal-body");
      if (bodyEl) {
        bodyEl.innerHTML = content.body;
      }
    }

    if (content.footer) {
      const footerEl = modal.querySelector(".modal-footer");
      if (footerEl) {
        footerEl.innerHTML = content.footer;
      }
    }
  }

  /**
   * Get modal element
   */
  getModal(modalId: string): HTMLElement | undefined {
    return this.modals.get(modalId);
  }

  /**
   * Check if modal is open
   */
  isOpen(modalId: string): boolean {
    const modal = this.modals.get(modalId);
    return modal?.classList.contains("open") ?? false;
  }

  /**
   * Close all modals
   */
  closeAll(): void {
    Array.from(this.modals.keys()).forEach(id => this.hide(id));
  }

  private createModalElement(config: ModalConfig, content: ModalContent): HTMLElement {
    const {
      id,
      title,
      size = "md",
      closable = true,
      className = "",
      zIndex,
    } = config;

    const modal = document.createElement("div");
    modal.id = id;
    modal.className = `modal-overlay ${className}`;
    modal.style.zIndex = String(zIndex ?? this.zIndexBase++);

    const sizeClass = `modal-${size}`;
    const actionsHtml = content.actions
      ? content.actions.map(action => this.createActionButton(action, id)).join("")
      : "";

    modal.innerHTML = `
      <div class="modal-content ${sizeClass}">
        ${title || closable ? `
          <div class="modal-header">
            ${title ? `<h3 class="modal-title">${title}</h3>` : ""}
            ${closable ? `
              <button class="modal-close-btn" data-modal-close="${id}">✕</button>
            ` : ""}
          </div>
        ` : ""}
        
        <div class="modal-body">
          ${content.body}
        </div>
        
        ${content.footer || actionsHtml ? `
          <div class="modal-footer">
            ${content.footer || ""}
            ${actionsHtml}
          </div>
        ` : ""}
      </div>
    `;

    // Add styles if not already present
    if (!document.querySelector("#ui-lib-modal-styles")) {
      this.injectStyles();
    }

    return modal;
  }

  private createActionButton(action: ModalAction, modalId: string): string {
    const {
      label,
      action: actionHandler,
      variant = "secondary",
      dismiss = false,
    } = action;

    const clickHandler = typeof actionHandler === "string" 
      ? actionHandler
      : `window.uiLibModalManager.handleAction('${modalId}', ${this.registerActionHandler(actionHandler)})`;

    const dismissHandler = dismiss ? `; window.uiLibModalManager.hide('${modalId}')` : "";

    return `
      <button 
        class="btn btn-${variant}" 
        onclick="${clickHandler}${dismissHandler}"
      >
        ${label}
      </button>
    `;
  }

  private actionHandlers = new Map<number, () => void>();
  private actionHandlerId = 0;

  private registerActionHandler(handler: () => void): number {
    const id = this.actionHandlerId++;
    this.actionHandlers.set(id, handler);
    return id;
  }

  handleAction(modalId: string, handlerId: number): void {
    const handler = this.actionHandlers.get(handlerId);
    if (handler) {
      handler();
      this.actionHandlers.delete(handlerId);
    }
  }

  private setupEventListeners(modal: HTMLElement, listeners: ModalEventListeners): void {
    Object.entries(listeners).forEach(([event, handler]) => {
      if (handler) {
        modal.addEventListener(`modal:${event.replace("on", "").toLowerCase()}`, () => {
          handler(modal);
        });
      }
    });
  }

  private setupCloseHandlers(modal: HTMLElement, config: ModalConfig): void {
    // Close button handler
    const closeBtn = modal.querySelector("[data-modal-close]");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.hide(config.id));
    }

    // Backdrop click handler
    if (config.backdrop !== "static") {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.hide(config.id);
        }
      });
    }

    // Keyboard handler
    if (config.keyboard !== false) {
      const handleKeyboard = (e: KeyboardEvent) => {
        if (e.key === "Escape" && this.isOpen(config.id)) {
          this.hide(config.id);
          document.removeEventListener("keydown", handleKeyboard);
        }
      };
      document.addEventListener("keydown", handleKeyboard);
    }
  }

  private triggerEvent(modal: HTMLElement, eventType: string): void {
    const event = new CustomEvent(`modal:${eventType}`, {
      bubbles: true,
      cancelable: true,
    });
    modal.dispatchEvent(event);
  }

  private trapFocus(modal: HTMLElement): void {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    firstFocusable.focus();
    
    const handleTab = (e: KeyboardEvent) => {
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
  }

  private injectStyles(): void {
    const styles = document.createElement("style");
    styles.id = "ui-lib-modal-styles";
    styles.textContent = `
      .modal-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .modal-overlay.open {
        display: flex !important;
        opacity: 1;
      }

      .modal-content {
        background: var(--surface-1, #ffffff);
        border-radius: var(--radius-3, 8px);
        display: flex;
        flex-direction: column;
        box-shadow: var(--shadow-6, 0 25px 50px -12px rgba(0, 0, 0, 0.25));
        transform: translateY(-20px) scale(0.95);
        transition: transform 0.3s ease;
        max-height: 90vh;
        overflow: hidden;
      }

      .modal-overlay.open .modal-content {
        transform: translateY(0) scale(1);
      }

      .modal-sm { width: 300px; }
      .modal-md { width: 500px; }
      .modal-lg { width: 800px; }
      .modal-xl { width: 1200px; }
      .modal-full { width: 95vw; height: 90vh; }

      .modal-header {
        padding: var(--size-4, 16px);
        background: var(--surface-2, #f5f5f5);
        border-bottom: 1px solid var(--surface-3, #e0e0e0);
        border-radius: var(--radius-3, 8px) var(--radius-3, 8px) 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .modal-title {
        font-size: var(--font-size-3, 18px);
        font-weight: var(--font-weight-6, 600);
        margin: 0;
        color: var(--text-1, #333);
      }

      .modal-close-btn {
        background: none;
        border: none;
        font-size: var(--font-size-4, 20px);
        cursor: pointer;
        color: var(--text-2, #666);
        padding: var(--size-1, 4px);
        line-height: 1;
      }

      .modal-close-btn:hover {
        color: var(--text-1, #333);
      }

      .modal-body {
        flex: 1;
        overflow: auto;
        padding: var(--size-4, 16px);
      }

      .modal-footer {
        padding: var(--size-3, 12px) var(--size-4, 16px);
        background: var(--surface-2, #f5f5f5);
        border-top: 1px solid var(--surface-3, #e0e0e0);
        display: flex;
        gap: var(--size-2, 8px);
        justify-content: flex-end;
        align-items: center;
      }

      .btn {
        padding: var(--size-2, 8px) var(--size-3, 12px);
        background: var(--surface-1, #ffffff);
        border: 1px solid var(--surface-3, #e0e0e0);
        border-radius: var(--radius-2, 4px);
        cursor: pointer;
        font-size: var(--font-size-1, 14px);
        font-weight: var(--font-weight-5, 500);
        transition: all 0.2s ease;
      }

      .btn:hover {
        background: var(--surface-2, #f5f5f5);
      }

      .btn-primary {
        background: var(--blue-6, #0066cc);
        color: var(--gray-0, #ffffff);
        border-color: var(--blue-6, #0066cc);
      }

      .btn-primary:hover {
        background: var(--blue-7, #0052a3);
      }

      .btn-danger {
        background: var(--red-6, #dc2626);
        color: var(--gray-0, #ffffff);
        border-color: var(--red-6, #dc2626);
      }

      .btn-danger:hover {
        background: var(--red-7, #b91c1c);
      }

      @media (max-width: 768px) {
        .modal-sm, .modal-md, .modal-lg, .modal-xl {
          width: 95vw;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }
}

/**
 * Create modal manager script for client-side use
 */
export const createModalManagerScript = (): string => {
  return `
// ui-lib Modal Manager - Programmatic modal creation and management
window.uiLibModalManager = ${ModalManager.toString().replace(/class ModalManager/, 'new (class')}.getInstance()};

// Convenience functions
window.createModal = function(config, content, listeners) {
  return window.uiLibModalManager.create(config, content, listeners);
};

window.showModal = function(modalId) {
  window.uiLibModalManager.show(modalId);
};

window.hideModal = function(modalId) {
  window.uiLibModalManager.hide(modalId);
};

window.destroyModal = function(modalId) {
  window.uiLibModalManager.destroy(modalId);
};
`.trim();
};