// JSX Runtime: Direct-to-String Renderer

import { renderActionToString, type ComponentAction } from './actions.ts';
import { escape } from './dom-helpers.ts';

const SELF_CLOSING_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

export function h(tag: string | Function, props: Record<string, any> | null, ...children: any[]) {
  props = props || {};
  
  if (typeof tag === 'function') {
    return tag({ ...props, children });
  }

  let attributes = '';
  for (const [key, value] of Object.entries(props)) {
    if (key === 'children' || value == null || value === false) continue;

    if (key.startsWith('on') && Array.isArray(value)) {
      const handlerString = (value as ComponentAction[])
        .map(renderActionToString)
        .join(';');
      attributes += ` ${key.toLowerCase()}="${escape(handlerString)}"`;
    } else if (typeof value === 'boolean') {
      if (value) attributes += ` ${key}`;
    } else {
      attributes += ` ${key}="${escape(String(value))}"`;
    }
  }
  
  const openTag = `<${tag}${attributes}>`;

  if (SELF_CLOSING_TAGS.has(tag)) {
    return openTag;
  }
  const flattenedChildren = children.flat(Infinity);
  const childrenHtml = flattenedChildren
    .map(child => {
      if (child == null || typeof child === 'boolean') return ''; // Ignore null/undefined/boolean children
      if (typeof child === 'string') return escape(child);
      if (typeof child === 'number') return String(child);
      return child; // Assumes it's already a rendered string (from a nested h call)
    })
    .join('');

  return `${openTag}${childrenHtml}</${tag}>`;
}
