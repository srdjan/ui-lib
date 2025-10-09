import { type ApiMap, generateClientApi } from "./api-generator.ts";
import { spreadAttrs } from "./dom-helpers.ts";

const HX_MARKER: unique symbol = Symbol("ui-lib:hx-options");

export interface HxEnhancementOptions {
  trigger?: string;
  confirm?: string;
  indicator?: string;
  disable?: boolean;
  target?: string;
  swap?: string;
  include?: string | string[];
  vals?: Record<string, unknown>;
  headers?: Record<string, string>;
  attributes?: Record<string, string>;
  pushUrl?: string | boolean;
}

export type TaggedHxOptions = HxEnhancementOptions & {
  readonly __hx: typeof HX_MARKER;
};

export function hx(options: HxEnhancementOptions): TaggedHxOptions {
  return Object.assign({}, options, { __hx: HX_MARKER }) as TaggedHxOptions;
}

export type HxActionMap<TApi extends ApiMap> = {
  // Use any to allow spreading into JSX props in tests and app code
  [K in keyof TApi]: (...args: unknown[]) => any;
};

export function generateClientHx<TApi extends ApiMap>(
  apiMap: TApi,
  defaults: HxEnhancementOptions = {},
): HxActionMap<TApi> {
  const clientApi = generateClientApi(apiMap);
  const entries = Object.entries(clientApi).map(([key, fn]) => {
    const action = (...args: unknown[]) => {
      let hxOptions: HxEnhancementOptions | undefined;
      const hasTagged = args.length > 0 &&
        isTaggedHxOptions(args[args.length - 1]);
      const callArgs = hasTagged ? args.slice(0, -1) : args;
      if (hasTagged) {
        hxOptions = args[args.length - 1] as TaggedHxOptions;
      }
      const attrs = fn(...(callArgs as string[]));
      const enhanced = decorateAttributes(attrs, defaults, hxOptions);
      return spreadAttrs(enhanced);
    };
    return [key, action];
  });

  return Object.fromEntries(entries) as HxActionMap<TApi>;
}

export function decorateAttributes(
  attrs: Record<string, string>,
  defaults: HxEnhancementOptions = {},
  overrides?: HxEnhancementOptions,
): Record<string, string> {
  const merged = { ...attrs };
  [defaults, overrides].forEach((enh) => {
    if (!enh) return;
    applyEnhancements(merged, enh);
  });
  return merged;
}

function applyEnhancements(
  target: Record<string, string>,
  enh: HxEnhancementOptions,
): void {
  if (enh.target) target["hx-target"] = enh.target;
  if (enh.swap) target["hx-swap"] = enh.swap;
  if (enh.trigger) target["hx-trigger"] = enh.trigger;
  if (enh.confirm) target["hx-confirm"] = enh.confirm;
  if (enh.indicator) target["hx-indicator"] = enh.indicator;
  if (enh.disable) target["hx-disable"] = "";
  if (enh.pushUrl !== undefined) {
    target["hx-push-url"] = typeof enh.pushUrl === "boolean"
      ? String(enh.pushUrl)
      : enh.pushUrl;
  }
  if (enh.include) {
    target["hx-include"] = Array.isArray(enh.include)
      ? enh.include.join(",")
      : enh.include;
  }
  if (enh.attributes) {
    Object.assign(target, enh.attributes);
  }
  if (enh.vals && Object.keys(enh.vals).length > 0) {
    const existing = safeParseJson(target["hx-vals"]);
    const mergedVals = { ...existing, ...enh.vals };
    target["hx-vals"] = JSON.stringify(mergedVals);
  }
  if (enh.headers && Object.keys(enh.headers).length > 0) {
    const existingHeaders = safeParseJson(target["hx-headers"]);
    const mergedHeaders = { ...existingHeaders, ...enh.headers };
    target["hx-headers"] = JSON.stringify(mergedHeaders);
  }
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

function isTaggedHxOptions(value: unknown): value is TaggedHxOptions {
  return typeof value === "object" && value !== null &&
    (value as TaggedHxOptions).__hx === HX_MARKER;
}

// Sugar: call a generated API function in a way that reads like a semantic action
export function onAction<T extends (...args: any[]) => string>(
  fn: T,
  ...args: Parameters<T>
): string {
  return fn(...(args as any[]));
}

// Helper to create an Item-compatible action object (no hx in app code)
export type ItemActionLike = {
  readonly text: string;
  readonly attributes: string;
  readonly confirm?: string;
  readonly variant?: string;
};

export function itemAction<T extends (...args: any[]) => string>(
  fn: T,
  text: string,
  args: Parameters<T>,
  options?: { confirm?: string; variant?: string },
): ItemActionLike {
  const attributes = fn(...(args as any[]));
  return {
    text,
    attributes,
    ...(options?.confirm ? { confirm: options.confirm } : {}),
    ...(options?.variant ? { variant: options.variant } : {}),
  };
}
