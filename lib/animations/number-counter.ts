// Number Counter Animation Utilities
// Reusable animation utilities extracted from showcase metrics

/**
 * Animation easing functions
 */
export type EasingFunction = (t: number) => number;

/**
 * Built-in easing functions
 */
export const easing = {
  linear: (t: number): number => t,
  
  // Quadratic
  easeInQuad: (t: number): number => t * t,
  easeOutQuad: (t: number): number => t * (2 - t),
  easeInOutQuad: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  // Cubic
  easeInCubic: (t: number): number => t * t * t,
  easeOutCubic: (t: number): number => (--t) * t * t + 1,
  easeInOutCubic: (t: number): number => 
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  
  // Quartic
  easeInQuart: (t: number): number => t * t * t * t,
  easeOutQuart: (t: number): number => 1 - (--t) * t * t * t,
  easeInOutQuart: (t: number): number => 
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  
  // Elastic
  easeInElastic: (t: number): number => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    const c4 = (2 * Math.PI) / 3;
    return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
  
  easeOutElastic: (t: number): number => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    const c4 = (2 * Math.PI) / 3;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  
  // Bounce
  easeOutBounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
} as const;

/**
 * Counter animation options
 */
export interface CounterAnimationOptions {
  readonly from: number;
  readonly to: number;
  readonly duration?: number;
  readonly delay?: number;
  readonly easing?: EasingFunction;
  readonly steps?: number;
  readonly onUpdate?: (value: number) => void;
  readonly onComplete?: (finalValue: number) => void;
  readonly formatter?: (value: number) => string;
}

/**
 * Animation state
 */
interface AnimationState {
  id: number;
  startTime: number;
  cancelRequested: boolean;
}

/**
 * Number counter animation utility
 */
export class NumberCounterAnimation {
  private animationId = 0;
  private activeAnimations = new Map<number, AnimationState>();

  /**
   * Start a counter animation
   */
  animate(options: CounterAnimationOptions): number {
    const {
      from,
      to,
      duration = 2000,
      delay = 0,
      easing: easingFn = easing.easeOutCubic,
      steps = 60,
      onUpdate,
      onComplete,
      formatter = (value) => value.toString(),
    } = options;

    const animationId = this.animationId++;
    const startTime = Date.now() + delay;
    const stepDuration = duration / steps;
    const delta = to - from;

    const state: AnimationState = {
      id: animationId,
      startTime,
      cancelRequested: false,
    };

    this.activeAnimations.set(animationId, state);

    let currentStep = 0;

    const step = () => {
      if (state.cancelRequested) {
        this.activeAnimations.delete(animationId);
        return;
      }

      const now = Date.now();
      
      if (now < startTime) {
        setTimeout(step, 16); // ~60fps
        return;
      }

      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      const easedProgress = easingFn(progress);
      const currentValue = from + delta * easedProgress;

      onUpdate?.(currentValue);

      if (progress >= 1) {
        this.activeAnimations.delete(animationId);
        onComplete?.(to);
      } else {
        setTimeout(step, stepDuration);
      }
    };

    // Start the animation
    setTimeout(step, 16);

    return animationId;
  }

  /**
   * Cancel an animation
   */
  cancel(animationId: number): void {
    const state = this.activeAnimations.get(animationId);
    if (state) {
      state.cancelRequested = true;
    }
  }

  /**
   * Cancel all animations
   */
  cancelAll(): void {
    this.activeAnimations.forEach((state) => {
      state.cancelRequested = true;
    });
    this.activeAnimations.clear();
  }

  /**
   * Check if an animation is running
   */
  isRunning(animationId: number): boolean {
    return this.activeAnimations.has(animationId);
  }

  /**
   * Get count of active animations
   */
  getActiveCount(): number {
    return this.activeAnimations.size;
  }
}

/**
 * Default counter animation instance
 */
export const numberCounter = new NumberCounterAnimation();

/**
 * Convenience function for animating numbers
 */
export const animateNumber = (options: CounterAnimationOptions): number => {
  return numberCounter.animate(options);
};

/**
 * Animate multiple counters with staggered delays
 */
export const animateCounterGroup = (
  counters: readonly CounterAnimationOptions[],
  staggerDelay = 100,
): readonly number[] => {
  return counters.map((counter, index) => {
    const delay = (counter.delay ?? 0) + (index * staggerDelay);
    return numberCounter.animate({ ...counter, delay });
  });
};

/**
 * Common number formatters
 */
export const formatters = {
  integer: (value: number): string => Math.round(value).toString(),
  
  decimal: (decimals = 1) => (value: number): string => 
    value.toFixed(decimals),
  
  percentage: (decimals = 1) => (value: number): string => 
    `${value.toFixed(decimals)}%`,
  
  currency: (currency = "$", decimals = 2) => (value: number): string => 
    `${currency}${value.toFixed(decimals)}`,
  
  fileSize: (value: number): string => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let unitIndex = 0;
    let size = value;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)}${units[unitIndex]}`;
  },
  
  duration: (value: number): string => {
    const minutes = Math.floor(value / 60);
    const seconds = Math.round(value % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  },
  
  withUnit: (unit: string, decimals = 1) => (value: number): string => 
    `${value.toFixed(decimals)}${unit}`,
};

/**
 * Create a counter animation with DOM element integration
 */
export const createElementCounter = (
  element: Element,
  options: Omit<CounterAnimationOptions, "onUpdate">,
): number => {
  return numberCounter.animate({
    ...options,
    onUpdate: (value) => {
      const formatted = options.formatter ? options.formatter(value) : value.toString();
      element.textContent = formatted;
    },
  });
};

/**
 * Batch animate multiple DOM elements
 */
export const animateElements = (
  elements: readonly { element: Element; options: CounterAnimationOptions }[],
  staggerDelay = 100,
): readonly number[] => {
  return elements.map(({ element, options }, index) => {
    const delay = (options.delay ?? 0) + (index * staggerDelay);
    
    return numberCounter.animate({
      ...options,
      delay,
      onUpdate: (value) => {
        const formatted = options.formatter ? options.formatter(value) : value.toString();
        element.textContent = formatted;
        options.onUpdate?.(value);
      },
    });
  });
};