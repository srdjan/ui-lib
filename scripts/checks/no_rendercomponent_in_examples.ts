// Fail if renderComponent is used anywhere under examples/todo-app (app code must use JSX only)
// deno run --allow-read scripts/checks/no_rendercomponent_in_examples.ts

const root = new URL("../../examples/todo-app/", import.meta.url);

const forbidden = /\brenderComponent\s*\(/;
let violations: { path: string; line: number; text: string }[] = [];

async function scanFile(path: string) {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n/);
  lines.forEach((line, idx) => {
    if (forbidden.test(line)) {
      violations.push({ path, line: idx + 1, text: line.trim() });
    }
  });
}

async function scanDir(dir: string) {
  for await (const entry of Deno.readDir(dir)) {
    const fullPath = `${dir}/${entry.name}`;
    if (entry.isDirectory) {
      await scanDir(fullPath);
    } else if (entry.isFile && /\.(ts|tsx)$/.test(entry.name)) {
      await scanFile(fullPath);
    }
  }
}

await scanDir(new URL(root).pathname);

if (violations.length > 0) {
  console.error(
    "renderComponent usage found in application code (examples/todo-app):\n",
  );
  for (const v of violations) {
    console.error(`${v.path}:${v.line}: ${v.text}`);
  }
  Deno.exit(1);
} else {
  console.log("OK: No renderComponent usage found under examples/todo-app");
}
