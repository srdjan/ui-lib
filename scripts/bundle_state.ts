const OUTPUT = new URL("../dist/ui-lib-state.js", import.meta.url);
const ENTRY = new URL("./state-entry.ts", import.meta.url);

await Deno.mkdir(new URL("../dist", import.meta.url), { recursive: true });

const { files } = await Deno.emit(ENTRY, {
  bundle: "classic",
  compilerOptions: {
    target: "ES2021",
  },
});

const bundled = files["deno:///bundle.js"];

if (!bundled) {
  throw new Error("Failed to bundle state manager script");
}

await Deno.writeTextFile(OUTPUT, bundled);
console.log("Generated dist/ui-lib-state.js");
