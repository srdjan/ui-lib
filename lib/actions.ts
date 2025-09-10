// Type-safe action types for DOM manipulation and state management
// Enhanced with new action types extracted from showcase functionality

// Core DOM action type definitions
export type ToggleClassAction = { type: "toggleClass"; className: string };
export type ToggleClassesAction = {
  type: "toggleClasses";
  classNames: string[];
};

// Modal action types
export type ShowModalAction = { type: "showModal"; modalId: string };
export type HideModalAction = { type: "hideModal"; modalId: string };
export type CreateModalAction = {
  type: "createModal";
  config: {
    id: string;
    title?: string;
    content: string;
    size?: "sm" | "md" | "lg" | "xl" | "full";
  };
};

// Cart action types
export type CartAddAction = {
  type: "cartAdd";
  item: {
    id: string;
    name: string;
    price: number;
    quantity?: number;
  };
};
export type CartRemoveAction = { type: "cartRemove"; itemId: string };
export type CartUpdateAction = {
  type: "cartUpdate";
  itemId: string;
  updates: Record<string, unknown>;
};
export type CartClearAction = { type: "cartClear" };

// Theme action types
export type ThemeSwitchAction = { type: "themeSwitch"; themeName: string };
export type ThemeToggleDarkAction = { type: "themeToggleDark" };

// Navigation action types  
export type SmoothScrollAction = { type: "smoothScroll"; target: string };
export type TabSwitchAction = { type: "tabSwitch"; tabId: string };

// Counter animation action types
export type StartCounterAction = {
  type: "startCounter";
  elementId: string;
  from?: number;
  to: number;
  duration?: number;
};
export type StopCounterAction = { type: "stopCounter"; elementId: string };

// Code action types
export type CopyCodeAction = { type: "copyCode"; elementSelector?: string };
export type FormatCodeAction = { type: "formatCode"; elementSelector?: string };

// Demo viewer action types
export type LoadDemoAction = { type: "loadDemo"; demoName: string };
export type ShowCodeModalAction = { type: "showCodeModal"; demoName?: string };

// Base actions supported by the runtime
export type BaseAction = 
  | ToggleClassAction
  | ToggleClassesAction
  | ShowModalAction
  | HideModalAction
  | CreateModalAction
  | CartAddAction
  | CartRemoveAction
  | CartUpdateAction
  | CartClearAction
  | ThemeSwitchAction
  | ThemeToggleDarkAction
  | SmoothScrollAction
  | TabSwitchAction
  | StartCounterAction
  | StopCounterAction
  | CopyCodeAction
  | FormatCodeAction
  | LoadDemoAction
  | ShowCodeModalAction;

// Chain multiple actions together
export type ChainAction = { type: "chain"; actions: BaseAction[] };

// Union of actions supported by the runtime
export type ComponentAction = BaseAction | ChainAction;

// Action creator utilities
export const actions = {
  // DOM actions
  toggleClass: (className: string): ToggleClassAction => ({
    type: "toggleClass",
    className,
  }),

  toggleClasses: (classNames: string[]): ToggleClassesAction => ({
    type: "toggleClasses",
    classNames,
  }),

  // Modal actions
  showModal: (modalId: string): ShowModalAction => ({
    type: "showModal",
    modalId,
  }),

  hideModal: (modalId: string): HideModalAction => ({
    type: "hideModal",
    modalId,
  }),

  createModal: (config: CreateModalAction["config"]): CreateModalAction => ({
    type: "createModal",
    config,
  }),

  // Cart actions
  cartAdd: (item: CartAddAction["item"]): CartAddAction => ({
    type: "cartAdd",
    item,
  }),

  cartRemove: (itemId: string): CartRemoveAction => ({
    type: "cartRemove",
    itemId,
  }),

  cartUpdate: (itemId: string, updates: Record<string, unknown>): CartUpdateAction => ({
    type: "cartUpdate",
    itemId,
    updates,
  }),

  cartClear: (): CartClearAction => ({
    type: "cartClear",
  }),

  // Theme actions
  themeSwitch: (themeName: string): ThemeSwitchAction => ({
    type: "themeSwitch",
    themeName,
  }),

  themeToggleDark: (): ThemeToggleDarkAction => ({
    type: "themeToggleDark",
  }),

  // Navigation actions
  smoothScroll: (target: string): SmoothScrollAction => ({
    type: "smoothScroll",
    target,
  }),

  tabSwitch: (tabId: string): TabSwitchAction => ({
    type: "tabSwitch",
    tabId,
  }),

  // Counter actions
  startCounter: (
    elementId: string,
    to: number,
    options?: { from?: number; duration?: number },
  ): StartCounterAction => ({
    type: "startCounter",
    elementId,
    to,
    ...options,
  }),

  stopCounter: (elementId: string): StopCounterAction => ({
    type: "stopCounter",
    elementId,
  }),

  // Code actions
  copyCode: (elementSelector?: string): CopyCodeAction => ({
    type: "copyCode",
    elementSelector,
  }),

  formatCode: (elementSelector?: string): FormatCodeAction => ({
    type: "formatCode",
    elementSelector,
  }),

  // Demo actions
  loadDemo: (demoName: string): LoadDemoAction => ({
    type: "loadDemo",
    demoName,
  }),

  showCodeModal: (demoName?: string): ShowCodeModalAction => ({
    type: "showCodeModal",
    demoName,
  }),

  // Chain actions
  chain: (actions: BaseAction[]): ChainAction => ({
    type: "chain",
    actions,
  }),
};
