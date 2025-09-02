// deno run --allow-run --allow-read --allow-env scripts/release.ts [--push]
// Minimal release helper: runs checks, commits, tags, and optionally pushes.

const shouldPush = Deno.args.includes("--push");

async function readVersion(): Promise<string> {
  const v = (await Deno.readTextFile("VERSION")).trim();
  if (!/^\d+\.\d+\.\d+$/.test(v)) {
    console.error(`Invalid VERSION: ${v}`);
    Deno.exit(1);
  }
  return v;
}

async function run(cmd: string[], opts: Deno.CommandOptions = {}) {
  const p = new Deno.Command(cmd[0], { args: cmd.slice(1), ...opts });
  const { code, stdout, stderr } = await p.output();
  if (stdout.length) await Deno.stdout.write(stdout);
  if (stderr.length) await Deno.stderr.write(stderr);
  if (code !== 0) {
    console.error(`Command failed: ${cmd.join(" ")}`);
    Deno.exit(code);
  }
}

const version = await readVersion();

// Preflight checks (these are fast and deterministic)
await run(["deno", "task", "check"]);
await run(["deno", "task", "fmt:check"]);
await run(["deno", "task", "lint"]);
await run(["deno", "task", "test"]);
await run(["deno", "task", "coverage"]);
await run(["deno", "task", "docs"]);

// Commit and tag
await run(["git", "add", "-A"]);
// Commit may fail if nothing changed; handle gracefully
try {
  await run(["git", "commit", "-m", `release: v${version}`]);
} catch {
  console.log("No changes to commit; continuing to tag");
}
await run(["git", "tag", "-a", `v${version}`, "-m", `funcwc v${version}`]);

if (shouldPush) {
  await run(["git", "push"]);
  await run(["git", "push", "--tags"]);
}

console.log(`Release v${version} prepared. Use --push to push to origin.`);
