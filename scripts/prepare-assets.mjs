/**
 * prepare-assets.mjs
 *
 * The brand collateral arrived as phone screenshots of an Instagram carousel:
 * each frame carries a translucent "3/6" pager badge in the top-right corner
 * and, on some, black letterbox bars plus carousel dots.
 *
 * This script turns them into clean web assets:
 *   1. trim near-black letterbox bars (and any explicit bottom crop)
 *   2. erase the pager badge by lifting a blurred patch of neighbouring
 *      background and feathering it over the badge — the backgrounds are flat
 *      ivory/taupe, so a soft blurred patch is indistinguishable
 *   3. emit a full-bleed version plus a square crop for the circular cards
 *
 * Run: node scripts/prepare-assets.mjs
 */

import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SRC = "/root/.claude/uploads/9e8788e4-cd4a-5c54-8a5a-5c01ac3e9b62";
const OUT = path.resolve(process.cwd(), "public/media");

/** Badge geometry, in source pixels (all sources are 1170px wide). */
const BADGE = { x: 992, w: 178, y: 14, h: 142 };

/**
 * @typedef {object} Job
 * @property {string} src        source filename
 * @property {string} out        output basename
 * @property {number} [sourceX]  x to lift the cover patch from (default: left of badge)
 * @property {number} [cropBottom] extra px to cut from the bottom (carousel dots)
 * @property {[number, number]} [focus] square-crop centre as a 0..1 fraction of w/h
 */

/** @type {Job[]} */
const JOBS = [
  // — product photography ————————————————————————————
  { src: "d7d180e5-image.jpg", out: "wedding-cover", focus: [0.5, 0.56] },
  { src: "27f2b5cd-image.jpg", out: "birthday-covers", focus: [0.5, 0.72] },
  { src: "8a0b3d39-image.jpg", out: "birthday-spread", focus: [0.5, 0.62] },
  { src: "ab3cd2eb-image.jpg", out: "love-spread", focus: [0.5, 0.62] },
  { src: "cb4176ab-image.jpg", out: "examples-flatlay", focus: [0.52, 0.76] },

  // — process / editorial ————————————————————————————
  // Palm-frond shadow sits right beside this badge, so lift the patch from
  // the flat taupe on the far left instead.
  { src: "14c34b7d-image.jpg", out: "open-book", sourceX: 180, focus: [0.5, 0.5] },
  { src: "003aa143-image.jpg", out: "finishing", focus: [0.5, 0.52] },
  { src: "dbaa1ffd-image.jpg", out: "heart-grid", cropBottom: 96, focus: [0.5, 0.45] },
  { src: "1d58769a-image.jpg", out: "about-book", focus: [0.5, 0.68] },
  { src: "a694bf91-image.jpg", out: "gift-box", focus: [0.62, 0.72] },
];

/**
 * Editorial detail crops, lifted from the cleaned full-bleed frames.
 * Real macro details of the real product — a spread's polaroid cluster, the
 * foil monogram on the envelope — give each album a set of pages to leaf
 * through without inventing photography that doesn't exist.
 *
 * `rect` is [x, y, w, h] as a fraction of the cleaned frame.
 * @type {{from: string, out: string, rect: [number, number, number, number]}[]}
 */
const DETAILS = [
  { from: "wedding-cover", out: "wedding-rings", rect: [0.76, 0.14, 0.24, 0.24] },
  { from: "wedding-cover", out: "wedding-title", rect: [0.18, 0.07, 0.64, 0.22] },

  { from: "birthday-spread", out: "birthday-collage", rect: [0.09, 0.4, 0.4, 0.33] },
  { from: "birthday-spread", out: "birthday-fashion", rect: [0.5, 0.34, 0.43, 0.45] },

  { from: "love-spread", out: "love-polaroids", rect: [0.07, 0.45, 0.39, 0.29] },
  { from: "love-spread", out: "love-list", rect: [0.5, 0.34, 0.33, 0.29] },

  { from: "examples-flatlay", out: "archive-cover", rect: [0.34, 0.352, 0.32, 0.40] },
  { from: "examples-flatlay", out: "archive-pages", rect: [0.6, 0.35, 0.38, 0.36] },

  { from: "finishing", out: "keepsake-seal", rect: [0.68, 0.54, 0.31, 0.3] },
  { from: "finishing", out: "keepsake-spread", rect: [0.24, 0.3, 0.5, 0.38] },

  { from: "open-book", out: "craft-leather", rect: [0.07, 0.46, 0.25, 0.28] },
  { from: "heart-grid", out: "heart-detail", rect: [0.24, 0.2, 0.53, 0.5] },

  // Circular-card covers. These two sources are already square, so the
  // generic square crop is a no-op and leaves the carousel headline in shot —
  // they need an explicit square cut down on the product itself.
  { from: "birthday-covers", out: "birthday-circle", rect: [0.30, 0.39, 0.38, 0.38] },
  { from: "examples-flatlay", out: "archive-circle", rect: [0.25, 0.42, 0.5, 0.5] },

  // These two frames are mostly burned-in carousel copy; only the product in
  // the corner is usable, so crop hard to it.
  { from: "gift-box", out: "keepsake-box", rect: [0.622, 0.63, 0.378, 0.37] },
  { from: "about-book", out: "archive-open", rect: [0.11, 0.585, 0.78, 0.4] },

  // The open book on its own, without the slide's headline — used large in
  // the process section, where Russian marketing copy would read as a
  // screenshot rather than as photography.
  { from: "open-book", out: "process-book", rect: [0.258, 0.30, 0.437, 0.385] },
];

/** Rows darker than this on average are letterbox, not photograph. */
const BLACK_THRESHOLD = 26;

/** Find the first/last non-letterbox row by sampling row means. */
async function findContentBounds(image, width, height) {
  const { data } = await image
    .clone()
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rowMean = (y) => {
    let sum = 0;
    for (let x = 0; x < width; x += 8) sum += data[y * width + x];
    return sum / Math.ceil(width / 8);
  };

  let top = 0;
  while (top < height - 1 && rowMean(top) < BLACK_THRESHOLD) top++;

  let bottom = height - 1;
  while (bottom > top + 1 && rowMean(bottom) < BLACK_THRESHOLD) bottom--;

  return { top, bottom };
}

/** A soft-edged alpha mask so the patch dissolves instead of butting up. */
function featherMask(w, h) {
  return Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
       <defs>
         <radialGradient id="f" cx="50%" cy="50%" r="50%">
           <stop offset="55%" stop-color="#fff" stop-opacity="1"/>
           <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
         </radialGradient>
       </defs>
       <rect width="${w}" height="${h}" fill="url(#f)"/>
     </svg>`,
  );
}

async function run() {
  if (!existsSync(SRC)) {
    console.error(
      `Source screenshots not found at:\n  ${SRC}\n\n` +
        "Point SRC at the original byvivelle carousel screenshots to regenerate.\n" +
        "The generated assets are committed under public/media, so this script\n" +
        "only needs running when the source photography changes.",
    );
    process.exit(1);
  }

  await mkdir(OUT, { recursive: true });

  for (const job of JOBS) {
    const srcPath = path.join(SRC, job.src);
    const base = sharp(srcPath);
    const meta = await base.metadata();

    // 1 — trim letterbox
    const { top, bottom } = await findContentBounds(base, meta.width, meta.height);
    const cropBottom = job.cropBottom ?? 0;
    const height = bottom - top + 1 - cropBottom;

    let img = sharp(srcPath).extract({
      left: 0,
      top,
      width: meta.width,
      height,
    });

    // 2 — erase the pager badge
    const bw = Math.min(BADGE.w, meta.width - BADGE.x);
    const bh = Math.min(BADGE.h, height - BADGE.y);
    const sourceX = job.sourceX ?? BADGE.x - BADGE.w - 12;

    const patch = await img
      .clone()
      .extract({ left: sourceX, top: BADGE.y, width: bw, height: bh })
      .blur(14)
      .composite([{ input: featherMask(bw, bh), blend: "dest-in" }])
      .png()
      .toBuffer();

    const cleaned = await img
      .composite([{ input: patch, left: BADGE.x, top: BADGE.y }])
      .jpeg({ quality: 94, mozjpeg: true })
      .toBuffer();

    // 3 — full-bleed
    await sharp(cleaned)
      .resize({ width: 1400, withoutEnlargement: true })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(path.join(OUT, `${job.out}.jpg`));

    // 4 — square crop for the circular cards
    const [fx, fy] = job.focus ?? [0.5, 0.5];
    const side = Math.min(meta.width, height);
    const left = Math.round(
      Math.max(0, Math.min(meta.width - side, fx * meta.width - side / 2)),
    );
    const cropTop = Math.round(
      Math.max(0, Math.min(height - side, fy * height - side / 2)),
    );

    await sharp(cleaned)
      .extract({ left, top: cropTop, width: side, height: side })
      .resize(900, 900)
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(path.join(OUT, `${job.out}-square.jpg`));

    console.log(`✓ ${job.out}  (trim ${top}→${bottom}, ${meta.width}×${height})`);
  }

  // — editorial detail crops —————————————————————————————
  for (const d of DETAILS) {
    const from = path.join(OUT, `${d.from}.jpg`);
    const m = await sharp(from).metadata();
    const [rx, ry, rw, rh] = d.rect;

    await sharp(from)
      .extract({
        left: Math.round(rx * m.width),
        top: Math.round(ry * m.height),
        width: Math.round(rw * m.width),
        height: Math.round(rh * m.height),
      })
      .resize({ width: 1100, withoutEnlargement: true })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(path.join(OUT, `${d.out}.jpg`));

    console.log(`  ↳ ${d.out}`);
  }

  // — logo: cut the badge out of its screenshot backdrop into a clean PNG —
  const logoSrc = path.join(SRC, "1cde3ef3-image.jpg");
  const cx = 585;
  const cy = 386;
  const r = 378;
  const size = 560;
  const circle = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
       <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 1}" fill="#fff"/>
     </svg>`,
  );

  // Two passes: sharp runs resize before composite within one pipeline, so the
  // mask has to be built against the already-resized square.
  const square = await sharp(logoSrc)
    .extract({ left: cx - r, top: Math.max(0, cy - r), width: r * 2, height: r * 2 })
    .resize(size, size)
    .png()
    .toBuffer();

  await sharp(square)
    .composite([{ input: circle, blend: "dest-in" }])
    .png()
    .toFile(path.join(OUT, "logo.png"));

  console.log("✓ logo");

  // — modern formats ——————————————————————————————
  // Emitted at build time rather than by a runtime image server: the album
  // viewer is behind a click, so a static export never prerenders its
  // variants and they would 404 on any plain static host. AppImage.vue picks
  // these up through <picture>.
  let encoded = 0;
  for (const file of await readdir(OUT)) {
    if (!/\.(jpg|png)$/.test(file)) continue;

    const from = path.join(OUT, file);
    const base = file.replace(/\.(jpg|png)$/, "");

    await sharp(from).webp({ quality: 82 }).toFile(path.join(OUT, `${base}.webp`));
    await sharp(from).avif({ quality: 62 }).toFile(path.join(OUT, `${base}.avif`));
    encoded++;
  }

  console.log(`✓ ${encoded} images re-encoded to webp + avif`);
  console.log("\n" + (await readdir(OUT)).sort().join("\n"));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
