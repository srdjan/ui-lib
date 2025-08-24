// Type-safe action types for DOM manipulation

// Core action type definitions
export type ToggleClassAction = { type: 'toggleClass', className: string };
export type ToggleClassesAction = { type: 'toggleClasses', classNames: string[] };
export type UpdateCounterAction = { type: 'updateCounter', selector: string, delta: number };
export type UpdateParentCounterAction = { type: 'updateParentCounter', parentSelector: string, counterSelector: string, delta: number };
export type ResetCounterAction = { type: 'resetCounter', displaySelector: string, initialValue: number | string, containerSelector?: string };
export type SetTextAction = { type: 'setText', selector: string, value: string };
export type ToggleVisibilityAction = { type: 'toggleVisibility', selector: string };
export type UpdateInputAction = { type: 'updateInput', selector: string, value: string };
export type SyncCheckboxAction = { type: 'syncCheckbox', className: string };
export type ActivateTabAction = { type: 'activateTab', container: string, buttons: string, content: string, activeClass: string };
export type ToggleParentClassAction = { type: 'toggleParentClass', className: string };

// Union of all possible actions
export type ComponentAction = 
  | ToggleClassAction
  | ToggleClassesAction
  | UpdateCounterAction
  | UpdateParentCounterAction
  | ResetCounterAction
  | SetTextAction
  | ToggleVisibilityAction
  | UpdateInputAction
  | SyncCheckboxAction
  | ActivateTabAction
  | ToggleParentClassAction;
