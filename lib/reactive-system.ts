import { on, subscribeToState } from "./reactive-helpers.ts";

export function applyReactiveAttrs(
  markup: string,
  reactive: any,
  name: string,
): string {
  if (!reactive?.inject) return markup;

  const reactiveAttrs: string[] = [];
  const reactiveCode: string[] = [];

  if (reactive?.state) {
    for (const [topic, handler] of Object.entries(reactive.state)) {
      reactiveCode.push(subscribeToState(topic, handler as string));
    }
  }
  if (reactive?.on) {
    // Consolidate all events into a single hx-on attribute
    reactiveAttrs.push(on(reactive.on));
  }
  if (reactive?.mount || reactiveCode.length > 0 || reactive?.unmount) {
    let lifecycleCode = "";
    if (reactive?.mount || reactiveCode.length > 0) {
      const mountCode = [
        ...(reactiveCode.length > 0 ? reactiveCode : []),
        ...(reactive?.mount ? [reactive.mount] : []),
      ].join(";\n");
      lifecycleCode += mountCode;
    }
    if (reactive?.unmount) {
      lifecycleCode += `\n\n// Setup unmount observer\n`;
      lifecycleCode += `
        if (typeof MutationObserver !== 'undefined') {
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              mutation.removedNodes.forEach((node) => {
                if (node === this || (node.nodeType === 1 && node.contains(this))) {
                  try { ${reactive.unmount} } catch(e) { console.warn('ui-lib unmount error:', e); }
                  observer.disconnect();
                }
              });
            });
          });
          observer.observe(document.body, { childList: true, subtree: true });
        }
      `.trim();
    }
    if (lifecycleCode) {
      const code = lifecycleCode.replace(/\n/g, " ").replace(
        /"/g,
        "&quot;",
      );
      reactiveAttrs.push(`hx-on="htmx:load: ${code}"`);
    }
  }

  if (reactiveAttrs.length === 0) return markup;
  const firstTagMatch = markup.match(/^(\s*)(<[a-zA-Z][^>]*)(>)/);
  if (!firstTagMatch) return markup;
  const [, whitespace, openTag, closeAngle] = firstTagMatch;

  // Merge hx-on if already present on the root tag
  const existingHxOnMatch = openTag.match(/\s(hx-on)=\"([^\"]*)\"/);
  let newOpenTag = openTag;
  const injected = reactiveAttrs.join(" ");
  if (existingHxOnMatch) {
    const existing = existingHxOnMatch[2];
    // Merge by concatenating with a newline
    const merged = `${existing}\n${injected.replace(/^hx-on=\"|\"$/g, "")}`;
    newOpenTag = openTag.replace(
      existingHxOnMatch[0],
      ` hx-on="${merged}"`,
    );
  } else {
    newOpenTag = `${openTag} ${injected}`;
  }
  const enhancedTag = `${whitespace}${newOpenTag}${closeAngle}`;
  return markup.replace(firstTagMatch[0], enhancedTag);
}
