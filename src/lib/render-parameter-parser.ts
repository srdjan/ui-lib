// Parser for extracting prop helpers from render function parameters
import { type PropHelper, isPropHelper, string, number, boolean, array, object } from "./prop-helpers.ts";

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

export function parseRenderParameters(renderFunction: StringifiableFunction): ParsedRenderParameters {
  const funcStr = renderFunction.toString();
  
  // Extract the parameter list from the function string
  const paramMatch = funcStr.match(/^\s*(?:async\s+)?(?:\w+\s*=>|\(([^)]*)\)\s*=>|function[^(]*\(([^)]*)\))/);
  if (!paramMatch) {
    return { propHelpers: {}, hasProps: false };
  }
  
  // Get the first parameter (should be the props parameter)
  const paramList = paramMatch[1] || paramMatch[2] || '';
  const firstParam = paramList.split(',')[0]?.trim();
  
  if (!firstParam || !firstParam.startsWith('{')) {
    // No destructured props parameter
    return { propHelpers: {}, hasProps: false };
  }
  
  // Extract the destructured parameter content
  const destructuredMatch = firstParam.match(/^\{\s*([^}]*)\s*\}/);
  if (!destructuredMatch) {
    return { propHelpers: {}, hasProps: false };
  }
  
  const destructuredContent = destructuredMatch[1];
  const propHelpers: Record<string, PropHelper> = {};
  
  // Parse individual property assignments
  // Handle patterns like: name = string("default"), age = number(0)
  const properties = parseDestructuredProperties(destructuredContent);
  
  for (const prop of properties) {
    const { name, defaultExpression } = prop;
    
    if (defaultExpression) {
      // Try to evaluate the default expression to get the prop helper
      const propHelper = evaluateHelperExpression(defaultExpression);
      if (propHelper) {
        propHelpers[name] = propHelper;
      }
    }
  }
  
  return { 
    propHelpers, 
    hasProps: Object.keys(propHelpers).length > 0 
  };
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
    
    if (token.type === 'identifier') {
      const prop: DestructuredProperty = { name: token.value };
      
      // Check if next token is '='
      if (i + 1 < tokens.length && tokens[i + 1].value === '=') {
        // Skip the '=' token
        i += 2;
        
        // Collect tokens until comma or end
        const defaultTokens: string[] = [];
        let parenLevel = 0;
        
        while (i < tokens.length) {
          const t = tokens[i];
          if (t.value === ',' && parenLevel === 0) {
            break;
          }
          if (t.value === '(') parenLevel++;
          if (t.value === ')') parenLevel--;
          
          defaultTokens.push(t.value);
          i++;
        }
        
        prop.defaultExpression = defaultTokens.join('').trim();
      }
      
      properties.push(prop);
    }
    
    i++;
  }
  
  return properties;
}

interface Token {
  type: 'identifier' | 'operator' | 'literal' | 'punctuation';
  value: string;
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
    if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      let value = char;
      i++;
      
      while (i < content.length && content[i] !== quote) {
        if (content[i] === '\\' && i + 1 < content.length) {
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
      
      tokens.push({ type: 'literal', value });
      continue;
    }
    
    // Handle identifiers
    if (/[a-zA-Z_$]/.test(char)) {
      let value = '';
      while (i < content.length && /[a-zA-Z0-9_$]/.test(content[i])) {
        value += content[i];
        i++;
      }
      tokens.push({ type: 'identifier', value });
      continue;
    }
    
    // Handle numbers
    if (/[0-9]/.test(char)) {
      let value = '';
      while (i < content.length && /[0-9.]/.test(content[i])) {
        value += content[i];
        i++;
      }
      tokens.push({ type: 'literal', value });
      continue;
    }
    
    // Handle punctuation and operators
    tokens.push({ 
      type: /[=,()]/.test(char) ? 'punctuation' : 'operator', 
      value: char 
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
      object
    };
    
    // Simple pattern matching for helper calls
    const helperMatch = expression.match(/^(string|number|boolean|array|object)\s*\(\s*(.*?)\s*\)$/);
    if (!helperMatch) {
      return null;
    }
    
    const [, helperName, argsStr] = helperMatch;
    type AnyHelper = (arg?: unknown) => PropHelper;
    const helperFn = context[helperName as keyof typeof context] as unknown as AnyHelper;
    
    if (!helperFn) {
      return null;
    }
    
    // Parse arguments safely
    let args: unknown[] = [];
    if (argsStr.trim()) {
      // For now, handle simple cases: string literals, numbers, booleans
      if (argsStr.startsWith('"') || argsStr.startsWith("'") || argsStr.startsWith('`')) {
        // String literal
        args = [JSON.parse(argsStr.replace(/`/g, '"'))];
      } else if (/^-?\d+(\.\d+)?$/.test(argsStr)) {
        // Number literal
        args = [Number(argsStr)];
      } else if (argsStr === 'true' || argsStr === 'false') {
        // Boolean literal
        args = [argsStr === 'true'];
      } else if (argsStr === 'null') {
        args = [null];
      } else if (argsStr === 'undefined' || argsStr === '') {
        args = [];
      } else if (argsStr.startsWith('[') || argsStr.startsWith('{')) {
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
