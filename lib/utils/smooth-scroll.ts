// Smooth Scroll Utilities - Enhanced smooth scrolling with easing
// Extracted from showcase navigation functionality

/**
 * Scroll behavior options
 */
export interface ScrollOptions {
  readonly duration?: number;
  readonly offset?: number;
  readonly easing?: (t: number) => number;
  readonly onComplete?: () => void;
  readonly onCancel?: () => void;
}

/**
 * Easing functions for smooth scrolling
 */
export const scrollEasing = {
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
 * Smooth scroll utility class
 */
export class SmoothScroll {
  private static activeScrolls = new Set<number>();
  private static scrollId = 0;

  /**
   * Scroll to element smoothly
   */
  static scrollToElement(
    target: string | Element,
    options: ScrollOptions = {},
  ): void {
    const element = typeof target === "string"
      ? document.querySelector(target)
      : target;

    if (!element) {
      console.warn(`Scroll target not found:`, target);
      return;
    }

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset + rect.top + (options.offset ?? 0);

    this.scrollTo(scrollTop, options);
  }

  /**
   * Scroll to specific position smoothly
   */
  static scrollTo(
    targetY: number,
    options: ScrollOptions = {},
  ): void {
    const {
      duration = 800,
      easing = scrollEasing.easeOutCubic,
      onComplete,
      onCancel,
    } = options;

    // Cancel any existing scrolls
    this.cancelAll();

    const startY = window.pageYOffset;
    const distance = targetY - startY;

    if (Math.abs(distance) < 1) {
      onComplete?.();
      return;
    }

    const scrollId = this.scrollId++;
    this.activeScrolls.add(scrollId);

    const startTime = Date.now();

    const scroll = () => {
      if (!this.activeScrolls.has(scrollId)) {
        onCancel?.();
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      const currentY = startY + distance * easedProgress;

      window.scrollTo(0, currentY);

      if (progress < 1) {
        requestAnimationFrame(scroll);
      } else {
        this.activeScrolls.delete(scrollId);
        onComplete?.();
      }
    };

    requestAnimationFrame(scroll);
  }

  /**
   * Cancel all active smooth scrolls
   */
  static cancelAll(): void {
    this.activeScrolls.clear();
  }

  /**
   * Setup smooth scroll for anchor links
   */
  static setupAnchorLinks(
    selector = 'a[href^="#"]',
    options: ScrollOptions = {},
  ): void {
    document.addEventListener("click", (event) => {
      const link = (event.target as Element).closest(
        selector,
      ) as HTMLAnchorElement;

      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      this.scrollToElement(target, options);
    });
  }

  /**
   * Check if smooth scrolling is supported
   */
  static isSupported(): boolean {
    return "scrollBehavior" in document.documentElement.style;
  }

  /**
   * Fallback to native smooth scroll if supported
   */
  static scrollToElementNative(
    target: string | Element,
    options: { offset?: number } = {},
  ): void {
    const element = typeof target === "string"
      ? document.querySelector(target)
      : target;

    if (!element) return;

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset + rect.top + (options.offset ?? 0);

    if (this.isSupported()) {
      window.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    } else {
      window.scrollTo(0, scrollTop);
    }
  }
}

/**
 * Convenience functions
 */
export const smoothScrollTo = (
  target: string | Element,
  options?: ScrollOptions,
): void => {
  SmoothScroll.scrollToElement(target, options);
};

export const smoothScrollToTop = (options?: ScrollOptions): void => {
  SmoothScroll.scrollTo(0, options);
};

export const setupSmoothScrolling = (options?: ScrollOptions): void => {
  SmoothScroll.setupAnchorLinks('a[href^="#"]', options);
};

/**
 * Generate JavaScript code for client-side smooth scrolling
 */
export const createSmoothScrollScript = (
  options: ScrollOptions = {},
): string => {
  const {
    duration = 800,
    offset = 0,
  } = options;

  return `
// ui-lib Smooth Scroll - Enhanced smooth scrolling with easing
window.uiLibSmoothScroll = {
  // Easing functions
  easing: {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  },

  // Active scroll tracking
  activeScrolls: new Set(),
  scrollId: 0,

  // Scroll to element
  scrollToElement(target, options = {}) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) {
      console.warn('Scroll target not found:', target);
      return;
    }

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset + rect.top + (options.offset || ${offset});

    this.scrollTo(scrollTop, options);
  },

  // Scroll to position
  scrollTo(targetY, options = {}) {
    const {
      duration = ${duration},
      easing = this.easing.easeOutCubic,
      onComplete,
      onCancel
    } = options;

    // Cancel existing scrolls
    this.cancelAll();

    const startY = window.pageYOffset;
    const distance = targetY - startY;

    if (Math.abs(distance) < 1) {
      if (onComplete) onComplete();
      return;
    }

    const scrollId = this.scrollId++;
    this.activeScrolls.add(scrollId);

    const startTime = Date.now();

    const scroll = () => {
      if (!this.activeScrolls.has(scrollId)) {
        if (onCancel) onCancel();
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      const currentY = startY + distance * easedProgress;

      window.scrollTo(0, currentY);

      if (progress < 1) {
        requestAnimationFrame(scroll);
      } else {
        this.activeScrolls.delete(scrollId);
        if (onComplete) onComplete();
      }
    };

    requestAnimationFrame(scroll);
  },

  // Cancel all scrolls
  cancelAll() {
    this.activeScrolls.clear();
  },

  // Initialize anchor link handling
  init() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      this.scrollToElement(target, { offset: ${offset} });
    });
  }
};

// Global convenience functions
window.smoothScrollTo = window.uiLibSmoothScroll.scrollToElement;
window.smoothScrollToTop = () => window.uiLibSmoothScroll.scrollTo(0);

// Auto-initialize smooth scrolling
document.addEventListener('DOMContentLoaded', () => {
  window.uiLibSmoothScroll.init();
});
`.trim();
};
