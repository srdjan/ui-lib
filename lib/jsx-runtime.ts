// JSX Runtime: Direct-to-String Renderer with Type-Safe Event Handling

import type { ComponentAction } from "./actions.ts";
import { escape } from "./dom-helpers.ts";

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

// Type-safe event handler that can accept ComponentAction directly
type EventHandler = ComponentAction | string;

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

  let attributes = "";
  let dangerousInnerHTML = "";
  for (const [key, value] of Object.entries(props)) {
    if (key === "children" || value == null || value === false) continue;

    if (key === "dangerouslySetInnerHTML" && isDangerousInnerHTML(value)) {
      dangerousInnerHTML = String(value.__html);
      continue;
    }

    if (key.startsWith("on")) {
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
