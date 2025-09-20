// Modal Manager - Programmatic modal creation and management
// Extracted from showcase inline JavaScript for broader reuse

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
 * Modal manager state type
 */
type ModalManagerState = {
  readonly modals: ReadonlyMap<string, HTMLElement>;
  readonly zIndexBase: number;
};

/**
 * Create default modal manager state
 */
const createDefaultModalManagerState = (): ModalManagerState => ({
  modals: new Map(),
  zIndexBase: 1000,
});

/**
 * Pure helper functions
 */

const triggerEvent = (modal: HTMLElement, eventType: string): void => {
  const event = new CustomEvent(`modal:${eventType}`, {
    detail: { modalId: modal.id },
    bubbles: true,
  });
  modal.dispatchEvent(event);
};

const trapFocus = (modal: HTMLElement): void => {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement =
    focusableElements[focusableElements.length - 1] as HTMLElement;

  // Focus first element
  firstElement.focus();

  // Handle tab key
  const handleTab = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  modal.addEventListener("keydown", handleTab);
};

const setupEventListeners = (
  modal: HTMLElement,
  listeners: ModalEventListeners,
): void => {
  if (listeners.onShow) {
    modal.addEventListener("modal:show", listeners.onShow);
  }
  if (listeners.onShown) {
    modal.addEventListener("modal:shown", listeners.onShown);
  }
  if (listeners.onHide) {
    modal.addEventListener("modal:hide", listeners.onHide);
  }
  if (listeners.onHidden) {
    modal.addEventListener("modal:hidden", listeners.onHidden);
  }
};

const setupCloseHandlers = (modal: HTMLElement, config: ModalConfig): void => {
  if (!config.closable) return;

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideModal(modal.id);
    }
  });

  // Close on escape key
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      hideModal(modal.id);
    }
  };

  document.addEventListener("keydown", handleEscape);

  // Store handler for cleanup
  (modal as any).__escapeHandler = handleEscape;
};

const showModal = (
  state: ModalManagerState,
  modalId: string,
): ModalManagerState => {
  const modal = state.modals.get(modalId);
  if (!modal) {
    console.warn(`Modal ${modalId} not found`);
    return state;
  }

  // Trigger show event
  triggerEvent(modal, "show");

  // Add classes and show
  modal.classList.add("open");
  modal.style.display = "flex";

  // Focus trap
  trapFocus(modal);

  // Trigger shown event after animation
  setTimeout(() => {
    triggerEvent(modal, "shown");
  }, 300);

  return state;
};

const hideModal = (modalId: string): void => {
  // This is a side effect function that directly manipulates DOM
  // In a pure functional approach, this would be handled differently
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.warn(`Modal ${modalId} not found`);
    return;
  }

  // Trigger hide event
  triggerEvent(modal, "hide");

  // Remove classes and hide
  modal.classList.remove("open");

  // Trigger hidden event after animation
  setTimeout(() => {
    modal.style.display = "none";
    triggerEvent(modal, "hidden");
  }, 300);
};

const createModalElement = (
  config: ModalConfig,
  content: ModalContent,
  zIndex: number,
): HTMLElement => {
  const {
    id,
    title,
    size = "md",
    closable = true,
    className = "",
  } = config;

  const modal = document.createElement("div");
  modal.id = id;
  modal.className = `modal-overlay ${className}`;
  modal.style.zIndex = String(config.zIndex ?? zIndex);

  const sizeClass = `modal-${size}`;
  const actionsHtml = content.actions
    ? content.actions.map((action) => createActionButton(action, id)).join("")
    : "";

  modal.innerHTML = `
    <div class="modal-dialog ${sizeClass}">
      <div class="modal-content">
        ${
    title
      ? `
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            ${
        closable
          ? '<button type="button" class="modal-close" aria-label="Close">&times;</button>'
          : ""
      }
          </div>
        `
      : ""
  }
        <div class="modal-body">
          ${
    content.header
      ? `<div class="modal-content-header">${content.header}</div>`
      : ""
  }
          <div class="modal-content-body">${content.body}</div>
          ${
    content.footer
      ? `<div class="modal-content-footer">${content.footer}</div>`
      : ""
  }
        </div>
        ${actionsHtml ? `<div class="modal-footer">${actionsHtml}</div>` : ""}
      </div>
    </div>
  `;

  return modal;
};

const createActionButton = (action: ModalAction, modalId: string): string => {
  const variant = action.variant || "secondary";
  const disabled = action.disabled ? "disabled" : "";

  return `
    <button
      type="button"
      class="btn btn-${variant}"
      data-action="${action.action}"
      data-modal-id="${modalId}"
      ${disabled}
    >
      ${action.label}
    </button>
  `;
};

const destroyModal = (
  state: ModalManagerState,
  modalId: string,
): ModalManagerState => {
  const modal = state.modals.get(modalId);
  if (!modal) return state;

  hideModal(modalId);

  setTimeout(() => {
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }

    // Clean up escape handler
    const escapeHandler = (modal as any).__escapeHandler;
    if (escapeHandler) {
      document.removeEventListener("keydown", escapeHandler);
    }
  }, 300);

  const newModals = new Map(state.modals);
  newModals.delete(modalId);

  return {
    ...state,
    modals: newModals,
  };
};

const createModal = (
  state: ModalManagerState,
  config: ModalConfig,
  content: ModalContent,
  listeners?: ModalEventListeners,
): { modal: HTMLElement; newState: ModalManagerState } => {
  const modal = createModalElement(config, content, state.zIndexBase);

  // Add to DOM
  document.body.appendChild(modal);

  // Setup event listeners
  if (listeners) {
    setupEventListeners(modal, listeners);
  }

  // Setup close handlers
  setupCloseHandlers(modal, config);

  const newModals = new Map(state.modals);
  newModals.set(config.id, modal);

  const newState: ModalManagerState = {
    ...state,
    modals: newModals,
    zIndexBase: state.zIndexBase + 1,
  };

  // Show modal
  showModal(newState, config.id);

  return { modal, newState };
};

const updateModalContent = (
  state: ModalManagerState,
  modalId: string,
  content: Partial<ModalContent>,
): ModalManagerState => {
  const modal = state.modals.get(modalId);
  if (!modal) return state;

  if (content.header) {
    const headerEl = modal.querySelector(".modal-content-header");
    if (headerEl) {
      headerEl.innerHTML = content.header;
    }
  }

  if (content.body) {
    const bodyEl = modal.querySelector(".modal-content-body");
    if (bodyEl) {
      bodyEl.innerHTML = content.body;
    }
  }

  if (content.footer) {
    const footerEl = modal.querySelector(".modal-content-footer");
    if (footerEl) {
      footerEl.innerHTML = content.footer;
    }
  }

  return state;
};

const isModalOpen = (state: ModalManagerState, modalId: string): boolean => {
  const modal = state.modals.get(modalId);
  return modal?.classList.contains("open") ?? false;
};

const closeAllModals = (state: ModalManagerState): ModalManagerState => {
  Array.from(state.modals.keys()).forEach((id) => hideModal(id));
  return state;
};

// Functional ModalManager interface
export interface IModalManager {
  create(
    config: ModalConfig,
    content: ModalContent,
    listeners?: ModalEventListeners,
  ): HTMLElement;
  show(modalId: string): void;
  hide(modalId: string): void;
  destroy(modalId: string): void;
  updateContent(modalId: string, content: Partial<ModalContent>): void;
  getModal(modalId: string): HTMLElement | undefined;
  isOpen(modalId: string): boolean;
  closeAll(): void;
}

// Functional ModalManager implementation
export const createModalManager = (): IModalManager => {
  let state = createDefaultModalManagerState();

  return {
    create(
      config: ModalConfig,
      content: ModalContent,
      listeners?: ModalEventListeners,
    ): HTMLElement {
      const { modal, newState } = createModal(
        state,
        config,
        content,
        listeners,
      );
      state = newState;
      return modal;
    },

    show(modalId: string): void {
      state = showModal(state, modalId);
    },

    hide(modalId: string): void {
      hideModal(modalId);
    },

    destroy(modalId: string): void {
      state = destroyModal(state, modalId);
    },

    updateContent(modalId: string, content: Partial<ModalContent>): void {
      state = updateModalContent(state, modalId, content);
    },

    getModal(modalId: string): HTMLElement | undefined {
      return state.modals.get(modalId);
    },

    isOpen(modalId: string): boolean {
      return isModalOpen(state, modalId);
    },

    closeAll(): void {
      state = closeAllModals(state);
    },
  };
};

// Global modal manager instance
let globalModalManager: IModalManager | null = null;

/**
 * Get or create global modal manager instance
 */
export const getModalManager = (): IModalManager => {
  if (!globalModalManager) {
    globalModalManager = createModalManager();
  }
  return globalModalManager;
};

// Backward compatibility - ModalManager class that uses functional implementation
export class ModalManager {
  private static instance: ModalManager;
  private manager: IModalManager;

  constructor() {
    this.manager = createModalManager();
  }

  static getInstance(): ModalManager {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager();
    }
    return ModalManager.instance;
  }

  create(
    config: ModalConfig,
    content: ModalContent,
    listeners?: ModalEventListeners,
  ): HTMLElement {
    return this.manager.create(config, content, listeners);
  }

  show(modalId: string): void {
    this.manager.show(modalId);
  }

  hide(modalId: string): void {
    this.manager.hide(modalId);
  }

  destroy(modalId: string): void {
    this.manager.destroy(modalId);
  }

  updateContent(modalId: string, content: Partial<ModalContent>): void {
    this.manager.updateContent(modalId, content);
  }

  getModal(modalId: string): HTMLElement | undefined {
    return this.manager.getModal(modalId);
  }

  isOpen(modalId: string): boolean {
    return this.manager.isOpen(modalId);
  }

  closeAll(): void {
    this.manager.closeAll();
  }
}

// Utility functions for modal styling
const injectModalStyles = (): void => {
  if (document.querySelector("#ui-lib-modal-styles")) return;

  const styles = document.createElement("style");
  styles.id = "ui-lib-modal-styles";
  styles.textContent = `
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-overlay.open {
      display: flex;
    }

    .modal-dialog {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
    }

    .modal-sm { width: 300px; }
    .modal-md { width: 500px; }
    .modal-lg { width: 800px; }
    .modal-xl { width: 1140px; }
    .modal-full { width: 100vw; height: 100vh; border-radius: 0; }

    .modal-header {
      padding: 1rem;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-title {
      margin: 0;
      font-size: 1.25rem;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-body {
      padding: 1rem;
    }

    .modal-footer {
      padding: 1rem;
      border-top: 1px solid #e9ecef;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: 1px solid transparent;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .btn-primary {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
      border-color: #6c757d;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
      border-color: #dc3545;
    }
  `;

  document.head.appendChild(styles);
};

// Initialize styles when module loads
if (typeof document !== "undefined") {
  injectModalStyles();
}
