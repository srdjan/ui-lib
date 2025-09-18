// Animated Counter Component - Number animation with easing
// Extracted from showcase metrics animation for broader reuse

import { defineComponent } from "../../define-component.ts";
import type { ComponentProps } from "../../types.ts";

/**
 * Animation easing functions
 */
export type EasingFunction = (t: number) => number;

export const easingFunctions = {
  linear: (t: number): number => t,
  easeInQuad: (t: number): number => t * t,
  easeOutQuad: (t: number): number => t * (2 - t),
  easeInOutQuad: (t: number): number =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number): number => t * t * t,
  easeOutCubic: (t: number): number => (--t) * t * t + 1,
  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
} as const;

/**
 * Counter animation configuration
 */
export interface AnimationConfig {
  readonly duration?: number;
  readonly delay?: number;
  readonly easing?: keyof typeof easingFunctions | EasingFunction;
  readonly steps?: number;
  readonly format?: (value: number) => string;
}

/**
 * Animated counter props
 */
export interface AnimatedCounterProps extends ComponentProps {
  readonly from?: number;
  readonly to: number;
  readonly unit?: string;
  readonly decimals?: number;
  readonly animation?: AnimationConfig;
  readonly class?: string;
  readonly autoStart?: boolean;
  readonly trigger?: "load" | "visible" | "manual";
}

/**
 * Default number formatter
 */
const defaultFormatter = (value: number, decimals = 1, unit = ""): string => {
  return `${value.toFixed(decimals)}${unit}`;
};

/**
 * Animated counter component
 */
export const AnimatedCounter = defineComponent<AnimatedCounterProps>(
  "animated-counter",
  {
    render: ({
      from = 0,
      to,
      unit = "",
      decimals = 1,
      animation = {},
      class: className,
      autoStart = true,
      trigger = "load",
      ...props
    }) => {
      const {
        duration = 2000,
        delay = 0,
        easing = "easeOutCubic",
        steps = 60,
        format = (value) => defaultFormatter(value, decimals, unit),
      } = animation;

      const counterId = `counter-${Math.random().toString(36).substr(2, 9)}`;
      const easingName = typeof easing === "string" ? easing : "custom";

      return /*html*/ `
      <span 
        id="${counterId}"
        class="animated-counter ${className ?? ""}" 
        data-component="animated-counter"
        data-from="${from}"
        data-to="${to}"
        data-unit="${unit}"
        data-decimals="${decimals}"
        data-duration="${duration}"
        data-delay="${delay}"
        data-easing="${easingName}"
        data-steps="${steps}"
        data-auto-start="${autoStart}"
        data-trigger="${trigger}"
        ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(" ")}
      >
        ${format(from)}
      </span>

      <style>
        .animated-counter {
          font-variant-numeric: tabular-nums;
          transition: color 0.3s ease;
        }
        
        .animated-counter.counting {
          color: var(--accent-color, var(--blue-6, #0066cc));
        }
        
        .animated-counter.complete {
          color: var(--success-color, var(--green-6, #16a34a));
        }
      </style>
    `;
    },

    /**
     * Generate client-side JavaScript for counter animation
     */
    clientScript: () => {
      return `
// ui-lib Animated Counter - Number animation system
window.uiLibAnimatedCounter = {
  // Easing functions
  easingFunctions: {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  },

  // Active animations
  animations: new Map(),

  // Animate a counter
  animate(element) {
    const from = parseFloat(element.dataset.from || 0);
    const to = parseFloat(element.dataset.to);
    const unit = element.dataset.unit || '';
    const decimals = parseInt(element.dataset.decimals || 1);
    const duration = parseInt(element.dataset.duration || 2000);
    const delay = parseInt(element.dataset.delay || 0);
    const easingName = element.dataset.easing || 'easeOutCubic';
    const steps = parseInt(element.dataset.steps || 60);
    
    // Get easing function
    const easing = this.easingFunctions[easingName] || this.easingFunctions.easeOutCubic;
    
    // Format function
    const format = (value) => {
      if (decimals === 0) {
        return Math.round(value) + unit;
      }
      return value.toFixed(decimals) + unit;
    };

    // Stop any existing animation
    this.stop(element.id);
    
    // Add counting class
    element.classList.add('counting');
    
    const startTime = Date.now() + delay;
    const stepDuration = duration / steps;
    let currentStep = 0;
    
    const animationId = setInterval(() => {
      const now = Date.now();
      
      if (now < startTime) return;
      
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      const easedProgress = easing(progress);
      const currentValue = from + (to - from) * easedProgress;
      
      element.textContent = format(currentValue);
      
      if (progress >= 1) {
        clearInterval(animationId);
        this.animations.delete(element.id);
        element.classList.remove('counting');
        element.classList.add('complete');
        element.textContent = format(to);
        
        // Trigger completion event
        element.dispatchEvent(new CustomEvent('counter:complete', {
          detail: { from, to, duration }
        }));
      }
    }, stepDuration);
    
    this.animations.set(element.id, animationId);
    
    // Trigger start event
    element.dispatchEvent(new CustomEvent('counter:start', {
      detail: { from, to, duration }
    }));
  },

  // Stop animation
  stop(elementId) {
    const animationId = this.animations.get(elementId);
    if (animationId) {
      clearInterval(animationId);
      this.animations.delete(elementId);
      
      const element = document.getElementById(elementId);
      if (element) {
        element.classList.remove('counting');
      }
    }
  },

  // Reset counter to start value
  reset(elementId) {
    this.stop(elementId);
    
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const from = parseFloat(element.dataset.from || 0);
    const unit = element.dataset.unit || '';
    const decimals = parseInt(element.dataset.decimals || 1);
    
    const format = (value) => {
      if (decimals === 0) {
        return Math.round(value) + unit;
      }
      return value.toFixed(decimals) + unit;
    };
    
    element.textContent = format(from);
    element.classList.remove('counting', 'complete');
  },

  // Animate multiple counters with staggered delays
  animateGroup(counters, staggerDelay = 100) {
    counters.forEach((counter, index) => {
      const element = typeof counter === 'string' 
        ? document.getElementById(counter) 
        : counter;
        
      if (!element) return;
      
      // Add staggered delay
      const originalDelay = parseInt(element.dataset.delay || 0);
      element.dataset.delay = String(originalDelay + (index * staggerDelay));
      
      this.animate(element);
    });
  },

  // Initialize counters based on trigger
  init() {
    const counters = document.querySelectorAll('[data-component="animated-counter"]');
    
    counters.forEach(counter => {
      const trigger = counter.dataset.trigger || 'load';
      const autoStart = counter.dataset.autoStart !== 'false';
      
      if (!autoStart) return;
      
      if (trigger === 'load') {
        this.animate(counter);
      } else if (trigger === 'visible') {
        this.setupVisibilityObserver(counter);
      }
      // Manual trigger counters are started programmatically
    });
  },

  // Setup intersection observer for visibility trigger
  setupVisibilityObserver(element) {
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      this.animate(element);
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    });
    
    observer.observe(element);
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.uiLibAnimatedCounter.init();
  });
} else {
  window.uiLibAnimatedCounter.init();
}

// Re-initialize when new counters are added
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) { // Element node
        const counters = node.querySelectorAll ? 
          node.querySelectorAll('[data-component="animated-counter"]') : [];
        
        counters.forEach(counter => {
          if (counter.dataset.autoStart !== 'false') {
            const trigger = counter.dataset.trigger || 'load';
            if (trigger === 'load') {
              window.uiLibAnimatedCounter.animate(counter);
            } else if (trigger === 'visible') {
              window.uiLibAnimatedCounter.setupVisibilityObserver(counter);
            }
          }
        });
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
    `.trim();
    },
  },
);
