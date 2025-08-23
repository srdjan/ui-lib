import type { Action, ComponentSpec } from "./types.ts";
import { createEffect, createSignal } from "./signals.ts";

// signals-based defineComponent consuming real DOM nodes from JSX runtime
export const defineComponent = <S, P, A extends Action>(
  name: string,
  spec: ComponentSpec<S, P, A>,
): void => {
  if (customElements.get(name)) return;

  type AnyPropSpec = {
    readonly attribute?: string | false;
    readonly parse?: (v: unknown) => unknown;
    readonly default?: unknown;
  };
  const propsSpec: Readonly<Record<string, AnyPropSpec>> | null = spec.props
    ? (spec.props as unknown as Readonly<Record<string, AnyPropSpec>>)
    : null;

  class FunctionalElement extends HTMLElement {
    private _props!: P;
    private _root!: ShadowRoot;
    private _mountedNode: Node | null = null;

    static get observedAttributes(): string[] {
      const ps = propsSpec;
      if (!ps) return [];
      return Object.values(ps)
        .map((v) => (v && v.attribute ? String(v.attribute) : null))
        .filter((x): x is string => !!x);
    }

    connectedCallback(): void {
      if (!this.shadowRoot) this._root = this.attachShadow({ mode: "open" });
      else this._root = this.shadowRoot;

      if (
        spec.styles && (this._root as any).adoptedStyleSheets &&
        spec.styles.every((s) => s instanceof CSSStyleSheet)
      ) {
        (this._root as any).adoptedStyleSheets = spec.styles as CSSStyleSheet[];
      } else if (spec.styles && spec.styles.length) {
        const styleEl = document.createElement("style");
        styleEl.textContent = (spec.styles as (string | CSSStyleSheet)[])
          .map((s) =>
            typeof s === "string"
              ? s
              : Array.from((s as CSSStyleSheet).cssRules).map((r) => r.cssText)
                .join("\n")
          )
          .join("\n");
        this._root.appendChild(styleEl);
      }

      this._props = this._readProps();

      const [getState, setState] = createSignal<S>(spec.init(this._props));

      const dispatch = (action: Readonly<A>) => {
        const next = spec.update(getState(), action);
        setState(next);
      };

      const ctx = {
        emit: (name: string, detail?: unknown, options?: CustomEventInit) =>
          this.dispatchEvent(
            new CustomEvent(name, {
              detail,
              composed: true,
              bubbles: true,
              ...options,
            }),
          ),
      };

      // For event handlers attached in JSX, we use a capturing listener on root to translate
      // handler results (Action) into dispatches. This keeps handlers pure.
      const wrapHandler = (fn: unknown) => (ev: Event) => {
        const result = (fn as any)(ev);
        if (result && typeof result === "object" && "type" in result) {
          dispatch(result as A);
        }
      };

      createEffect(async () => {
        // Provide current dispatch to JSX runtime wrapper
        try {
          const runtime = await import("../lib/jsx-runtime.ts");
          (runtime as any).setCurrentDispatch((a: unknown) => dispatch(a as A));
        } catch {
          // ignore if runtime not present
        }
        const node = spec.view(getState(), { ...(this._props as any), ...ctx });
        if (this._mountedNode === null) {
          this._mountedNode = node;
          this._root.appendChild(node);
        } else if (this._mountedNode !== node) {
          this._root.replaceChild(node, this._mountedNode);
          this._mountedNode = node;
        }
      });
    }

    attributeChangedCallback(): void {
      const nextProps = this._readProps();
      if (JSON.stringify(nextProps) !== JSON.stringify(this._props)) {
        this._props = nextProps;
      }
    }

    private _readProps(): P {
      const out: Record<string, unknown> = {};
      const ps = propsSpec;
      if (ps) {
        for (const [key, specProp] of Object.entries(ps)) {
          if (specProp?.attribute) {
            const raw = this.getAttribute(specProp.attribute);
            const parsed = specProp.parse ? specProp.parse(raw) : raw;
            out[key] = parsed ?? specProp.default;
          } else if (specProp?.default !== undefined) {
            out[key] = specProp.default;
          }
        }
      }
      return out as P;
    }
  }

  customElements.define(name, FunctionalElement);
};
