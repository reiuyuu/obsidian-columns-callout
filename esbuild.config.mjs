import esbuild from "esbuild";

const production = process.argv.includes("production");

const options = {
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: ["obsidian"],
  platform: "browser",
  format: "cjs",
  target: "es2018",
  outfile: "main.js",
  sourcemap: production ? false : "inline",
  minify: production,
};

if (production) {
  await esbuild.build(options);
} else {
  const context = await esbuild.context(options);
  await context.watch();
  console.log("Watching for changes...");
}
