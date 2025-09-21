#!/usr/bin/env -S deno run --allow-read --allow-write

const files = [
  "lib/components/input/select.ts",
  "lib/components/input/textarea.ts",
  "lib/components/feedback/alert.ts",
  "lib/components/feedback/badge.ts",
  "lib/components/feedback/progress.ts",
  "lib/components/feedback/toast.ts",
  "lib/components/button/button-group.ts",
  "lib/components/data-display/animated-counter.ts",
];

for (const filePath of files) {
  const content = await Deno.readTextFile(filePath);

  // Convert export interface XxxProps extends YYY to export type XxxProps = YYY &
  let modified = content.replace(
    /export interface (\w+Props) extends (\w+)\s*{\n([\s\S]*?)^}/gm,
    (match, name, baseType, body) => {
      // Add readonly to each property
      const readonlyBody = body.split("\n").map((line) => {
        // Skip empty lines and comments
        if (!line.trim() || line.trim().startsWith("//")) return line;
        // Add readonly to properties
        return line.replace(/^(\s*)(\w+)(\??:)/, "$1readonly $2$3");
      }).join("\n");

      return `export type ${name} = ${baseType} & {\n${readonlyBody}}`;
    },
  );

  if (modified !== content) {
    await Deno.writeTextFile(filePath, modified);
    console.log(`✅ Fixed ${filePath}`);
  }
}

console.log("✨ Done!");
