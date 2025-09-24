// JSX Runtime: Direct-to-String Renderer with Type-Safe Event Handling and ui-lib Component Support

import type { ComponentAction } from "./actions.ts";
import type { HxActionMap } from "./api-recipes.ts";
import { parseActionPlan, resolveActionTarget } from "./action-dsl.ts";
import { renderComponent } from "./component-state.ts";
import { escape, spreadAttrs } from "./dom-helpers.ts";
import { parseArgumentList } from "./expression-args.ts";
import { normalizeClass, normalizeStyle } from "./jsx-normalize.ts";
import { getRegistry } from "./registry.ts";

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

  const consumedProps = new Set<string>();
  let inferredActionAttrs: string | undefined;

  if (props && typeof props === "object" && "action" in props) {
    const actionValue = props.action;
    if (typeof actionValue === "string" && actionValue.trim().length > 0) {
      const overrides = {
        target: typeof props.target === "string" ? props.target : undefined,
        swap: typeof props.swap === "string" ? props.swap : undefined,
      };
      inferredActionAttrs = buildActionAttributes(actionValue, overrides);
      if (inferredActionAttrs) {
        consumedProps.add("action");
        if (overrides.target !== undefined) consumedProps.add("target");
        if (overrides.swap !== undefined) consumedProps.add("swap");
      }
    }
  }

  if (typeof tag === "function") {
    const fn = tag as (p: Record<string, unknown>) => string;
    return fn({ ...props, children });
  }

  // Check if this is a ui-lib component (kebab-case tag name)
  if (typeof tag === "string" && isKebabCase(tag)) {
    const registry = getRegistry();

    if (registry[tag]) {
      // Registered ui-lib component: render immediately to HTML
      // IMPORTANT: SSR path - pass raw typed props through
      const ssrProps = { ...(props as Record<string, unknown>) };

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
        (ssrProps as any).children = childrenHtml;
      }

      return renderComponent(tag, ssrProps);
    }
  }

  let attributes = "";
  let dangerousInnerHTML = "";
  for (const [key, value] of Object.entries(props)) {
    if (key === "children" || value == null || value === false) continue;
    if (consumedProps.has(key)) continue;

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

  if (inferredActionAttrs) {
    attributes += ` ${inferredActionAttrs}`;
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

function buildActionAttributes(
  actionValue: string,
  overrides: { target?: string; swap?: string },
): string | undefined {
  const plan = parseActionPlan(actionValue);
  if (!plan) {
    console.warn(`ui-lib: unable to parse action expression "${actionValue}"`);
    return undefined;
  }

  if (plan.calls.length === 0) return undefined;

  if (plan.calls.length > 1) {
    console.warn(
      "ui-lib: action sequences are not yet supported; ignoring extra calls",
    );
    return undefined;
  }

  const call = plan.calls[0];
  const context = getCurrentContext();
  const apiMethod = context?.apiMap?.[call.name];

  if (!apiMethod) {
    console.warn(`ui-lib: action method "${call.name}" not found in API map`);
    return undefined;
  }

  let apiResult: unknown;
  try {
    apiResult = apiMethod(...call.args);
  } catch (error) {
    console.warn(
      `ui-lib: failed to invoke action method "${call.name}"`,
      error,
    );
    return undefined;
  }

  let attrsRecord: Record<string, string> = {};
  if (typeof apiResult === "string") {
    attrsRecord = parseAttributeString(apiResult);
  } else if (apiResult && typeof apiResult === "object") {
    attrsRecord = Object.fromEntries(
      Object.entries(apiResult as Record<string, unknown>).map(([
        key,
        value,
      ]) => [key, String(value)]),
    );
  }

  const hxVals = safeParseJson(attrsRecord["hx-vals"]);
  hxVals.args = call.args.map((arg) => {
    const serialized = serializeForJson(arg);
    return serialized === undefined ? null : serialized;
  });
  attrsRecord["hx-vals"] = JSON.stringify(hxVals);

  const resolvedTarget = resolveActionTarget(overrides.target);
  if (resolvedTarget) {
    attrsRecord["hx-target"] = resolvedTarget;
  }

  if (overrides.swap) {
    attrsRecord["hx-swap"] = overrides.swap;
  }

  return spreadAttrs(attrsRecord);
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
      const methodName = descriptor.api || descriptor.method ||
        descriptor.action;

      let apiResult = "";
      if (typeof methodName === "string") {
        apiResult = invokeApiMethod(methodName, descriptor.args ?? []) || "";
      }

      let attributesResult = "";
      if (descriptor.attributes) {
        attributesResult = spreadAttrs(descriptor.attributes);
      }

      // Merge API result and attributes intelligently
      if (apiResult && attributesResult) {
        return mergeHtmxAttributes(apiResult, attributesResult);
      }
      return apiResult || attributesResult;
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

/**
 * Merge two HTMX attribute strings, with the second taking precedence for duplicates
 */
function mergeHtmxAttributes(first: string, second: string): string {
  const firstAttrs = parseAttributeString(first);
  const secondAttrs = parseAttributeString(second);

  // Merge with second taking precedence
  const merged = { ...firstAttrs, ...secondAttrs };

  return Object.entries(merged)
    .map(([key, value]) => `${key}="${escape(String(value))}"`)
    .join(" ");
}

/**
 * Parse an attribute string like 'hx-delete="/api/todos/1" hx-swap="outerHTML"'
 * into an object like { "hx-delete": "/api/todos/1", "hx-swap": "outerHTML" }
 */
function parseAttributeString(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};

  // Match attribute="value" patterns, handling escaped quotes
  const attrRegex = /(\w+(?:-\w+)*)="([^"]*)"/g;
  let match;

  while ((match = attrRegex.exec(attrString)) !== null) {
    const [, key, value] = match;
    attrs[key] = value;
  }

  return attrs;
}

function safeParseJson(value: string | undefined): Record<string, unknown> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" && parsed !== null
      ? parsed as Record<string, unknown>
      : {};
  } catch {
    return {};
  }
}

function serializeForJson(value: unknown): unknown {
  if (value === undefined) return null;
  if (value === null) return null;
  if (Array.isArray(value)) {
    return value.map((entry) => {
      const serialized = serializeForJson(entry);
      return serialized === undefined ? null : serialized;
    });
  }
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      const serialized = serializeForJson(entry);
      if (serialized !== undefined) {
        result[key] = serialized;
      }
    }
    return result;
  }
  if (typeof value === "function") return undefined;
  if (typeof value === "symbol") return String(value);
  return value;
}

function isAttributeRecord(value: object): boolean {
  const keys = Object.keys(value);
  if (keys.length === 0) return false;
  let hasAttributePrefix = false;
  for (const key of keys) {
    if (!/^[a-z0-9:-]+$/i.test(key)) return false;
    if (
      key.startsWith("hx-") || key.startsWith("data-") ||
      key.startsWith("aria-")
    ) {
      hasAttributePrefix = true;
    }
  }
  return hasAttributePrefix;
}
