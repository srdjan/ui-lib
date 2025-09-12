// Enhanced defineComponent with the three ergonomic breakthroughs
import type { ApiMap, GeneratedApiMap } from "./api-generator.ts";
import type { ComponentConfig } from "./define-component.ts";
import { defineComponent as baseDefineComponent } from "./define-component.ts";
import { extractPropDefinitions } from "./prop-helpers.ts";
import { parseRenderParameters } from "./render-parameter-parser.ts";
import { parseUnifiedStyles } from "./styles-parser.ts";

// ✨ Ergonomic Component Configuration
export interface ErgonomicComponentConfig<TProps = any> {
  name: string;

  // ✨ Breakthrough 1: Function-Style Props (Zero Duplication!)
  // Props are auto-inferred from render function parameters
  render: (
    props: TProps,
    api?: GeneratedApiMap,
    classes?: Record<string, string>,
    children?: string,
  ) => string;

  // ✨ Breakthrough 2: CSS-Only Format (Auto-Generated Classes!)
  // Just write CSS properties - class names auto-generated
  styles?: Record<string, string | Record<string, string>>;

  // ✨ Breakthrough 3: Unified API System (HTMX Attributes Auto-Generated!)
  // Define server handlers - client functions auto-generated
  api?: ApiMap;

  // Optional configuration
  router?: any;
  reactive?: any;
}

/**
 * ✨ Enhanced defineComponent with Three Ergonomic Breakthroughs
 *
 * @example
 * ```tsx
 * // ✨ All three breakthroughs in action!
 * defineErgonomicComponent({
 *   name: "todo-item",
 *
 *   // ✨ Breakthrough 2: CSS-Only Format
 *   styles: {
 *     container: `{ padding: 1rem; background: white; border-radius: 0.5rem; }`,
 *     title: `{ font-size: 1.2rem; font-weight: bold; }`,
 *     button: `{ background: #007bff; color: white; border: none; padding: 0.5rem; }`
 *   },
 *
 *   // ✨ Breakthrough 3: Unified API System
 *   api: {
 *     toggle: patch("/api/todos/:id/toggle", toggleHandler),
 *     remove: del("/api/todos/:id", removeHandler)
 *   },
 *
 *   // ✨ Breakthrough 1: Function-Style Props (Zero Duplication!)
 *   render: ({
 *     id = string(),
 *     text = string("Untitled"),
 *     completed = boolean(false),
 *     priority = oneOf(["low", "medium", "high"], "medium")
 *   }, api, classes) => (
 *     `<div class="${classes.container}">
 *        <h3 class="${classes.title}">${text}</h3>
 *        <button class="${classes.button}" ${api.toggle(id)}>
 *          ${completed ? "✓" : "○"}
 *        </button>
 *        <button class="${classes.button}" ${api.remove(id)}>×</button>
 *      </div>`
 *   )
 * });
 * ```
 */
export function defineErgonomicComponent<TProps = any>(
  config: ErgonomicComponentConfig<TProps>,
): void {
  const { name, render, styles, api, router, reactive } = config;

  // ✨ Breakthrough 1: Auto-extract props from render function parameters
  const { propHelpers, hasProps } = parseRenderParameters(render);
  let propsTransformer: ((attrs: Record<string, string>) => TProps) | undefined;

  if (hasProps) {
    const { propsTransformer: autoTransformer } = extractPropDefinitions(
      propHelpers,
    );
    propsTransformer = autoTransformer as (
      attrs: Record<string, string>,
    ) => TProps;

    console.log(
      `✨ Auto-generated props for "${name}":`,
      Object.keys(propHelpers),
    );
  }

  // ✨ Breakthrough 2: Auto-generate class names from CSS-only format
  let processedStyles: string | undefined;
  let classMap: Record<string, string> | undefined;

  if (styles) {
    const { classMap: generatedClassMap, combinedCss } = parseUnifiedStyles(
      styles,
    );
    classMap = generatedClassMap;
    processedStyles = combinedCss;

    console.log(
      `✨ Auto-generated classes for "${name}":`,
      Object.keys(generatedClassMap),
    );
  }

  // ✨ Create the enhanced component configuration
  const enhancedConfig: ComponentConfig<TProps> = {
    router,
    reactive,
    autoProps: false, // We handle props manually for better control
    props: propsTransformer,
    styles: processedStyles,
    classes: classMap,
    ...(api ? { api } : {}),
    render: (
      props: TProps,
      generatedApi?: GeneratedApiMap,
      providedClasses?: Record<string, string>,
      children?: string,
    ) => {
      const finalClasses = providedClasses || classMap || {};
      return render(props, generatedApi, finalClasses, children);
    },
  } as ComponentConfig<TProps>;

  // ✨ Use the base defineComponent with our enhanced configuration
  baseDefineComponent(name, enhancedConfig);

  console.log(`✨ Ergonomic component "${name}" registered successfully!`);
}

/**
 * ✨ Convenience function for simple components without API
 */
export function defineSimpleComponent<TProps = any>(
  name: string,
  render: ErgonomicComponentConfig<TProps>["render"],
  styles?: ErgonomicComponentConfig<TProps>["styles"],
): void {
  defineErgonomicComponent({ name, render, styles });
}

/**
 * ✨ Convenience function for API-enabled components
 */
export function defineApiComponent<TProps = any>(
  name: string,
  render: ErgonomicComponentConfig<TProps>["render"],
  api: ApiMap,
  styles?: ErgonomicComponentConfig<TProps>["styles"],
): void {
  defineErgonomicComponent({ name, render, api, styles });
}
