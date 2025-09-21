// Animation Utilities - Reusable animation systems for ui-lib
// Extracted from showcase and made available to all applications

export * from "./number-counter.ts";

// Export animation types
export type {
  CounterAnimationOptions,
  EasingFunction,
} from "./number-counter.ts";

// Export animation utilities
export {
  animateCounterGroup,
  animateElements,
  animateNumber,
  createElementCounter,
  easing,
  formatters,
  numberCounter,
  NumberCounterAnimation,
} from "./number-counter.ts";
