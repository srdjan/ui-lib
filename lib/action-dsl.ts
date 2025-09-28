import { deserializeArgument, splitArguments } from "./expression-args.ts";

export type ActionCall = {
  readonly name: string;
  readonly args: readonly unknown[];
};

export type ParsedAction =
  | { readonly kind: "single"; readonly action: ActionCall }
  | { readonly kind: "sequence"; readonly actions: readonly ActionCall[] };

export type ActionPlan = {
  readonly calls: readonly ActionCall[];
  readonly modifiers: readonly ActionModifier[];
};

export type ActionModifier =
  | { readonly type: "delay"; readonly ms: number }
  | { readonly type: "optimistic"; readonly value: unknown }
  | {
    readonly type: "unknown";
    readonly name: string;
    readonly value?: unknown;
  };

export function parseActionPlan(raw: string): ActionPlan | undefined {
  const parsed = parseActionExpression(raw);
  if (!parsed) return undefined;

  switch (parsed.kind) {
    case "single":
      return { calls: [parsed.action], modifiers: [] };
    case "sequence":
      return { calls: parsed.actions, modifiers: [] };
  }
}

export function parseActionExpression(input: string): ParsedAction | undefined {
  const normalized = input.trim();
  if (!normalized) return undefined;

  if (normalized.startsWith("sequence")) {
    const call = parseInvocation(normalized);
    if (!call || call.name !== "sequence") return undefined;
    const nested = call.args
      .map((arg) => typeof arg === "string" ? parseInvocation(arg) : undefined)
      .filter((value): value is ActionCall => Boolean(value));
    if (nested.length === 0) return undefined;
    return { kind: "sequence", actions: nested };
  }

  const single = parseInvocation(normalized);
  if (!single) return undefined;
  return { kind: "single", action: single };
}

function parseInvocation(source: string): ActionCall | undefined {
  const trimmed = source.trim();
  if (!trimmed) return undefined;

  const openIndex = trimmed.indexOf("(");
  if (openIndex === -1 || !trimmed.endsWith(")")) return undefined;

  const name = trimmed.slice(0, openIndex).trim();
  if (!isIdentifier(name)) return undefined;

  const inner = trimmed.slice(openIndex + 1, -1);
  if (!inner.trim()) return { name, args: [] };

  const argSegments = splitArguments(inner);
  const args = argSegments.map((segment) => {
    const value = segment.trim();
    if (!value) return undefined;
    if (isInvocation(value)) return value;
    return deserializeArgument(value);
  }).filter((arg): arg is unknown => arg !== undefined);

  return { name, args };
}

function isInvocation(value: string): boolean {
  const idx = value.indexOf("(");
  return idx > 0 && value.trim().endsWith(")");
}

function isIdentifier(value: string): boolean {
  return /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(value);
}

export function resolveActionTarget(
  value: string | undefined,
): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("role:")) {
    const roleName = trimmed.slice("role:".length).trim();
    if (!roleName) return undefined;
    return `[data-role="${roleName}"]`;
  }
  return trimmed;
}
