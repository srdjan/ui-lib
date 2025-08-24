// JSX Runtime: Direct-to-String Renderer with Type-Safe Event Handling

import { type ComponentAction } from './actions.ts';
import { escape } from './dom-helpers.ts';

const SELF_CLOSING_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

// Type-safe event handler that can accept ComponentAction directly
type EventHandler = ComponentAction | string;

// Fragment component for JSX
export function Fragment(props: { children?: any[] }): string {
  return props.children?.flat(Infinity).join('') || '';
}

export function h(tag: string | Function, props: Record<string, any> | null, ...children: any[]): string {
  props = props || {};
  
  if (typeof tag === 'function') {
    return tag({ ...props, children });
  }

  let attributes = '';
  for (const [key, value] of Object.entries(props)) {
    if (key === 'children' || value == null || value === false) continue;

    if (key.startsWith('on')) {
      let handlerString = '';
      
      if (typeof value === 'string') {
        handlerString = value;
      } else if (typeof value === 'object' && value.type) {
        // Direct ComponentAction object
        handlerString = renderActionToString(value as ComponentAction);
      } else if (Array.isArray(value)) {
        // Legacy array support (deprecated)
        handlerString = (value as ComponentAction[])
          .map(renderActionToString)
          .join(';');
      }
      
      // For event handlers, we need lighter escaping (only quotes)
      const escapedHandler = handlerString.replace(/"/g, '&quot;');
      attributes += ` ${key.toLowerCase()}="${escapedHandler}"`;
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
      if (typeof child === 'number') return String(child);
      if (typeof child === 'string') {
        // Check if it's already rendered HTML element from nested h calls
        // Must start with '<', end with '>', and contain proper closing tag structure
        if (child.startsWith('<') && child.endsWith('>') && 
            child.match(/^<[a-zA-Z][^>]*>.*<\/[a-zA-Z][^>]*>$/) &&
            !child.includes('<script')) { // Extra safety check
          return child; // Already rendered HTML from nested h calls
        } else {
          return escape(child); // Plain text content
        }
      }
      return child; // Assumes it's already a rendered string (from a nested h call)
    })
    .join('');

  return `${openTag}${childrenHtml}</${tag}>`;
}

// Helper function to render ComponentActions to strings
function renderActionToString(action: ComponentAction): string {
  switch (action.type) {
    case "toggleClass": 
      return `this.classList.toggle('${action.className}')`;
    case "toggleClasses": 
      return action.classNames.map(c => `this.classList.toggle('${c}')`).join(';');
    case "updateParentCounter": 
      return `const p=this.closest('${action.parentSelector}');if(p){const c=p.querySelector('${action.counterSelector}');if(c){const v=parseInt(c.textContent||0)+${action.delta};c.textContent=v;if(p.dataset)p.dataset.count=v;}}`.replace(/\s+/g, ' ');
    case "resetCounter": 
      return `const C=this.closest('${action.containerSelector||'.counter'}');if(C){const D=C.querySelector('${action.displaySelector}');if(D)D.textContent='${action.initialValue}';if(C.dataset)C.dataset.count='${action.initialValue}'}`.replace(/\s+/g, ' ');
    case "activateTab": 
      return `const C=this.closest('${action.container}');if(!C)return;const K=this.dataset.tab;C.querySelectorAll('${action.buttons}').forEach(b=>b.classList.remove('${action.activeClass}'));this.classList.add('${action.activeClass}');C.querySelectorAll('${action.content}').forEach(c=>c.classList.remove('${action.activeClass}'));const A=C.querySelector("[data-tab='"+K+"']");if(A)A.classList.add('${action.activeClass}');if(C.dataset)C.dataset.active=K;`.replace(/\s+/g, ' ');
    case "toggleParentClass": 
      return `this.parentElement.classList.toggle('${action.className}')`;
    case "syncCheckbox": 
      return `this.closest('.todo,[data-todo]').classList.toggle('${action.className}',this.checked)`;
    default: 
      return '';
  }
}
