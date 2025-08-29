// Enhanced component definition with reactive features
import { defineComponent, type ComponentConfig, type PropsTransformer, type StylesInput, type ClassMap, type GeneratedApiMap } from "./define-component.ts";
import type { ApiMap } from "./api-generator.ts";
import { subscribeToState, listensFor } from "./reactive-helpers.ts";
import { parseRenderParameters } from "./render-parameter-parser.ts";
import { extractPropDefinitions } from "./prop-helpers.ts";

/**
 * Enhanced component configuration that supports reactive features
 * Simplified to avoid complex intersection type issues
 */
export interface ReactiveComponentConfig<TProps> {
  // Core component properties (copied to avoid inheritance issues)
  props?: PropsTransformer<Record<string, string>, TProps>;
  styles?: StylesInput;
  classes?: ClassMap;
  api?: ApiMap;
  render: (props: TProps, api?: GeneratedApiMap, classes?: ClassMap) => string;
  /**
   * CSS property reactions - automatically update CSS based on property changes
   * Key: CSS property name (without --), Value: CSS rule to apply when property changes
   */
  cssReactions?: Record<string, string>;

  /**
   * State subscriptions - automatically subscribe to state manager topics
   * Key: topic name, Value: JavaScript handler code (receives 'data' parameter)
   */
  stateSubscriptions?: Record<string, string>;

  /**
   * Event listeners - automatically listen for DOM events
   * Key: event name (without funcwc: prefix), Value: JavaScript handler code
   */
  eventListeners?: Record<string, string>;

  /**
   * Reactive lifecycle hooks
   */
  onMount?: string; // JavaScript code to run when component mounts
  onUnmount?: string; // JavaScript code to run when component unmounts (via MutationObserver)

  /**
   * Auto-inject reactive attributes into the root element
   * If false, reactive features must be manually added to elements
   */
  autoInjectReactive?: boolean;
}

/**
 * Define a component with enhanced reactive capabilities
 * 
 * @example
 * ```tsx
 * defineReactiveComponent("cart-display", {
 *   stateSubscriptions: {
 *     'cart': `
 *       this.querySelector('.count').textContent = data.count;
 *       this.classList.toggle('empty', data.isEmpty);
 *     `
 *   },
 *   eventListeners: {
 *     'theme-changed': `
 *       this.classList.toggle('dark', event.detail.theme === 'dark');
 *     `
 *   },
 *   onMount: `
 *     console.log('Cart display mounted');
 *     this.setAttribute('data-reactive', 'true');
 *   `,
 *   render: ({ count = number(0) }) => (
 *     <div class="cart-display">
 *       Items: <span class="count">{count}</span>
 *     </div>
 *   )
 * });
 * ```
 */
export function defineReactiveComponent<TProps = Record<string, string>>(
  name: string,
  config: ReactiveComponentConfig<TProps>,
): void {
  const {
    cssReactions,
    stateSubscriptions,
    eventListeners,
    onMount,
    onUnmount,
    autoInjectReactive = true,
    render,
    styles: originalStyles,
    ...baseConfig
  } = config;

  // Enhanced render function with reactive injection
  const enhancedRender = (props: TProps, api?: GeneratedApiMap, classes?: Record<string, string>) => {
    let html = render(props, api, classes);

    if (!autoInjectReactive) {
      return html;
    }

    // Build reactive attributes to inject
    const reactiveAttrs: string[] = [];
    const reactiveCode: string[] = [];

    // Add state subscriptions
    if (stateSubscriptions) {
      Object.entries(stateSubscriptions).forEach(([topic, handler]) => {
        reactiveCode.push(subscribeToState(topic, handler));
      });
    }

    // Add event listeners
    if (eventListeners) {
      Object.entries(eventListeners).forEach(([eventName, handler]) => {
        reactiveAttrs.push(listensFor(eventName, handler));
      });
    }

    // Add lifecycle hooks
    if (onMount || reactiveCode.length > 0 || onUnmount) {
      let lifecycleCode = "";

      // Mount code (including subscriptions)
      if (onMount || reactiveCode.length > 0) {
        const mountCode = [
          ...(reactiveCode.length > 0 ? reactiveCode : []),
          ...(onMount ? [onMount] : []),
        ].join(";\n");

        lifecycleCode += mountCode;
      }

      // Unmount code (if provided)
      if (onUnmount) {
        lifecycleCode += `\n\n// Setup unmount observer\n`;
        lifecycleCode += `
          if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                mutation.removedNodes.forEach((node) => {
                  if (node === this || (node.nodeType === 1 && node.contains(this))) {
                    try { ${onUnmount} } catch(e) { console.warn('funcwc unmount error:', e); }
                    observer.disconnect();
                  }
                });
              });
            });
            observer.observe(document.body, { childList: true, subtree: true });
          }
        `.trim();
      }

      if (lifecycleCode) {
        reactiveAttrs.push(`hx-on:load="${lifecycleCode.replace(/"/g, "&quot;")}"`);
      }
    }

    // Inject reactive attributes into the first element
    if (reactiveAttrs.length > 0) {
      // Find the first opening tag and inject attributes
      const firstTagMatch = html.match(/^(\s*)(<[a-zA-Z][^>]*)(>)/);
      if (firstTagMatch) {
        const [, whitespace, openTag, closeAngle] = firstTagMatch;
        const enhancedTag = `${whitespace}${openTag} ${reactiveAttrs.join(" ")} data-component="${name}"${closeAngle}`;
        html = html.replace(firstTagMatch[0], enhancedTag);
      }
    } else if (autoInjectReactive) {
      // Just add data-component attribute
      const firstTagMatch = html.match(/^(\s*)(<[a-zA-Z][^>]*)(>)/);
      if (firstTagMatch) {
        const [, whitespace, openTag, closeAngle] = firstTagMatch;
        const enhancedTag = `${whitespace}${openTag} data-component="${name}"${closeAngle}`;
        html = html.replace(firstTagMatch[0], enhancedTag);
      }
    }

    return html;
  };

  // Enhanced styles with CSS reactions
  let enhancedStyles = originalStyles;
  if (cssReactions && typeof originalStyles === "object") {
    // Add reactive CSS rules
    const reactiveCssRules = Object.entries(cssReactions)
      .map(([property, rule]) => {
        // Create CSS that reacts to the custom property
        return `[data-component="${name}"] { ${rule.replace(/var\(--[\w-]+\)/g, `var(--${property})`)} }`;
      })
      .join("\n");

    enhancedStyles = {
      ...originalStyles,
      reactiveRules: reactiveCssRules,
    };
  }

  // Extract props transformer from original render function for function-style props support
  // We need to do this before creating enhancedRender since parseRenderParameters
  // analyzes the original function string
  const { propHelpers, hasProps } = parseRenderParameters(render);
  let propsTransformer = baseConfig.props;
  
  if (!propsTransformer && hasProps) {
    const { propsTransformer: autoTransformer } = extractPropDefinitions(propHelpers);
    propsTransformer = autoTransformer as PropsTransformer<Record<string, string>, TProps>;
    console.log(
      `Auto-generated props for component "${name}":`,
      Object.keys(propHelpers),
    );
  }

  // Call the original defineComponent with enhanced configuration
  defineComponent(name, {
    ...baseConfig,
    props: propsTransformer,
    styles: enhancedStyles,
    render: enhancedRender,
  } as any); // Type assertion to handle signature compatibility
}

/**
 * Utility function to create reactive CSS classes that respond to CSS custom properties
 * 
 * @example
 * ```tsx
 * const themeClasses = createReactiveCSSClasses({
 *   'theme-mode': {
 *     light: 'background: white; color: black;',
 *     dark: 'background: #1a1a1a; color: white;'
 *   },
 *   'size-mode': {
 *     small: 'font-size: 0.8rem; padding: 0.25rem;',
 *     large: 'font-size: 1.2rem; padding: 1rem;'
 *   }
 * });
 * ```
 */
export function createReactiveCSSClasses(
  propertyMappings: Record<string, Record<string, string>>,
): Record<string, string> {
  const cssClasses: Record<string, string> = {};

  Object.entries(propertyMappings).forEach(([property, valueMap]) => {
    Object.entries(valueMap).forEach(([value, styles]) => {
      const className = `reactive-${property}-${value}`;
      cssClasses[className] = `
        [data-reactive-${property}="${value}"] .${className},
        [style*="--${property}: ${value}"] .${className} {
          ${styles}
        }
      `;
    });
  });

  return cssClasses;
}

/**
 * Utility to create a reactive component that responds to multiple state topics
 * 
 * @example
 * ```tsx
 * defineMultiStateComponent("dashboard-widget", {
 *   topics: ['user', 'cart', 'theme'],
 *   render: ({ title = string("Widget") }, api, classes, states) => {
 *     const user = states.user || {};
 *     const cart = states.cart || {};
 *     const theme = states.theme || 'light';
 *     
 *     return (
 *       <div class={`widget theme-${theme}`}>
 *         <h3>Welcome {user.name || 'Guest'}</h3>
 *         <p>Cart: {cart.count || 0} items</p>
 *       </div>
 *     );
 *   }
 * });
 * ```
 */
interface MultiStateComponentConfig<TProps> extends Omit<ComponentConfig<TProps>, 'render'> {
  topics: string[];
  render: (
    props: TProps,
    api: any,
    classes?: Record<string, string>,
    states?: Record<string, unknown>
  ) => string;
}

export function defineMultiStateComponent<TProps = Record<string, string>>(
  name: string,
  config: MultiStateComponentConfig<TProps>,
): void {
  const { topics, render, ...baseConfig } = config;

  const stateSubscriptions: Record<string, string> = {};
  
  // Create subscriptions for each topic
  topics.forEach(topic => {
    stateSubscriptions[topic] = `
      if (!this._funcwcStates) this._funcwcStates = {};
      this._funcwcStates['${topic}'] = data;
      
      // Trigger re-render with updated states
      if (this._funcwcRender) {
        try {
          this._funcwcRender();
        } catch (error) {
          console.warn('Multi-state component re-render error:', error);
        }
      }
    `;
  });

  // Enhanced render that includes state data
  const enhancedRender = (props: TProps, api: any, classes?: Record<string, string>) => {
    // Store render function and initial state gathering
    const renderSetup = `
      // Store render function for state updates
      this._funcwcRender = () => {
        const states = this._funcwcStates || {};
        // Note: This is a simplified re-render - in practice you'd want more sophisticated updating
        console.log('Re-rendering ${name} with states:', states);
      };
      
      // Initialize states from current state manager
      this._funcwcStates = {};
      ${topics.map(topic => `
        const ${topic}State = window.funcwcState?.getState('${topic}');
        if (${topic}State !== undefined) this._funcwcStates['${topic}'] = ${topic}State;
      `).join('\n')}
    `;

    // Get initial states (this is a limitation - in a real implementation, 
    // you'd want to pass current states to render)
    const initialStates: Record<string, unknown> = {};
    
    const html = render(props, api, classes, initialStates);

    // Inject the render setup
    const firstTagMatch = html.match(/^(\s*)(<[a-zA-Z][^>]*)(>)/);
    if (firstTagMatch) {
      const [, whitespace, openTag, closeAngle] = firstTagMatch;
      const enhancedTag = `${whitespace}${openTag} hx-on:load="${renderSetup.replace(/"/g, "&quot;")}" data-component="${name}"${closeAngle}`;
      return html.replace(firstTagMatch[0], enhancedTag);
    }

    return html;
  };

  defineComponent(name, {
    ...baseConfig,
    render: enhancedRender,
  } as any); // Type assertion to bypass complex type issues
}

/**
 * Helper to create a component that automatically syncs with CSS custom properties
 */
export function defineCSSReactiveComponent<TProps = Record<string, string>>(
  name: string,
  config: ComponentConfig<TProps> & {
    watchedProperties: string[];
    onPropertyChange?: (property: string, value: string) => string;
  }
): void {
  const { watchedProperties, onPropertyChange, render, ...baseConfig } = config;

  const propertyWatcher = watchedProperties.map(property => `
    // Watch for --${property} changes
    const observer${property} = new MutationObserver(() => {
      const newValue = getComputedStyle(document.documentElement).getPropertyValue('--${property}');
      if (newValue !== this.dataset.lastValue${property}) {
        this.dataset.lastValue${property} = newValue;
        ${onPropertyChange ? onPropertyChange(property, 'newValue') : `console.log('Property --${property} changed to:', newValue);`}
      }
    });
    observer${property}.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
  `).join('\n');

  defineComponent(name, {
    ...baseConfig,
    render,
  } as any); // Type assertion to bypass complex type issues
}

// Export types for external use
export type { MultiStateComponentConfig };
