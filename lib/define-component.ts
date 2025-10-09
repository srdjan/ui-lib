// Minimal defineComponent API with inline prop definitions
import { type ApiMap } from "./api-generator.ts";
import { type ApiRoute } from "./api-helpers.ts";
import { generateClientHx, type HxActionMap } from "./api-recipes.ts";
import { renderComponent } from "./component-state.ts";
import { getConfig } from "./config.ts";
import {
  hasDeclarativeBindings,
  processDeclarativeBindings,
} from "./declarative-bindings.ts";
import "./jsx.d.ts";
import { extractPropDefinitions } from "./prop-helpers.ts";
import { applyReactiveAttrs } from "./reactive-system.ts";
import { getRegistry } from "./registry.ts";
import { parseRenderParameters } from "./render-parameter-parser.ts";
import {
  isUnifiedStyles,
  parseUnifiedStyles,
  type UnifiedStyles,
} from "./styles-parser.ts";
// Re-export h function for JSX support
export { h } from "./jsx-runtime.ts";

export type { HxActionMap };

// Minimal types
export type ClassMap = Record<string, string>;
export type StylesInput = string | UnifiedStyles | Record<string, string>;
export type DefinedComponent<TProps = any> =
  & (
    (props?: TProps & { children?: unknown }) => string
  )
  & { readonly componentName: string };

// Consolidated reactive configuration
export type ReactiveConfig = {
  readonly on?: Readonly<Record<string, string>>;
  readonly state?: Readonly<Record<string, string>>;
  readonly css?: Readonly<Record<string, string>>;
  readonly mount?: string;
  readonly unmount?: string;
  readonly inject?: boolean; // default false
};

// Minimal component configuration with inline props in render function
export type ComponentConfig<TProps = any> = {
  readonly reactive?: ReactiveConfig;
  readonly styles?: StylesInput;
  readonly api?: ApiMap;
  readonly clientScript?: (config?: any) => string;
  // Optional explicit props transformer (legacy/alternate style)
  readonly props?: (attrs: Record<string, string>) => TProps;
  readonly render: (
    props: TProps,
    api?: HxActionMap<any>,
    classes?: ClassMap,
  ) => string;
};

// App component configuration - restricted version without styling capabilities
// Apps must compose pre-styled library components with variants
export type AppComponentConfig<TProps = any> = {
  readonly reactive?: ReactiveConfig;
  readonly api?: ApiMap;
  readonly props?: (attrs: Record<string, string>) => TProps;
  readonly render: (
    props: TProps,
    api?: HxActionMap<any>,
    classes?: ClassMap,
  ) => string;
};

// New minimal defineComponent implementation with inline prop definitions
export function defineComponent<TProps = any>(
  name: string,
  config: ComponentConfig<TProps>,
): DefinedComponent<TProps> {
  const {
    styles: stylesInput,
    api: apiMap,
    reactive,
    render,
  } = config;

  const globalConfig = getConfig();
  const { logging, dev } = globalConfig;

  // Prefer explicit props transformer if provided; otherwise auto-extract
  const { propHelpers, hasProps } = parseRenderParameters(render);
  let propsTransformer: ((attrs: Record<string, string>) => TProps) | undefined;

  if (typeof (config as any).props === "function") {
    propsTransformer = (config as any).props as (
      attrs: Record<string, string>,
    ) => TProps;
  } else if (hasProps) {
    const { propsTransformer: autoTransformer } = extractPropDefinitions(
      propHelpers,
    );
    propsTransformer = autoTransformer as (
      attrs: Record<string, string>,
    ) => TProps;

    if (dev) {
      console.log(
        `✨ Auto-generated props for "${name}":`,
        Object.keys(propHelpers),
      );
    }
  }

  // Handle styles - support both unified styles and CSS-only format
  let css: string | undefined;
  let classMap: ClassMap | undefined;

  if (stylesInput) {
    if (typeof stylesInput === "object" && !isUnifiedStyles(stylesInput)) {
      // CSS-only format (Record<string, string>)
      const unifiedStyles: UnifiedStyles = {};
      for (const [key, value] of Object.entries(stylesInput)) {
        if (typeof value === "string" && value.includes("{")) {
          // CSS string format: "{ padding: 1rem; }"
          const cssContent = value.trim().replace(/^\{|\}$/g, "").trim();
          unifiedStyles[key] = { cssText: cssContent };
        } else if (typeof value === "string") {
          unifiedStyles[key] = { cssText: value };
        }
      }
      const { classMap: extractedClassMap, combinedCss } = parseUnifiedStyles(
        unifiedStyles,
      );
      css = combinedCss;
      classMap = extractedClassMap;
    } else if (isUnifiedStyles(stylesInput)) {
      // Unified styles format
      const { classMap: extractedClassMap, combinedCss } = parseUnifiedStyles(
        stylesInput,
      );
      css = combinedCss;
      classMap = extractedClassMap;
    } else {
      // Traditional string styles
      css = stylesInput as string;
    }
  }

  // Enhance CSS with reactive rules if requested
  if (reactive?.css) {
    const reactiveCssRules = Object.entries(reactive.css)
      .map(([property, rule]) => {
        return `[data-component="${name}"] { ${
          rule.replace(/var\(--[\w-]+\)/g, `var(--${property})`)
        } }`;
      })
      .join("\n");
    css = css ? `${css}\n${reactiveCssRules}` : reactiveCssRules;
  }

  // Validate required configuration
  if (!render) {
    throw new Error(
      `Component "${name}" is missing required render function.`,
    );
  }

  // Generate API client functions if provided (using enhanced hx version)
  let generatedApi: HxActionMap<any> | undefined;
  if (apiMap) {
    generatedApi = generateClientHx(apiMap, {
      swap: globalConfig.hx.swapDefault,
      target: globalConfig.hx.targetDefault,
      headers: globalConfig.hx.headers,
    });
  }

  // Register the component in the SSR registry
  const registry = getRegistry();
  if (registry[name]) {
    console.warn(
      `⚠️  Component "${name}" already exists and will be overwritten!`,
    );
  }

  registry[name] = {
    props: undefined, // No separate props config
    css,
    api: generatedApi,
    apiMap, // Store for external registration
    render: (rawAttrs, _unusedApi) => {
      // Transform props if we extracted them from render parameters
      let finalProps: TProps;
      if (propsTransformer) {
        finalProps = propsTransformer(rawAttrs as Record<string, string>);
      } else {
        // No props transformation - pass raw attributes
        finalProps = rawAttrs as unknown as TProps;
      }

      // Preserve children passed from SSR tag processor
      const children = (rawAttrs as any).children || "";
      const propsWithChildren = {
        ...finalProps,
        children,
      };

      let html: string;
      if (dev) {
        console.log(`🎨 Rendering component: ${name}`);
      }

      html = render(propsWithChildren, generatedApi, classMap);

      // Process declarative bindings if present
      if (hasDeclarativeBindings(html)) {
        html = processDeclarativeBindings(html, name);
      }

      // Inject data-component on the first opening tag for debugging and tooling
      const tagMatch = html.match(/([\s\S]*?)(<[a-zA-Z][^>]*)(>)/);
      if (tagMatch) {
        const [full, prefix, openTag, closeAngle] = tagMatch;
        const hasDataComponent = /\sdata-component=/.test(openTag);
        const newOpen = hasDataComponent
          ? openTag
          : `${openTag} data-component="${name}"`;
        html = `${prefix}${newOpen}${closeAngle}${html.slice(full.length)}`;
      }

      // Apply reactive attributes if configured
      if (reactive) {
        const processedHtml = applyReactiveAttrs(html, reactive, name);
        if (reactive.inject && reactive.mount) {
          return `${processedHtml}
<script data-component="${name}">
(() => {
  const el = document.currentScript.previousElementSibling;
  if (el && typeof ${reactive.mount} === 'function') {
    ${reactive.mount}.call(el);
  }
})();
</script>`;
        }
        return processedHtml;
      }

      return html;
    },
  };

  if (logging) {
    console.log(`✅ Component "${name}" registered with inline props`);
  }

  const component = ((props?: TProps & { children?: unknown }) => {
    const finalProps = (props ?? {}) as Record<string, unknown>;
    return renderComponent(name, finalProps);
  }) as DefinedComponent<TProps>;

  Object.defineProperty(component, "componentName", {
    value: name,
    writable: false,
    enumerable: false,
  });

  return component;
}

// Helper to register component API routes externally
export function registerComponentApi(
  componentName: string,
  router: {
    register: (
      method: string,
      path: string,
      handler: (
        req: Request,
        params?: Record<string, string>,
      ) => Promise<Response> | Response,
    ) => void;
  },
): void {
  const registry = getRegistry();
  const component = registry[componentName];

  if (!component?.apiMap) {
    console.warn(`Component "${componentName}" has no API to register`);
    return;
  }

  for (const apiDefinition of Object.values(component.apiMap)) {
    if (!isApiRoute(apiDefinition)) {
      console.warn(
        `Invalid API definition for component "${componentName}". Expected ApiRoute object created by get/post/patch/put/del helpers`,
      );
      continue;
    }

    router.register(
      apiDefinition.method,
      apiDefinition.path,
      apiDefinition.handler as (
        req: Request,
        params?: Record<string, string>,
      ) => Promise<Response> | Response,
    );
  }
}

// Simpler component definition for direct use (like defineSimpleComponent)
export function defineSimpleComponent(
  name: string,
  render: (props: any, api?: HxActionMap<any>, classes?: ClassMap) => string,
  styles?: Record<string, string>,
  api?: ApiMap,
): DefinedComponent {
  return defineComponent(name, {
    render,
    styles,
    api,
  });
}

/**
 * Type guard to check if value is ApiRoute object (new format)
 */
function isApiRoute(value: unknown): value is ApiRoute {
  return (
    typeof value === "object" &&
    value !== null &&
    "method" in value &&
    "path" in value &&
    "handler" in value &&
    "toAction" in value &&
    typeof (value as ApiRoute).toAction === "function"
  );
}
