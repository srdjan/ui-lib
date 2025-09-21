// Functional Modal Manager - Pure functional approach without classes
import {
  createDOMEffects,
  deferredEffect,
  DOMOperation,
  executeDOMBatch,
} from "../../dom-effects.ts";
import { err, ok, Result } from "../../result.ts";

// Import and re-export types from original for compatibility
import type { ModalConfig } from "./modal-manager.ts";
export type { ModalConfig } from "./modal-manager.ts";

// Modal content configuration with readonly
export type ModalContent = {
  readonly header?: string;
  readonly body: string;
  readonly footer?: string;
  readonly actions?: readonly ModalAction[];
};

// Modal action configuration with readonly
export type ModalAction = {
  readonly label: string;
  readonly action: string | (() => void);
  readonly variant?: "primary" | "secondary" | "danger";
  readonly dismiss?: boolean;
  readonly disabled?: boolean;
};

// Modal state as immutable data
export type ModalState = {
  readonly modals: ReadonlyMap<string, ModalData>;
  readonly zIndexBase: number;
  readonly activeModalId: string | null;
};

type ModalData = {
  readonly config: ModalConfig;
  readonly content: ModalContent;
  readonly isOpen: boolean;
  readonly zIndex: number;
};

// Error types
export type ModalError =
  | { readonly type: "ModalNotFound"; readonly id: string }
  | { readonly type: "ModalAlreadyExists"; readonly id: string }
  | { readonly type: "InvalidConfig"; readonly reason: string };

// Initial state factory
export const createInitialModalState = (): ModalState => ({
  modals: new Map(),
  zIndexBase: 1000,
  activeModalId: null,
});

// Pure state transitions
export const addModal = (
  state: ModalState,
  config: ModalConfig,
  content: ModalContent,
): Result<ModalState, ModalError> => {
  if (state.modals.has(config.id)) {
    return err({ type: "ModalAlreadyExists", id: config.id });
  }

  const modalData: ModalData = {
    config,
    content,
    isOpen: false,
    zIndex: state.zIndexBase + state.modals.size * 10,
  };

  const newModals = new Map(state.modals);
  newModals.set(config.id, modalData);

  return ok({
    ...state,
    modals: newModals,
  });
};

export const removeModal = (
  state: ModalState,
  modalId: string,
): Result<ModalState, ModalError> => {
  if (!state.modals.has(modalId)) {
    return err({ type: "ModalNotFound", id: modalId });
  }

  const newModals = new Map(state.modals);
  newModals.delete(modalId);

  return ok({
    ...state,
    modals: newModals,
    activeModalId: state.activeModalId === modalId ? null : state.activeModalId,
  });
};

export const setModalOpen = (
  state: ModalState,
  modalId: string,
  isOpen: boolean,
): Result<ModalState, ModalError> => {
  const modal = state.modals.get(modalId);
  if (!modal) {
    return err({ type: "ModalNotFound", id: modalId });
  }

  const newModals = new Map(state.modals);
  newModals.set(modalId, { ...modal, isOpen });

  return ok({
    ...state,
    modals: newModals,
    activeModalId: isOpen
      ? modalId
      : (state.activeModalId === modalId ? null : state.activeModalId),
  });
};

// Pure functions that return DOM operations
export const createShowModalEffects = (
  modalId: string,
): readonly DOMOperation[] => {
  const showEvent = new CustomEvent(`modal:show`, {
    detail: { modalId },
    bubbles: true,
  });

  const shownEvent = new CustomEvent(`modal:shown`, {
    detail: { modalId },
    bubbles: true,
  });

  return [
    createDOMEffects.dispatchEvent(modalId, showEvent),
    createDOMEffects.setDisplay(modalId, "flex"),
    createDOMEffects.addClass(modalId, "open"),
    deferredEffect([
      createDOMEffects.dispatchEvent(modalId, shownEvent),
      createDOMEffects.focus(`${modalId}-first-focusable`),
    ], 100),
  ];
};

export const createHideModalEffects = (
  modalId: string,
): readonly DOMOperation[] => {
  const hideEvent = new CustomEvent(`modal:hide`, {
    detail: { modalId },
    bubbles: true,
  });

  const hiddenEvent = new CustomEvent(`modal:hidden`, {
    detail: { modalId },
    bubbles: true,
  });

  return [
    createDOMEffects.dispatchEvent(modalId, hideEvent),
    createDOMEffects.removeClass(modalId, "open"),
    deferredEffect([
      createDOMEffects.setDisplay(modalId, "none"),
      createDOMEffects.dispatchEvent(modalId, hiddenEvent),
    ], 300),
  ];
};

export const createDestroyModalEffects = (
  modalId: string,
): readonly DOMOperation[] => [
  ...createHideModalEffects(modalId),
  deferredEffect([
    { type: "removeChild", parentId: "document-body", childId: modalId },
  ], 350),
];

// Generate modal HTML (pure function)
export const generateModalHTML = (
  config: ModalConfig,
  content: ModalContent,
  zIndex: number,
): string => {
  const { id, title, size = "md", closable = true, className = "" } = config;
  const sizeClass = `modal-${size}`;

  const actionsHtml = content.actions
    ? content.actions.map((action) => generateActionButtonHTML(action, id))
      .join("")
    : "";

  return `
    <div id="${id}" class="modal-overlay ${className}" style="z-index: ${
    config.zIndex ?? zIndex
  }">
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
    </div>
  `;
};

const generateActionButtonHTML = (
  action: ModalAction,
  modalId: string,
): string => {
  const variant = action.variant || "secondary";
  const disabled = action.disabled ? "disabled" : "";

  return `
    <button
      type="button"
      class="btn btn-${variant}"
      data-action="${
    typeof action.action === "string" ? action.action : "custom"
  }"
      data-modal-id="${modalId}"
      ${disabled}
    >
      ${action.label}
    </button>
  `;
};

// Module-level state management (instead of class singleton)
let globalModalState = createInitialModalState();

// Public API as exported functions (replaces class methods)
export const modalManager = {
  create: (
    config: ModalConfig,
    content: ModalContent,
  ): Result<void, ModalError> => {
    const result = addModal(globalModalState, config, content);
    if (result.ok) {
      globalModalState = result.value;

      // Generate and inject HTML (side effect at boundary)
      const modal = globalModalState.modals.get(config.id);
      if (modal) {
        const html = generateModalHTML(config, content, modal.zIndex);
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        document.body.appendChild(tempDiv.firstElementChild as HTMLElement);
      }

      return ok(undefined);
    }
    return result as Result<void, ModalError>;
  },

  show: (modalId: string): Result<void, ModalError> => {
    const result = setModalOpen(globalModalState, modalId, true);
    if (result.ok) {
      globalModalState = result.value;
      const effects = createShowModalEffects(modalId);
      executeDOMBatch(effects);
      return ok(undefined);
    }
    return result as Result<void, ModalError>;
  },

  hide: (modalId: string): Result<void, ModalError> => {
    const result = setModalOpen(globalModalState, modalId, false);
    if (result.ok) {
      globalModalState = result.value;
      const effects = createHideModalEffects(modalId);
      executeDOMBatch(effects);
      return ok(undefined);
    }
    return result as Result<void, ModalError>;
  },

  destroy: (modalId: string): Result<void, ModalError> => {
    const result = removeModal(globalModalState, modalId);
    if (result.ok) {
      globalModalState = result.value;
      const effects = createDestroyModalEffects(modalId);
      executeDOMBatch(effects);
      return ok(undefined);
    }
    return result as Result<void, ModalError>;
  },

  toggle: (modalId: string): Result<void, ModalError> => {
    const modal = globalModalState.modals.get(modalId);
    if (!modal) {
      return err({ type: "ModalNotFound", id: modalId });
    }
    return modal.isOpen
      ? modalManager.hide(modalId)
      : modalManager.show(modalId);
  },

  getState: (): ModalState => globalModalState,

  reset: (): void => {
    globalModalState = createInitialModalState();
  },
};

// Export as default for easy migration
export default modalManager;
