// Animation Utilities - Reusable animation systems for ui-lib
// Extracted from showcase and made available to all applications

export * from "./number-counter.ts";

// Export animation types
export type {
  EasingFunction,
  CounterAnimationOptions,
} from "./number-counter.ts";

// Export animation utilities
export {
  easing,
  numberCounter,
  animateNumber,
  animateCounterGroup,
  formatters,
  createElementCounter,
  animateElements,
  NumberCounterAnimation,
} from "./number-counter.ts";