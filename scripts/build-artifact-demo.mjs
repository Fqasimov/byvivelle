/**
 * build-artifact-demo.mjs
 *
 * Repackages the static export (.output/public) for the Claude Artifact host,
 * which differs from a plain static server in two ways:
 *
 *  1. it reserves published paths beginning with "_", so `_nuxt/` and
 *     `_payload.json` are renamed and every reference rewritten
 *  2. it supplies its own <html>/<head>/<body> skeleton, so the page has to be
 *     a fragment — and that skeleton's unlayered `body{font:14px system-ui;
 *     background:#fafaf9}` outranks our own body rule, which Tailwind emits
 *     inside a cascade layer. An unlayered override restores the brand's
 *     paper ground and type.
 *
 * Nothing here touches the project itself; the real site owns its <body>.
 *
 * Run: node scripts/build-artifact-demo.mjs <out-dir>
 */

import { cp, readFile, writeFile, rm, readdir, stat } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve("/home/user/byvivelle/.output/public");
const OUT = path.resolve(process.argv[2] ?? "./artifact-demo");

const TEXT = new Set([".html", ".js", ".css", ".json"]);
const RENAMES = [
  ["/_nuxt/", "/nuxt/"],
  ["_nuxt/", "nuxt/"],
  ["/_payload.json", "/payload.json"],
  ["`_payload.json`", "`payload.json`"],
];

/**
 * Nuxt emits root-absolute asset URLs ("/nuxt/…", "/media/…"), which only
 * resolve if the page is served at the origin root. The artifact host
 * documents published paths as relative, so make every reference relative and
 * let a <base> shim decide what they are relative *to*.
 */
const RELATIVE = [
  // Import-map values must be URL-like: a bare "nuxt/x.js" is rejected, so
  // every rewritten reference gets an explicit "./" and resolves against
  // the <base> below.
  ['buildAssetsDir:"/nuxt/"', 'buildAssetsDir:"./nuxt/"'],
  ['"/nuxt/', '"./nuxt/'],
  ["'/nuxt/", "'./nuxt/"],
  ['"/media/', '"./media/'],
  ["'/media/", "'./media/"],
  ["`/media/", "`./media/"],
  ['"/payload.json', '"./payload.json'],
  ["`/payload.json", "`./payload.json"],
];

/**
 * Resolves the relative asset URLs above against the directory the page is
 * served from — root, "/some/path/", or "/some/path" with no trailing slash
 * (a last segment with no file extension is treated as a directory). Must be
 * the first thing in the fragment: <base> only affects elements parsed after
 * it.
 */
const BASE_SHIM = `<script>
(function () {
  var p = location.pathname;
  if (p.charAt(p.length - 1) !== "/") {
    var cut = p.lastIndexOf("/");
    // A last segment carrying a file extension is a file, not a directory.
    p = p.slice(cut + 1).indexOf(".") !== -1 ? p.slice(0, cut + 1) : p + "/";
  }
  var b = document.createElement("base");
  b.href = p;
  document.head.prepend(b);
})();
<\/script>`;

/** Unlayered, so it beats the host skeleton's own body rule. */
const OVERRIDE = `<style>
/* The artifact skeleton styles <body> unlayered, which outranks the site's
   own layered body rule. Restore the paper ground and the sans stack. */
body{margin:0;background-color:#faf6f0;color:#17120e;
font-family:"Inter",ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:16px;
font-feature-settings:"kern","liga","calt";-webkit-font-smoothing:antialiased;
-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}
</style>`;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

await rm(OUT, { recursive: true, force: true });
await cp(SRC, OUT, { recursive: true });
await cp(path.join(OUT, "_nuxt"), path.join(OUT, "nuxt"), { recursive: true });
await rm(path.join(OUT, "_nuxt"), { recursive: true });
await cp(path.join(OUT, "_payload.json"), path.join(OUT, "payload.json"));
await rm(path.join(OUT, "_payload.json"));

for (const file of await walk(OUT)) {
  if (!TEXT.has(path.extname(file))) continue;
  const before = await readFile(file, "utf8");
  let after = before;
  for (const [a, b] of [...RENAMES, ...RELATIVE]) after = after.split(a).join(b);
  if (after !== before) await writeFile(file, after);
}

// — inline every image ————————————————————————————
// <picture> only falls back between <source>s on format *support*, never on
// load *failure*: if the host does not serve the AVIF the way the markup
// promises, the browser commits to that source and the image breaks with a
// perfectly good JPEG sitting unused beside it. Embedding the JPEG/PNG bytes
// directly removes the negotiation, the extra requests and any path
// resolution — the <source> variants all collapse to the same data URI.
const mediaDir = path.join(OUT, "media");
const dataUris = new Map();

for (const file of await readdir(mediaDir)) {
  const ext = path.extname(file);
  if (ext !== ".jpg" && ext !== ".png") continue;
  const mime = ext === ".png" ? "image/png" : "image/jpeg";
  const bytes = await readFile(path.join(mediaDir, file));
  dataUris.set(
    file.slice(0, -ext.length),
    `data:${mime};base64,${bytes.toString("base64")}`,
  );
}

/** Every reference to a stem — in any format — becomes the one data URI. */
function inlineMedia(text) {
  return text.replace(
    /(?:\.\/|\/)media\/([A-Za-z0-9-]+)\.(?:jpg|png|webp|avif)/g,
    (whole, stem) => dataUris.get(stem) ?? whole,
  );
}

for (const file of await walk(OUT)) {
  if (path.extname(file) !== ".js") continue;
  await writeFile(file, inlineMedia(await readFile(file, "utf8")));
}

// — the page fragment ————————————————————————————
const src = await readFile(path.join(OUT, "index.html"), "utf8");
const head = src.match(/<head>([\s\S]*?)<\/head>/)[1]
  .replace(/<meta charset="utf-8">/, "")
  .replace(/<meta name="viewport"[^>]*>/, "");
const body = src
  .match(/<body[^>]*>([\s\S]*?)<\/body>/)[1]
  // Nuxt puts these on <body>; the skeleton owns <body>, so move them inward.
  .replace('<div id="__nuxt">', '<div id="__nuxt" class="grain antialiased">');

const fragment = inlineMedia(`${BASE_SHIM}\n${OVERRIDE}\n${head.trim()}\n${body.trim()}\n`);
await writeFile(path.resolve(OUT, "../byvivelle.html"), fragment);

// Local stand-in for the host skeleton, so the packaging can be tested.
await writeFile(
  path.join(OUT, "index.html"),
  `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>:root{color-scheme:light}body{margin:0;font:14px system-ui,sans-serif;background:#fafaf9}
img{max-width:100%}[hidden]{display:none!important}</style>
</head><body>\n${fragment}\n</body></html>\n`,
);

const files = (await walk(OUT))
  .map((f) => path.relative(OUT, f))
  .filter((f) => !["index.html", "200.html", "404.html"].includes(f))
  // Images are embedded in the page now, so they no longer ship as files.
  .filter((f) => !f.startsWith("media/"))
  .sort();

let bytes = 0;
for (const f of files) bytes += (await stat(path.join(OUT, f))).size;

await writeFile(
  path.resolve(OUT, "../files.json"),
  JSON.stringify(files.map((p) => ({ path: p })), null, 0),
);

console.log(`fragment ${fragment.length} bytes`);
console.log(`${files.length} supporting files, ${(bytes / 1e6).toFixed(2)} MB`);
const bad = files.filter((f) => f.startsWith("_") || f.includes("/_"));
console.log("reserved paths:", bad.length ? bad : "none");
