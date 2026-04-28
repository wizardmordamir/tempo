import { join } from "path";

const OUT_DIR = "./dist";

async function build() {
  console.log("🚀 Building tempo...");

  const result = await Bun.build({
    // Only these two are public
    entrypoints: ["./src/index.ts", "./src/node/index.ts"],
    outdir: OUT_DIR,
    target: "node",
    format: "esm",
    splitting: true, // This will put shared code into a 'chunk-xxxxx.js'
    sourcemap: "external",
    minify: false,
  });

  if (!result.success) {
    console.error("❌ Build failed");
    result.logs.forEach(console.error);
    process.exit(1);
  }

  console.log(`✅ Success! Built to ${OUT_DIR}`);
}

build();
