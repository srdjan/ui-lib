// Type-safe action types for DOM manipulation (core only)

// Core action type definitions
export type ToggleClassAction = { type: 'toggleClass', className: string };
export type ToggleClassesAction = { type: 'toggleClasses', classNames: string[] };

// Union of actions supported by the runtime
export type ComponentAction = 
  | ToggleClassAction
  | ToggleClassesAction;
