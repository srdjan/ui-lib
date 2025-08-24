// Server-side component state management for HTMX interactivity
import { getRegistry } from "./registry.ts";

// Simple in-memory state store (in production, this would be session-based or use a database)
const componentStates = new Map<string, Record<string, unknown>>();

// Generate a unique component instance ID
export function generateComponentId(componentName: string): string {
  return `${componentName}-${crypto.randomUUID()}`;
}

// Initialize component state
export function initializeComponentState(
  componentId: string, 
  componentName: string,
  initialProps: Record<string, unknown> = {}
): Record<string, unknown> {
  const registry = getRegistry();
  const entry = registry[componentName];
  
  if (!entry) {
    throw new Error(`Component ${componentName} not found in registry`);
  }
  
  const initialState = entry.init();
  componentStates.set(componentId, initialState);
  
  return initialState;
}

// Get component state
export function getComponentState(componentId: string): Record<string, unknown> | null {
  return componentStates.get(componentId) || null;
}

// Update component state
export function updateComponentState(
  componentId: string, 
  stateUpdate: Record<string, unknown>
): Record<string, unknown> | null {
  const currentState = componentStates.get(componentId);
  if (!currentState) return null;
  
  const newState = { ...currentState, ...stateUpdate };
  componentStates.set(componentId, newState);
  return newState;
}

// Execute an action and return the updated state
export function executeComponentAction(
  componentId: string,
  componentName: string,
  actionName: string,
  args: unknown[] = []
): Record<string, unknown> | null {
  const registry = getRegistry();
  const entry = registry[componentName];
  
  if (!entry || !entry.actions) {
    return null;
  }
  
  const action = entry.actions[actionName];
  if (!action) {
    return null;
  }
  
  const currentState = getComponentState(componentId);
  if (!currentState) {
    return null;
  }
  
  // Execute the action to get state update
  const stateUpdate = action(currentState, ...args);
  
  // Apply the update and return new state
  return updateComponentState(componentId, stateUpdate);
}

// Render component with current state
export function renderComponentWithState(
  componentId: string,
  componentName: string,
  props: Record<string, unknown> = {}
): string {
  const registry = getRegistry();
  const entry = registry[componentName];
  
  if (!entry) {
    return `<!-- component ${componentName} not found -->`;
  }
  
  const state = getComponentState(componentId) || entry.init();
  
  // Parse props if prop spec exists
  let parsedProps = props;
  if (entry.props) {
    parsedProps = {};
    for (const [key, spec] of Object.entries(entry.props)) {
      const rawValue = props[key];
      parsedProps[key] = spec.parse(rawValue);
    }
  }
  
  // Create action creators that include the component ID for HTMX
  const actionCreators = createHTMXActionCreators(componentId, componentName);
  
  // Render component - we need to handle the action creators differently
  // Since the original render expects action creators, we'll pass them
  const markup = entry.render(state, parsedProps, actionCreators);
  const cssTag = entry.css ? `<style>${entry.css}</style>` : "";
  
  return `${cssTag}${markup}`;
}

// Create simple action helper that returns HTMX attributes as strings
function createHTMXActionCreators(
  componentId: string, 
  componentName: string
) {
  const htmxAction = (actionName: string, args?: unknown[]) => {
    let attrs = `hx-post="/api/component/${componentName}/${componentId}/${actionName}" hx-target="#${componentId}"`;
    if (args && args.length > 0) {
      attrs += ` hx-vals='${JSON.stringify({ args })}'`;
    }
    return attrs;
  };

  // Return the function directly and also add individual action creators
  return { htmxAction };
}