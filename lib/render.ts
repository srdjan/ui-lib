import type { DefinedComponent } from "./define-component.ts";

type Renderable = string | number | boolean | null | undefined;

export function render(element: Renderable): string;
export function render<TProps>(
  component: DefinedComponent<TProps>,
  props?: TProps & { children?: unknown },
): string;
export function render(
  input: Renderable | DefinedComponent<any>,
  props?: Record<string, unknown>,
): string {
  if (typeof input === "function" && typeof input.componentName === "string") {
    if (props) {
      return input(props);
    }
    return input();
  }

  if (input == null) return "";

  return String(input);
}
