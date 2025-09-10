/**
 * Open Props Component Adapter
 * Adapts library components to use Open Props design tokens and maintain existing styling
 */

import { Button as LibButton } from "../../../lib/components/button/button.ts";
import { Input as LibInput } from "../../../lib/components/input/input.ts";
import { Alert as LibAlert } from "../../../lib/components/feedback/alert.ts";

/**
 * Wrapper for Button component that uses Open Props styling
 */
export function Button(props: any): string {
  // Extract Open Props classes and merge with component styles
  const openPropsClass = props.className || "";
  const componentHtml = LibButton({
    ...props,
    className: `${openPropsClass} open-props-button`
  });
  
  // Extract and combine styles
  const styleMatch = componentHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/g);
  const componentStyles = styleMatch ? styleMatch.join('\n') : '';
  const html = componentHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '').trim();
  
  return `${html}${componentStyles}`;
}

/**
 * Wrapper for Input component that uses Open Props styling
 */
export function Input(props: any): string {
  const openPropsClass = props.className || "";
  const componentHtml = LibInput({
    ...props,
    className: `${openPropsClass} open-props-input`
  });
  
  const styleMatch = componentHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/g);
  const componentStyles = styleMatch ? styleMatch.join('\n') : '';
  const html = componentHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '').trim();
  
  return `${html}${componentStyles}`;
}

/**
 * Wrapper for Alert component that uses Open Props styling
 */
export function Alert(props: any): string {
  const openPropsClass = props.className || "";
  const componentHtml = LibAlert({
    ...props,
    className: `${openPropsClass} open-props-alert`
  });
  
  const styleMatch = componentHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/g);
  const componentStyles = styleMatch ? styleMatch.join('\n') : '';
  const html = componentHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '').trim();
  
  return `${html}${componentStyles}`;
}

/**
 * Get Open Props integration styles
 */
export function getOpenPropsIntegrationStyles(): string {
  return `
    <style>
    /* Open Props integration for library components */
    .open-props-button {
      /* Ensure library buttons work well with Open Props */
      font-family: var(--font-sans);
      border-radius: var(--radius-2);
      transition: all var(--animation-fade-in);
    }
    
    .open-props-input {
      /* Ensure library inputs work well with Open Props */
      font-family: var(--font-sans);
      border-radius: var(--radius-2);
      transition: all var(--animation-fade-in);
    }
    
    .open-props-input:focus {
      outline: var(--border-size-2) solid var(--blue-6);
      outline-offset: var(--border-size-1);
    }
    
    .open-props-alert {
      /* Ensure library alerts work well with Open Props */
      font-family: var(--font-sans);
      border-radius: var(--radius-2);
    }
    
    /* Forms layout using Open Props */
    .forms-card .open-props-button,
    .forms-card .open-props-input,
    .forms-card .open-props-alert {
      /* Inherit the beautiful Open Props styling from parent */
      color: inherit;
    }
    </style>
  `;
}