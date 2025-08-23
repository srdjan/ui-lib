import type { VNode } from "./types.ts";

// Minimal diff/patch engine for MVP

export type HandlerWrapper = (fn: unknown) => EventListener;

export const renderVNode = (
  vnode: VNode,
  handlerWrapper: HandlerWrapper,
  doc: Document = document,
): Node => {
  switch (vnode.type) {
    case "text":
      return doc.createTextNode(vnode.text);
    case "element": {
      const el = doc.createElement(vnode.tag);
      applyProps(el, vnode.props, handlerWrapper);
      if (vnode.children) {
        for (const c of vnode.children) {
          el.appendChild(renderVNode(c, handlerWrapper, doc));
        }
      }
      return el;
    }
  }
};

export const patch = (
  parent: Node,
  oldNode: Node | null,
  vnode: VNode,
  handlerWrapper: HandlerWrapper,
): Node => {
  const newNode = renderVNode(vnode, handlerWrapper);
  if (!oldNode) {
    parent.appendChild(newNode);
  } else {
    parent.replaceChild(newNode, oldNode);
  }
  return newNode;
};

const isEventProp = (k: string) =>
  k.startsWith("on") && k[2] === k[2]?.toUpperCase();

const applyProps = (
  el: Element,
  props: Readonly<Record<string, unknown>> | undefined,
  handlerWrapper: HandlerWrapper,
): void => {
  if (!props) return;
  for (const [key, value] of Object.entries(props)) {
    if (isEventProp(key)) {
      const eventName = key.slice(2).toLowerCase();
      if (typeof value === "function") {
        // We wrap to convert handler return Action into dispatch calls.
        el.addEventListener(eventName, handlerWrapper(value));
      }
      continue;
    }
    if (key === "class" || key === "className") {
      (el as HTMLElement).className = String(value ?? "");
      continue;
    }
    if (key === "style" && typeof value === "object" && value !== null) {
      Object.assign((el as HTMLElement).style, value);
      continue;
    }
    // Prefer property if exists, else attribute
    if (key in (el as any)) {
      (el as any)[key] = value;
    } else if (value === true) {
      el.setAttribute(key, "");
    } else if (value === false || value == null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, String(value));
    }
  }
};
