// Script to convert component interfaces to types with readonly properties
import { MultiEdit } from "../lib/mod.ts";

const filesToConvert = [
  "lib/components/input/select.ts",
  "lib/components/input/input.ts",
  "lib/components/input/textarea.ts",
  "lib/components/feedback/alert.ts",
  "lib/components/feedback/progress.ts",
  "lib/components/feedback/toast.ts",
  "lib/components/feedback/badge.ts",
  "lib/components/button/button-group.ts",
  "lib/components/data-display/animated-counter.ts",
  "lib/components/showcase/demo-viewer.ts",
  "lib/components/showcase/code-modal.ts",
  "lib/components/showcase/code-actions.ts",
];

async function convertFile(filePath: string) {
  const content = await Deno.readTextFile(filePath);

  // Convert interface Props declarations to type
  let newContent = content.replace(
    /export interface (\w+Props)(\s+extends\s+(\w+))?\s*{([^}]+)}/g,
    (match, name, extendsClause, baseType, body) => {
      // Add readonly to each property
      const readonlyBody = body.replace(
        /^\s*(\w+)(\??:)/gm,
        "  readonly $1$2",
      );

      if (baseType) {
        return `export type ${name} = ${baseType} & {${readonlyBody}}`;
      } else {
        return `export type ${name} = {${readonlyBody}}`;
      }
    },
  );

  // Also convert any other export interface patterns
  newContent = newContent.replace(
    /export interface (\w+)(\s+extends\s+(\w+))?\s*{([^}]+)}/g,
    (match, name, extendsClause, baseType, body) => {
      // Skip if already converted or not a Props interface
      if (
        !name.includes("Props") && !name.includes("Config") &&
        !name.includes("Options")
      ) {
        return match; // Keep non-prop interfaces as-is for now
      }

      // Add readonly to each property
      const readonlyBody = body.replace(
        /^\s*(\w+)(\??:)/gm,
        "  readonly $1$2",
      );

      if (baseType) {
        return `export type ${name} = ${baseType} & {${readonlyBody}}`;
      } else {
        return `export type ${name} = {${readonlyBody}}`;
      }
    },
  );

  if (newContent !== content) {
    await Deno.writeTextFile(filePath, newContent);
    console.log(`✅ Converted interfaces in ${filePath}`);
    return true;
  }
  return false;
}

async function main() {
  console.log("Converting interfaces to types with readonly properties...\n");

  let convertedCount = 0;
  for (const file of filesToConvert) {
    if (await convertFile(file)) {
      convertedCount++;
    }
  }

  console.log(`\n✨ Converted ${convertedCount} files`);
}

main().catch(console.error);
