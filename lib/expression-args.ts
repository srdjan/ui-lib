// Utility helpers for parsing JavaScript-like argument lists used in JSX DSLs
// Supports numbers, booleans, null/undefined, quoted strings, and raw tokens.

export type ParsedArgument = unknown;

export function parseArgumentList(argsString: string): ParsedArgument[] {
  const trimmed = argsString.trim();
  if (!trimmed) return [];

  const segments = splitArguments(trimmed);
  return segments.map(deserializeArgument);
}

export function splitArguments(source: string): string[] {
  const segments: string[] = [];
  let current = "";
  let depthParen = 0;
  let depthBrace = 0;
  let depthBracket = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escaped = false;

  for (let i = 0; i < source.length; i++) {
    const char = source[i];

    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === "\\" && (inSingle || inDouble || inTemplate)) {
      current += char;
      escaped = true;
      continue;
    }

    if (char === "'" && !inDouble && !inTemplate) {
      inSingle = !inSingle;
      current += char;
      continue;
    }

    if (char === '"' && !inSingle && !inTemplate) {
      inDouble = !inDouble;
      current += char;
      continue;
    }

    if (char === "`" && !inSingle && !inDouble) {
      inTemplate = !inTemplate;
      current += char;
      continue;
    }

    if (!inSingle && !inDouble && !inTemplate) {
      if (char === "(") depthParen++;
      if (char === ")") depthParen--;
      if (char === "{") depthBrace++;
      if (char === "}") depthBrace--;
      if (char === "[") depthBracket++;
      if (char === "]") depthBracket--;

      if (
        char === "," && depthParen === 0 && depthBrace === 0 &&
        depthBracket === 0
      ) {
        segments.push(current.trim());
        current = "";
        continue;
      }
    }

    current += char;
  }

  if (current.trim().length > 0) {
    segments.push(current.trim());
  }

  return segments.filter((segment) => segment.length > 0);
}

export function deserializeArgument(raw: string): ParsedArgument {
  const value = raw.trim();
  if (!value) return undefined;

  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    return unescapeQuoted(value.slice(1, -1), value[0]);
  }

  if (value === "true" || value === "false") {
    return value === "true";
  }

  if (value === "null") return null;
  if (value === "undefined") return undefined;

  const num = Number(value);
  if (!Number.isNaN(num)) return num;

  if (
    (value.startsWith("{") && value.endsWith("}")) ||
    (value.startsWith("[") && value.endsWith("]"))
  ) {
    try {
      return JSON.parse(value);
    } catch {
      // fall through to returning raw string
    }
  }

  return value;
}

function unescapeQuoted(value: string, quote: string): string {
  const pattern = quote === '"' ? /\\"/g : /\\'/g;
  return value.replace(/\\\\/g, "\\").replace(pattern, quote);
}
