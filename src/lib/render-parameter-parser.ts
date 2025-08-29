// Parser for extracting prop helpers from render function parameters
import {
  array,
  boolean,
  isPropHelper,
  number,
  object,
  type PropHelper,
  string,
} from "./prop-helpers.ts";

export interface ParsedRenderParameters {
  propHelpers: Record<string, PropHelper>;
  hasProps: boolean;
}

/**
 * Parses render function parameters to extract prop helper calls
 *
 * Supports destructured parameters like:
 * ({ name = string("default"), age = number(0) }, api, classes) => { ... }
 */
type StringifiableFunction = { toString(): string };

export function parseRenderParameters(
  renderFunction: StringifiableFunction,
): ParsedRenderParameters {
  const funcStr = renderFunction.toString();

  // Extract the parameter list with balanced parentheses handling
  let paramList = "";
  
  // Look for arrow function pattern: (...) => or function pattern: function(...) 
  const arrowMatch = funcStr.match(/^\s*(?:async\s+)?(\([^]*?\))\s*=>/);
  const functionMatch = funcStr.match(/^\s*(?:async\s+)?function[^(]*(\([^]*?\))/);
  
  if (arrowMatch) {
    // Extract balanced parentheses content for arrow functions
    paramList = extractBalancedParentheses(funcStr, arrowMatch.index! + arrowMatch[0].indexOf('('));
  } else if (functionMatch) {
    // Extract balanced parentheses content for function declarations
    paramList = extractBalancedParentheses(funcStr, functionMatch.index! + functionMatch[0].indexOf('('));
  }
  
  if (!paramList) {
    return { propHelpers: {}, hasProps: false };
  }

  // Remove outer parentheses and get the first parameter
  const innerParamList = paramList.slice(1, -1).trim();
  const firstParam = splitTopLevelCommas(innerParamList)[0]?.trim();

  if (firstParam) {
    // Case 1: Destructured parameter with defaults
    if (firstParam.startsWith("{")) {
      const destructuredMatch = firstParam.match(/^\{\s*([^}]*)\s*\}/);
      if (!destructuredMatch) return { propHelpers: {}, hasProps: false };

      const destructuredContent = destructuredMatch[1];
      const propHelpers: Record<string, PropHelper> = {};
      const properties = parseDestructuredProperties(destructuredContent);
      for (const prop of properties) {
        const { name, defaultExpression } = prop;
        if (defaultExpression) {
          const propHelper = evaluateHelperExpression(defaultExpression);
          if (propHelper) propHelpers[name] = propHelper;
        }
      }
      return { propHelpers, hasProps: Object.keys(propHelpers).length > 0 };
    }

    // Case 2: Parameter with initializer to an object literal
    // e.g. `props: Props = { title: string(".."), count: number(0) }`
    const eqIdx = firstParam.indexOf("=");
    if (eqIdx !== -1) {
      const initExpr = firstParam.slice(eqIdx + 1).trim();
      if (initExpr.startsWith("{")) {
        // Extract object literal content with balanced braces
        const content = extractBalancedBraces(initExpr);
        if (content) {
          const propHelpers: Record<string, PropHelper> = {};
          const objectProps = parseObjectLiteralHelperProperties(content.inner);
          for (const { name, expr } of objectProps) {
            const helper = evaluateHelperExpression(expr);
            if (helper) propHelpers[name] = helper;
          }
          return { propHelpers, hasProps: Object.keys(propHelpers).length > 0 };
        }
      }
    }
  }

  // No recognizable props pattern
  return { propHelpers: {}, hasProps: false };
}

interface DestructuredProperty {
  name: string;
  defaultExpression?: string;
}

/**
 * Parse destructured properties from a string like:
 * "name = string('default'), age = number(0), active = boolean()"
 */
function parseDestructuredProperties(content: string): DestructuredProperty[] {
  const properties: DestructuredProperty[] = [];
  const tokens = tokenizeDestructured(content);

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];

    if (token.type === "identifier") {
      const prop: DestructuredProperty = { name: token.value };

      // Check if next token is '='
      if (i + 1 < tokens.length && tokens[i + 1].value === "=") {
        // Skip the '=' token
        i += 2;

        // Collect tokens until comma or end
        const defaultTokens: string[] = [];
        let parenLevel = 0;

        while (i < tokens.length) {
          const t = tokens[i];
          if (t.value === "," && parenLevel === 0) {
            break;
          }
          if (t.value === "(") parenLevel++;
          if (t.value === ")") parenLevel--;

          defaultTokens.push(t.value);
          i++;
        }

        prop.defaultExpression = defaultTokens.join("").trim();
      }

      properties.push(prop);
    }

    i++;
  }

  return properties;
}

interface Token {
  type: "identifier" | "operator" | "literal" | "punctuation";
  value: string;
}

/**
 * Extract balanced parentheses content starting from a given position
 */
function extractBalancedParentheses(source: string, startIndex: number): string {
  if (source[startIndex] !== '(') return "";
  
  let depth = 0;
  let endIndex = startIndex;
  
  for (let i = startIndex; i < source.length; i++) {
    const char = source[i];
    if (char === '(') depth++;
    else if (char === ')') {
      depth--;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }
  
  return depth === 0 ? source.slice(startIndex, endIndex + 1) : "";
}

/**
 * Split a string by commas that are not inside parentheses, brackets, or braces
 */
function splitTopLevelCommas(source: string): string[] {
  const parts: string[] = [];
  let current = "";
  let depth = 0;
  let inString = false;
  let stringChar = "";
  
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    const prevChar = i > 0 ? source[i - 1] : "";
    
    if (!inString) {
      if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
        inString = true;
        stringChar = char;
      } else if (char === '(' || char === '[' || char === '{') {
        depth++;
      } else if (char === ')' || char === ']' || char === '}') {
        depth--;
      } else if (char === ',' && depth === 0) {
        parts.push(current.trim());
        current = "";
        continue;
      }
    } else if (char === stringChar && prevChar !== '\\') {
      inString = false;
      stringChar = "";
    }
    
    current += char;
  }
  
  if (current.trim()) {
    parts.push(current.trim());
  }
  
  return parts;
}

// Extracts the inner content of a balanced brace object literal at the start of the string
function extractBalancedBraces(
  source: string,
): { inner: string; endIndex: number } | null {
  if (!source.startsWith("{")) return null;
  let depth = 0;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        const inner = source.slice(1, i);
        return { inner, endIndex: i };
      }
    }
  }
  return null;
}

// Parse object literal properties of the form: key: helperCall(...)
function parseObjectLiteralHelperProperties(
  content: string,
): Array<{ name: string; expr: string }> {
  const tokens = tokenizeDestructured(content);
  const props: Array<{ name: string; expr: string }> = [];
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t.type === "identifier") {
      const name = t.value;
      // Expect ':'
      let j = i + 1;
      while (j < tokens.length && tokens[j].value.trim() === "") j++;
      if (j < tokens.length && tokens[j].value === ":") {
        j++;
        // Collect until top-level comma
        const exprTokens: string[] = [];
        let paren = 0;
        while (j < tokens.length) {
          const v = tokens[j].value;
          if (v === "(") paren++;
          if (v === ")") paren--;
          if (v === "," && paren === 0) break;
          exprTokens.push(v);
          j++;
        }
        const expr = exprTokens.join("").trim();
        if (expr) props.push({ name, expr });
        i = j;
      }
    }
    i++;
  }
  return props;
}

/**
 * Simple tokenizer for destructured parameter content
 */
function tokenizeDestructured(content: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < content.length) {
    const char = content[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Handle string literals
    if (char === '"' || char === "'" || char === "`") {
      const quote = char;
      let value = char;
      i++;

      while (i < content.length && content[i] !== quote) {
        if (content[i] === "\\" && i + 1 < content.length) {
          value += content[i] + content[i + 1];
          i += 2;
        } else {
          value += content[i];
          i++;
        }
      }

      if (i < content.length) {
        value += content[i];
        i++;
      }

      tokens.push({ type: "literal", value });
      continue;
    }

    // Handle identifiers
    if (/[a-zA-Z_$]/.test(char)) {
      let value = "";
      while (i < content.length && /[a-zA-Z0-9_$]/.test(content[i])) {
        value += content[i];
        i++;
      }
      tokens.push({ type: "identifier", value });
      continue;
    }

    // Handle numbers
    if (/[0-9]/.test(char)) {
      let value = "";
      while (i < content.length && /[0-9.]/.test(content[i])) {
        value += content[i];
        i++;
      }
      tokens.push({ type: "literal", value });
      continue;
    }

    // Handle punctuation and operators
    tokens.push({
      type: /[=,()]/.test(char) ? "punctuation" : "operator",
      value: char,
    });
    i++;
  }

  return tokens;
}

/**
 * Safely evaluate a helper expression like string("default") or number(0)
 */
function evaluateHelperExpression(expression: string): PropHelper | null {
  try {
    // Create a safe evaluation context with only our helper functions
    const context = {
      string,
      number,
      boolean,
      array,
      object,
    };

    // Simple pattern matching for helper calls
    const helperMatch = expression.match(
      /^(string|number|boolean|array|object)\s*\(\s*(.*?)\s*\)$/,
    );
    if (!helperMatch) {
      return null;
    }

    const [, helperName, argsStr] = helperMatch;
    type AnyHelper = (arg?: unknown) => PropHelper;
    const helperFn =
      context[helperName as keyof typeof context] as unknown as AnyHelper;

    if (!helperFn) {
      return null;
    }

    // Parse arguments safely
    let args: unknown[] = [];
    if (argsStr.trim()) {
      // For now, handle simple cases: string literals, numbers, booleans
      if (
        argsStr.startsWith('"') || argsStr.startsWith("'") ||
        argsStr.startsWith("`")
      ) {
        // String literal
        args = [JSON.parse(argsStr.replace(/`/g, '"'))];
      } else if (/^-?\d+(\.\d+)?$/.test(argsStr)) {
        // Number literal
        args = [Number(argsStr)];
      } else if (argsStr === "true" || argsStr === "false") {
        // Boolean literal
        args = [argsStr === "true"];
      } else if (argsStr === "null") {
        args = [null];
      } else if (argsStr === "undefined" || argsStr === "") {
        args = [];
      } else if (argsStr.startsWith("[") || argsStr.startsWith("{")) {
        // JSON literal
        try {
          args = [JSON.parse(argsStr)];
        } catch {
          return null;
        }
      }
    }

    const result = args.length > 0 ? helperFn(args[0]) : helperFn();

    return isPropHelper(result) ? result : null;
  } catch (error) {
    console.warn(`Failed to evaluate helper expression: ${expression}`, error);
    return null;
  }
}
