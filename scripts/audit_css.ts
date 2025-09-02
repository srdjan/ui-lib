// CSS audit: block inline styles and hex colors in lib/**, warn in examples/**
// Usage: deno run -A scripts/audit_css.ts

const encoder = new TextEncoder();
function log(msg: string) {
  Deno.stdout.writeSync(encoder.encode(msg + "\n"));
}
function warn(msg: string) {
  Deno.stderr.writeSync(encoder.encode("WARN: " + msg + "\n"));
}
function error(msg: string) {
  Deno.stderr.writeSync(encoder.encode("ERROR: " + msg + "\n"));
}

type Finding = { file: string; line: number; snippet: string };

async function scanDir(root: string, globs: string[]): Promise<string[]> {
  const matches: string[] = [];
  for await (const entry of Deno.readDir(root)) {
    const path = `${root}/${entry.name}`;
    if (entry.isDirectory) {
      const child = await scanDir(path, globs);
      matches.push(...child);
    } else {
      if (globs.some((g) => entry.name.endsWith(g))) {
        // Skip tests
        if (/\.test\.(ts|tsx)$/.test(entry.name)) continue;
        matches.push(path);
      }
    }
  }
  return matches;
}

async function grep(file: string, pattern: RegExp): Promise<Finding[]> {
  const out: Finding[] = [];
  const content = await Deno.readTextFile(file);
  const lines = content.split(/\r?\n/);
  lines.forEach((line, i) => {
    if (pattern.test(line)) {
      out.push({ file, line: i + 1, snippet: line.trim() });
    }
  });
  return out;
}

async function main() {
  const libFiles = await scanDir("lib", [".ts", ".tsx"]);
  const exampleFiles = await scanDir("examples", [".ts", ".tsx", ".html"]);

  const attrStyle = /\bstyle=\"/;
  const hexColor = /#[0-9a-fA-F]{3,8}\b/;

  let failed = false;

  // LIB: hard error for inline style attrs and hex colors
  let libFindings: Finding[] = [];
  for (const f of libFiles) {
    libFindings.push(...await grep(f, attrStyle));
    libFindings.push(...await grep(f, hexColor));
  }
  if (libFindings.length > 0) {
    failed = true;
    error("Inline styles or hex colors found in lib/**:");
    for (const f of libFindings) {
      error(`  ${f.file}:${f.line}: ${f.snippet}`);
    }
  } else {
    log("lib/** passed: no inline styles or hex colors detected");
  }

  // EXAMPLES: warn only
  let exStyle: Finding[] = [];
  let exHex: Finding[] = [];
  for (const f of exampleFiles) {
    exStyle.push(...await grep(f, attrStyle));
    exHex.push(...await grep(f, hexColor));
  }
  if (exStyle.length > 0) {
    warn(`examples/** inline styles: ${exStyle.length} occurrence(s)`);
  }
  if (exHex.length > 0) {
    warn(`examples/** hex colors: ${exHex.length} occurrence(s)`);
  }

  if (failed) Deno.exit(1);
}

if (import.meta.main) {
  await main();
}
