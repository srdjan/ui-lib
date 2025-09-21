#!/usr/bin/env -S deno run --allow-read --allow-write

const files = [
  "lib/components/data-display/animated-counter.ts",
  "lib/components/overlay/modal-manager.ts",
  "lib/components/showcase/demo-viewer.ts",
  "lib/components/showcase/code-modal.ts",
  "lib/components/showcase/code-actions.ts",
];

for (const filePath of files) {
  const content = await Deno.readTextFile(filePath);

  // Convert export interface XxxConfig to export type XxxConfig
  let modified = content.replace(
    /export interface (\w+Config)\s*{\n([\s\S]*?)^}/gm,
    (match, name, body) => {
      // Add readonly to each property
      const readonlyBody = body.split("\n").map((line) => {
        // Skip empty lines and comments
        if (!line.trim() || line.trim().startsWith("//")) return line;
        // Add readonly to properties, but not if already present
        if (line.includes("readonly")) return line;
        return line.replace(/^(\s*)(\w+)(\??:)/, "$1readonly $2$3");
      }).join("\n");

      return `export type ${name} = {\n${readonlyBody}}`;
    },
  );

  if (modified !== content) {
    await Deno.writeTextFile(filePath, modified);
    console.log(`✅ Fixed ${filePath}`);
  }
}

console.log("✨ Done!");
