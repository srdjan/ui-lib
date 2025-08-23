import type { Action, ComponentSpec, Store } from "./types.ts";
import { createStore } from "./store.ts";
import { type HandlerWrapper, patch } from "./patch.ts";

// We keep a tiny imperative adapter for Custom Elements but expose a pure API.

export const defineComponent = <S, P, A extends Action>(
  name: string,
  spec: ComponentSpec<S, P, A>,
): void => {
  if (customElements.get(name)) return; // idempotent

  type AnyPropSpec = {
    readonly attribute?: string | false;
    readonly parse?: (v: unknown) => unknown;
    readonly default?: unknown;
  };
  const propsSpec: Readonly<Record<string, AnyPropSpec>> | null = spec.props
    ? (spec.props as unknown as Readonly<Record<string, AnyPropSpec>>)
    : null;

  class FunctionalElement extends HTMLElement {
    private _store!: Store<S, A>;
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
      this._store = createStore(spec.init(this._props), spec.reducer);
      this._store.subscribe(() => this._scheduleRender());
      this._scheduleRender();
    }

    attributeChangedCallback(): void {
      const nextProps = this._readProps();
      // naive: always re-render on props change
      if (JSON.stringify(nextProps) !== JSON.stringify(this._props)) {
        this._props = nextProps;
        this._scheduleRender();
      }
    }

    disconnectedCallback(): void {
      // No global resources to clean in MVP
    }

    private _scheduleRender(): void {
      queueMicrotask(() => this._render());
    }

    private _wrapHandler: HandlerWrapper = (fn: unknown) => {
      return ((ev: Event) => {
        const result = (fn as any)(ev);
        if (result && typeof result === "object" && "type" in result) {
          this._store.dispatch(result as A);
        }
      }) as EventListener;
    };

    private _render(): void {
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
      const vnode = spec.view(this._store.getState(), {
        ...(this._props as any),
        ...ctx,
      });
      this._mountedNode = patch(
        this._root,
        this._mountedNode,
        vnode,
        this._wrapHandler,
      );
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

    public dispatch(action: Readonly<A>): void {
      this._store.dispatch(action);
    }
  }

  customElements.define(name, FunctionalElement);
};
