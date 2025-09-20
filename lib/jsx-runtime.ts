// JSX Runtime: Direct-to-String Renderer with Type-Safe Event Handling and ui-lib Component Support

import type { ComponentAction } from "./actions.ts";
import { escape, spreadAttrs } from "./dom-helpers.ts";
import { getRegistry } from "./registry.ts";
import { renderComponent } from "./component-state.ts";
import { normalizeClass, normalizeStyle } from "./jsx-normalize.ts";
import type { HxActionMap } from "./api-recipes.ts";

const SELF_CLOSING_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

// Component rendering context for API integration
interface RenderContext {
  apiMap?: HxActionMap<any>;
  componentId?: string;
}

// Global context stack for nested component rendering
let contextStack: RenderContext[] = [];

// Set current component context (used by component-state.ts)
export function setRenderContext(context: RenderContext) {
  contextStack.push(context);
}

// Clear current component context
export function clearRenderContext() {
  contextStack.pop();
}

// Get current component context
function getCurrentContext(): RenderContext | undefined {
  return contextStack[contextStack.length - 1];
}

// Type-safe event handler that can accept ComponentAction directly
type EventHandler = ComponentAction | string;

// Helper function to detect if a tag is a ui-lib component (kebab-case)
function isKebabCase(tag: string): boolean {
  return tag.includes("-") && tag === tag.toLowerCase();
}

// Helper function to convert JSX props to ui-lib props format
function convertJSXPropsToFuncwcProps(
  props: Record<string, unknown>,
): Record<string, unknown> {
  const converted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (key === "children") continue;

    // Convert camelCase to kebab-case for attribute names
    const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();

    // Convert values to strings as ui-lib expects from HTML attributes
    if (value === true) {
      converted[kebabKey] = "";
    } else if (value === false || value == null) {
      // Skip false/null values
      continue;
    } else {
      converted[kebabKey] = String(value);
    }
  }

  return converted;
}

// Fragment component for JSX
export function Fragment(props: { children?: unknown[] }): string {
  return props.children?.flat(Infinity).join("") || "";
}

export function h(
  tag: string,
  props: Record<string, unknown> | null,
  ...children: unknown[]
): string;
export function h<P extends Record<string, unknown>>(
  tag: (props: P & { children?: unknown[] }) => string,
  props: P,
  ...children: unknown[]
): string;
export function h(
  tag: string | ((props: Record<string, unknown>) => string),
  props: Record<string, unknown> | null,
  ...children: unknown[]
): string {
  props = props || {};

  if (typeof tag === "function") {
    const fn = tag as (p: Record<string, unknown>) => string;
    return fn({ ...props, children });
  }

  // Check if this is a ui-lib component (kebab-case tag name)
  if (typeof tag === "string" && isKebabCase(tag)) {
    const registry = getRegistry();

    if (registry[tag]) {
      // Registered ui-lib component: render immediately to HTML
      const funcwcProps = convertJSXPropsToFuncwcProps(props);

      // Flatten and stringify children
      let childrenHtml = "";
      if (children.length > 0) {
        childrenHtml = children
          .flat(Infinity)
          .filter((child) => child != null && typeof child !== "boolean")
          .map((child) => String(child))
          .join("");
      }

      // Pass children through to component render
      if (childrenHtml) {
        (funcwcProps as any).children = childrenHtml;
      }

      return renderComponent(tag, funcwcProps);
    }
  }

  let attributes = "";
  let dangerousInnerHTML = "";
  for (const [key, value] of Object.entries(props)) {
    if (key === "children" || value == null || value === false) continue;

    if (key === "dangerouslySetInnerHTML" && isDangerousInnerHTML(value)) {
      dangerousInnerHTML = String(value.__html);
      continue;
    }

    if (key === "class" || key === "className") {
      const className = normalizeClass(value);
      if (className) {
        attributes += ` class="${escape(className)}"`;
      }
    } else if (key === "style") {
      const style = normalizeStyle(value);
      if (style) {
        attributes += ` style="${escape(style)}"`;
      }
    } else if (key === "onAction") {
      const htmxAttrs = renderOnAction(value);
      if (htmxAttrs) {
        attributes += ` ${htmxAttrs}`;
      }
    } else if (key.startsWith("on")) {
      let handlerString = "";

      if (typeof value === "string") {
        handlerString = value;
      } else if (typeof value === "object" && value && "type" in value) {
        // Direct ComponentAction object
        handlerString = renderActionToString(value as ComponentAction);
      }

      // For event handlers, we need lighter escaping (only quotes)
      const escapedHandler = handlerString.replace(/"/g, "&quot;");
      attributes += ` ${key.toLowerCase()}="${escapedHandler}"`;
    } else if (typeof value === "boolean") {
      if (value) attributes += ` ${key}`;
    } else {
      attributes += ` ${key}="${escape(String(value))}"`;
    }
  }

  const openTag = `<${tag}${attributes}>`;

  if (SELF_CLOSING_TAGS.has(tag)) {
    return openTag;
  }
  // If dangerouslySetInnerHTML is provided, use that instead of children
  if (dangerousInnerHTML) {
    return `${openTag}${dangerousInnerHTML}</${tag}>`;
  }

  const flattenedChildren = children.flat(Infinity);
  const childrenHtml = flattenedChildren
    .map((child) => {
      if (child == null || typeof child === "boolean") return ""; // Ignore null/undefined/boolean children
      if (typeof child === "number") return String(child);
      if (typeof child === "string") {
        // Check if it's already rendered HTML element from nested h calls
        // Must start with '<', end with '>', and be either self-closing or have proper closing tag structure
        const tagMatch = child.match(/^<([a-zA-Z][a-zA-Z0-9-]*)/);
        const tagName = tagMatch ? tagMatch[1] : "";

        const looksLikeHtml = child.startsWith("<") && child.endsWith(">");
        const isSelfClosing = /^<[a-zA-Z][^>]*\/>$/.test(child);
        const isKnownSelfClosing = SELF_CLOSING_TAGS.has(tagName) &&
          /^<[a-zA-Z][^>]*>$/.test(child);
        const isNormalElement = /^<[a-zA-Z][^>]*>[\s\S]*<\/[a-zA-Z][^>]*>$/
          .test(child);
        const isScriptTag = /^<script\b[^>]*>[\s\S]*<\/script>$/.test(child);

        if (
          looksLikeHtml &&
          (isSelfClosing || isKnownSelfClosing || isNormalElement ||
            isScriptTag)
        ) {
          return child; // Already-rendered HTML (including explicit <script> tags)
        }
        return escape(child); // Plain text content
      }
      return child; // Assumes it's already a rendered string (from a nested h call)
    })
    .join("");

  return `${openTag}${childrenHtml}</${tag}>`;
}

// Narrowing helper for dangerouslySetInnerHTML objects
function isDangerousInnerHTML(value: unknown): value is { __html: unknown } {
  return typeof value === "object" && value !== null && "__html" in value;
}

// Helper function to render ComponentActions to strings
function renderActionToString(action: ComponentAction): string {
  switch (action.type) {
    case "toggleClass":
      return `this.classList.toggle('${action.className}')`;
    case "toggleClasses":
      return action.classNames.map((c) => `this.classList.toggle('${c}')`).join(
        ";",
      );
    case "chain":
      return action.actions.map(renderActionToString).join(";");
    default:
      return "";
  }
}

// Helper function to parse action strings and convert to HTMX attributes
function renderOnAction(value: unknown): string {
  const resolved = resolveOnAction(value);
  return resolved ?? "";
}

type OnActionDescriptor = {
  api?: string;
  method?: string;
  action?: string;
  args?: unknown[];
  attributes?: Record<string, unknown>;
};

function resolveOnAction(value: unknown): string | undefined {
  if (value == null) return undefined;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    if (trimmed.startsWith("api.")) {
      return resolveActionExpression(trimmed);
    }
    if (
      /\bhx-/.test(trimmed) || trimmed.startsWith("data-") ||
      trimmed.startsWith("aria-")
    ) {
      return trimmed;
    }
    return undefined;
  }

  if (Array.isArray(value)) {
    const [methodName, ...args] = value;
    if (typeof methodName === "string") {
      return invokeApiMethod(methodName, args);
    }
    return undefined;
  }

  if (typeof value === "object") {
    if (isActionDescriptor(value)) {
      const descriptor = value as OnActionDescriptor;
      if (descriptor.attributes) {
        return spreadAttrs(descriptor.attributes);
      }
      const methodName = descriptor.api || descriptor.method ||
        descriptor.action;
      if (typeof methodName === "string") {
        return invokeApiMethod(methodName, descriptor.args ?? []);
      }
    } else if (isAttributeRecord(value)) {
      return spreadAttrs(value as Record<string, unknown>);
    }
  }

  return undefined;
}

function resolveActionExpression(expression: string): string | undefined {
  const match = expression.match(/^api\.(\w+)\((.*)\)$/);
  if (!match) return undefined;

  const [, methodName, rawArgs] = match;
  const args = parseArgumentList(rawArgs);
  return invokeApiMethod(methodName, args);
}

function invokeApiMethod(
  methodName: string,
  args: unknown[],
): string | undefined {
  const context = getCurrentContext();
  const apiMethod = context?.apiMap?.[methodName];

  if (!apiMethod) {
    console.warn(
      `ui-lib: onAction method "${methodName}" not found in API map`,
    );
    return undefined;
  }

  try {
    const result = apiMethod(...args);
    if (typeof result === "string") return result.trim();
    if (result && typeof result === "object") {
      return spreadAttrs(result as Record<string, unknown>);
    }
  } catch (error) {
    console.warn(
      `ui-lib: failed to invoke onAction method "${methodName}"`,
      error,
    );
  }
  return undefined;
}

function isActionDescriptor(value: object): value is OnActionDescriptor {
  return "api" in value || "method" in value || "action" in value ||
    "attributes" in value;
}

function isAttributeRecord(value: object): boolean {
  return Object.keys(value).every((key) => /^[a-z0-9:-]+$/i.test(key));
}

function parseArgumentList(argsString: string): unknown[] {
  const trimmed = argsString.trim();
  if (!trimmed) return [];

  const segments = splitArguments(trimmed);
  return segments.map(deserializeArgument);
}

function splitArguments(source: string): string[] {
  const segments: string[] = [];
  let current = "";
  let depthParen = 0;
  let depthBrace = 0;
  let depthBracket = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escaped = false;

  for (let i = 0; i < source.length; i++) {
    const char = source[i];

    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === "\\" && (inSingle || inDouble || inTemplate)) {
      current += char;
      escaped = true;
      continue;
    }

    if (char === "'" && !inDouble && !inTemplate) {
      inSingle = !inSingle;
      current += char;
      continue;
    }

    if (char === '"' && !inSingle && !inTemplate) {
      inDouble = !inDouble;
      current += char;
      continue;
    }

    if (char === "`" && !inSingle && !inDouble) {
      inTemplate = !inTemplate;
      current += char;
      continue;
    }

    if (!inSingle && !inDouble && !inTemplate) {
      if (char === "(") depthParen++;
      if (char === ")") depthParen--;
      if (char === "{") depthBrace++;
      if (char === "}") depthBrace--;
      if (char === "[") depthBracket++;
      if (char === "]") depthBracket--;

      if (
        char === "," && depthParen === 0 && depthBrace === 0 &&
        depthBracket === 0
      ) {
        segments.push(current.trim());
        current = "";
        continue;
      }
    }

    current += char;
  }

  if (current.trim().length > 0) {
    segments.push(current.trim());
  }

  return segments.filter((segment) => segment.length > 0);
}

function deserializeArgument(raw: string): unknown {
  const value = raw.trim();
  if (!value) return undefined;

  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    return unescapeQuoted(value.slice(1, -1), value[0]);
  }

  if (value === "true" || value === "false") {
    return value === "true";
  }

  if (value === "null") return null;
  if (value === "undefined") return undefined;

  const num = Number(value);
  if (!Number.isNaN(num)) return num;

  return value;
}

function unescapeQuoted(value: string, quote: string): string {
  const pattern = quote === '"' ? /\\"/g : /\\'/g;
  return value.replace(/\\\\/g, "\\").replace(pattern, quote);
}
